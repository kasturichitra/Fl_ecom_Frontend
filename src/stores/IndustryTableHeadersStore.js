import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useIndustryTableHeadersStore = create(
    persist(
        (set) => ({
            industryHeaders: [
                { key: "UNIQUE ID", value: true },
                { key: "INDUSTRY NAME", value: true },
                { key: "STATUS", value: true },
                { key: "ACTIONS", value: true },
            ],

            updateTableHeaders: (headers) => set({ industryHeaders: headers }),
        }),

        {
            name: "industry-table-headers", // Storage key
            getStorage: () => sessionStorage, // Persist in sessionStorage
        }
    )
);