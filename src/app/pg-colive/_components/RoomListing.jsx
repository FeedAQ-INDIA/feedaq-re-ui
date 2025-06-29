"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Trash2 } from "lucide-react";
import React, { useState } from "react";

// Schema
const priceDetailSchema = z.object({
  priceType: z.string().min(1, "Price type is required"),
  priceDetail: z.string().regex(/^\d+$/, "Must be a valid number"),
});

const roomSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  title: z.string().min(4).max(25),
  description: z.string().optional(),
  price: z.string().regex(/^\d+$/, "Price must be a number"),
  availability:  z.string(),
  priceDetailList: z.array(priceDetailSchema).optional(),
    isAirConditioned : z.boolean() ,
    furnishingStatus: z.enum(["furnished", "semi_furnished", "unfurnished"]),
    occupancyLimit : z.coerce.number(),
area : z.coerce.number().optional() ,
    areaUnit : z.enum(["sq_ft", "sq_yd", "sq_m", "acre", "bigha"]),

});

export default function RoomListing({ addRoomTypeToList }) {

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
        roomType: "Single Sharing",
        title: '',
        description: '',
        price: '',
        availability:  new Date().toISOString().split("T")[0],
         isAirConditioned : false ,
        furnishingStatus: "furnished" ,
        occupancyLimit : '',
        area : '' ,
        areaUnit : "sq_ft",
      priceDetailList: [{ priceType: "", priceDetail: "" }],
    },
  });

  const { control, handleSubmit, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceDetailList",
  });

  const onSubmit = (values) => {
    addRoomTypeToList(values);
    form.reset();
   };

  return (
     <div className="mt-6">
         <Form {...form}>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
                 <div className="grid gap-4">
                     {/* Room Type */}
                     <FormField
                         control={control}
                         name="roomType"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Room Type</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value}>
                                     <FormControl>
                                         <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Room Type" />
                                         </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                         {[
                                             "Single Sharing",
                                             "Double Sharing",
                                             "Triple Sharing",
                                             "Quadruple Sharing",
                                             "Quadruple Sharing++",
                                         ].map((type) => (
                                             <SelectItem key={type} value={type}>
                                                 {type}
                                             </SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />

                     {/* Title */}
                     <FormField
                         control={control}
                         name="title"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Title</FormLabel>
                                 <FormControl>
                                     <Input placeholder="Title" maxLength={25} {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />

                     {/* Description */}
                     <FormField
                         control={control}
                         name="description"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Description</FormLabel>
                                 <FormControl>
                                     <Textarea placeholder="Description" maxLength={200} {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />

                     <FormField
                         control={control}
                         name="occupancyLimit"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Occupancy Limit</FormLabel>
                                 <FormControl>
                                     <Input type="number" {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />

                     <FormField
                         control={control}
                         name="area"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Area</FormLabel>
                                 <FormControl>
                                     <Input type="number" {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />

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


                     <FormField
                         control={form.control}
                         name="isAirConditioned"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Air Conditioned</FormLabel>
                                 <FormControl>
                                     <Select
                                         onValueChange={(val) => field.onChange(val === "true")}
                                         value={field.value?.toString()} // convert boolean to "true"/"false"
                                     >
                                         <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Is Air Conditioned" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="true">Yes</SelectItem>
                                             <SelectItem value="false">No</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />



                     {/* Price */}
                     <FormField
                         control={control}
                         name="price"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Price</FormLabel>
                                 <FormControl>
                                     <Input placeholder="Price" type="number" {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />

                     <FormLabel>Additional Pricing</FormLabel>
                     {/* Dynamic Price Detail List */}
                     {fields.map((fieldItem, index) => (
                         <div className="flex gap-2  " key={fieldItem.id}>
                              <FormField
                                 control={control}
                                 name={`priceDetailList.${index}.priceType`}
                                 render={({ field }) => (
                                     <FormItem className="">
                                         {/*<FormLabel>Price Type</FormLabel>*/}
                                         <Select onValueChange={field.onChange} value={field.value}>
                                             <FormControl>
                                                 <SelectTrigger size="lg">
                                                     <SelectValue placeholder="Price Type" />
                                                 </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                 <SelectItem value="Deposit">Deposit</SelectItem>
                                                 <SelectItem value="Maintainance">Maintainance</SelectItem>
                                                 <SelectItem value="Electricity">Electricity</SelectItem>
                                                 <SelectItem value="Water">Water</SelectItem>
                                                 <SelectItem value="Other">Other</SelectItem>
                                             </SelectContent>
                                         </Select>
                                         <FormMessage />
                                     </FormItem>
                                 )}
                             />

                             {/* Price Detail */}
                             <FormField
                                 control={control}
                                 name={`priceDetailList.${index}.priceDetail`}
                                 render={({ field }) => (
                                     <FormItem className=" ">
                                          <FormControl>
                                             <Input placeholder="Amount" type="number" {...field} />
                                         </FormControl>
                                         <FormMessage />
                                     </FormItem>
                                 )}
                             />

                             <Button
                                 type="button"
                                 variant="destructive"
                                 size="lg"
                                 onClick={() => remove(index)}
                                 className=""
                             >
                                 <Trash2 size={16} />
                             </Button>
                         </div>
                     ))}

                     <Button type="button" variant="outline" onClick={() => append({ priceType: "", priceDetail: "" })} className="w-full mt-2">
                         Add Price Detail
                     </Button>

                     {/* Availability */}
                     <FormField
                         control={control}
                         name="availability"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Availability</FormLabel>
                                  <Input type="date" {...field}/>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />
                 </div>

                 <div className="flex gap-4">
                     <Button type="submit">Save</Button>
                     <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                 </div>

             </form>
         </Form>
     </div>
  );
}
