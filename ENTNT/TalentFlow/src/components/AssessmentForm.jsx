import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function AssessmentForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      type: "Technical",
      status: "Draft",
      questionCount: "",
      defaultQuestionType: "single-choice",
    }
  );

  // Reset when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        type: "Technical",
        status: "Draft",
        questionCount: "",
        defaultQuestionType: "single-choice",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.questionCount.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit({
      ...formData,
      id: initialData?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assessment Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Frontend Development Test"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. React, CSS, JavaScript"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Technical">Technical</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Cognitive">Cognitive</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
          </select>
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default Question Type
          </label>
          <select
            value={formData.defaultQuestionType}
            onChange={(e) =>
              setFormData({ ...formData, defaultQuestionType: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="single-choice">Single Choice</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="text">Subjective (Text)</option>
            <option value="short-text">Short Answer</option>
          </select>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Questions *
          </label>
          <input
            type="number"
            value={formData.questionCount}
            onChange={(e) =>
              setFormData({ ...formData, questionCount: e.target.value })
            }
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 10"
            min="1"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 mt-6">
        <button type="submit" className="btn-primary">
          {initialData ? "Update Assessment" : "Create Assessment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AssessmentForm;