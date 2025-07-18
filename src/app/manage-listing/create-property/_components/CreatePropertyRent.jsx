"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import AddressSearch from "@/app/_components/AddressSearch"; // Your existing component
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import Link from "next/link";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import axios from "axios";


export default function CreatePropertyRent() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});
    const [mapReference, setMapReference] = useState(null);

    const propertyListingSchema = z.object({
        title: z.string().min(5),
        description: z.string().min(10),
        rules: z.string().optional(),
        category: z.enum(["residential", "commercial", "industrial", "land", "other"]),
        propertyType: z.enum([
            "apartment", "independent_house", "villa", "builder_floor",
            "residential_plot", "farmhouse", "penthouse", "studio_apartment",
            "duplex", "triplex", "row_house", "room", "serviced_apartment", "pg_coliving"
        ]),
        price: z.union([z.string(), z.number()]).transform(val => Number(val)).optional(),
        rent: z.union([z.string(), z.number()]).transform(val => Number(val)).optional(),
        bhkType: z.enum(["1_rk", "1_bhk", "2_bhk", "3_bhk", "4_bhk", "5_bhk", "5_plus_bhk"]).optional(),
        bedrooms: z.number().int().optional(),
        bathrooms: z.number().int().optional(),
        balconies: z.number().int().optional(),
        floorNumber: z.number().int().optional(),
        totalFloors: z.number().int().optional(),
        carpetArea: z.number().optional(),
        builtupArea: z.number().optional(),
        superBuiltupArea: z.number().optional(),
        areaUnit: z.enum(["sq_ft", "sq_yd", "sq_m", "acre", "bigha"]),
        furnishingStatus: z.enum(["furnished", "semi_furnished", "unfurnished"]).optional(),
        constructionStatus: z.enum(['ready_to_move', 'under_construction']).optional(),
        ageOfProperty: z.enum(['new', '1_5_years', '5_10_years', '10_20_years', '20_plus_years']).optional(),
        facing: z.enum(['north', 'east', 'west', 'south', 'north_east', 'north_west', 'south_east', 'south_west']).optional(),
        ownershipType: z.enum(['freehold', 'leasehold']).optional(),
        hasVirtualTour: z.boolean(),
        addressLine1: z.string(),
        locality: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string().default("India"),
        latitude: z.number(),
        longitude: z.number(),
    });

    const form = useForm({
        resolver: zodResolver(propertyListingSchema),
        defaultValues: {
            category: "residential",
            propertyType: "apartment",
            areaUnit: "sq_ft",
            country: "India",
        },
    });

    const onSubmit = (data) => {
        console.log("Submitted:", data);
        // send to backend
    };

    const [projects, setProjects] = useState([]);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.post("http://localhost:8080/search-v2", {
                    limit: 10,
                    offset: 0,
                    getThisData: {
                        datasource: "Project",
                        attributes: [],
                        where: {
                            name: {
                                $like: `%${projectSearchQuery}%`,
                            },
                        },
                    },
                });
                const results = res.data?.data?.results || [];
                // const mapped = results.map((d) => ({
                //     id: d.developer_id,
                //     name: d.developer_name,
                // }));
                setProjects(results);
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };

        fetchProjects();
    }, [projectSearchQuery]);


    return (
        <div className="mt-12">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">


                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input placeholder="Property Title" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea
                                        placeholder="Property Description" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

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


                    <div className=" ">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price (for sale)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Category"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["residential", "commercial", "industrial", "land", "other"].map(a => (
                                                    <SelectItem key={a} value={(a)}>
                                                        {a}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>


                    <div>
                        <FormField
                            control={form.control}
                            name="propertyType"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Property Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    "apartment", "independent_house", "villa", "builder_floor",
                                                    "residential_plot", "farmhouse", "penthouse", "studio_apartment",
                                                    "duplex", "triplex", "row_house", "room", "serviced_apartment", "pg_coliving"
                                                ].map(a => (
                                                    <SelectItem key={a} value={(a)}>
                                                        {a}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="bhkType"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>BHK Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select BHK Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["1_rk", "1_bhk", "2_bhk", "3_bhk", "4_bhk", "5_bhk", "5_plus_bhk"].map(a => (
                                                    <SelectItem key={a} value={(a)}>
                                                        {a}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Bedrooms</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="No. of Bedroom" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="No. of bathrooms" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="carpetArea"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Carpet Area</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="Carpet Area" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="areaUnit"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Area unit</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Area Unit"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["sq_ft", "sq_yd", "sq_m", "acre", "bigha"].map(a => (
                                                    <SelectItem key={a} value={(a)}>
                                                        {a}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="furnishingStatus"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Furnishing Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Furnishing Status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["furnished", "semi_furnished", "unfurnished"].map(a => (
                                                    <SelectItem key={a} value={(a)}>
                                                        {a}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>

                        <FormField
                            control={form.control}
                            name="developerId"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Project{" "}
                                        <Link
                                            href="/manage-listing/create-project"
                                            target="_blank"
                                            className="font-normal text-blue-600 underline"
                                        >
                                            Click here to create project
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
                                                        ? projects.find((dev) => dev.id === field.value)?.name
                                                        : "Select Project"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search developer..."
                                                    className="h-9"
                                                    value={projectSearchQuery}
                                                    onValueChange={setProjectSearchQuery}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No developer found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {projects.map((dev) => (
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

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-4">

                        <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Address Line 1</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Address" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="addressLine2"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Address Line 2</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Address" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="locality"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Locality</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Locality" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter City" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter State" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Country" readOnly {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>

                    <div className="flex gap-4">
                        <Button type="submit">Save Property</Button>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
