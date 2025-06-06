"use client";
import React, {useEffect, useState} from "react";
import {apiClient} from "@/lib/apiClient.mjs";
import {useUser} from "@/lib/useUser";
import ListingCard from "@/app/_components/ListingCard";
import Image from "next/image";
import {Card, CardHeader} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

export default function Search() {
    const {user, refreshUser} = useUser();


    const [listingData, setListingData] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);


    useEffect(() => {


        if (user) {
            findRecentTracks();

        }

    }, [user]);


    const findRecentTracks = async () => {
        apiClient(`http://localhost:8080/search-v2`, {
            method: "POST", credentials: true, body: JSON.stringify({
                limit: limit, offset: offset, getThisData: {
                    datasource: "UserFav", attributes: [], where: {userId: user?.data?.userId}, include: [{
                        datasource: "Property",
                        as: "property",
                        required: false,
                        include: [{datasource: "PropertyFeature", as: "features", required: false}, {
                            datasource: "Location", as: "locatedIn", required: true
                        }, {
                            datasource: "Project",
                            as: "project",
                            required: false,
                            include: [{datasource: "Developer", as: "developer", required: false},]
                        }, {datasource: "PropertyImage", as: "images", required: false},
                            {datasource: "UserFav", as: "fav", required: false}]

                    },],
                },
            }),
        }, window.location.pathname)
            .then(res => res.json())               // ✅ Parse the response and return the Promise
            .then((json) => {
                console.log(json)
                setListingData(json?.data?.results?.map(a => a?.property))
                setLimit(json?.data?.limit);
                setOffset(json?.data?.offset);

            })       // ✅ Now you can access the actual data
            .catch(err => console.error(err));     // ✅ Catch and log any errors
        setLoadingSearch(false)
    };


    return (<div className=" ">


        <div className="p-2 md:p-6">

            <Card className="border-0 bg-rose-500">
                <CardHeader>
                    <div className="flex flex-sm justify-items-center gap-4 items-center">

                        <div className="text-white">
                            <h1 className="text-xl font-medium tracking-wide">My Favourites</h1>
                        </div>
                    </div>


                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6 gap-4">
                {listingData?.map(a => (<ListingCard listing={a}/>))}
                <div className="col-span-1">
                    <Image
                        src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}
                        alt="Picture of the author"
                        width={200}
                        height={240}
                        className="w-full h-[310px] rounded-md"
                    />
                </div>
            </div>
        </div>


    </div>);
}
