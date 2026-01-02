import { X, Plus, Edit2, Trash2, Power, PowerOff, AlertCircle } from "lucide-react";

/**
 * FAQ Detail Panel - Shows selected FAQ details
 * @param {Object} faq - Selected FAQ object
 * @param {Function} onAddChild - Callback to add child FAQ
 * @param {Function} onEdit - Callback to edit FAQ
 * @param {Function} onDelete - Callback to delete FAQ
 * @param {Function} onToggleStatus - Callback to toggle active status
 * @param {Function} onClose - Callback to close panel
 * @param {Boolean} isLoading - Loading state for actions
 */
const FAQDetailPanel = ({ faq, onAddChild, onEdit, onDelete, onToggleStatus, onClose, isLoading = false }) => {
  if (!faq) {
    return (
      <div className="w-full lg:w-96 bg-gray-50 border-l border-gray-200 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-center">Select a FAQ from the tree to view details</p>
      </div>
    );
  }

  const hasChildren = faq.children && faq.children.length > 0;

  // console.log("faq", faq);
  // console.log("is_active", faq.is_active);

  // console.log("onToggleStatus", onToggleStatus);
  

  return (
    <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-indigo-50">
        <h3 className="text-lg font-bold text-indigo-900">FAQ Details</h3>
        <button onClick={onClose} className="p-1 hover:bg-indigo-100 rounded transition lg:hidden" title="Close">
          <X size={20} className="text-indigo-600" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Question */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Question</label>
          <p className="text-sm font-medium text-gray-900">{faq.question_text}</p>
        </div>

        {/* Answer */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Answer</label>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answer_text}</p>
        </div>

        {/* Issue Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Issue Type</label>
          <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded">
            {faq.issue_type}
          </span>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Priority</label>
          <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-indigo-600 bg-indigo-100 rounded-full">
            {faq.priority}
          </span>
        </div>

        {/* FAQ Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">FAQ Type</label>
          <span
            className={`
              inline-block px-3 py-1 text-sm font-semibold rounded
              ${faq.type === "root" ? "bg-blue-100 text-blue-800" : ""}
              ${faq.type === "followup" ? "bg-purple-100 text-purple-800" : ""}
              ${faq.type === "leaf" ? "bg-green-100 text-green-800" : ""}
            `}
          >
            {faq.type.charAt(0).toUpperCase() + faq.type.slice(1)}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {faq.type === "root" && "Top-level FAQ with no parent"}
            {faq.type === "followup" && "Has parent and children"}
            {faq.type === "leaf" && "Has parent but no children"}
          </p>
        </div>

        {/* Parent FAQ */}
        {faq.parent_question_id && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Parent FAQ</label>
            <p className="text-sm text-gray-700">ID: {faq.parent_question_id}</p>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
          <span
            className={`
              inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded
              ${faq.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            `}
          >
            {faq.is_active ? (
              <>
                <Power size={14} />
                Active
              </>
            ) : (
              <>
                <PowerOff size={14} />
                Inactive
              </>
            )}
          </span>
        </div>

        {/* Escalation Allowed */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Escalation Allowed</label>
          <div className="flex items-center gap-2">
            {faq.escalation_allowed ? (
              <>
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Yes</span>
              </>
            ) : (
              <span className="text-sm text-gray-600">No</span>
            )}
          </div>
          {faq.escalation_allowed && (
            <p className="text-xs text-amber-700 mt-1">
              {faq.escalation_label || "This FAQ can be escalated to support team"}
            </p>
          )}
        </div>

        {/* Children Count */}
        {hasChildren && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Child FAQs</label>
            <p className="text-sm text-gray-700">{faq.children.length} child question(s)</p>
          </div>
        )}
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
        {/* Add Child Button */}
        <button
          onClick={() => onAddChild(faq)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add Child Question
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(faq)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit2 size={18} />
          Edit FAQ
        </button>

        {/* Toggle Status Button */}
        <button
          onClick={() => onToggleStatus(faq.question_id)}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed
            ${
              faq.is_active
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }
          `}
        >
          {/* {faq.is_active ? (
            <>
              <PowerOff size={18} />
              Disable FAQ
            </>
          ) : (
            <>
              <Power size={18} />
              Enable FAQ
            </>
          )} */}

          {
            faq.is_active ? (
              <>
                <PowerOff size={18} />
                Disable FAQ
              </>
            ) : (
              <>
                <Power size={18} />
                Enable FAQ
              </>
            )
          }
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(faq)}
          disabled={isLoading || hasChildren}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={hasChildren ? "Cannot delete FAQ with children" : "Delete FAQ"}
        >
          <Trash2 size={18} />
          Delete FAQ
        </button>
        {hasChildren && <p className="text-xs text-red-600 text-center">Delete child FAQs first</p>}
      </div>
    </div>
  );
};

export default FAQDetailPanel;
