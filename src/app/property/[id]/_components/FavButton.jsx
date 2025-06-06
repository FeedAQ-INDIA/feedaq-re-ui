"use client";


import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";
import {Button} from "@/components/ui/button";
import {HeartPlus, Share2} from "lucide-react";
import React, {useState} from "react";

export default function FavButton({listing}) {


    const {user, refreshUser} = useUser();

    const [fav, setFav] = useState(listing.fav);

    const saveUserFav = async () => {
        try {
            const res = await apiClient("http://localhost:8080/saveUserFav", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    propertyId: listing.id,
                    userId: user?.data?.userId
                }),
            });
            if (res.ok) {
                console.log("user fav saved ");
                let a = await res.json();
                console.log(a?.data?.data);
                setFav(a?.data?.data);
             }
        } catch (err) {
            console.error("User tracking error", err);
        }
    }

    const deleteUserFav = async () => {
        try {
            const res = await apiClient("http://localhost:8080/deleteUserFav", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    favId: fav.id
                }),
            });
            if (res.ok) {
                console.log("user fav deleted successfully ")
                setFav(null);
            }
        } catch (err) {
            console.error("User tracking error", err);
        }
    }


    return (
        <>
            {user? <Button variant="secondary" className={` flex gap-1 items-center  ${fav ? 'bg-rose-600 hover:bg-rose-500 text-white':'' }`}  onClick={() => fav? deleteUserFav(fav?.id) :saveUserFav(listing.id)}>
                <HeartPlus /> Save
            </Button>:<></>}
        </>
    );
}
