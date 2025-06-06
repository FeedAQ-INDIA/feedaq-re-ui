// lib/useUser.js or .ts
import { useEffect, useState } from "react";
import { apiClient } from "./apiClient";

export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await apiClient("http://localhost:8080/getUser", {method:"POST"});
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.log("Not authenticated");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return { user, loading };
}
