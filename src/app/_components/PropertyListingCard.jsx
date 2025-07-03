import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {CheckLine, ExternalLink, HeartPlus, Info, X} from "lucide-react";
import "./pg-colive.css";
import Link from "next/link";
import ImageCarousel from "@/app/_components/ImageCarousel";
import { formatDistanceToNow } from 'date-fns';
import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";


function Listing({listing, active}) {
    const [screenNo, setScreenNo] = useState(true);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const {user, refreshUser} = useUser();

    const [fav, setFav] = useState(listing.fav);

    useEffect(() => {
        // findMinMaxPrice(listing?.roomListing)
    }, [])

    const handleScreenNo = () => {
        setScreenNo(!screenNo);
        console.log(screenNo);
    };

    const copyToClipboard = (text) => {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "readonly");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

    };



    function formatIndianCurrency(value) {
        const absValue = Math.abs(value);

        if (absValue >= 1e12) {
            return `₹${(value / 1e12).toFixed(2)}LCr`;
        } else if (absValue >= 1e7) {
            return `₹${(value / 1e7).toFixed(2)}Cr`;
        } else if (absValue >= 1e5) {
            return `₹${(value / 1e5).toFixed(2)}L`;
        } else {
            return `₹${value.toFixed(2)}`;
        }
    }

    const saveUserFav = async (propertyId) => {
        try {
            const res = await apiClient("http://localhost:8080/saveUserFav", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    propertyId,
                    userId: user?.data?.userId
                }),
            }, window.location.pathname);
            if(res.ok){
                console.log("user fav saved ");
                let a = await res.json();
                console.log(a?.data?.data)
                setFav(a?.data?.data)
            }
        } catch (err) {
            console.error("User tracking error", err);
        }
    }

    const deleteUserFav = async (favId) => {
        try {
            const res = await apiClient("http://localhost:8080/deleteUserFav", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                     favId: favId
                }),
            }, window.location.pathname);
            if(res.ok){
                console.log("user fav deleted successfully ")
                setFav(null);
            }
        } catch (err) {
            console.error("User tracking error", err);
        }    }



    return (
        <div className="p-2 border shadow hover:shadow-lg overflow-x-hidden rounded-md bg-white text-black ">
            <div className="overflow-y-auto">
                {screenNo ? (
                    <div className="h-fit">
                        <div className="wrapper">
                            <div className="marquee">
                                <div className="flex overflow-x-auto gap-2">
                                    {listing?.isVerified ?
                                        <Badge className="tracking-wider rounded-sm bg-green-600 text-white flex gap-1"><CheckLine size={14} />Verified</Badge>
                                        : <></>}
                                    <Badge variant="outline" className="rounded-sm">
                                        Posted {formatDistanceToNow(listing?.createdAt, { addSuffix: true })}
                                    </Badge>
                                    <Badge variant="outline" className="rounded-sm">
                                        2400 sqft.
                                    </Badge>
                                    <Badge variant="outline" className="rounded-sm">
                                        2 HSARING AC : Rs.3000/-
                                    </Badge>

                                </div>
                            </div>
                        </div>

                        <ImageCarousel
                            imageList={[
                                "https://www.adanirealty.com/-/media/Project/Realty/Home/Social-Clubs/Club-house-Shantigram-(1).jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Residential/Pune/Atelier-Greens/Carousel-Images/Thumbnail-image/1.jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Commercial/Gurugram/Downtown-Avenue/Outdoor/1920x1080/For-Desktop-1920-X1080-2.jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Commercial/Gurugram/Downtown-Avenue/Project-Status/1920x1080/Downtown-Airel-View-1.jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Commercial/Gurugram/Downtown-Avenue/Outdoor/1920x1080/For-Desktop-1920-X1080-4.jpg",
                            ]}

                            customClass={'rounded-md h-[140px] md:h-[150px]'}
                            width={800}
                            height={150}
                        />
                        <div className="p-1 tracking-wide">
                            <Link href={`/property/${listing?.id}`}>
                                <h2 className="font-semibold text-md line-clamp-1">{listing?.title}</h2>
                                <h2 className="font-bold text-sm ">{formatIndianCurrency(listing?.price)} <span
                                    className="text-muted-foreground text-xs font-normal">₹11.46 K/sq.ft
                  Avg. Price</span></h2>  <p
                                className=" mt-1 text-xs text-muted-foreground">{listing?.project?.name ? listing?.project?.name?.toUpperCase() + ' - ' : ' '} {listing?.locality}</p>
                            </Link>

                        </div>
                    </div>
                ) : (
                    <div className="h-[240px]">
                        <div className="p-1">

                            <div className="wrapper">
                                <div className="wrapper">
                                    <div className="marquee">
                                        <div className="flex overflow-x-auto gap-2">
                                            <Badge variant="outline" className="rounded-sm">
                                                2400 sqft.
                                            </Badge>
                                            <Badge variant="outline" className="rounded-sm">
                                                2 HSARING AC : Rs.3000/-
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tracking-wide">
                                <h2 className="font-semibold text-lg line-clamp-1">{listing?.title}
                                </h2>

                                <h2 className="font-medium text-sm  ">{formatIndianCurrency(listing?.price)} <span
                                    className="text-muted-foreground text-xs">₹11.46 K/sq.ft Avg. Price</span></h2>
                                <p className="my-1  text-sm text-muted-foreground">{listing?.project?.name ? listing?.project?.name?.toUpperCase() + ' - ' : ' '} {listing?.locality}</p>

                                <p className="  text-sm  ">{listing?.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">

                {user? <Button variant="secondary" className={`w-full flex-1 ${fav ? 'bg-rose-600 hover:bg-rose-500 text-white':'' }`} size="sm" onClick={() => fav? deleteUserFav(fav?.id) :saveUserFav(listing.id)}>
                    <HeartPlus />
                </Button>:<></>}

                <Link
                    href={`/property/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer" className="flex-1"
                >
                    <Button variant="secondary" className='w-full' size="sm">
                        <ExternalLink/>
                    </Button>
                </Link>

                {screenNo ? (
                    <Button onClick={handleScreenNo} size="sm" className="cursor-pointer"  className="flex-1">
                        <Info/>
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={handleScreenNo} size="sm" className="cursor-pointer"  className="flex-1">
                        <X/>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Listing;
