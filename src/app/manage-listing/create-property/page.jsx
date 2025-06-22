"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import AddressSearch from "@/app/_components/AddressSearch"; // Your existing component
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import CreatePropertyBuy from "@/app/manage-listing/create-property/_components/CreatePropertyBuy";
import {Label} from "@/components/ui/label";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";


export default function PropertyListingForm() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});
    const [transactionType, setTransactionType] = useState("");



    return (
        <div className="p-4">
            <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                        CREATE LISTING
                    </CardTitle>
                </CardHeader>


            </Card>

            <div className="mt-8">
                <Label>Transaction Type</Label>
                <Select onValueChange={setTransactionType} defaultValue={transactionType} >
                    <SelectTrigger className="w-full mt-4">
                        <SelectValue placeholder="Select Transaction Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        {["buy", "rent"].map(a => (
                            <SelectItem key={a} value={a}>
                                {a.toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {transactionType=="buy" && <CreatePropertyBuy/>}
            </div>

        </div>
    );
}
