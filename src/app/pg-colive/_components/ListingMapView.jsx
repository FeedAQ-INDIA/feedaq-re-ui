"use client";
import { useEffect, useState } from "react";
import PGListingCard from "./PGListingCard";
 import AddressSearch from "@/app/_components/AddressSearch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { redirect } from "next/navigation";

function ListingMapView({ type }) {
  const [listing, setListing] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [mapReference, setMapReference] = useState(null);

  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const mapReferenceQueryParam = searchParams.get("reference");
  const address = searchParams.get("address");
  const genderQueryParam = searchParams.get("gender");
  const roomTypeQueryParam = searchParams.get("roomtype");
  const brandQueryParam = searchParams.get("brand");

  const [genderOption, setGenderOption] = useState("");
  const [roomTypeOption, setRoomTypeOption] = useState([
    {
      key: "Single Sharing",
      ischecked: false,
    },
    {
      key: "Double Sharing",
      ischecked: false,
    },
    {
      key: "Triple Sharing",
      ischecked: false,
    },
    {
      key: "Quadruple Sharing",
      ischecked: false,
    },
    {
      key: "Quadruple Sharing++",
      ischecked: false,
    },
  ]);
  const [brandOption, setBrandOption] = useState([
    {
      key: "Zolo",
      ischecked: false,
    },
    {
      key: "Colive",
      ischecked: false,
    },
    {
      key: "Bloom",
      ischecked: false,
    },
    {
      key: "Pro 4",
      ischecked: false,
    },
  ]);
  const [priceOption, setPriceOption] = useState("");

  const router = useRouter();

  useEffect(() => {
    console.log("Selected Address : ", decodeURIComponent(address));
    console.log("Coordinates : ", { lat: lat, lng: lng });
    console.log("Reference : ", mapReferenceQueryParam)
    console.log("Gender:", genderQueryParam);
    console.log("Brand", brandQueryParam);
    console.log("Room Type", roomTypeQueryParam);
    if (!( mapReferenceQueryParam)) {
      redirect("/");
    }
    if (genderQueryParam && genderQueryParam!='') {
      setGenderOption(genderQueryParam);
    }
    if(brandQueryParam){
      
    }
    fetchAddressByReference();
    console.log(selectedAddress)
  }, []);

  useEffect(() => {
    console.log("Updated selectedAddress:", selectedAddress);
 }, [selectedAddress]);

  const fetchAddressByReference = async () => {
    const res = await fetch(
      `https://api.olamaps.io/places/v1/details?place_id=ola-platform:${mapReferenceQueryParam}&api_key=1rCxrGlqhTlG77NQnYAmLpVkLpXR1y0Wtn5sQa4S`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    console.log(data);
    setCoordinates({ lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng });
    setSelectedAddress(data.result.formatted_address);
    setMapReference(mapReferenceQueryParam)
    console.log(data.result.formatted_address)
  };


  useEffect(() => {
  
    if(mapReference){
      router.push(`?reference=${mapReference}`)
    }
    findNearbyLocations(coordinates.lat, coordinates.lng, 5000);
  }, [mapReference]);

  useEffect(() => {
    if (mapReference) {
      findNearbyLocations(coordinates.lat, coordinates.lng, 5000);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('gender', genderOption);

    router.push(url.toString());

   }, [brandOption, roomTypeOption,genderOption, priceOption]);


  const findNearbyLocations = async (userLatitude, userLongitude, radius) => {
    let selectedBrand = brandOption
        .filter((a) => a.ischecked == true)
        .map((a) => a.key);
    let selectedRoomType = roomTypeOption
        .filter((a) => a.ischecked == true)
        .map((a) => a.key);
    const { data, error } = await supabase.rpc("nearby_listing_v4", {
      lat: userLongitude,
      long: userLatitude,
      radius: 5000,
      p_gender: genderOption && genderOption != "" ? genderOption : null,
      p_brand: selectedBrand?.length > 0 ? selectedBrand : null,
      p_price: priceOption && priceOption != "" ? priceOption : null,
      p_roomtype: selectedRoomType?.length > 0 ? selectedRoomType : null,
    });

    if (error) {
      console.error("Error finding nearby locations:", error);
      return;
    }

    // console.log("Nearby locations:", data);

    for (let i = 0; i < data.length; i++) {
      const { data: pgRoomListingData, error: pgRoomListingError } =
          await supabase
              .from("pgroomlisting")
              .select()
              .eq("pg_listing_id", data[i]?.id);

      if (pgRoomListingData) {
        console.log(pgRoomListingData);
        data[i]["roomListing"] = pgRoomListingData;
      } else {
        console.log(pgRoomListingError);
      }
    }
    console.log("Nearby locations:", data);
    setListing(data);

    return data;
  };

  const handleOnCheckedChange = (type, index) => {
    if (type === 'roomType') {
      setRoomTypeOption((prevOptions) => {
        // Update the ischecked state for the clicked option
        const updatedOptions = prevOptions.map((option, i) =>
          i === index ? { ...option, ischecked: !option.ischecked } : option
        );
  
        // Update the URL with the selected room types
        const selectedRoomTypes = updatedOptions
          .filter((option) => option.ischecked)
          .map((option) => option.key)
          .join(',');  // Join selected keys into a comma-separated string
  
        // Construct the new URL without appending multiple parameters
        const url = new URL(window.location.href);
        url.searchParams.set('roomType', selectedRoomTypes);
  
        router.push(url.toString());
  
        return updatedOptions;  
      });
    } else if(type === 'brandOptions') {
      setBrandOption((prevOptions) => {
        // Update the ischecked state for the clicked option
        const updatedOptions = prevOptions.map((option, i) =>
          i === index ? { ...option, ischecked: !option.ischecked } : option
        );
  
        // Update the URL with the selected room types
        const selectedRoomTypes = updatedOptions
          .filter((option) => option.ischecked)
          .map((option) => option.key)
          .join(',');  // Join selected keys into a comma-separated string
  
        // Construct the new URL without appending multiple parameters
        const url = new URL(window.location.href);
        url.searchParams.set('brand', selectedRoomTypes);
  
        router.push(url.toString());
  
        return updatedOptions;   
      });
    }
  };
  

  return (
    <div className="">
      <div className="flex flex-wrap gap-2 max-w-full">
        <div className="flex-grow">
          <AddressSearch
            setSelectedAddress={setSelectedAddress}
            setCoordinates={setCoordinates}
            selectedAddress={selectedAddress ? selectedAddress : ""}
            setMapReference={setMapReference}
            customTriggerWidth={
              "w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] "
            }
            customContentWidth={
              "w-full max-w-[300px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] "
            }
          />
        </div>

        <div>
          <Select
            onValueChange={(value) => setGenderOption(value)}
            value={genderOption}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Men">Men</SelectItem>
              <SelectItem value="Women">Women</SelectItem>
              <SelectItem value="Colive">Colive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Room Type</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {roomTypeOption.map((a, index) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={a.key}
                    checked={a.ischecked}
                    onCheckedChange={() => {
                      handleOnCheckedChange('roomType', index)
                    }}
                  >
                    {a.key}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Brands</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {brandOption.map((a, index) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={a.key}
                    checked={a.ischecked}
                    onCheckedChange={() => {
                      handleOnCheckedChange('brandOptions', index)
                    }}
                  >
                    {a.key}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4000 - 5000">4000 - 5000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

  
      <div className="grid grid-cols-1 mt-[30px]">
        {listing?.length > 0 ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4 bg-dark">
            {listing.map((a, index) => (
              <PGListingCard key={index} listing={a} />
            ))}
          </div>
        ) : (
          <p className="text-center mt-5">
            No Listing found with respect to searched location
          </p>
        )}

        <div></div>
      </div>
    </div>
  );
}

export default ListingMapView;
