import { create } from "zustand";

const industryStore = create((set) => ({
    allIndustries: [], 
    setAllIndustries: (industries) => set({ allIndustries: industries }),
}));

export default industryStore; 