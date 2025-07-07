"use client";

import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
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
import {toast} from "sonner";

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
    agentAreasServed: z.array(z.string()).optional(),
    agentSpecializations: z.array(z.string()).optional(),
    agentLanguagesSpoken: z.array(z.string()).optional(),
    latitude: z.preprocess(val => (val === '' ? undefined : Number(val)), z.number()),
    longitude: z.preprocess(val => (val === '' ? undefined : Number(val)), z.number()),
    addressLine1: z.string(),
    addressLine2: z.string(),
    locality: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string().default("India"),

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

            agentAreasServed: [],
            agentSpecializations: [],
            agentLanguagesSpoken: [],
            latitude: '',
            longitude: ''
        },
    });

    async function onSubmit(data) {
        console.log(data);
        try {
            let avatarUrl = null;
            if (previews.length>0) {
                let formData = new FormData()
                previews.forEach((item, index) => {
                    formData.append('file', item.file)
                    formData.append('type', 'agent-avatar')
                })

                try {
                    const res = await fetch('/api/upload/avatar', {
                        method: 'POST',
                        body: formData,
                    })

                    const data = await res.json()
                    console.log(data)
                    if (res.ok) {
                        // setPreviews([]) // Clear preview after upload
                        avatarUrl = data?.file?.url
                    } else {
                        console.log(data.error || 'Upload failed.')
                    }
                } catch (err) {
                    console.error('Upload error:', err)
                    throw err;
                } finally {

                }
            }
            console.log(avatarUrl);
            const res = await apiClient("http://localhost:8080/registerAgent", {
                method: "POST", credentials: "include", body: JSON.stringify({
                    agentBio: data.agentBio,
                    agentPhoneNumber: data.agentPhoneNumber,
                    agentEmail: data.agentEmail,
                    agentLicenseNumber: data.agentLicenseNumber,
                    agentExperience: data.agentExperience,
                    agentAgencyName: data.agentAgencyName,
                    agentWebsite: data.agentWebsite,
                    agentAreasServed: data.agentAreasServed,
                    agentSpecializations: data.agentSpecializations,
                    agentLanguagesSpoken: data.agentLanguagesSpoken,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    locality: data.locality,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    mapReferenceId: mapReference,
                    mapReferenceAddress: selectedAddress,
                }),
            }, window.location.pathname);
            if (res.ok) {
                console.log("Agent profile updated successfully");
                form.reset();
                setPreviews([])
                toast("You are registered as a Consultant : #"+res?.data?.data?.agentId, {
                    description: new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true}),
                    action: {
                        label: "Copy Id",
                        onClick: () => navigator.clipboard.writeText(res?.data?.data?.agentId)
                    },
                })
                await refreshUser();
            }
        }catch (err) {

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


    return (<div className="p-2 md:p-4">
            <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                        REGISTER AS CONSULTANT
                    </CardTitle>
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


                        <div className="grid gap-4">
 

                            <FormField
                                control={form.control}
                                name="addressLine1"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Address Line 1</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Address" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />

                            <FormField
                                control={form.control}
                                name="addressLine2"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Address Line 2</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Address" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />

                            <FormField
                                control={form.control}
                                name="locality"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Locality</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Locality" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({field}) => (<FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter City" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({field}) => (<FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter State" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({field}) => (<FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Country" readOnly  {...field} />
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
