import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialFilters = {
  search: "",
  status: "",              // active | inactive | ""
  sort: "createdAt:desc",
  page: 0,
  limit: 10,
};

export const useIndustryFiltersStore = create(
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
      name: "industry-filters",
      getStorage: () => sessionStorage,
    }
  )
);
