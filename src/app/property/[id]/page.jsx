import ImageCarousel from "@/app/_components/ImageCarousel";
import {Button} from "@/components/ui/button";
import Head from "next/head";
import {CheckLine, HeartPlus, MessageCircle, Phone, Share2} from "lucide-react";
import Link from "next/link";
import React  from "react";
import MapMarker from "@/app/_components/MapMarker";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import UserTrackClient from "@/app/_components/UserTrackClient";
import {apiClient} from "@/lib/apiClient.mjs";
import FavButton from "@/app/property/[id]/_components/FavButton";
import ShareButton from "@/app/property/[id]/_components/ShareButton";


async function PGColiveDetail({params}) {
    const {id} = params;


    const res = await fetch('http://localhost:8080/search-v2', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            limit: 5,
            offset: 0,
            getThisData: {
                datasource: "Property",
                attributes: [],
                where: {id: id},
                include: [
                    {datasource: "PropertyFeature", as: "features", required: false},
                    {datasource: "Location", as: "locatedIn", required: true},
                    {
                        datasource: "Project", as: "project", required: false,
                        include: [{datasource: "Developer", as: "developer", required: false}]
                    },
                    {datasource: "PropertyAttachment", as: "attachment", required: false},
                    {datasource: "UserFav", as: "fav", required: false}
                 ]
            }
        }),
        cache: 'no-store', // disables static caching
    });

    if (!res.ok) {
        const text = await res.text();
        return <div>Error fetching data: {text}</div>;
    }

    const data = await res.json();
    const listing = data?.data?.results?.[0]
    console.log(data?.data?.results?.[0]);


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



    return (
        <>
            <Head>

            </Head>
            <UserTrackClient propertyId={id} />
            <div className="px-2 md:px-6  my-3 mt-5 ">


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <ImageCarousel
                            imageList={[
                                "https://www.adanirealty.com/-/media/Project/Realty/Home/Social-Clubs/Club-house-Shantigram-(1).jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Residential/Pune/Atelier-Greens/Carousel-Images/Thumbnail-image/1.jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Commercial/Gurugram/Downtown-Avenue/Outdoor/1920x1080/For-Desktop-1920-X1080-2.jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Commercial/Gurugram/Downtown-Avenue/Project-Status/1920x1080/Downtown-Airel-View-1.jpg",
                                "https://www.adanirealty.com/-/media/Project/Realty/Commercial/Gurugram/Downtown-Avenue/Outdoor/1920x1080/For-Desktop-1920-X1080-4.jpg",
                            ]}
                            width={500}
                            height={300}
                            customClass={'rounded-md h-[300px] md:h-[400px] lg:[500px] w-full'}
                        />
                    </div>
                    <div className="hidden lg:block">
                        <MapMarker
                            lat={listing?.locatedIn?.geom?.coordinates?.[0]}
                            lng={listing?.locatedIn?.geom?.coordinates?.[1]}
                            detail={listing?.title}
                            cutsomClassName={"w-full h-[400px] rounded-md"} // Fully rounded corners
                        />
                    </div>

                </div>
                <div className="mt-6 mb-2 flex flex-wrap gap-2 items-center">
                    <p className="text-xs text-muted-foreground">Listing Id : {listing?.id}</p>
                    <div className=" sm:ml-auto">
                        {listing?.isVerified ?
                            <Badge
                                className="tracking-wider rounded-sm bg-green-600 text-white flex gap-1 animate-blink"><CheckLine
                                size={14}/><span>Verified</span></Badge>
                            : <></>}
                    </div>
                </div>
                <div className="mb-6 flex gap-2 flex-col">
                    <div className="tracking-wider">
                        <h2 className="font-semibold text-xl ">{listing?.title} </h2>
                        <p className="font-bold text-lg mt-1">{formatIndianCurrency(listing?.price)}
                            <span
                                className="text-muted-foreground text-xs font-normal ms-2">₹11.46 K/sq.ft Avg Price</span>
                        </p>
                        <p className=" mt-1 text-sm text-muted-foreground">
                            {listing?.project?.name ? listing?.project?.name?.toUpperCase() + ' - ' : ' '}
                            {listing?.locatedIn?.locality}
                        </p>
                    </div>

                    <div className="flex-wrap flex items-center gap-2 my-2">
                        <Link className=" "
                              href={`https://wa.me/9631045873?text=Hi! I want detail regarding property id ${listing.id}`}
                              target="_blank">
                            <Button className="bg-green-500 text-white hover:bg-green-600 flex gap-1 items-center">
                                <MessageCircle/>
                                Whatsapp
                            </Button>
                        </Link>

                        <Button className="bg-pink-500 text-white hover:bg-pink-600 flex gap-1 items-center ">
                            <Phone/> Contact
                        </Button>

<ShareButton/>

                        <FavButton listing={listing}/>

                    </div>


                </div>
                <div className="my-2">
                    <h2 className="font-bold text-xl tracking-wide">Overview</h2>
                    <p className="my-2">{listing?.description}</p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-4">
                    <div className=" lg:col-span-3">


                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border border-gray-200 rounded-md overflow-hidden mb-4">
                            {[
                                {label: "Transaction Type", value: listing?.transactionType},
                                {label: "BHK Type", value: listing?.bhkType},
                                {label: "No. of Bedrooms", value: listing?.bedrooms},
                                {label: "No. of Bathrooms", value: listing?.bathrooms},
                                {label: "No. of Balconies", value: listing?.balconies},
                                {label: "Carpet Area", value: listing?.carpetArea},
                                {label: "Built up Area", value: listing?.builtupArea},
                                {label: "Super Built up Area", value: listing?.superBuiltupArea},
                                {label: "Furnishing status", value: listing?.furnishingStatus},
                                {label: "Construction status", value: listing?.constructionStatus},
                                {label: "Possession Date", value: listing?.possessionDate},
                                {label: "Age of Property", value: listing?.ageOfProperty},
                                {label: "Floor No.", value: listing?.floorNumber},
                                {label: "Total Floors", value: listing?.totalFloors},
                                {label: "Facing", value: listing?.facing},
                                {label: "Ownership Type", value: listing?.ownershipType},
                                {label: "Preferred Tenants", value: listing?.preferredTenants},
                                {label: "Availability Date", value: listing?.availabilityDate},
                                {label: "Security Deposit", value: listing?.securityDeposit},
                                {label: "Maintainance Charges", value: listing?.maintenanceCharges},
                                {label: "Posted at", value: listing?.createdAt},

                            ].map((item, index) =>
                                item.value ? (<div
                                    key={index}
                                    className="border border-gray-200 px-4 py-2 flex flex-col cursor-pointer hover:bg-gray-100 hover:shadow"
                                >
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="text-base font-medium">{String(item.value)?.replaceAll('_', ' ')?.toUpperCase() ?? '-'}</p>
                                </div>) : <></>
                            )}
                        </div>

                        <div className="my-6">
                            <h2 className="font-bold text-xl  tracking-wide">Amenities</h2>
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border border-gray-200 rounded-md overflow-hidden my-4">
                                {[
                                    {label: "Parking", value: listing?.features?.hasParking},
                                    {label: "Lift", value: listing?.features?.hasLift},
                                    {label: "Power Backup", value: listing?.features?.hasPowerBackup},
                                    {label: "Security", value: listing?.features?.hasSecurity},
                                    {label: "Water Supply", value: listing?.features?.hasWaterSupply},
                                    {label: "Gym", value: listing?.features?.hasGym},
                                    {label: "Swimming Pool", value: listing?.features?.hasSwimmingPool},
                                    {label: "Play Area", value: listing?.features?.hasPlayArea},
                                    {label: "Clubhouse", value: listing?.features?.hasClubhouse},
                                    {label: "Servant Room", value: listing?.features?.hasServantRoom},
                                    {label: "Pooja Room", value: listing?.features?.hasPoojaRoom},
                                    {label: "Study Room", value: listing?.features?.hasStudyRoom},
                                    {
                                        label: "Private Terrace/Garden",
                                        value: listing?.features?.hasPrivateTerraceGarden
                                    },

                                ].map((item, index) =>
                                    (item.value != null) ? (<div
                                            key={index}
                                            className="border-1 border-gray-200 px-4 py-2 flex flex-col cursor-pointer hover:bg-gray-100 hover:shadow"
                                        >
                                            <p className="text-sm text-muted-foreground">{item.label}</p>
                                            <p className="text-base font-medium">{item.value ? 'Yes' : 'No'}</p>
                                        </div>
                                    ) : <></>)}
                            </div>
                        </div>

                        <div className="my-6">
                            <h2 className="font-bold text-xl tracking-wide ">Locality</h2>
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-0 border border-gray-200 rounded-md overflow-hidden my-4">
                                {[
                                    {label: "Address Line 1", value: listing?.locatedIn?.addressLine1},
                                    {label: "Address Line 2", value: listing?.locatedIn?.addressLine2},
                                    {label: "Locality", value: listing?.locatedIn?.locality},
                                    {label: "City", value: listing?.locatedIn?.city},
                                    {label: "State", value: listing?.locatedIn?.state},
                                    {label: "Zip Code", value: listing?.locatedIn?.zipCode},
                                    {label: "Country", value: listing?.locatedIn?.country},
                                    {label: "Latitude", value: listing?.locatedIn?.latitude},
                                    {label: "Longitude", value: listing?.locatedIn?.longitude},

                                ].map((item, index) =>
                                    item.value ? (<div
                                        key={index}
                                        className="border border-gray-200 px-4 py-2 flex flex-col cursor-pointer hover:bg-gray-100 hover:shadow"
                                    >
                                        <p className="text-sm text-muted-foreground">{item.label}</p>
                                        <p className="text-base font-medium">{String(item.value)?.replaceAll('_', ' ')?.toUpperCase() ?? '-'}</p>
                                    </div>) : <></>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <Image
                            src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}
                            alt="Picture of the author"
                            width={200}
                            height={800}
                            className="w-full h-full rounded-md"
                        />
                    </div>
                </div>


            </div>

        </>
    );
}

export default PGColiveDetail;
