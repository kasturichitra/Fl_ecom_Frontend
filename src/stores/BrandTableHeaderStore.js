import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useBrandTableHeadersStore = create(
    persist(
        (set) => ({
            brandHeaders: [
                { key: "BRAND ID", value: true },
                { key: "BRAND NAME", value: true },
                { key: "STATUS", value: true },
                { key: "ACTIONS", value: true },
                { key: "DESCRIPTION", value: true },
            ],

            updateBrandTableHeaders: (headers) => set({ brandHeaders: headers }),
        }),

        {
            name: "brand-table-header", // Storage key
            getStorage: () => sessionStorage, // Persist in sessionStorage
        }
    )
)