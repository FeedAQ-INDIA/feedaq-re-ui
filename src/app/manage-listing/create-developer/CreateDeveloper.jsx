'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React from "react";
import axios from "axios";
import {apiClient} from "@/lib/apiClient.mjs";

// --- Zod Schema ---
const developerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    contactNumber: z.string().optional(),
    description: z.string().optional(),
});

export function CreateDeveloper({ onSubmit }) {
    const form = useForm({
        resolver: zodResolver(developerSchema),
        defaultValues: {
            name: '',
            website: '',
            email: '',
            contactNumber: '',
            description: '',
        },
    });


    async function onSubmit(data){
        try {

            const devRes = await apiClient("http://localhost:8080/saveDeveloper", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name : data.name,
                    website : data.website,
                    email : data.email,
                    contactNumber : data.contactNumber,
                    description : data.description,
                }),
            }, window.location.pathname);


            if (devRes.ok) {
                const devData = await devRes.json();
                console.log(devData);
             }
        } catch (err) {
            console.error("User tracking error", err);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Developer Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="developer@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+91-XXXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief about the developer..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                </div>
            </form>
        </Form>
    );
}
