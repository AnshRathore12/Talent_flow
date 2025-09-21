/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.4.12).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '02f4ad4a2797f85668baf5227ce50ba9'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data.type) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(event.source, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(event.source, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(event.source, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister the worker if there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { clientId, request } = event
  const url = new URL(request.url)

  const acceptHeader = request.headers.get('accept') || ''

  const isApiRequest = url.pathname.startsWith('/api/')

  const isNavigationRequest =
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      acceptHeader.includes('text/html') &&
      !isApiRequest)

  if (!isApiRequest && isNavigationRequest) {
    // If this is a navigation request for a non-API route, don't mock
    return
  }

  if (!activeClientIds.has(clientId)) {
    return
  }

  // Bypass server-sent events
  if (acceptHeader.includes('text/event-stream')) {
    return
  }

  // Bypass all non-API requests
  if (!isApiRequest) {
    return
  }

  event.respondWith(
    handleRequest(event, clientId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] Successfully emulated a network error for the "%s %s" request.',
          request.method,
          request.url,
        )
        return
      }

      // At this point, any exception indicates an issue with the original request/response.
      console.error(
        `\
[MSW] Caught an exception from the "%s %s" request (%s). This is probably not a problem with Mock Service Worker. There is likely an additional logging output above.`,
        request.method,
        request.url,
        `${error.name}: ${error.message}`,
      )
    }),
  )
})

async function handleRequest(event, clientId) {
  const client = await self.clients.get(clientId)
  const response = await getResponse(event, client, requestId)

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    ;(async function () {
      const responseClone = response.clone()
      sendToClient(client, {
        type: 'RESPONSE',
        payload: {
          requestId,
          type: responseClone.type,
          ok: responseClone.ok,
          status: responseClone.status,
          statusText: responseClone.statusText,
          body:
            responseClone.body === null ? null : await responseClone.text(),
          headers: Object.fromEntries(responseClone.headers.entries()),
        },
      })
    })()
  }

  return response
}

// Determine if the response should be mocked
async function getResponse(event, client, requestId) {
  const { request } = event

  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = request.clone()

  function passthrough() {
    // Clone the request because it might've been already used
    // (i.e. its body has been read and sent to the client).
    const headers = Object.fromEntries(requestClone.headers.entries())

    // Remove MSW-specific request headers so the bypassed requests
    // comply with the server's CORS preflight check.
    // Operate with the headers as an object because request "Headers"
    // are immutable.
    delete headers['x-msw-bypass']

    return fetch(requestClone, { headers })
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough()
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(client.id)) {
    return passthrough()
  }

  // Bypass requests with the explicit bypass header.
  // Such requests can be issued by "ctx.fetch()".
  if (requestClone.headers.get('x-msw-bypass') === 'true') {
    return passthrough()
  }

  // Notify the client that a request has been intercepted.
  const requestBuffer = await requestClone.arrayBuffer()
  const clientMessage = await sendToClient(
    client,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: requestClone.url,
        mode: requestClone.mode,
        method: requestClone.method,
        headers: Object.fromEntries(requestClone.headers.entries()),
        cache: requestClone.cache,
        credentials: requestClone.credentials,
        destination: requestClone.destination,
        integrity: requestClone.integrity,
        redirect: requestClone.redirect,
        referrer: requestClone.referrer,
        referrerPolicy: requestClone.referrerPolicy,
        body: requestBuffer,
        bodyUsed: requestClone.bodyUsed,
        keepalive: requestClone.keepalive,
      },
    },
    5000,
  )

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE': {
      return respondWithMock(clientMessage.data)
    }

    case 'MOCK_NOT_FOUND': {
      return passthrough()
    }
  }

  return passthrough()
}

function sendToClient(client, message, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(new Error(event.data.error))
      }

      resolve(event.data)
    }

    client.postMessage(
      message,
      [channel.port2],
    )

    setTimeout(() => {
      reject(new Error('Response timeout'))
    }, timeout)
  })
}

function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs)
  })
}

async function respondWithMock(response) {
  // Setting response status code to 0 is not supported.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#status
  if (response.status === 0) {
    response.status = 200
  }

  return new Response(response.body, response)
}

const requestId = crypto.randomUUID()
