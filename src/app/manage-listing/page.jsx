"use client";

import React, {useEffect, useState} from "react";

import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";
import ListingCard from "@/app/_components/PropertyListingCard";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import HomePGView from "@/app/_components/HomePGView";


export default function PropertyListingForm() {


    const {user, refreshUser} = useUser();


    const [listingData, setListingData] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);



    return (
        <div className="p-4">
            <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                        MANAGE LISTING
                    </CardTitle>
                </CardHeader>


            </Card>

            {/*<div className="flex flex-wrap gap-4 my-4">*/}
            {/*    <Link  className="flex-1 cursor-pointer" href={'/manage-listing/create-property'} target='_blank'><Button className="w-full cursor-pointer" variant="secondary">Create Listing</Button></Link>*/}
            {/*    <Link  className="flex-1 cursor-pointer" href={'/manage-listing/create-project'} target='_blank'><Button className="w-full cursor-pointer" variant="secondary">Create Project</Button></Link>*/}
            {/*    <Link  className="flex-1 cursor-pointer" href={'/manage-listing/create-developer'} target='_blank'><Button className="w-full cursor-pointer" variant="secondary">Create Developer</Button></Link>*/}
            {/*    <Link  className="flex-1 cursor-pointer" href={'/manage-listing/create-pg-colive'} target='_blank'><Button className="w-full cursor-pointer" variant="secondary">Create PG / Colive</Button></Link>*/}
            {/*</div>*/}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  my-8">
            <Link href='/manage-listing/project' target="_blank" className=" cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101 hover:shadow-amber-100 relative">
                {/* Background image + overlay for visual impact */}
                <div
                    className="absolute inset-0 bg-center"
                    style={{
                        backgroundImage:
                            "url('https://visor.gumlet.io//public/assets/home/desktop/hero-img.png?compress=true&format=auto&quality=75&dpr=auto&h=480&w=522&ar=unset')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
                </div>
                {/* PG stays content */}
                <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
                    <CardHeader>
                        <div>
                            <h4 className="font-bold tracking-wider text-2xl">
                                Manage Project Listings
                            </h4>
                        </div>
                     </CardHeader>
                </Card>
            </Link>

            <Link href='/manage-listing/property' target="_blank" className=" cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101 hover:shadow-amber-100  relative">
                {/* Background image + overlay for visual impact */}
                <div
                    className="absolute inset-0 bg-center"
                    style={{
                        backgroundImage:
                            "url('https://visor.gumlet.io//public/assets/home/desktop/hero-img.png?compress=true&format=auto&quality=75&dpr=auto&h=480&w=522&ar=unset')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
                </div>
                {/* PG stays content */}
                <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
                    <CardHeader>
                        <div>
                            <h4 className="font-bold tracking-wider text-2xl">
                                Manage Property Listings
                            </h4>
                        </div>
                    </CardHeader>
                </Card>
            </Link>


            <Link href='/manage-listing/developer' target="_blank" className=" cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101 hover:shadow-amber-100   relative">
                {/* Background image + overlay for visual impact */}
                <div
                    className="absolute inset-0 bg-center"
                    style={{
                        backgroundImage:
                            "url('https://visor.gumlet.io//public/assets/home/desktop/hero-img.png?compress=true&format=auto&quality=75&dpr=auto&h=480&w=522&ar=unset')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
                </div>
                {/* PG stays content */}
                <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
                    <CardHeader>
                        <div>
                            <h4 className="font-bold tracking-wider text-2xl">
                                Manage Developer Listings
                            </h4>
                        </div>
                    </CardHeader>
                </Card>
            </Link>

            <Link href='/manage-listing/pg-colive' target="_blank" className=" cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101 hover:shadow-amber-100  relative">
                {/* Background image + overlay for visual impact */}
                <div
                    className="absolute inset-0 bg-center"
                    style={{
                        backgroundImage:
                            "url('https://visor.gumlet.io//public/assets/home/desktop/hero-img.png?compress=true&format=auto&quality=75&dpr=auto&h=480&w=522&ar=unset')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
                </div>
                {/* PG stays content */}
                <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
                    <CardHeader>
                        <div>
                            <h4 className="font-bold tracking-wider text-2xl">
                                Manage PG / Coliving Listings
                            </h4>
                        </div>
                    </CardHeader>
                </Card>
            </Link>

            </div>
        </div>
    );
}
