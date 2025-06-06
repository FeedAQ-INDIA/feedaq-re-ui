import { useEffect, useState, useCallback } from "react";
import { apiClient } from "./apiClient";

export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient("http://localhost:8080/getUser", {
                method: "POST",
            }, window.location.pathname);
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null); // in case of 401 or bad response
            }
        } catch (err) {
            console.log("Not authenticated");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, loading, refreshUser: fetchUser };
}
