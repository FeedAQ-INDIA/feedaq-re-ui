"use client";

import {Card, CardHeader} from "@/components/ui/card.jsx";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
 import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CircleArrowLeft, CircleArrowRight} from "lucide-react";
import {useUser} from "@/lib/useUser";
import {apiClient} from "@/lib/apiClient.mjs";


function MyAccount() {
    const {user, refreshUser } = useUser();

    const createAccountSchema = z.object({
        firstName: z.string()
            .min(1, "Name must be at least one character long."),
        lastName: z.string().optional(),
        number: z
            .string()
            .length(10, "Phone number must be 10 digits.")
    });
    const createAccountForm = useForm({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {firstName: "", lastName: "", number: ''},
    });

    useEffect(() => {
        if (user) {
            createAccountForm.reset({
                firstName: user.data.firstName,
                lastName: user.data.lastName,
                number: user.data.number || '',
            });
        }
    }, [user]);

    async function onSubmit(data) {

        const res = await apiClient("http://localhost:8080/saveUserDetail",
            {
                method: "POST",
                credentials: true,
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    number: data.number,
                }),
            })
        if(res.ok){
            console.log("user updated succesfully");
            await refreshUser();
        }

    }

    return (
        <>

            <div className="p-3 md:p-6">
                <Card className="border-0 bg-rose-500">
                    <CardHeader>
                        <div className="flex flex-sm justify-items-center gap-4 items-center">
                            <Avatar className="w-12 h-12">
                                <AvatarFallback className="text-xl">{user?.data?.nameInitial}</AvatarFallback>
                            </Avatar>
                            <div className="text-white">
                                <h1 className="text-xl font-medium">Welcome {user?.data?.derivedUserName}</h1>
                                <p>Member since {user?.data?.created_date}</p>
                            </div>
                        </div>


                    </CardHeader>
                </Card>
                <div className="my-16">
                    <Form {...createAccountForm}>
                        <form
                            onSubmit={createAccountForm.handleSubmit(onSubmit)}
                            className="w-full space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid w-full   items-center gap-1.5">
                                    <FormField
                                        control={createAccountForm.control}
                                        name="firstName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <FormField
                                        control={createAccountForm.control}
                                        name="lastName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid w-full  items-center gap-1.5">

                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" id="email" value={user?.data?.email} readOnly/>
                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <FormField
                                        control={createAccountForm.control}
                                        name="number"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>

                                                    <Input
                                                        {...field}
                                                        type="text" // change to text to allow better control
                                                        placeholder="Phone Number"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        onChange={(e) => {
                                                            const cleaned = e.target.value.replace(/\D/g, ""); // remove non-digits
                                                            field.onChange(cleaned);
                                                        }}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <Label htmlFor="language">Language</Label>
                                    <Input type="text" id="language" value="English" readOnly/>
                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <Label htmlFor="country">Country</Label>
                                    <Input type="text" id="country" value="India" readOnly/>
                                </div>
                            </div>
                            <div className="flex gap-4 my-6">
                                <Button onClick={()=> createAccountForm.reset()} variant="outline">Reset</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </>)

}


export default MyAccount;