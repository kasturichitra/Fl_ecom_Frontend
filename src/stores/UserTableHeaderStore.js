import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useUserTableHeaderStore = create(
    persist(
        (set) => ({
            userHeaders: [
                { key: "User ID", value: true },
                { key: "Name", value: true },
                { key: "Email", value: true },
                { key: "Phone", value: true },
                // { key: "Joined Date", value: true },
                // { key: "Status", value: true }
            ],
            updateUserTableHeaders: (headers) => set({ userHeaders: headers })
        }),
        {
            name: "user-table-header",
            getStorage: () => sessionStorage
        }
    )
)