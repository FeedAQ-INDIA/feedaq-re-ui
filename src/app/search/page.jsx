"use client";
import React, {useEffect, useState} from "react";

import {useRouter, useSearchParams} from "next/navigation";
import AddressSearch from "@/app/_components/AddressSearch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import ListingCard from "@/app/_components/ListingCard";
import Image from "next/image";
import {CircleEllipsis, Ellipsis} from "lucide-react";

export default function Search() {
    const searchParams = useSearchParams();
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const address = searchParams.get("address");

    const [listingData, setListingData] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({});
    const [mapReference, setMapReference] = useState(searchParams.get("reference") || '5000067664145');


    const [loadingSearch, setLoadingSearch] = useState(false);

    const router = useRouter();

    useEffect(() => {
        console.log("Selected Address : ", decodeURIComponent(address));
        console.log("Coordinates : ", {lat: lat, lng: lng});


        fetchAddressByReference();

        console.log(selectedAddress)
    }, [mapReference]);


    const fetchAddressByReference = async () => {
        setLoadingSearch(true)
        const res = await fetch(
            `https://api.olamaps.io/places/v1/details?place_id=ola-platform:${mapReference}&api_key=1rCxrGlqhTlG77NQnYAmLpVkLpXR1y0Wtn5sQa4S`
        );
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await res.json();
        console.log(data);
        setCoordinates({lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng});
        setSelectedAddress(data.result.formatted_address);
        console.log(data.result.formatted_address)
        findNearbyLocations(data.result.geometry.location.lat, data.result.geometry.location.lng);

    };


    const findNearbyLocations = async (lat, lng) => {
        fetch(`http://localhost:8080/search?transactionType=buy&centerLat=${lat}&centerLon=${lng}&radiusKm=50`)
            .then(res => res.json())               // ✅ Parse the response and return the Promise
            .then((json) => {
                console.log(json)
                setListingData(json?.properties)

            })       // ✅ Now you can access the actual data
            .catch(err => console.error(err));     // ✅ Catch and log any errors
        setLoadingSearch(false)
    };


    return (
        <div className=" ">
            <header
                className="sticky top-0 z-50 flex flex-nowrap items-center gap-2 border-b bg-white py-2 px-2 md:px-4 overflow-x-auto shadow-sm"
            >
                <div className="flex-grow">
                    <AddressSearch
                        setSelectedAddress={setSelectedAddress}
                        setCoordinates={setCoordinates}
                        selectedAddress={selectedAddress || ""}
                        setMapReference={setMapReference}
                        customTriggerWidth="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[400px]"
                        customContentWidth="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
                    />
                </div>

                <div className="flex-grow max-w-[140px]">
                    <Select>
                        <SelectTrigger className="w-full min-w-[80px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Buy">Buy</SelectItem>
                            <SelectItem value="Rent">Rent</SelectItem>
                            <SelectItem value="Lease">Lease</SelectItem>
                            <SelectItem value="PG/Coliving">PG/Coliving</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="ml-auto">
                    <Button size="sm" className="min-w-[40px] px-2">
                        <Ellipsis />
                    </Button>
                </div>
            </header>


            <div className="px-2 md:px-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6 gap-4">
                    {listingData.map(a => (<ListingCard listing={a}/>))}
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


        </div>
    );
}
