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

export default function HomeAgentView({reference, initialPage, lim}) {


    const [listings, setListings] = useState([]);

    const {
        latitude,
        longitude,
        mapReference,
        loading,
        fetchLocation,
    } = useLocationStore();

     const findNearbyLocations =  () => {
        apiClient(`http://localhost:8080/searchAgent?lat=${latitude}&lng=${longitude}&radius=50&limit=${20}&page=${1}`)
            .then(res => res.json())               // ✅ Parse the response and return the Promise
            .then((json) => {
                console.log(json)
                setListings(json?.data)
            })       // ✅ Now you can access the actual data
            .catch(err => console.error(err));     // ✅ Catch and log any errors
    };

    useEffect(() => {
        findNearbyLocations()
    },  [latitude]);





    return (
        <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-3 my-6 gap-4">
            {listings?.map(a => (<ConsultantListingCard listing={a}/>))}
            {/*<div className="col-span-1 ">*/}
            {/*    <Image*/}
            {/*        src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}*/}
            {/*        alt="Picture of the author"*/}
            {/*        width={200}*/}
            {/*        height={240}*/}
            {/*        className="w-full h-[265px] rounded-md"*/}
            {/*    />*/}
            {/*</div>*/}

            <Link href={`/pg-colive/search?reference=${mapReference}`}  target="_blank">
                <div className="col-span-1 w-full h-[200px] rounded-md flex flex-col items-center justify-center bg-rose-500 ">
                <div className="text-center">
                    <p className="text-2xl text-white font-bold mb-2">VIEW ALL</p>
                    {/*<Plus size={40} className="mx-auto" />*/}
                </div>
            </div></Link>
        </div>

    );
}
