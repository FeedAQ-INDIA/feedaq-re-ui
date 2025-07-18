"use client";
import React, {useEffect, useState} from "react";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination"

import {useRouter} from "next/navigation";
import AddressSearch from "@/app/_components/AddressSearch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import ListingCard from "@/app/_components/PropertyListingCard";
import Image from "next/image";
import {ChevronLeft, ChevronRight, CircleEllipsis, Ellipsis} from "lucide-react";
import {apiClient} from "@/lib/apiClient.mjs";
import ProjectListingCard from "@/app/_components/ProjectListingCard";

export default function ProjectSearchPage({reference, initialPage, lim}) {

    const [listingData, setListingData] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({});
    const [mapReference, setMapReference] = useState(reference || 5000039876089);
    const [limit, setLimit] = useState(lim || 3);
    const [page, setPage] = useState(initialPage || 1);
    const [totalCount, setTotalCount] = useState(0);

    const [loadingSearch, setLoadingSearch] = useState(false);

    const router = useRouter();

    useEffect(() => {

        if(page){
            fetchAddressByReference();
        }

        console.log(selectedAddress)
    }, [mapReference, page]);


    const fetchAddressByReference = async () => {
        setLoadingSearch(true)
        const res = await apiClient(
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
        apiClient(`http://localhost:8080/searchProject?lat=19.17380000&lng=72.86000000&radius=5&limit=${limit}&page=${page}`)
            .then(res => res.json())               // ✅ Parse the response and return the Promise
            .then((json) => {
                console.log(json)
                setListingData(json?.data)
                setPage(json?.currentPage)
                setTotalCount(json?.total)
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
                        customTriggerWidth="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[400px] border-0"
                        customContentWidth="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
                        customTriggerProps={{variant: "ghost"}}
                    />
                </div>

            </header>


            <div className="px-2 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6 gap-4">
                    {listingData?.map((a, index) => (
                        <><ProjectListingCard listing={a}/>
                            {index % 4 == 0 && <div className="col-span-1">
                                <Image
                                    src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}
                                    alt="Picture of the author"
                                    width={200}
                                    height={240}
                                    className="w-full h-[310px] rounded-md"
                                />
                            </div>}
                        </>))}
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

                {listingData?.length > 0 && (
                    <div className="flex flex-row items-center">
                        <div className="text-xs text-muted-foreground">
                            {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} row(s) selected.
                        </div>
                        <Pagination className="ml-auto mr-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6"
                                        disabled={page === 1}
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                        <span className="sr-only">Previous Page</span>
                                    </Button>
                                </PaginationItem>
                                <PaginationItem>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6"
                                        disabled={page >= Math.ceil(totalCount / limit)}
                                        onClick={() =>
                                            setPage((prev) =>
                                                prev + 1 <= Math.ceil(totalCount / limit) ? prev + 1 : prev
                                            )
                                        }
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        <span className="sr-only">Next Page</span>
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>


        </div>
    );
}
