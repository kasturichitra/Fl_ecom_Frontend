import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderTableHeadersStore = create(
    persist(
        (set) => ({
            orderHeaders: [
                { key: "ORDER ID", value: true },
                { key: "CUSTOMER ID", value: true },
                { key: "ORDER STATUS", value: true },
                { key: "PAYMENT METHOD", value: true },
                { key: "ORDER TYPE", value: true },
                { key: "TOTAL AMOUNT", value: true },
            ],

            updateOrderHeaders: (headers) => set({ orderHeaders: headers }),
        }),

        {
            name: "order-table-headers", // Storage key
            getStorage: () => sessionStorage, // Persist in sessionStorage
        }
    )
)