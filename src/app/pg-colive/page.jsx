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
import AgentListingCard from "@/app/_components/AgentListingCard";
import HomeAgentView from "@/app/_components/HomeAgentView";
import HomeProjectView from "@/app/_components/HomeProjectView";
import TransformationText from "@/app/_components/TransformationText";
import HomePGView from "@/app/_components/HomePGView";
import HomePropertyView from "@/app/_components/HomePropertyView";

export default function Home() {


  return (
      <div className="p-4">
        <section className="mb-4">
          <div className="relative rounded-lg bg-[url(https://cdn.pixabay.com/photo/2013/09/16/19/21/beds-182965_1280.jpg)] bg-cover bg-center bg-no-repeat">
            <div className="absolute rounded-lg inset-0 bg-gray-900/75  bg-transparent   from-gray-900/95 to-gray-900/25  bg-gradient-to-r  bg-gradient-to-l"></div>

            <div className="relative  mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
              <div className="max-w-xl text-center  ltr:sm:text-left rtl:sm:text-right">
                <h1 className="text-3xl font-extrabold text-white sm:text-5xl text-left">
                  Let us find your
                  <strong className="block font-extrabold text-rose-500">
                    {" "}
                    Forever Home.{" "}
                  </strong>
                </h1>

                <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed text-left">
                  Let us guide you to your forever home, where every detail aligns with your dreams and creates a perfect haven.              </p>

                <div className="mt-8 items-left">
                  <HomePageSearch className="w-screen" />
                </div>

              </div>

            </div>
          </div>
        </section>


        <section className="my-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
             <Card className="rounded-sm bg-pink-200 hover:bg-rose-500 cursor-pointer  hover:text-white">
              <CardHeader className="">
                <Image
                    src="https://www.colive.com/assets/images/home/section15/Mens.png"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">For Men</h1>

                {/*<Link href={'/manage-listing'}> <Button variant="outline" className="mt-4 cursor-pointer">*/}
                {/*  Browse*/}
                {/*</Button>*/}
                {/*</Link>*/}
              </CardContent>
            </Card>


            <Card className="rounded-sm  bg-pink-200 hover:bg-rose-500 cursor-pointer  hover:text-white">
              <CardHeader className="">
                <Image
                    src="https://www.colive.com/assets/images/home/section15/Womens.png"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">For Women</h1>
                {/*<p className="mt-2">*/}
                {/*  Flexible PGs and stylish coliving spaces for students and professionals — fully furnished, affordable, and ready to move in.*/}
                {/*</p>*/}
                {/*<Link href={'/pg-colive'}><Button variant="outline" className="mt-4 cursor-pointer">*/}
                {/*  Find PG/Colive*/}
                {/*</Button></Link>*/}
              </CardContent>
            </Card>


            <Card className="rounded-sm bg-pink-200 hover:bg-rose-500 cursor-pointer  hover:text-white">
              <CardHeader className=" ">
                <Image
                    src="https://www.colive.com/assets/images/home/section15/Coliving.png"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">For Coliving</h1>
                {/*<p className="mt-2">*/}
                {/*  Flexible PGs and stylish coliving spaces for students and professionals — fully furnished, affordable, and ready to move in.*/}
                {/*</p>*/}
                {/*<Link href={'/agent'}>*/}
                {/*  <Button variant="outline" className="mt-4 cursor-pointer">*/}
                {/*    Browse*/}
                {/*  </Button></Link>*/}
              </CardContent>
            </Card>

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



        <section className="my-8 relative">
          {/* Background Image */}
          <div
              className="absolute inset-0 bg-center"
              style={{
                backgroundImage:
                    "url('https://visor.gumlet.io//public/assets/home/desktop/hero-img.png?compress=true&format=auto&quality=75&dpr=auto&h=480&w=522&ar=unset')",
              }}
          >
            {/* Black overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
          </div>

          {/* Content */}
          <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
            <CardHeader>
              <div>
                <h4 className="font-bold tracking-wider text-2xl">
                  Trending Coliving Stays
                </h4>
              </div>
              <HomePGView />
            </CardHeader>
          </Card>
        </section>


        <section className="my-8 relative">
          {/* Background Image */}
          <div
              className="absolute inset-0 bg-center"
              style={{
                backgroundImage:
                    "url('https://visor.gumlet.io//public/assets/images/stay-easy.png?compress=true&format=auto&quality=75&dpr=auto&h=auto&w=auto&ar=unset')",
              }}
          >
            {/* Black overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
          </div>

          {/* Content */}
          <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
            <CardHeader>
              <div>
                <h4 className="font-bold tracking-wider text-2xl">
                  Trending Women PG & Hostels
                </h4>
              </div>
              <HomePGView />
            </CardHeader>
          </Card>
        </section>


        <section className="my-8 relative">
          {/* Background Image */}
          <div
              className="absolute inset-0 bg-center"
              style={{
                backgroundImage:
                    "url('https://visor.gumlet.io//public/assets/images/findEasy.png?compress=true&format=auto&quality=75&dpr=auto&h=auto&w=auto&ar=unset')",
              }}
          >
            {/* Black overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70" />
          </div>

          {/* Content */}
          <Card className="relative rounded-sm bg-transparent text-white border-none shadow-none">
            <CardHeader>
              <div>
                <h4 className="font-bold tracking-wider text-2xl">
                  Trending Men PG & Hostels
                </h4>
              </div>
              <HomePGView />
            </CardHeader>
          </Card>
        </section>



      </div>
  );
}


