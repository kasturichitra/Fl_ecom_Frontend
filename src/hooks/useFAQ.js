import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFAQ, getAdminFAQTree } from "../ApiServices/faqService";

// Mock FAQ data structure matching backend schema
const mockFAQData = {
  issue_types: [
    {
      id: "it1",
      name: "order",
      display_name: "Order Issues",
      faqs: [
        {
          question_id: "faq_order_001",
          question_text: "How do I track my order?",
          answer_text:
            "You can track your order by logging into your account and visiting the 'My Orders' section. Click on the specific order to view tracking details.",
          issue_type: "order",
          sub_category: "tracking",
          type: "root",
          parent_question_id: null,
          next_questions: ["faq_order_002", "faq_order_003"],
          escalation_allowed: false,
          escalation_label: "Still need help?",
          priority: 1,
          keywords: ["track", "order", "status", "shipping"],
          created_by: "admin",
          is_active: true,
          version: 1,
          children: [
            {
              question_id: "faq_order_002",
              question_text: "What if tracking shows no updates?",
              answer_text:
                "If tracking hasn't updated in 48 hours, please contact customer support with your order number.",
              issue_type: "order",
              sub_category: "tracking",
              type: "followup",
              parent_question_id: "faq_order_001",
              next_questions: [],
              escalation_allowed: true,
              escalation_label: "Contact Support",
              priority: 1,
              keywords: ["tracking", "no update", "stuck"],
              created_by: "admin",
              is_active: true,
              version: 1,
              children: [],
            },
            {
              question_id: "faq_order_003",
              question_text: "Can I change my delivery address?",
              answer_text:
                "Address changes are possible only if the order hasn't been shipped yet. Contact support immediately.",
              issue_type: "order",
              sub_category: "modification",
              type: "leaf",
              parent_question_id: "faq_order_001",
              next_questions: [],
              escalation_allowed: true,
              escalation_label: "Request Address Change",
              priority: 2,
              keywords: ["address", "change", "delivery", "modify"],
              created_by: "admin",
              is_active: true,
              version: 1,
              children: [],
            },
          ],
        },
        {
          question_id: "faq_order_004",
          question_text: "How do I cancel my order?",
          answer_text:
            "Orders can be cancelled within 24 hours of placement. Go to 'My Orders' and click the 'Cancel Order' button.",
          issue_type: "order",
          sub_category: "cancellation",
          type: "root",
          parent_question_id: null,
          next_questions: ["faq_order_005"],
          escalation_allowed: false,
          escalation_label: "Still need help?",
          priority: 2,
          keywords: ["cancel", "order", "refund"],
          created_by: "admin",
          is_active: true,
          version: 1,
          children: [
            {
              question_id: "faq_order_005",
              question_text: "Will I get a full refund?",
              answer_text: "Yes, cancelled orders receive full refunds within 5-7 business days.",
              issue_type: "order",
              sub_category: "cancellation",
              type: "leaf",
              parent_question_id: "faq_order_004",
              next_questions: [],
              escalation_allowed: false,
              escalation_label: "Still need help?",
              priority: 1,
              keywords: ["refund", "cancel", "money back"],
              created_by: "admin",
              is_active: true,
              version: 1,
              children: [],
            },
          ],
        },
        {
          question_id: "faq_order_006",
          question_text: "My order is delayed, what should I do?",
          answer_text:
            "Delays can happen due to various reasons. Check the estimated delivery date in your order details.",
          issue_type: "order",
          sub_category: "delivery",
          type: "root",
          parent_question_id: null,
          next_questions: [],
          escalation_allowed: true,
          escalation_label: "Report Delay",
          priority: 3,
          keywords: ["delay", "late", "delivery", "waiting"],
          created_by: "admin",
          is_active: false,
          version: 1,
          children: [],
        },
      ],
    },
    {
      id: "it2",
      name: "payment",
      display_name: "Payment Issues",
      faqs: [
        {
          question_id: "faq_payment_001",
          question_text: "Payment failed but money was deducted?",
          answer_text:
            "If payment fails but money is debited, it will be automatically refunded within 5-7 business days.",
          issue_type: "payment",
          sub_category: "transaction",
          type: "root",
          parent_question_id: null,
          next_questions: ["faq_payment_002"],
          escalation_allowed: true,
          escalation_label: "Report Payment Issue",
          priority: 1,
          keywords: ["payment", "failed", "deducted", "money", "refund"],
          created_by: "system",
          is_active: true,
          version: 1,
          children: [
            {
              question_id: "faq_payment_002",
              question_text: "How can I verify the refund?",
              answer_text: "You can check your bank statement or contact your bank for refund confirmation.",
              issue_type: "payment",
              sub_category: "transaction",
              type: "leaf",
              parent_question_id: "faq_payment_001",
              next_questions: [],
              escalation_allowed: false,
              escalation_label: "Still need help?",
              priority: 1,
              keywords: ["refund", "verify", "bank", "statement"],
              created_by: "system",
              is_active: true,
              version: 1,
              children: [],
            },
          ],
        },
        {
          question_id: "faq_payment_003",
          question_text: "What payment methods do you accept?",
          answer_text: "We accept Credit Card, Debit Card, Net Banking, UPI, and Cash on Delivery.",
          issue_type: "payment",
          sub_category: "methods",
          type: "root",
          parent_question_id: null,
          next_questions: [],
          escalation_allowed: false,
          escalation_label: "Still need help?",
          priority: 2,
          keywords: ["payment", "methods", "accept", "card", "upi"],
          created_by: "system",
          is_active: true,
          version: 1,
          children: [],
        },
      ],
    },
    {
      id: "it3",
      name: "returns",
      display_name: "Returns & Refunds",
      faqs: [
        {
          question_id: "faq_returns_001",
          question_text: "I received a damaged product",
          answer_text:
            "We apologize for the inconvenience. Please report damaged products within 48 hours with photos.",
          issue_type: "returns",
          sub_category: "damaged",
          type: "root",
          parent_question_id: null,
          next_questions: ["faq_returns_002"],
          escalation_allowed: true,
          escalation_label: "Report Damaged Product",
          priority: 1,
          keywords: ["damaged", "broken", "defective", "return"],
          created_by: "admin",
          is_active: true,
          version: 1,
          children: [
            {
              question_id: "faq_returns_002",
              question_text: "How do I return a damaged product?",
              answer_text: "Once verified, we'll arrange a free pickup and send a replacement or process a refund.",
              issue_type: "returns",
              sub_category: "process",
              type: "followup",
              parent_question_id: "faq_returns_001",
              next_questions: ["faq_returns_003"],
              escalation_allowed: false,
              escalation_label: "Still need help?",
              priority: 1,
              keywords: ["return", "pickup", "replacement", "process"],
              created_by: "admin",
              is_active: true,
              version: 1,
              children: [
                {
                  question_id: "faq_returns_003",
                  question_text: "How long does the replacement take?",
                  answer_text: "Replacement products are shipped within 3-5 business days after pickup.",
                  issue_type: "returns",
                  sub_category: "process",
                  type: "leaf",
                  parent_question_id: "faq_returns_002",
                  next_questions: [],
                  escalation_allowed: false,
                  escalation_label: "Still need help?",
                  priority: 1,
                  keywords: ["replacement", "time", "duration", "shipping"],
                  created_by: "admin",
                  is_active: true,
                  version: 1,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Local state to simulate database
let faqDatabase = JSON.parse(JSON.stringify(mockFAQData));

/**
 * Get all FAQs with optional filters
 */
export const useGetAdminFAQTree = ({ searchTerm = "", is_active = "true" } = {}) => {
  return useQuery({
    queryKey: ["faqs", searchTerm, is_active],
    queryFn: () =>
      getAdminFAQTree({
        is_active,
        searchTerm,
      }),
    select: (res) => res.data,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Helper function to recursively filter FAQs by search term
 */
const filterFAQsBySearch = (faqs, searchTerm) => {
  return faqs.reduce((acc, faq) => {
    const matchesQuestion = faq.question_text.toLowerCase().includes(searchTerm);
    const matchesAnswer = faq.answer_text?.toLowerCase().includes(searchTerm) || false;
    const matchesKeywords = faq.keywords?.some((kw) => kw.includes(searchTerm)) || false;

    let filteredChildren = [];
    if (faq.children && faq.children.length > 0) {
      filteredChildren = filterFAQsBySearch(faq.children, searchTerm);
    }

    // Include FAQ if it matches or if any of its children match
    if (matchesQuestion || matchesAnswer || matchesKeywords || filteredChildren.length > 0) {
      acc.push({
        ...faq,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};

/**
 * Helper function to recursively filter FAQs by status
 */
const filterFAQsByStatus = (faqs, isActive) => {
  return faqs.reduce((acc, faq) => {
    let filteredChildren = [];
    if (faq.children && faq.children.length > 0) {
      filteredChildren = filterFAQsByStatus(faq.children, isActive);
    }

    // Include FAQ if status matches or if it has matching children
    if (faq.is_active === isActive || filteredChildren.length > 0) {
      acc.push({
        ...faq,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};

/**
 * Create a new FAQ
 */
export const useCreateFAQ = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ created successfully!");
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create FAQ");
      options.onError?.();
    },
  });
};

/**
 * Update an existing FAQ
 */
export const useUpdateFAQ = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question_id, data }) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Helper function to find and update FAQ
      const updateFAQRecursive = (faqs) => {
        for (let faq of faqs) {
          if (faq.question_id === question_id) {
            Object.assign(faq, {
              question_text: data.question_text !== undefined ? data.question_text : faq.question_text,
              answer_text: data.answer_text !== undefined ? data.answer_text : faq.answer_text,
              sub_category: data.sub_category !== undefined ? data.sub_category : faq.sub_category,
              priority: data.priority !== undefined ? data.priority : faq.priority,
              is_active: data.is_active !== undefined ? data.is_active : faq.is_active,
              escalation_allowed:
                data.escalation_allowed !== undefined ? data.escalation_allowed : faq.escalation_allowed,
              escalation_label: data.escalation_label !== undefined ? data.escalation_label : faq.escalation_label,
              keywords: data.keywords !== undefined ? data.keywords : faq.keywords,
              version: faq.version + 1,
            });
            return faq;
          }
          if (faq.children && faq.children.length > 0) {
            const result = updateFAQRecursive(faq.children);
            if (result) return result;
          }
        }
        return null;
      };

      // Search through all issue types
      for (let issueType of faqDatabase.issue_types) {
        const updatedFAQ = updateFAQRecursive(issueType.faqs);
        if (updatedFAQ) {
          // Sort FAQs by priority
          issueType.faqs.sort((a, b) => a.priority - b.priority);
          return updatedFAQ;
        }
      }

      throw new Error("FAQ not found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ updated successfully!");
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update FAQ");
      options.onError?.();
    },
  });
};

/**
 * Delete a FAQ
 */
export const useDeleteFAQ = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question_id) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Helper function to find and remove FAQ
      const deleteFAQRecursive = (faqs, parentFaqs = null) => {
        for (let i = 0; i < faqs.length; i++) {
          if (faqs[i].question_id === question_id) {
            // Check if FAQ has children
            if (faqs[i].children && faqs[i].children.length > 0) {
              throw new Error("Cannot delete FAQ with children. Please delete child FAQs first.");
            }
            faqs.splice(i, 1);
            return true;
          }
          if (faqs[i].children && faqs[i].children.length > 0) {
            if (deleteFAQRecursive(faqs[i].children, faqs)) {
              // Update parent type if no children left
              if (faqs[i].children.length === 0) {
                faqs[i].type = "leaf";
              }
              return true;
            }
          }
        }
        return false;
      };

      // Search through all issue types
      for (let issueType of faqDatabase.issue_types) {
        if (deleteFAQRecursive(issueType.faqs)) {
          return true;
        }
      }

      throw new Error("FAQ not found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ deleted successfully!");
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete FAQ");
      options.onError?.();
    },
  });
};

/**
 * Toggle FAQ status (enable/disable)
 */
export const useToggleFAQStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question_id) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Helper function to find and toggle FAQ status
      const toggleStatusRecursive = (faqs) => {
        for (let faq of faqs) {
          if (faq.question_id === question_id) {
            faq.is_active = !faq.is_active;
            faq.version = faq.version + 1;
            return faq;
          }
          if (faq.children && faq.children.length > 0) {
            const result = toggleStatusRecursive(faq.children);
            if (result) return result;
          }
        }
        return null;
      };

      // Search through all issue types
      for (let issueType of faqDatabase.issue_types) {
        const toggledFAQ = toggleStatusRecursive(issueType.faqs);
        if (toggledFAQ) {
          return toggledFAQ;
        }
      }

      throw new Error("FAQ not found");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success(`FAQ ${data.is_active ? "enabled" : "disabled"} successfully!`);
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to toggle FAQ status");
      options.onError?.();
    },
  });
};

/**
 * Helper function to get all FAQs as a flat list (for parent selection dropdown)
 */
export const useGetFlatFAQList = ({ excludeId = null } = {}) => {
  return useQuery({
    queryKey: ["faqs-flat", excludeId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const flatList = [];

      const flattenFAQs = (faqs, level = 0) => {
        for (let faq of faqs) {
          if (faq.question_id !== excludeId) {
            flatList.push({
              ...faq,
              level,
              display: `${"  ".repeat(level)}${faq.question_text.substring(0, 60)}${
                faq.question_text.length > 60 ? "..." : ""
              }`,
            });
          }
          if (faq.children && faq.children.length > 0) {
            flattenFAQs(faq.children, level + 1);
          }
        }
      };

      for (let issueType of faqDatabase.issue_types) {
        flattenFAQs(issueType.faqs);
      }

      return flatList;
    },
  });
};
