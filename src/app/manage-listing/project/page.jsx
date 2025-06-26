"use client";

import React, {useEffect, useState} from "react";

import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";
import ListingCard from "@/app/_components/PropertyListingCard";
import Image from "next/image";
import PropertyListingCard from "@/app/_components/PropertyListingCard";


export default function PropertyListingForm() {


    const {user, refreshUser} = useUser();


    const [listingData, setListingData] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);


    useEffect(() => {


        if (user) {
            findListedprop();

        }

    }, [user]);


    const findListedprop = async () => {
        apiClient(`http://localhost:8080/search-v2`, {
            method: "POST", credentials: true, body: JSON.stringify({
                limit: limit, offset: offset, getThisData:
        {
            datasource: "Project",
                attributes: [],
            where: {userId: user?.data?.userId},
            include: [
                {datasource: "ProjectFeature", as: "features", required: false},
                {datasource: "ProjectConfiguration", as: "configurations", required: false},
                {datasource: "ProjectAttachment", as: "attachment", required: false},
            ]
        }
            }),
        }, window.location.pathname)
            .then(res => res.json())               // ✅ Parse the response and return the Promise
            .then((json) => {
                console.log(json)
                setListingData(json?.data?.results)
                setLimit(json?.data?.limit);
                setOffset(json?.data?.offset);

            })       // ✅ Now you can access the actual data
            .catch(err => console.error(err));     // ✅ Catch and log any errors
        setLoadingSearch(false)
    };



    return (
        <div className="p-4">
            <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                        MANAGE PROJECT LISTING
                    </CardTitle>
                </CardHeader>


            </Card>

                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6 gap-4">
                    {listingData?.map(a => (<PropertyListingCard listing={a}/>))}
                    {/*<div className="col-span-1">*/}
                    {/*    <Image*/}
                    {/*        src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}*/}
                    {/*        alt="Picture of the author"*/}
                    {/*        width={200}*/}
                    {/*        height={240}*/}
                    {/*        className="w-full h-[310px] rounded-md"*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>

        </div>
    );
}
