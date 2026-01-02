import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2, Power, PowerOff } from "lucide-react";
import { useState } from "react";

/**
 * Recursive tree node component for FAQ hierarchy
 * @param {Object} faq - FAQ object with children
 * @param {Function} onSelect - Callback when FAQ is selected
 * @param {String} selectedId - Currently selected FAQ id
 * @param {Number} level - Nesting level for indentation
 */
const FAQTreeNode = ({ faq, onSelect,onToggleStatus ,selectedId, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = faq?.children && faq?.children.length > 0;
  const isSelected = selectedId === faq?.question_id;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect(faq);
  };

  return (
    <div className="select-none">
      {/* FAQ Node */}
      <div
        className={`
          flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
          transition-all duration-200 group
          ${isSelected ? "bg-indigo-50 border-l-4 border-indigo-600" : "hover:bg-gray-50 border-l-4 border-transparent"}
        `}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Icon */}
        <div className="flex-shrink-0">
          {hasChildren ? (
            <button onClick={handleToggle} className="p-0.5 hover:bg-gray-200 rounded transition">
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}
        </div>

        {/* Priority Badge */}
        <div className="flex-shrink-0">
          {faq?.priority ? (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-indigo-600 bg-indigo-100 rounded-full">
              {faq?.priority}
            </span>
          ) : (
            <span className="inline-flex w-3 h-3 rounded-full bg-indigo-300" />
          )}
        </div>

        {/* FAQ Question */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm truncate ${isSelected ? "font-semibold text-indigo-900" : "font-medium text-gray-800"}`}
          >
            {faq?.question_text}
          </p>
        </div>

        {/* Status & Escalation Indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Escalation Eligible */}
          {faq?.escalation_allowed && (
            <div className="flex items-center" title="Escalation Eligible">
              <AlertCircle size={16} className="text-amber-600" />
            </div>
          )}

          {/* Active/Inactive Status */}
          {/* <div className={`flex items-center`} title={faq?.is_active ? "Active" : "Inactive"}>
            {faq?.is_active ? (
              <Power size={16} className="text-green-600" />
            ) : (
              <PowerOff size={16} className="text-red-600" />
            )}
          </div> */}

          {/* Active/Inactive Status */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent selecting the node
              onToggleStatus(faq.question_id);
            }}
            title={faq?.is_active ? "Disable FAQ" : "Enable FAQ"}
            className="p-1 rounded hover:bg-gray-200 transition"
          >
            {faq?.is_active ? (
              <Power size={16} className="text-green-600" />
            ) : (
              <PowerOff size={16} className="text-red-600" />
            )}
          </button>


          {/* FAQ Type Badge */}
          <span
            className={`
              px-2 py-0.5 text-xs font-semibold rounded
              ${faq?.type === "root" ? "bg-blue-100 text-blue-800" : ""}
              ${faq?.type === "followup" ? "bg-purple-100 text-purple-800" : ""}
              ${faq?.type === "leaf" ? "bg-green-100 text-green-800" : ""}
            `}
          >
            {faq?.type}
          </span>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {faq?.children
            .sort((a, b) => a.priority - b.priority)
            .map((child) => (
              <FAQTreeNode
                key={child.question_id}
                faq={child}
                onSelect={onSelect}
                selectedId={selectedId}
                level={level + 1}
                onToggleStatus={onToggleStatus}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FAQTreeNode;
