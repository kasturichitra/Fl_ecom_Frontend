import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useCategoryTableHeadersStore = create(
    persist(
        (set) => ({
            categoryHeaders: [
                { key: "UNIQUE ID", value: true },
                { key: "CATEGORY NAME", value: true },
                { key: "STATUS", value: true },
                { key: "ACTIONS", value: true },
            ],

            updateCategoryTableHeaders: (headers) => set({ categoryHeaders: headers }),
        }),

        {
            name: "category-table-headers", // Storage key
            getStorage: () => sessionStorage, // Persist in sessionStorage
        }
    )
);  