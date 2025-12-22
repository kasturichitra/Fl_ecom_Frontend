import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCouponTableHeadersStore = create(
    persist(
        (set) => ({
            couponHeaders: [
                { key: "COUPON CODE", value: true },
                { key: "COUPON TYPE", value: true },
                { key: "DISCOUNT", value: true },
                { key: "MIN ORDER", value: true },
                { key: "MAX DISCOUNT", value: true },
                { key: "APPLY ON", value: true },
                { key: "USAGE LIMIT", value: true },
                { key: "START DATE", value: true },
                { key: "END DATE", value: true },
                { key: "STATUS", value: true },
                { key: "CREATED AT", value: false },
            ],

            updateTableHeaders: (headers) => set({ couponHeaders: headers }),
        }),

        {
            name: "coupon-table-headers-v2", // Updated storage key to force refresh
            getStorage: () => sessionStorage, // Persist in sessionStorage
        }
    )
);  
