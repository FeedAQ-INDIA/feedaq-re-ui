"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import AddressSearch from "@/app/_components/AddressSearch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import Link from "next/link";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import axios from "axios";
import {apiClient} from "@/lib/apiClient.mjs";
import MultiImageUpload from "@/app/manage-listing/_components/MultiImageUpload";
import {toast} from "sonner";


export default function CreatePropertyBuy() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});
    const [mapReference, setMapReference] = useState(null);

    const propertyListingSchema = z.object({
        title: z.string().min(5),
        projectId: z.number().optional(),
        description: z.string().min(10),
        rules: z.string().optional(),
        category: z.enum(["residential", "commercial", "industrial", "land", "other"]),
        propertyType: z.enum([
            "apartment", "independent_house", "villa", "builder_floor",
            "residential_plot", "farmhouse", "penthouse", "studio_apartment",
            "duplex", "triplex", "row_house", "room", "serviced_apartment", "pg_coliving"
        ]),
        price: z.union([z.string(), z.number()]).transform(val => Number(val)).optional(),
        // rent: z.union([z.string(), z.number()]).transform(val => Number(val)).optional(),
        bhkType: z.enum(["1_rk", "1_bhk", "2_bhk", "3_bhk", "4_bhk", "5_bhk", "5_plus_bhk"]).optional(),
        bedrooms: z.coerce.number().int().optional(),
        bathrooms: z.coerce.number().int().optional(),
        balconies: z.coerce.number().int().optional(),
        floorNumber: z.coerce.number().int().optional(),
        totalFloors: z.coerce.number().int().optional(),
        carpetArea: z.coerce.number().optional(),
        builtupArea: z.coerce.number().optional(),
        superBuiltupArea: z.coerce.number().optional(),
        areaUnit: z.enum(["sq_ft", "sq_yd", "sq_m", "acre", "bigha"]),
        furnishingStatus: z.enum(["furnished", "semi_furnished", "unfurnished"]).optional(),
        constructionStatus: z.enum(['ready_to_move', 'under_construction']).optional(),
        ageOfProperty: z.enum(['new', '1_5_years', '5_10_years', '10_20_years', '20_plus_years']).optional(),
        facing: z.enum(['north', 'east', 'west', 'south', 'north_east', 'north_west', 'south_east', 'south_west']).optional(),
        ownershipType: z.enum(['freehold', 'leasehold']).optional(),
        hasVirtualTour: z.boolean(),
        addressLine1: z.string(),
        addressLine2: z.string(),
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

    async function onSubmit(data) {
        try {
            console.log(data)
            const propertyRes = await apiClient("http://localhost:8080/saveProperty", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        transactionType: "buy",
                        title: data.title,
                        projectId: data.projectId,
                        description: data.description,
                        rules: data.rules,
                        category: data.category,
                        propertyType: data.propertyType,
                        price: data.price,
                        // rent: data.rent,
                        bhkType: data.bhkType,
                        bedrooms: data.bedrooms,
                        bathrooms: data.bathrooms,
                        balconies: data.balconies,
                        floorNumber: data.floorNumber,
                        totalFloors: data.totalFloors,
                        carpetArea: data.carpetArea,
                        builtupArea: data.builtupArea,
                        superBuiltupArea: data.superBuiltupArea,
                        areaUnit: data.areaUnit,
                        furnishingStatus: data.furnishingStatus,
                        constructionStatus: data.constructionStatus,
                        ageOfProperty: data.ageOfProperty,
                        facing: data.facing,
                        ownershipType: data.ownershipType,
                        hasVirtualTour: data.hasVirtualTour,
                        addressLine1: data.addressLine1,
                        addressLine2: data.addressLine2,
                        locality: data.locality,
                        city: data.city,
                        state: data.state,
                        country: data.country,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        mapReferenceId: mapReference,
                        mapReferenceAddress: selectedAddress,
                    }
                )
            }, window.location.pathname);


            if (propertyRes.ok) {
                const devData = await propertyRes.json();
                console.log(devData);
                if(previews.length>0){
                    let uploadData = await handleUpload(devData?.data?.id);
                    console.log(uploadData);
                    try {
                        const propertyAttachRes = await apiClient("http://localhost:8080/savePropertyAttachment", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(uploadData)

                        }, window.location.pathname);

                        if (propertyAttachRes.ok) {
                            console.log(propertyAttachRes);
                        } else {
                            console.log('Error Occured')
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                toast("Property Listing has been created : #"+devData?.data?.id, {
                    description: new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true}),
                    action: {
                        label: "Copy Id",
                        onClick: () => navigator.clipboard.writeText(devData?.data?.id)
                    },
                })
            }
        } catch (err) {
            console.error("User tracking error", err);
        }
    }

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



    const [previews, setPreviews] = useState([])
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const handleUpload = async (propertyId) => {
        if (previews.length === 0) {
            setMessage('Please select images before uploading.')
            return
        }

        setUploading(true)
        setMessage('Uploading...')

        const formData = new FormData()
        previews.forEach((item, index) => {
            formData.append('files', item.file)
            formData.append(`meta[${index}][caption]`, item.caption)
            formData.append(`meta[${index}][isPrimary]`, String(item.isPrimary))
            formData.append(`meta[${index}][order]`, String(item.order))
        })
        formData.append('propertyId', propertyId)

        try {
            const res = await fetch('/api/upload/property', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            console.log(data)
            if (res.ok) {
                setMessage('Images uploaded successfully!')
                setPreviews([]) // Clear preview after upload
            } else {
                setMessage(data.error || 'Upload failed.')
            }
            return data;
        } catch (err) {
            console.error('Upload error:', err)
            setMessage('Something went wrong during the upload.')
            throw err;
        } finally {
            setUploading(false);
        }
    }



    return (
        <div className="mt-12">
            <Form {...form}>
                <form  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form validation errors:", errors);
                })} className="grid gap-6">

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

                        <FormField
                            control={form.control}
                            name="rules"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Rules</FormLabel>
                                    <FormControl><Textarea
                                        placeholder="Property Rules" {...field} /></FormControl>
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
                            name="balconies"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Balconies</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="No. of balconies" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="floorNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Floor Number</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="Floor Number" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="totalFloors"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Total Floors</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="Total Floors" {...field} /></FormControl>
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

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="builtupArea"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Built up Area</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="Built up Area" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={form.control}
                            name="superBuiltupArea"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Super Built up Area</FormLabel>
                                    <FormControl><Input type="number"
                                                        placeholder="Super Built up Area" {...field} /></FormControl>
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
                            name="constructionStatus"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Construction Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Construction Status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['ready_to_move', 'under_construction'].map(a => (
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
                            name="facing"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Facing</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Facing"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['north', 'east', 'west', 'south', 'north_east', 'north_west', 'south_east', 'south_west'].map(a => (
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
                            name="ownershipType"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Ownership Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Ownership Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['freehold', 'leasehold'].map(a => (
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
                            name="hasVirtualTour"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Virtual Tour</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "true")}
                                            value={field.value ? "true" : "false"}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Virtual Tour Availability"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['true', 'false'].map(a => (
                                                    <SelectItem key={a} value={(a)}>
                                                        {(a)}
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
                            name="projectId"
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
                                                    placeholder="Search project..."
                                                    className="h-9"
                                                    value={projectSearchQuery}
                                                    onValueChange={setProjectSearchQuery}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No projects found.</CommandEmpty>
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

                    <div className="  ">
                        <FormLabel className="mb-2">Choose an Avatar</FormLabel>

                        <MultiImageUpload previews={previews} setPreviews={setPreviews} setMessage={setMessage} message={message}/>
                        {/*{message && (*/}
                        {/*    <div*/}
                        {/*        className={`mt-4 p-3 rounded-lg text-center ${*/}
                        {/*            message.includes('success')*/}
                        {/*                ? 'bg-green-100 text-green-800'*/}
                        {/*                : 'bg-red-100 text-red-800'*/}
                        {/*        }`}*/}
                        {/*    >*/}
                        {/*        {message}*/}
                        {/*    </div>*/}
                        {/*)}*/}
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
