import { useState, useEffect } from "react";

export default function useCategoryTypes() {
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        setLoading(true);

        // ⬇️ Replace these with actual values or localStorage/sessionStorage
        // const token = localStorage.getItem("token");
        //         // JWT or auth token
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTFjNWE3N2JiN2IxZjFkMTVjZjNlNSIsImlhdCI6MTc2Mjc3NzQwMSwiZXhwIjoxNzY1MzY5NDAxfQ.SHcKAECfoH7w5WyPddP1sZE4Fne7IfPtpgF0LJ2gOYs`
        // const tenantID = localStorage.getItem("tenantID");  // Tenant ID
        const tenantID = "tenant123"

        const res = await fetch("proxy/api/categoryType", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(tenantID && { "x-tenant-id": tenantID }),
          },
          credentials: "include", // if backend uses cookies or session auth
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized — please log in again.");
          if (res.status === 403) throw new Error("Forbidden — access denied.");
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        // Adjust depending on your backend response structure
        setCategoryTypes(data.data || data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTypes();
  }, []);

  return { categoryTypes, loading, error };
}
