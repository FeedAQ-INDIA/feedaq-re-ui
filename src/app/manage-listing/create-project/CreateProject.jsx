"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import AddressSearch from "@/app/_components/AddressSearch";
import Link from "next/link";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check, ChevronsUpDown} from "lucide-react";
import axios from "axios";
import {apiClient} from "@/lib/apiClient.mjs";

const projectSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['newly_launched', 'under_construction', 'ready_to_move', 'possession_soon']),
    expectedCompletionDate: z.string().optional(),
    totalLandArea: z.coerce.number().optional(),
    landAreaUnit: z.enum(['sq_ft', 'sq_yd', 'acre', 'hectare']),
    projectUnitDetail: z.any().optional(),
    projectAdditionalDetail: z.any().optional(),
    numberOfTowers: z.coerce.number().optional(),
    reraRegistrationNumber: z.string().optional(),
    developerId: z.coerce.number(),
    isVerified: z.boolean().default(false),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    mapReferenceId: z.string().optional(),
    mapReferenceAddress: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    locality: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().optional(),
    country: z.string().default('India'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional()

    // projectConfiguration = [],
    // projectFeatures = []
});

export default function CreateProject({ onSubmit }) {

    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});
    const [mapReference, setMapReference] = useState(null);



    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            country: "India",
            isVerified: false
        }
    });

    async function onSubmit(data) {
        try {
console.log(data)
            const projectRes = await apiClient("http://localhost:8080/saveProject", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    expectedCompletionDate: data.expectedCompletionDate,
                    totalLandArea: data.totalLandArea,
                    landAreaUnit: data.landAreaUnit,
                    projectUnitDetail: data.projectUnitDetail,
                    projectAdditionalDetail: data.projectAdditionalDetail,
                    numberOfTowers: data.numberOfTowers,
                    reraRegistrationNumber: data.reraRegistrationNumber,
                    developerId: data.developerId,
                    isVerified: data.isVerified,
                    minPrice: data.minPrice,
                    maxPrice: data.maxPrice,
                    mapReferenceId: data.mapReferenceId,
                    mapReferenceAddress: data.mapReferenceAddress,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    locality: data.locality,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country,
                    latitude: data.latitude,
                    longitude: data.longitude
                })

            }, window.location.pathname);


            if (projectRes.ok) {
                const devData = await projectRes.json();
                console.log(devData);
            }
        } catch (err) {
            console.error("User tracking error", err);
        }
    }


    const [developers, setDevelopers] = useState([]);
    const [developerSearchQuery, setDeveloperSearchQuery] = useState("");

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const res = await axios.post("http://localhost:8080/search-v2", {
                    limit: 10,
                    offset: 0,
                    getThisData: {
                        datasource: "Developer",
                        attributes: [ ],
                        where: {
                            name: {
                                $like: `%${developerSearchQuery}%`,
                            },
                        },
                    },
                });
                const results = res.data?.data?.results || [];
                // const mapped = results.map((d) => ({
                //     id: d.developer_id,
                //     name: d.developer_name,
                // }));
                setDevelopers(results);
            } catch (err) {
                console.error("Error fetching developers:", err);
            }
        };

        fetchDevelopers();
    }, [developerSearchQuery]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">

                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea rows={3} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <div className=" ">
                    <AddressSearch
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        setCoordinates={(coords) => {
                            setCoordinates(coords); // Local state, optional
                            console.log(coords);
                            form.setValue("latitude", coords?.lat || "");
                            form.setValue("longitude", coords?.lng || "");
                        }}
                        setMapReference={setMapReference}
                        customTriggerWidth="min-w-full max-w-full"
                        customContentWidth="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
                        customTriggerProps={{variant: "outline"}}
                    />

                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({field}) => <Input type="hidden" {...field} />}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({field}) => <Input type="hidden" {...field} />}
                    />
                </div>


                <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <select {...field} className="border p-2 rounded w-full">
                                    <option value="newly_launched">Newly Launched</option>
                                    <option value="under_construction">Under Construction</option>
                                    <option value="ready_to_move">Ready to Move</option>
                                    <option value="possession_soon">Possession Soon</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="expectedCompletionDate" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expected Completion Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />


                <FormField control={form.control} name="totalLandArea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Land Area</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />


                <FormField control={form.control} name="landAreaUnit" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Land Area Unit</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={field.onChange }
                                value={ field.value }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Land Area Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['sq_ft', 'sq_yd', 'acre', 'hectare'].map(a => (
                                        <SelectItem key={a} value={(a)}>
                                            {a}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="addressLine1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="addressLine2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="locality" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Locality</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="zipCode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl><Input  {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />


                 <FormField
                    control={form.control}
                    name="developerId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>
                                Developer{" "}
                                <Link
                                    href="/manage-listing/create-developer"
                                    target="_blank"
                                    className="font-normal text-blue-600 underline"
                                >
                                    Click here to create developer
                                </Link>
                            </FormLabel>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? developers.find((dev) => dev.id === field.value)?.name
                                                : "Select developer"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>

                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search developer..."
                                            className="h-9"
                                            value={developerSearchQuery}
                                            onValueChange={setDeveloperSearchQuery}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No developer found.</CommandEmpty>
                                            <CommandGroup>
                                                {developers.map((dev) => (
                                                    <CommandItem
                                                        key={dev.id}
                                                        value={dev.id.toString()} // Use only ID for uniqueness and selection
                                                        onSelect={() => {
                                                            field.onChange(dev.id === field.value ? "" : dev.id);
                                                        }}
                                                    >
                                                        {`${dev.name} - ${dev.id}`}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                dev.id === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                    <FormField control={form.control} name="numberOfTowers" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Towers</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="reraRegistrationNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>RERA Number</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="minPrice" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Min Price</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="maxPrice" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Price</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                <div className="flex gap-4">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                </div>
            </form>
        </Form>
    );
}
