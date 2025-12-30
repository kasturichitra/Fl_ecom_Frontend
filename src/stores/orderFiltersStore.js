import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialFilters = {
    search: "",
    orderStatus: "",
    paymentMethod: "",
    orderType: "",
    page: 0,
    limit: 10,
};

export const useOrderFiltersStore = create(
    persist(
        (set) => ({
            filters: initialFilters,

            // 🔹 set single filter
            setFilter: (key, value) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        [key]: value,
                    },
                })),

            // 🔹 set multiple filters
            setFilters: (payload) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        ...payload,
                    },
                })),

            // 🔄 reset all filters
            resetFilters: () =>
                set({
                    filters: initialFilters,
                }),
        }),
        {
            name: "order-filters",
            getStorage: () => sessionStorage,
        }
    )
);
