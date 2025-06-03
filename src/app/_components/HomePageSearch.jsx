"use client";
import { useEffect, useState } from "react";

import AddressSearch from "./AddressSearch";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
function HomePageSearch({ type }) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [mapReference, setMapReference] = useState(null);

  useEffect(() => {
    console.log("Selected Address : ", selectedAddress);
    console.log("Coordinates : ", coordinates);
    if (selectedAddress && coordinates?.lat && coordinates.lng) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  });

  return (
    <div className="">
      <div className="">
        <div className="">
          <AddressSearch
            setSelectedAddress={setSelectedAddress}
            setCoordinates={setCoordinates}
            setMapReference={setMapReference}
            customTriggerWidth={"w-full   sm:w-full "}
            customContentWidth={"w-[300px]"}
          />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {/*<Link href={`/search?lat=${coordinates?.lat}&lng=${coordinates?.lng}`} >*/}

          <Link             href={`/search?reference=${mapReference}`}
          >
          <Button
              // href={`/pg-colive?lat=${coordinates?.lat}&lng=${
              //   coordinates?.lng
              // }&address=${encodeURIComponent(selectedAddress)}`}
              disabled={!isValid}
              className="  rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 active:bg-rose-500 sm:w-auto"
          >
            Get Started
          </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default HomePageSearch;
