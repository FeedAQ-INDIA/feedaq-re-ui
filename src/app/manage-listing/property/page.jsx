"use client";

import React, {useEffect, useState} from "react";

import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";
import ListingCard from "@/app/_components/PropertyListingCard";
import Image from "next/image";
import PropertyListingCard from "@/app/_components/PropertyListingCard";
import ProjectListingCard from "@/app/_components/ProjectListingCard";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination";
import {ChevronLeft, ChevronRight} from "lucide-react";


export default function PropertyListingForm() {


    const {user, refreshUser} = useUser();


    const [listingData, setListingData] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {


        if (user) {
            findListedprop();

        }

    }, [user]);



    const findListedprop = async () => {
        await apiClient(`http://localhost:8080/search-v2`, {
            method: "POST", credentials: true, body: JSON.stringify({
                limit: limit, offset: offset, getThisData:     {
                    datasource: "Property",
                    as: "property",
                    required: false,
                    where: {userId: user?.data?.userId},
                    include: [
                        {datasource: "PropertyFeature", as: "features", required: false},
                        {
                            datasource: "Project", as: "project", required: false,
                            include: [{datasource: "Developer", as: "developer", required: false}]
                        },
                        {datasource: "PropertyAttachment", as: "attachment", required: false},
                        {datasource: "UserFav", as: "fav", required: false}]

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
        <div className="p-4">
            <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">

                <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                        MANAGE PROPERTY LISTINGS
                    </CardTitle>
                    <div className="sm:ml-auto">
                        <Link href={`/manage-listing/create-property`} target="_blank" >
                            <Button
                                className=" gap-1 cursor-pointer"
                                variant="secondary"
                            >Create</Button>
                        </Link>
                    </div>
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
            {listingData?.length > 0 && (
                <div className="flex flex-row items-center">
                    <div className="text-xs text-muted-foreground">
                        {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} row(s) selected.
                    </div>
                    <Pagination className="ml-auto mr-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6"
                                    onClick={() => {
                                        setOffset(Math.max(offset - limit, 0));
                                        console.log(Math.max(offset - limit, 0))

                                    }}
                                >
                                    <ChevronLeft className="h-3.5 w-3.5"/>
                                    <span className="sr-only">Previous Order</span>
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6"
                                    onClick={() => {
                                        setOffset(offset + limit < totalCount ? offset + limit : offset);
                                        console.log(offset + limit < totalCount ? offset + limit : offset)
                                    }}
                                >
                                    <ChevronRight className="h-3.5 w-3.5"/>
                                    <span className="sr-only">Next Order</span>
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
