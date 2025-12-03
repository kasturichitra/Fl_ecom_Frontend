
import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useEmployeTableHeaderStore = create(
    persist(
        (set) => ({
            employeeHeaders: [
                { key: "Employee ID", value: true },
                { key: "Name", value: true },
                { key: "Email", value: true },
                { key: "Phone", value: true },
                { key: "Joined Date", value: true },
                { key: "Status", value: true }
            ],

            updateEmployeeTableHeaders: (headers) => set({ employeeHeaders: headers })
        }),
        {
            name: "employee-table-header",
            getStorage: () => sessionStorage
        }
    )
)