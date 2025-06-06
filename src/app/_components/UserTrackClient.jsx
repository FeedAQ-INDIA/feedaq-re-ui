"use client";

import { useEffect } from "react";

export default function UserTrackClient({ propertyId }) {
    useEffect(() => {
        const trackUser = async () => {
            try {
                const userRes = await fetch("http://localhost:8080/getUser", {
                    method: "POST",
                    credentials: "include",
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    const userId = userData?.data?.userId;

                    await fetch("http://localhost:8080/saveUserSearchTrack", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            propertyId,
                            userId,
                        }),
                    });
                }
            } catch (err) {
                console.error("User tracking error", err);
            }
        };

        trackUser();
    }, [propertyId]);

    return null; // No UI needed
}
