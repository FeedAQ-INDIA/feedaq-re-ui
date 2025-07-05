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
 import useLocationStore from "@/lib/locationStore";

function HomePageSearch({ type, agentListLoad }) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [mapReference, setMapReference] = useState(null);
  const {

    setInitialSearchType
  } = useLocationStore();
  const [searchType, setSearchType] = useState("all");
  const [searchPageUri, setSearchPageUri] = useState("property");

  useEffect(() => {
    console.log(window.location.pathname)
    switch (window.location.pathname){
      case "/": setSearchType('all'); break;
      case "/buy": setSearchType('buy');break;
      case "/rent": setSearchType('rent');break;
      case "/plot-land": setSearchType('plot-land');break;
      case "/commercial": setSearchType('commercial');break;
      case "/project": setSearchType('project');break;
      case "/pg-colive": setSearchType('pg-colive');break;
      case "/consultant": setSearchType('consultant');break;
    }
  }, [window.location.pathname]);

  useEffect(() => {
    console.log("Selected Address : ", selectedAddress);
    console.log("Coordinates : ", coordinates);
    if (selectedAddress && coordinates?.lat && coordinates.lng) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

   }, [selectedAddress]);

  useEffect(() => {
    console.log(searchType)
    setInitialSearchType(searchType);
    switch (searchType){
      case "all": setSearchPageUri('property'); break;
      case "buy": setSearchPageUri('property');break;
      case "rent": setSearchPageUri('property');break;
      case "plot-land": setSearchPageUri('property');break;
      case "commercial": setSearchPageUri('property');break;
      case "project": setSearchPageUri('project/search');break;
      case "pg-colive": setSearchPageUri('pg-colive/search');break;
      case "consultant": setSearchPageUri('consultant/search');break;
    }
  }, [searchType]);


  return (
    <div className="">
      <div className="">
        <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
          <Link href={`/`}><Button onClick={()=>{setSearchType('all')}}  className={`cursor-pointer hover:opacity-85 ${searchType=='all'?'opacity-100' : 'opacity-40'} rounded-none`} variant="outline" size='sm'>All</Button></Link>
          <Link href={`/buy`}><Button onClick={()=>{setSearchType('buy')}} className={`cursor-pointer hover:opacity-85 ${searchType=='buy'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>Buy</Button></Link>
          {/*<Link href={`/rent`}><Button onClick={()=>{setSearchType('rent')}} className={`cursor-pointer hover:opacity-85 ${searchType=='rent'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>Rent</Button></Link>*/}
          {/*<Link href={`/plot-land`}><Button onClick={()=>{setSearchType('plot-land')}} className={`cursor-pointer hover:opacity-85 ${searchType=='plot-land'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>Plot/Land</Button></Link>*/}
          {/*<Link href={`/commercial`}><Button onClick={()=>{setSearchType('commercial')}} className={`cursor-pointer hover:opacity-85 ${searchType=='commercial'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>Commercial</Button></Link>*/}
          <Link href={`/project`}><Button onClick={()=>{setSearchType('project')}} className={`cursor-pointer hover:opacity-85 ${searchType=='project'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>Project</Button></Link>
          <Link href={`/pg-colive`}><Button onClick={()=>{setSearchType('pg-colive')}} className={`cursor-pointer hover:opacity-85 ${searchType=='pg-colive'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>PG/Coliving</Button></Link>
          <Link href={`/consultant`}><Button onClick={()=>{setSearchType('consultant')}}  className={`cursor-pointer hover:opacity-85 ${searchType=='consultant'?'opacity-100' : 'opacity-40'} rounded-none`}  variant="outline" size='sm'>Consultant</Button></Link>
        </div>
        <div className="">
          <AddressSearch
            setSelectedAddress={setSelectedAddress}
            setCoordinates={setCoordinates}
            setMapReference={setMapReference}
            customTriggerWidth={"w-full   sm:w-full "}
            customContentWidth={"w-[300px]"}
            customTriggerProps={{variant: "outline"}}
          />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">

          {isValid ? (
              <Link href={`/${searchPageUri}?reference=${mapReference}`}>
                <Button className="rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 active:bg-rose-500 sm:w-auto mt-2 cursor-pointer">
                  Get Started
                </Button>
              </Link>
          ) : (
              <Button
                  disabled
                  className="rounded bg-gray-400 px-12 py-3 text-sm font-medium text-white shadow sm:w-auto mt-2 cursor-not-allowed"
              >
                Get Started
              </Button>
          )}
        </div>

      </div>
    </div>
  );
}

export default HomePageSearch;
