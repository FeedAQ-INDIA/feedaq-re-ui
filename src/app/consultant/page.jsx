import Image from "next/image";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import HomePageSearch from "@/app/_components/HomePageSearch";
import {Badge} from "@/components/ui/badge";
import {CheckLine} from "lucide-react";
import ImageCarousel from "@/app/_components/ImageCarousel";
import Link from "next/link";
import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {apiClient} from "@/lib/apiClient.mjs";
import ConsultantListingCard from "@/app/_components/ConsultantListingCard";
import HomeAgentView from "@/app/_components/HomeAgentView";
import HomeProjectView from "@/app/_components/HomeProjectView";
import TransformationText from "@/app/_components/TransformationText";
import HomePGView from "@/app/_components/HomePGView";
import HomePropertyView from "@/app/_components/HomePropertyView";

export default function Home() {


  return (
      <div className="p-4">
        <section className="mb-4">
          <div className="relative rounded-lg bg-[url(https://cdn.pixabay.com/photo/2023/12/29/10/36/house-8475945_1280.jpg)] bg-cover bg-center bg-no-repeat">
            <div className="absolute rounded-lg inset-0 bg-gray-900/75  bg-transparent   from-gray-900/95 to-gray-900/25  bg-gradient-to-r  bg-gradient-to-l"></div>

            <div className="relative  mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
              <div className="max-w-xl text-center  ltr:sm:text-left rtl:sm:text-right">
                <h1 className="text-3xl font-extrabold text-white sm:text-5xl text-left">
                  Great agent makes
                  <strong className="block font-extrabold text-rose-500 mt-2">
                    {" "}
                    a great difference.{" "}
                  </strong>
                </h1>

                <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed text-left">
                  With over a million agents from all the top brokerages, a local agent knows your market and can guide you through the process from start to finish
                </p>

                <div className="mt-8 items-left">
                  <HomePageSearch className="w-screen" />
                </div>

              </div>

            </div>
          </div>
        </section>




        {/*<section className="my-12">*/}
        {/*  <Card className="rounded-sm bg-black text-white ">*/}
        {/*        <CardHeader className=" ">*/}
        {/*    <TransformationText transformations ={[*/}
        {/*    "BUY A PROPERTY",*/}
        {/*    "SELL A PROPERTY",*/}
        {/*    "RENT A PROPERTY",*/}
        {/*    "SEARCH CONSULATANTS ",*/}
        {/*    "FIND PG / HOSTELS",*/}
        {/*    "FIND COLIVING"*/}
        {/*  ]}/>*/}
        {/*        </CardHeader>*/}
        {/*  </Card>*/}
        {/*</section>*/}



        <section className="my-8">


          <Card className="rounded-sm bg-black text-white  ">
            <CardHeader  >

              <div className="">
                <h4 className="font-bold tracking-wider text-2xl">Featured Real Estate Consultants</h4>
              </div>
              <HomeAgentView/>

            </CardHeader>
          </Card>

          {/*<div className="">*/}
          {/*  <h4 className="font-bold tracking-wider text-2xl text-center">Featured Real Estate Consultants</h4>*/}
          {/*</div>*/}
          {/*<HomeAgentView/>*/}

        </section>



      </div>
  );
}


