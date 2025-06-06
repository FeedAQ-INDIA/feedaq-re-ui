"use client"
import { useEffect, useState } from "react";
import {Check, ChevronsUpDown, LocateFixed} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function AddressSearch({ setSelectedAddress, setCoordinates , customTriggerWidth, customContentWidth, selectedAddress, setMapReference}) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [addressSuggestionList, setAddressSuggestionList] = useState([]);

  useEffect(() => {
    console.log(selectedAddress)
    setAddress(selectedAddress);
  },[])

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    console.log("Total address fetched", addressSuggestionList);
    if (searchText) {
      const handler = setTimeout(() => {
        setDebouncedSearchText(searchText);
      }, 700);

      // Cleanup the timer if searchText changes before 300ms
      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchAddressSuggestion();
    }
  }, [debouncedSearchText]);

  const fetchAddressSuggestion = async () => {
    const res = await fetch(
      `https://api.olamaps.io/places/v1/autocomplete?input=${debouncedSearchText}&api_key=1rCxrGlqhTlG77NQnYAmLpVkLpXR1y0Wtn5sQa4S`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    console.log(data);
    const uniqueItems = [];
    const referenceSet = new Set();
    data.predictions.forEach((item) => {
      if (!referenceSet.has(item.reference)) {
        uniqueItems.push(item);
        referenceSet.add(item.reference);
      }
    });
    setAddressSuggestionList(uniqueItems);
  };

  const handleAddressSelection = (currentValue, lng, lat, reference) => {
    console.log("Selected Address", currentValue);
    console.log("Selected Lat", lat);
    console.log("Selected Lng", lng);

    setAddress(currentValue);
    setLat(lat);
    setLng(lng);
    setCoordinates({ lat: lat, lng: lng });
    setSelectedAddress(currentValue);
    setMapReference(reference)
  };

  return (
    <div>
 <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={`"  justify-between gap-4 ${customTriggerWidth}"`}
      size="lg"
    >
      <LocateFixed className="shrink-0" />
      <span className="truncate">
        {address  ? address : "Select Search Location"}
      </span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className={`" ${customContentWidth} p-0 overflow-auto"`}>
    <Command>
      <CommandInput
        placeholder="Type to Search Location..."
        value={searchText}
        onInput={(e) => setSearchText(e.target.value)}
      />
      <CommandList>
        <CommandEmpty>No location found.</CommandEmpty>
        <CommandGroup>
          {addressSuggestionList.map((framework) => (
            <CommandItem
              key={framework.reference}
              value={framework.description}
              onSelect={(currentValue) => {
                handleAddressSelection(
                    currentValue,
                    framework?.geometry?.location?.lng,
                    framework?.geometry?.location?.lat,
                    framework?.reference
                );
                // if (
                //   currentValue.toLowerCase().includes("bengaluru") ||
                //   currentValue.toLowerCase().includes("bangalore")
                // ) {
                //   handleAddressSelection(
                //     currentValue,
                //     framework?.geometry?.location?.lng,
                //     framework?.geometry?.location?.lat,
                //     framework?.reference
                //   );
                // } else {
                  // toast({
                  //   title: "Location not serviceable!",
                  //   description: "Currently we are serving only Bangalore location.",
                  //   variant: "destructive",
                  // })
                // }
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 text-green-600",
                  address === framework.description
                    ? "  block"
                    : "  hidden"
                )}
              />
              {framework.description}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>

    </div>
  );
}

export default AddressSearch;
