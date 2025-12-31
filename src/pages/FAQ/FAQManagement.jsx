import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import { DropdownFilter } from "../../components/DropdownFilter";
import FAQTreeNode from "./FAQTreeNode";
import FAQDetailPanel from "./FAQDetailPanel";
import FAQFormModal from "./FAQFormModal";
import { useGetAdminFAQTree, useCreateFAQ, useUpdateFAQ, useDeleteFAQ, useToggleFAQStatus } from "../../hooks/useFAQ";
import { statusOptions } from "../../lib/constants";
import { statusToBooleanConverter } from "../../lib/helperFunctions";

const FAQManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [prefilledParentQuestionId, setPrefilledParentQuestionId] = useState(null);
  const [expandedIssueTypes, setExpandedIssueTypes] = useState({});

  /* ---------------- Fetch FAQ Tree ---------------- */
  const { data: faqResponse, isLoading } = useGetAdminFAQTree({
    searchTerm,
    is_active: statusToBooleanConverter(statusFilter),
  });

  /* ---------------- Backend-native data ---------------- */
  const faqRoots = faqResponse?.data || [];

  /* ---------------- Group roots by issue_type ---------------- */
  const faqRootsByIssueType = useMemo(() => {
    const map = {};

    faqRoots.forEach((rootFAQ) => {
      const { issue_type } = rootFAQ;

      if (!map[issue_type]) {
        map[issue_type] = [];
      }

      map[issue_type].push(rootFAQ);
    });

    return map;
  }, [faqRoots]);

  /* ---------------- Expand all issue types by default ---------------- */
  useEffect(() => {
    if (Object.keys(faqRootsByIssueType).length > 0 && Object.keys(expandedIssueTypes).length === 0) {
      const expanded = {};
      Object.keys(faqRootsByIssueType).forEach((issue_type) => {
        expanded[issue_type] = true;
      });
      setExpandedIssueTypes(expanded);
    }
  }, [faqRootsByIssueType]);

  /* ---------------- Mutations ---------------- */
  const { mutateAsync: createFAQ, isPending: isCreating } = useCreateFAQ({
    onSuccess: () => {
      setShowFormModal(false);
      setPrefilledParentQuestionId(null);
    },
  });

  const { mutateAsync: updateFAQ, isPending: isUpdating } = useUpdateFAQ({
    onSuccess: () => {
      setShowFormModal(false);
      setEditingFAQ(null);
    },
  });

  const { mutateAsync: deleteFAQ, isPending: isDeleting } = useDeleteFAQ({
    onSuccess: () => setSelectedFAQ(null),
  });

  const { mutateAsync: toggleFAQStatus, isPending: isToggling } = useToggleFAQStatus();

  const isFormSubmitting = isCreating || isUpdating;
  const isActionLoading = isDeleting || isToggling;

  /* ---------------- Handlers ---------------- */
  const handleSelectFAQ = (faq) => setSelectedFAQ(faq);

  const handleAddNew = () => {
    setEditingFAQ(null);
    setPrefilledParentQuestionId(null);
    setShowFormModal(true);
  };

  const handleAddChild = (parentFAQ) => {
    setEditingFAQ(null);
    setPrefilledParentQuestionId(parentFAQ.question_id);
    setShowFormModal(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setShowFormModal(true);
  };

  const handleDelete = async (faq) => {
    if (window.confirm(`Delete "${faq.question_text}"?`)) {
      await deleteFAQ(faq.question_id);
    }
  };

  const handleToggleStatus = async (question_id) => {
    await toggleFAQStatus(question_id);
  };

  const handleFormSubmit = async (formData) => {
    if (editingFAQ) {
      await updateFAQ({
        question_id: editingFAQ.question_id,
        data: formData,
      });
    } else {
      await createFAQ(formData);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <PageHeader
          title="FAQ Management"
          subtitle="Manage hierarchical FAQ structure by issue type"
          actionLabel="Add New FAQ"
          onAction={handleAddNew}
        />

        {/* <div className="p-6 flex gap-4 bg-gray-50 border-t">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search FAQs..." />
          <DropdownFilter value={statusFilter} onSelect={setStatusFilter} data={statusOptions} placeholder="Status" />
        </div> */}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {isLoading ? (
              <div className="text-center py-12">Loading FAQs…</div>
            ) : Object.keys(faqRootsByIssueType).length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold">No FAQs Found</h3>
              </div>
            ) : (
              Object.entries(faqRootsByIssueType).map(([issue_type, rootFAQs]) => (
                <div key={issue_type} className="bg-white rounded-xl border shadow-sm">
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer bg-indigo-50"
                    onClick={() =>
                      setExpandedIssueTypes((p) => ({
                        ...p,
                        [issue_type]: !p[issue_type],
                      }))
                    }
                  >
                    {expandedIssueTypes[issue_type] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <HelpCircle size={20} />
                    <h3 className="font-bold capitalize flex-1">{issue_type}</h3>
                    <span className="text-sm font-semibold">{rootFAQs.length} FAQs</span>
                  </div>

                  {expandedIssueTypes[issue_type] && (
                    <div className="p-4 space-y-1">
                      {rootFAQs
                        .sort((a, b) => a.priority - b.priority)
                        .map((faq) => (
                          <FAQTreeNode
                            key={faq.question_id}
                            faq={faq}
                            level={0}
                            selectedId={selectedFAQ?.question_id}
                            onSelect={handleSelectFAQ}
                          />
                        ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <FAQDetailPanel
            faq={selectedFAQ}
            onAddChild={handleAddChild}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onClose={() => setSelectedFAQ(null)}
            isLoading={isActionLoading}
          />
        </div>
      </div>

      {showFormModal && (
        <FAQFormModal
          initialData={editingFAQ}
          prefilledParentId={prefilledParentQuestionId}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          isSubmitting={isFormSubmitting}
        />
      )}
    </div>
  );
};

export default FAQManagement;
