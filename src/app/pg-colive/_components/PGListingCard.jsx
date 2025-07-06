import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {CheckLine, ExternalLink, Heart, Info, Share2, UserRound, X} from "lucide-react";
import "@/app/_components/pg-colive.css";
import Link from "next/link";
import {formatDistanceToNow} from "date-fns";
import ImageCarousel from "@/app/_components/ImageCarousel";
import {Separator} from "@/components/ui/separator";

function PGListingCard({ listing, active }) {
  const [screenNo, setScreenNo] = useState(true);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);


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
    if(!value){
      return;
    }
    value = parseFloat(value)
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

  function getPriceRange(rooms ) {
    if (!rooms.length) return "₹0";

    const prices = rooms.map(room => room.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max ? formatIndianCurrency(min) : `${formatIndianCurrency(min)} - ${formatIndianCurrency(max)}`;
  }

  return (
      <div className="p-2 border shadow hover:shadow-lg overflow-x-hidden rounded-md bg-white text-black  ">
        <div className="overflow-y-auto">
          {screenNo ? (
              <div className="h-fit">

                <div className="wrapper">
                  <div className="marquee animate-8">
                    <div className="flex overflow-x-auto gap-2">
                      <Badge variant="outline" className="rounded-sm bg-green-600 text-white flex gap-1">{listing?.gender?.toUpperCase()}</Badge>
                      {listing?.isVerified &&  <Badge variant="outline" className="rounded-sm bg-rose-600 text-white flex gap-1">VERIFIED</Badge>}
                      {listing?.pgroomdetail?.map((a) => (
                          <Badge variant="outline" className="rounded-sm bg-blue-600 text-white">
                            {a.roomType?.toUpperCase()}
                          </Badge>
                      ))}
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
                  <Link href={`/pg-colive/${listing?.id}`}>
                    <h2 className="font-semibold text-md line-clamp-1">{listing?.title}</h2>
                    <h2 className="font-normal text-xs line-clamp-1  text-muted-foreground">{listing?.pgName}</h2>
                     <h2 className="font-bold text-xs line-clamp-1 mt-1">{getPriceRange(listing?.pgroomdetail)} / month  </h2>
                    <p
                      className=" mt-1 text-xs text-muted-foreground line-clamp-1">  {listing?.locality}</p>
                  </Link>

                </div>
              </div>
          ) : (
              <div className="h-[265px]">
                <div className="p-1">

                  <div className="wrapper">
                    <div className="marquee animate-8">
                      <div className="flex overflow-x-auto gap-2">
                        <Badge variant="outline" className="rounded-sm bg-green-600 text-white flex gap-1">{listing?.gender}</Badge>
                        {listing?.pgroomdetail?.map((a) => (
                            <Badge variant="outline" className="rounded-sm bg-blue-600 text-white">
                              {a.roomType}: ₹{a.price}/-
                            </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tracking-wide space-y-1 text-sm">
                    {/* Title and Basic Info */}
                    <h2 className="font-semibold text-md">{listing?.title}</h2>
                    <h2 className="font-normal text-sm">{listing?.pgName}</h2>
                    <h2 className="font-bold text-xs">{getPriceRange(listing?.pgroomdetail)} / month</h2>
                    {/* Description */}
                    <p className="text-sm my-2">{listing?.description}</p>

                    {/* Gender, Suited For */}
                    <p className="text-xs text-muted-foreground"><span className="font-medium">Gender</span> – {listing?.gender}</p>
                    <p className="text-xs text-muted-foreground"><span className="font-medium">Suited For</span> – {listing?.suitedFor}</p>

                    {/* Address */}
                    <p className=" text-xs text-muted-foreground">
                      {[
                        listing?.addressLine1,
                        listing?.addressLine2,
                        listing?.locality,
                        listing?.city,
                        listing?.state,
                        listing?.country
                      ].filter(Boolean).join('\n')}
                    </p>


                    {/* Operating Since */}
                    {listing?.operatingSince && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Operating Since</span> – {new Date(listing.operatingSince).toLocaleDateString()}
                        </p>
                    )}

                    {/* Meal Info */}
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium"> Meals Available</span> – {listing?.isMealAvailable ? 'Yes' : 'No'}
                    </p>


                    {/* --- Room Details --- */}
                    {listing?.pgroomdetail?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <Separator/>
                          <h3 className="text-sm font-semibold">Room Details</h3>
                          {listing.pgroomdetail.map((room, idx) => (
                              <div key={room.id} className="p-2 border rounded-md bg-gray-50 space-y-1">
                                <p className="text-sm font-semibold">{room.title}</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <Badge variant="outline" className="rounded-sm bg-blue-600 text-white">
                                    {room.roomType}
                                  </Badge>
                                  <Badge variant="outline" className="rounded-sm bg-emerald-600 text-white">
                                    ₹{room.price.toLocaleString()} / month
                                  </Badge>
                                  <Badge variant="outline" className="rounded-sm bg-pink-600 text-white">
                                    {room.area} {room.areaUnit}
                                  </Badge>
                                  <Badge variant="outline" className="rounded-sm bg-gray-700 text-white">
                                    Occupancy: {room.occupancyLimit}
                                  </Badge>
                                  <Badge variant="outline" className={`rounded-sm ${room.isAirConditioned ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
                                    {room.isAirConditioned ? 'AC' : 'Non AC'}
                                  </Badge>
                                  <Badge variant="outline" className="rounded-sm bg-purple-600 text-white">
                                    {room.furnishingStatus.charAt(0).toUpperCase() + room.furnishingStatus.slice(1).replace('_', ' ')}
                                  </Badge>
                                  {room?.additionalPrice?.map(a => (
                                      <Badge variant="outline" className="rounded-sm bg-purple-600 text-white">
                                        {a.priceType} - {formatIndianCurrency(a.priceDetail)}
                                      </Badge>
                                  ))}
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>

                </div>
              </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">

          <Link
              href={`/pg-colive/${listing.id}`}
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

export default PGListingCard;
