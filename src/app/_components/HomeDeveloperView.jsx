"use client";
import React, {useEffect, useState} from "react";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination"

import {useRouter} from "next/navigation";
import AddressSearch from "@/app/_components/AddressSearch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {ChevronLeft, ChevronRight, CircleEllipsis, Ellipsis, Plus} from "lucide-react";
import {apiClient} from "@/lib/apiClient.mjs";
import ConsultantListingCard from "@/app/_components/ConsultantListingCard";
 import useLocationStore from "@/lib/locationStore";
import Link from "next/link";
import DeveloperListingCard from "@/app/_components/DeveloperListingCard";

export default function HomeDeveloperView({reference, initialPage, lim}) {

    const [listingData, setListingData] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);


    useEffect(() => {


             findListedprop();


    }, []);


    const findListedprop = async () => {
        apiClient(`http://localhost:8080/search-v2`, {
            method: "POST", credentials: true, body: JSON.stringify({
                limit: limit, offset: offset, getThisData:     {
                    datasource: "Developer",
                    as: "developer",
                    required: false,
                 },
            }),
        }, window.location.pathname)
            .then(res => res.json())               // ✅ Parse the response and return the Promise
            .then((json) => {
                console.log(json)
                setListingData(json?.data?.results)
                setTotalCount(json?.data?.totalCount);
                setLimit(json?.data?.limit);
                setOffset(json?.data?.offset);

            })       // ✅ Now you can access the actual data
            .catch(err => console.error(err));     // ✅ Catch and log any errors
        setLoadingSearch(false)
    };




    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6 gap-4 items-stretch">
            {listingData?.map((a, idx) => (
                <div key={idx} className="flex flex-col h-full">
                    <DeveloperListingCard listing={a} />
                </div>
            ))}

            <Link href={`/`} target="_blank">
                <div className="col-span-1 w-full rounded-md flex flex-col items-center justify-center bg-rose-500 text-center text-white font-bold text-2xl p-4 h-full">
                    VIEW ALL
                </div>
            </Link>
        </div>

    );
}
