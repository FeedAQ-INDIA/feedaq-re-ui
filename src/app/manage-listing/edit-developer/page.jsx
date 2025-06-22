"use client";

import React, {useState} from "react";

import {Card, CardHeader, CardTitle} from "@/components/ui/card";

import {EditDeveloper} from "@/app/manage-listing/edit-developer/EditDeveloper";


export default function PropertyListingForm() {
 

    return (
        <div className="p-4">
            <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                        CREATE DEVELOPER
                    </CardTitle>
                </CardHeader>


            </Card>

            <div className="mt-8">
               <EditDeveloper/>
            </div>

        </div>
    );
}
