"use client";

import React, {useEffect, useState} from "react";
import {Card, CardHeader,} from "@/components/ui/card.jsx";
import {Button,} from "@/components/ui/button.jsx";
import {Avatar, AvatarFallback,} from "@/components/ui/avatar.jsx";
import {Input,} from "@/components/ui/input.jsx";
import {Textarea,} from "@/components/ui/textarea.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.jsx";

import {z} from "zod";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";
import AddressSearch from "@/app/_components/AddressSearch";
import AvatarImageUpload from "@/app/manage-listing/_components/AvatarImageUpload";

const createAgentSchema = z.object({
    agentBio: z.string().optional(),
    agentPhoneNumber: z.string().length(10, "Phone number must be 10 digits."),
    agentEmail: z.string().email("Invalid email"),
    agentLicenseNumber: z.string().optional(),
    agentExperience: z
        .preprocess(val => (val === '' ? undefined : Number(val)), z.number())
        .optional(),
    agentAgencyName: z.string().min(1, "Agency name is required"),
    agentWebsite: z.string().url().optional(),
    agentOfficeAddress: z.string(),
    agentCity: z.string(),
    agentState: z.string(),
    agentCountry: z.string(),
    agentAreasServed: z.array(z.string()).optional(),
    agentSpecializations: z.array(z.string()).optional(),
    agentLanguagesSpoken: z.array(z.string()).optional(),
    latitude: z.preprocess(val => (val === '' ? undefined : Number(val)), z.number()),
    longitude: z.preprocess(val => (val === '' ? undefined : Number(val)), z.number()),

});

function RegisterAsAgent() {
    const {user, refreshUser} = useUser();
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({});
    const [mapReference, setMapReference] = useState(null);


    const form = useForm({
        resolver: zodResolver(createAgentSchema), defaultValues: {
            agentBio: '',
            agentPhoneNumber: '',
            agentEmail: '',
            agentLicenseNumber: '',
            agentExperience: '',
            agentAgencyName: '',
            agentWebsite: '',
            agentOfficeAddress: '',
            agentCity: '',
            agentState: '',
            agentCountry: '',
            agentAreasServed: [],
            agentSpecializations: [],
            agentLanguagesSpoken: [],
            latitude: '',
            longitude: ''
        },
    });

    async function onSubmit(data) {
        console.log(data);
        const res = await apiClient("http://localhost:8080/registerAgent", {
            method: "POST", credentials: "include", body: JSON.stringify({
                agentBio: data.agentBio,
                agentPhoneNumber: data.agentPhoneNumber,
                agentEmail: data.agentEmail,
                agentLicenseNumber: data.agentLicenseNumber,
                agentExperience: data.agentExperience,
                agentAgencyName: data.agentAgencyName,
                agentWebsite: data.agentWebsite,
                agentOfficeAddress: data.agentOfficeAddress,
                agentCity: data.agentCity,
                agentState: data.agentState,
                agentCountry: data.agentCountry,
                agentAreasServed: data.agentAreasServed,
                agentSpecializations: data.agentSpecializations,
                agentLanguagesSpoken: data.agentLanguagesSpoken,
                latitude: data.latitude,
                longitude: data.longitude,
            }),
        }, window.location.pathname);
        if (res.ok) {
            console.log("Agent profile updated successfully");
            await refreshUser();
        }
    }


    const formValues = useWatch({ control: form.control });

// Log whenever form values change
    useEffect(() => {
        console.log("Form values updated:", formValues);
    }, [formValues]);

    const [previews, setPreviews] = useState([]) // [{ file, url, caption, isPrimary, order }]
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')


    return (<div className="p-2 md:p-6">
        <Card className="border-0 bg-rose-500">
            <CardHeader>
                <div className="flex gap-4 items-center">
                    <Avatar className="w-12 h-12">
                        <AvatarFallback className="text-xl">
                            {user?.data?.nameInitial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                        <h1 className="text-xl font-medium">
                            Welcome {user?.data?.derivedUserName}
                        </h1>
                        <p>Member since {user?.data?.created_date}</p>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <div className="my-12">
            <h1 className="font-bold text-2xl mb-6">Register as Agent</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" ">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <div className="lg:col-span-2">


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
                                customTriggerProps={{ variant: "outline" }}
                            />


                        </div>

                        <FormField
                            control={form.control}
                            name="latitude"
                            render={({field}) => (<FormItem>
                                 <FormControl>
                                    <Input  {...field} hidden/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />

                        <FormField
                            control={form.control}
                            name="longitude"
                            render={({field}) => (<FormItem>
                                 <FormControl>
                                    <Input   {...field} hidden/>
                                </FormControl>
                             </FormItem>)}
                        />

                        <div>
                            {/* Individual Fields */}
                            <FormField
                                control={form.control}
                                name="agentPhoneNumber"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone Number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentEmail"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentLicenseNumber"
                                render={({field}) => (<FormItem>
                                    <FormLabel>License Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="License Number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentExperience"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Experience (Years)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Years"  {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentAgencyName"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Agency Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Agency Name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentWebsite"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentOfficeAddress"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Office Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Office Address" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentCity"
                                render={({field}) => (<FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentState"
                                render={({field}) => (<FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentCountry"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Country" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentAreasServed"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Areas Served</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Comma-separated values"
                                               value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                                               onChange={(e) => {
                                                   const val = e.target.value;
                                                   field.onChange(val.split(",").map(s => s.trim()));
                                               }}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentSpecializations"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Specializations</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Residential, Commercial"
                                               value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                                               onChange={(e) => {
                                                   const val = e.target.value;

                                                   field.onChange(val.split(",").map(s => s.trim()));

                                               }}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>
                        <div>

                            <FormField
                                control={form.control}
                                name="agentLanguagesSpoken"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Languages Spoken</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., English, Hindi"
                                               value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                                               onChange={(e) => {
                                                   const val = e.target.value;

                                                   field.onChange(val.split(",").map(s => s.trim()));

                                               }}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>




                        <div className="lg:col-span-2">

                            <FormField
                                control={form.control}
                                name="agentBio"
                                render={({field}) => (<FormItem className="col-span-2">
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about the agent..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        </div>

                        <div  className="lg:col-span-2">
                            <FormLabel className="mb-2">Choose an Avatar</FormLabel>
                            <AvatarImageUpload previews={previews} setPreviews={setPreviews} setMessage={setMessage} message={message}/>
                            {message && (
                                <div
                                    className={`mt-4 p-3 rounded-lg text-center ${
                                        message.includes('success')
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>



                        <div className="flex gap-4 mt-6">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button type="submit" onClick={()=>{console.log("submitclick[ed")}}>Save</Button>
                        </div>
                </form>
            </Form>
        </div>
    </div>
);
}

export default RegisterAsAgent;
