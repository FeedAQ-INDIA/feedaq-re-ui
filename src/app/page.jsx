import Image from "next/image";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import HomePageSearch from "@/app/_components/HomePageSearch";
import {Badge} from "@/components/ui/badge";
import {CheckLine} from "lucide-react";
import ImageCarousel from "@/app/_components/ImageCarousel";
import Link from "next/link";
import React from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-sm">
              <CardHeader className="pb-1">
                <Image
                    src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-agent-lg-1.webp"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">Buy a property</h1>
                <p className="mt-2">
                  Find your place with an immersive photo experience and the most
                  listings, including things you won’t find anywhere else.
                </p>
                <Button variant="outline" className="mt-4">
                  Browse
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader className="pb-1">
                <Image
                    src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-rent-lg-1.webp"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">Rent a property</h1>
                <p className="mt-2">
                  We’re creating a seamless online experience – from shopping on the
                  largest rental network, to applying, to paying rent.
                </p>
                <Button variant="outline" className="mt-4">
                  Find Rentals
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader className="pb-1">
                <Image
                    src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-agent-lg-1.webp"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">Sell a property</h1>
                <p className="mt-2">
                  List your property with confidence and sell faster through our trusted network and expert guidance.
                </p>
                <Button variant="outline" className="mt-4">
                  Start selling
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader className="pb-1">
                <Image
                    src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-agent-lg-1.webp"
                    className="rounded-md h-[140px] md:h-[150px] mx-auto"
                    width={140}
                    height={100}
                />
              </CardHeader>
              <CardContent className="text-center tracking-wide">
                <h1 className="text-2xl font-bold">Find PG & Coliving</h1>
                <p className="mt-2">
                  Discover fully-managed PGs and coliving spaces ideal for students and
                  professionals, with meals, Wi-Fi, and more.
                </p>
                <Button variant="outline" className="mt-4">
                  Explore PGs
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
  );
}
