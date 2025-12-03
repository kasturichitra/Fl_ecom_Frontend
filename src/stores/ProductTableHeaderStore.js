import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useProductTableHeadersStore = create(
    persist(
        (set) => ({ 
            productHeaders: [
                { key: "PRODUCT ID", value: true },
                { key: "NAME", value: true },
                { key: "BRAND", value: true },
                { key: "CATEGORY", value: true },
                { key: "Final Price", value: true },
                { key: "STOCK", value: true },
                { key: "MOQ", value: true },
                { key: "COLOR", value: true },
                { key: "GENDER", value: true },
                { key: "ACTIONS", value: true },
            ],

            updateProductTableHeaders: (headers) => set({ productHeaders: headers }),
        }),
        {
            name: "product-table-header",
            getStorage: () => sessionStorage,
        }
    )
)