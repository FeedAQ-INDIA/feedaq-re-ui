"use client";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Trash2} from "lucide-react";
import AddressSearch from "@/app/_components/AddressSearch";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import RoomListing from "./_components/RoomListing";
import {Badge} from "@/components/ui/badge";
import {useUser} from "@/lib/useUser";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {apiClient} from "@/lib/apiClient.mjs";
import MultiImageUpload from "@/app/manage-listing/_components/MultiImageUpload";
import {toast} from "sonner";

function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [coordinates, setCoordinates] = useState({});
    const [mapReference, setMapReference] = useState(null);
    const {user} = useUser();

    const [roomTypeList, setRoomTypeList] = useState([]);
    const [file, setFile] = useState([]);


    const pgListingSchema = z.object({
        operatingSince: z.string().transform((val) => new Date(val)),
        suitedFor: z.enum(['Working', 'Student', 'All']),
        isMealAvailable: z.boolean(),
        pgContact: z.string(),
        pgEmail: z.string(),
        pgName: z.string(),
        title: z.string().min(3),
        description: z.string().min(3),
        rules: z.string().optional(),
        gender: z.enum(["Men", "Women", "Colive"]),
        brandName: z.enum(['Zolo', 'Colive', 'Helloworld']),
        roomTypeList: z.array(z.any()).min(1, "Listing should have atleast 1 room"),
        addressLine1: z.string(),
        addressLine2: z.string(),
        locality: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string().default("India"),
        latitude: z.number(),
        longitude: z.number(),
    });

    const pgForm = useForm({
        resolver: zodResolver(pgListingSchema), defaultValues: {
            title: "", address: "", city: "", description: "", rules: "", gender: "", brand: "", roomTypeList: [],
        },
    });

    const onSubmit = async (data) => {
        console.log(data);

        try {
            console.log(data)
            const projectRes = await apiClient("http://localhost:8080/savePG", {
                method: "POST", credentials: "include", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    operatingSince: data.operatingSince,
                    suitedFor: data.suitedFor,

                    pgContact: data.pgContact,
                    pgEmail: data.pgEmail,
                    pgName: data.pgName,

                    title: data.title,
                    description: data.description,
                    rules: data.rules,
                    gender: data.gender,
                    brandName: data.brandName,

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
                })

            }, window.location.pathname);


            if (projectRes.ok) {
                const projectData = await projectRes.json();
                console.log(projectData);
                console.log(projectData?.data?.data?.id)
                const pgRoomRes = await apiClient("http://localhost:8080/savePGRoom", {
                    method: "POST", credentials: "include", headers: {
                        "Content-Type": "application/json",
                    }, body: JSON.stringify(data.roomTypeList.map((a) => ({
                        title: a?.title,
                        description: a?.description,
                        additionalPrice: a.priceDetailList,
                        availableFrom: new Date(a?.availability),
                        isAirConditioned: a?.isAirConditioned,
                        furnishingStatus: a?.furnishingStatus,
                        occupancyLimit: a?.occupancyLimit,
                        price: a?.price,
                        area: a?.area,
                        areaUnit: a?.areaUnit,
                        roomType: a?.roomType,
                        pgId: projectData?.data?.data?.id         // add new key-value pair
                    }))),


                }, window.location.pathname);
                if (pgRoomRes.ok) {
                    const devData = await pgRoomRes.json();
                    console.log(devData)

                }
                if(previews.length>0){
                    let uploadData = await handleUpload(projectData?.data?.data?.id);
                    console.log(uploadData);
                    try {
                        const pgAttachRes = await apiClient("http://localhost:8080/savePGAttachment", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(uploadData)

                        }, window.location.pathname);

                        if (pgAttachRes.ok) {
                            console.log(pgAttachRes);
                        } else {
                            console.log('Error Occured')
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                toast("PG-Coliving has been created : #"+projectData?.data?.data?.id, {
                    description: new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true}),
                    action: {
                        label: "Copy Id",
                        onClick: () => navigator.clipboard.writeText(projectData?.data?.data?.id)
                    },
                })

            }
        } catch (err) {
            console.error("User tracking error", err);
        }
    };


    const addRoomTypeToList = (obj) => {
        console.log(obj);
        let roomList = [...roomTypeList, obj]
        setRoomTypeList(roomList);
        pgForm.setValue('roomTypeList', roomList)
    };


    const removeRoomTypeFromList = (index) => {
        const newList = [...roomTypeList];
        newList.splice(index, 1);
        setRoomTypeList(newList);
        pgForm.setValue('roomTypeList', newList)
    };

    const [previews, setPreviews] = useState([]) // [{ file, url, caption, isPrimary, order }]
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const handleUpload = async (pgId) => {
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
        formData.append('pgId', pgId)
        // formData.append('pgRoomId', null)

        try {
            const res = await fetch('/api/upload/pg-colive', {
                method: 'POST',
                body: formData,
            })


            if (res.ok) {
                const data = await res.json()
                console.log(data)
                setMessage('Images uploaded successfully!')
                setPreviews([]) // Clear preview after upload
            } else {
                setMessage(data.error || 'Upload failed.')
            }
            return data?.data;
        } catch (err) {
            console.error('Upload error:', err)
            setMessage('Something went wrong during the upload.')
            throw err;
        } finally {
            setUploading(false);
        }
    }

    useEffect(() => {
        console.log(previews);
    }, [previews]);
    return (<div className="p-4">
        <Card className="border-0 bg-muted/50  bg-rose-600 text-white ">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold  tracking-wider">
                    PUBLISH PG - COLIVE LISTING
                </CardTitle>
            </CardHeader>


        </Card>
        <div className="my-12">

            <div className=" ">
                <div className="relative my-8 flex items-center justify-center">
                    {/* Horizontal line */}
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-75" />

                    {/* Centered content */}
                    <div className="relative z-10 flex items-center gap-4 bg-white px-4">
                        <span className="text-gray-700 font-medium">Room Details</span>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">Add Room</Button>
                            </SheetTrigger>
                            <SheetContent className="p-0">
                                <SheetHeader className="p-4">
                                    <SheetTitle>Create a Room</SheetTitle>
                                </SheetHeader>
                                <div className="overflow-y-auto h-[calc(100svh-4em)] px-4">
                                    <RoomListing addRoomTypeToList={addRoomTypeToList} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>


                <div className="grid gris-cols-1 md:grid-cols-3 gap-4 my-4 ">
                        {roomTypeList.map((a, index) => {
                            return (<a
                                href="#"
                                className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-md"
                                key={index}
                            >
                                            <span
                                                className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                                <div className="sm:flex sm:justify-between sm:gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                            {a.title}
                                        </h3>

                                        <p className="mt-1 text-xs font-medium text-gray-600">
                                            {a.subTitle}
                                        </p>
                                    </div>

                                    <div className="hidden sm:block sm:shrink-0">
                                        <Button
                                            type={"button"}
                                            variant="destructive"
                                            onClick={() => removeRoomTypeFromList(index)}
                                        >
                                            <Trash2/>
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-pretty text-sm text-gray-500">
                                        {a?.priceDetail?.map((m) => {
                                            return (<>
                                                <Badge className="mr-1">
                                                    {m.priceType} : {m.priceDetail}
                                                </Badge>
                                            </>);
                                        })}
                                    </p>
                                </div>

                                <dl className="mt-6 flex gap-4 sm:gap-6">
                                    <div className="flex flex-col-reverse">
                                        <dt className="text-sm font-medium text-gray-600">
                                            {a.price}
                                        </dt>
                                        <dd className="text-xs text-gray-500">Price</dd>
                                    </div>

                                    <div className="flex flex-col-reverse">
                                        <dt className="text-sm font-medium text-gray-600">
                                            {a.availability}
                                        </dt>
                                        <dd className="text-xs text-gray-500">Availability</dd>
                                    </div>
                                </dl>
                            </a>);
                        })}
                </div>
            </div>


            <Form {...pgForm}>
                <form onSubmit={pgForm.handleSubmit(onSubmit, (errors) => {
                    console.error("Form validation errors:", errors);
                })} className="grid gap-6">
       <span className="relative flex justify-center my-8">
          <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

          <span className="relative z-10 bg-white px-6">General Details</span>
        </span>
                    <div className=" ">


                        <FormField
                            control={pgForm.control}
                            name="title"
                            render={({field}) => (<FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input placeholder="Property Title" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={pgForm.control}
                            name="description"
                            render={({field}) => (<FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea
                                    placeholder="Property Description" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>

                    <div className=" ">

                        <FormField
                            control={pgForm.control}
                            name="rules"
                            render={({field}) => (<FormItem>
                                <FormLabel>Rules</FormLabel>
                                <FormControl><Textarea
                                    placeholder="Property Rules" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>


                    <div>
                        <FormField
                            control={pgForm.control}
                            name="gender"
                            render={({field}) => (<FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Gender"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Men", "Women", "Colive"].map(a => (<SelectItem key={a} value={(a)}>
                                                {a}
                                            </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>


                    <div>
                        <FormField
                            control={pgForm.control}
                            name="brandName"
                            render={({field}) => (<FormItem>
                                <FormLabel>Brand Name</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Brand Name"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Zolo', 'Colive', 'Helloworld'].map(a => (<SelectItem key={a} value={(a)}>
                                                {a}
                                            </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>


                    <div>
                        <FormField
                            control={pgForm.control}
                            name="isMealAvailable"
                            render={({field}) => (<FormItem>
                                <FormLabel>Meal Available</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === "true")}
                                        value={field.value?.toString()} // convert boolean to "true"/"false"
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Is Meal Available"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Yes</SelectItem>
                                            <SelectItem value="false">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />

                    </div>


                    <div>
                        <FormField
                            control={pgForm.control}
                            name="suitedFor"
                            render={({field}) => (<FormItem>
                                <FormLabel>Suited For</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Suited For"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Working', 'Student', 'All'].map(a => (<SelectItem key={a} value={(a)}>
                                                {a}
                                            </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>




                    <div>
                        <FormField
                            control={pgForm.control}
                            name="operatingSince"
                            render={({field}) => (<FormItem>
                                <FormLabel>Operating Since</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>

                    <div>
                        <FormField
                            control={pgForm.control}
                            name="pgName"
                            render={({field}) => (<FormItem>
                                <FormLabel>PG Name</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>

                    <div>
                        <FormField
                            control={pgForm.control}
                            name="pgEmail"
                            render={({field}) => (<FormItem>
                                <FormLabel>PG Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>

                    <div>
                        <FormField
                            control={pgForm.control}
                            name="pgContact"
                            render={({field}) => (<FormItem>
                                <FormLabel>PG Contact</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>



                    <span className="relative flex justify-center my-8">
          <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

          <span className="relative z-10 bg-white px-6">Address Details</span>
        </span>


                    <div className="grid gap-4">

                        <div className="space-y-2">
                            <FormLabel>Select Property Location</FormLabel>
                            <AddressSearch
                                selectedAddress={selectedAddress}
                                setSelectedAddress={setSelectedAddress}
                                setCoordinates={(coords) => {
                                    setCoordinates(coords); // Local state, optional
                                    console.log(coords);
                                    pgForm.setValue("latitude", coords?.lat || "");
                                    pgForm.setValue("longitude", coords?.lng || "");
                                }}
                                setMapReference={setMapReference}
                                customTriggerWidth="min-w-full max-w-full "
                                customContentWidth="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
                                customTriggerProps={{variant: "outline"}}
                            />

                            <FormField
                                control={pgForm.control}
                                name="latitude"
                                render={({field}) => <Input type="hidden" {...field} />}
                            />
                            <FormField
                                control={pgForm.control}
                                name="longitude"
                                render={({field}) => <Input type="hidden" {...field} />}
                            />
                        </div>


                        <FormField
                            control={pgForm.control}
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
                            control={pgForm.control}
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
                            control={pgForm.control}
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
                            control={pgForm.control}
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
                            control={pgForm.control}
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
                            control={pgForm.control}
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



                    <span className="relative flex justify-center my-8">
          <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

          <span className="relative z-10 bg-white px-6">Gallery details</span>
        </span>

                    <div className="  ">
                        <Input
                            id="picture"
                            type="file"
                            multiple
                            onChange={(e) => setFile(e.target.files)}
                        />
                        <MultiImageUpload previews={previews} setPreviews={setPreviews} setMessage={setMessage} message={message}/>
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


                    <div className="flex gap-4">
                        <Button type="submit">Save</Button>
                        <Button type="button" variant="outline" onClick={() => pgForm.reset()}>Reset</Button>
                    </div>

                </form>
            </Form>


        </div>
    </div>);
}

export default AddNewListing;
