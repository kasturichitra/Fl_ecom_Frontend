import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetFlatFAQList } from "../../hooks/useFAQ";

/**
 * FAQ Form Modal - Create/Edit FAQ
 * @param {Object} initialData - Initial form data (for editing)
 * @param {String} prefilledParentId - Pre-filled parent ID (when adding child)
 * @param {Function} onSubmit - Form submit callback
 * @param {Function} onClose - Close modal callback
 * @param {Boolean} isSubmitting - Submission loading state
 */
const FAQFormModal = ({
  initialData = null,
  prefilledParentId = null,
  onSubmit,
  onClose,
  isSubmitting = false,
  issueTypes = [],
  parentFaqOptions = [],
}) => {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({
    question_text: "",
    answer_text: "",
    issue_type: "",
    parent_question_id: "",
    sub_category: "",
    priority: 1,
    is_active: true,
    escalation_allowed: false,
    escalation_label: "Still need help?",
    keywords: [],
    type: "",
  });


  // console.log("issueTypes", issueTypes)
  // console.log("parentFaqOptions", parentFaqOptions)

  const [errors, setErrors] = useState({});

  // Fetch flat FAQ list for parent selection (excluding current FAQ in edit mode)
  const { data: flatFAQList = [] } = useGetFlatFAQList({
    excludeId: initialData?.question_id,
  });

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData({
        question_text: initialData.question_text || "",
        answer_text: initialData.answer_text || "",
        issue_type: initialData.issue_type || "",
        parent_question_id: initialData.parent_question_id || "",
        sub_category: initialData.sub_category || "",
        priority: initialData.priority || 1,
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        escalation_allowed: initialData.escalation_allowed || false,
        escalation_label: initialData.escalation_label || "Still need help?",
        keywords: initialData.keywords || [],
      });
    } else if (prefilledParentId) {
      setFormData((prev) => ({
        ...prev,
        parent_question_id: prefilledParentId,
      }));
    }
  }, [initialData, prefilledParentId]);

  // console.log("flatFAQList", flatFAQList)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData?.question_text.trim()) {
  //     newErrors.question_text = "Question is required";
  //   }

  //   if (!formData?.answer_text.trim()) {
  //     newErrors.answer_text = "Answer is required";
  //   }

  //   if (!formData?.issue_type.trim()) {
  //     newErrors.issue_type = "Issue type is required";
  //   }

  //   if (!formData?.priority || formData?.priority < 1) {
  //     newErrors.priority = "Priority must be a positive number";
  //   }

  //   if (!formData?.type.trim()) {
  //     newErrors.type = "FAQ Level is required";
  //   }

  //   // Check for circular reference
  //   if (formData?.parent_question_id && initialData) {
  //     const isCircular = checkCircularReference(formData?.parent_question_id, initialData?.question_id);
  //     if (isCircular) {
  //       newErrors.parent_question_id = "Cannot select self or descendant as parent (circular reference)";
  //     }
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const validateForm = () => {
    const newErrors = {};

    // ✅ Always validate Question & Answer
    if (!formData.question_text.trim()) {
      newErrors.question_text = "Question is required";
    }

    if (!formData.answer_text.trim()) {
      newErrors.answer_text = "Answer is required";
    }

    // ✅ Validate remaining fields ONLY in create mode
    if (!isEditMode) {
      if (!formData.issue_type?.trim()) {
        newErrors.issue_type = "Issue type is required";
      }

      if (!formData.priority || formData.priority < 1) {
        newErrors.priority = "Priority must be a positive number";
      }

      if (!formData.type?.trim()) {
        newErrors.type = "FAQ Level is required";
      }

      if (formData.type === "leaf" && !formData.parent_question_id) {
        newErrors.parent_question_id = "Parent FAQ is required for Leaf FAQs";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const checkCircularReference = (selectedParentId, currentFaqId) => {
    // If selecting self as parent
    if (selectedParentId === currentFaqId) {
      return true;
    }

    // Check if selectedParent is a descendant of current FAQ
    const isDescendant = (faq, targetId) => {
      if (faq.question_id === targetId) return true;
      if (faq.children && faq.children.length > 0) {
        return faq.children.some((child) => isDescendant(child, targetId));
      }
      return false;
    };

    // This is a simplified check - in real implementation, you'd need to traverse the tree
    return false;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     console.log("formData", formData)

  //     const { parent_question_id, ...rest } = formData;

  //     // const payload =
  //     //   formData.type === "root"
  //     //     ? rest
  //     //     : { ...rest, parent_question_id };

  //     onSubmit(rest);
  //   }
  // };

  // Backend issue type enum values
  // const issueTypes = [
  //   { value: "order", label: "Order Issues" },
  //   { value: "payment", label: "Payment Issues" },
  //   { value: "delivery", label: "Delivery Issues" },
  //   { value: "returns", label: "Returns & Refunds" },
  //   { value: "account", label: "Account Issues" },
  //   { value: "general", label: "General Inquiry" },
  // ];


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // ✅ EDIT MODE → send only Question & Answer
    if (isEditMode) {
      onSubmit({
        question_text: formData.question_text,
        answer_text: formData.answer_text,
      });
      return;
    }

    // ✅ CREATE MODE → existing behavior (unchanged)
    const { parent_question_id, ...rest } = formData;
    onSubmit(
      formData.type === "root"
        ? rest
        : { ...rest, parent_question_id }
    );
  };


  const FAQLevel = [
    { value: "leaf", label: "Leaf" },
    { value: "root", label: "Root" }
  ]


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-indigo-50">
          <h2 className="text-2xl font-bold text-indigo-900">{isEditMode ? "Edit FAQ" : "Create New FAQ"}</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-indigo-100 rounded-full transition disabled:opacity-50"
          >
            <X size={24} className="text-indigo-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-5">
            {/* Question */}
            <div>
              <label htmlFor="question_text" className="block text-sm font-semibold text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                id="question_text"
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border ${errors.question_text ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none`}
                placeholder="Enter the FAQ question..."
                disabled={isSubmitting}
              />
              {errors.question_text && <p className="mt-1 text-sm text-red-500">{errors.question_text}</p>}
            </div>

            {/* Answer */}
            <div>
              <label htmlFor="answer_text" className="block text-sm font-semibold text-gray-700 mb-2">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answer_text"
                name="answer_text"
                value={formData.answer_text}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 border ${errors.answer_text ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none`}
                placeholder="Enter the FAQ answer..."
                disabled={isSubmitting}
              />
              {errors.answer_text && <p className="mt-1 text-sm text-red-500">{errors.answer_text}</p>}
            </div>

            {
              !isEditMode && (
                <>

                  {/* Issue Type */}
                  <div>
                    <label htmlFor="issue_type" className="block text-sm font-semibold text-gray-700 mb-2">
                      Issue Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="issue_type"
                      name="issue_type"
                      value={formData.issue_type}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.issue_type ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select issue type...</option>
                      {issueTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.issue_type && <p className="mt-1 text-sm text-red-500">{errors.issue_type}</p>}
                  </div>


                  {/* Faq Level */}

                  <div>
                    <label htmlFor="issue_type" className="block text-sm font-semibold text-gray-700 mb-2">
                      Faq Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.type ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select issue type...</option>
                      {FAQLevel.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                  </div>

                  {/* Parent FAQ */}
                  <div>
                    <label
                      htmlFor="parent_question_id"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Parent FAQ
                    </label>

                    <div className="relative group">
                      <select
                        id="parent_question_id"
                        name="parent_question_id"
                        value={formData.parent_question_id}
                        onChange={handleChange}
                        disabled={formData.type === "root" || isSubmitting}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        ${formData.type === "root"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-300"
                          }`}
                      >
                        <option value="">Select parent FAQ...</option>
                        {parentFaqOptions.map((faq) => (
                          <option key={faq.value} value={faq.value}>
                            {faq.label}
                          </option>
                        ))}
                      </select>

                      {formData.type === "root" && (
                        <div className="absolute left-0 -top-9 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap">
                          Root FAQs do not have a parent
                        </div>
                      )}
                    </div>

                    {errors.parent_question_id && (
                      <p className="mt-1 text-sm text-red-500">{errors.parent_question_id}</p>
                    )}
                  </div>


                  {/* Priority */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 border ${errors.priority ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Enter priority (lower = higher priority)"
                      disabled={isSubmitting}
                    />
                    {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
                    <p className="mt-1 text-xs text-gray-500">Lower numbers appear first in the list</p>
                  </div>

                  {/* Checkboxes Row */}
                  <div className="flex gap-6">
                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>

                    {/* Escalation Allowed */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="escalation_allowed"
                        name="escalation_allowed"
                        checked={formData.escalation_allowed}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="escalation_allowed" className="ml-2 text-sm font-medium text-gray-700">
                        Escalation Allowed
                      </label>
                    </div>
                  </div>

                  {/* FAQ Type Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>FAQ Type:</strong> {formData.parent_question_id ? "Child (Followup/Leaf)" : "Root"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {formData.parent_question_id
                        ? "This FAQ will be nested under the selected parent. It will become a 'followup' if children are added, or remain a 'leaf' if it has no children."
                        : "This FAQ will appear at the top level of the tree structure."}
                    </p>
                  </div>
                </>
              )
            }
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update FAQ" : "Create FAQ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQFormModal;
