'use client';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import React, {useState} from "react";
import {apiClient} from "@/lib/apiClient.mjs";
import AvatarImageUpload from "@/app/manage-listing/_components/AvatarImageUpload";
import {toast} from "sonner";

// --- Zod Schema ---
const developerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    contactNumber: z.string().optional(),
    description: z.string().optional(),
});

export function CreateDeveloper({onSubmit}) {
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

    const [previews, setPreviews] = useState([]) // [{ file, url, caption, isPrimary, order }]
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')

    async function onSubmit(data) {
        try {
            let avatarUrl = null;
            if (previews.length > 0) {
                let formData = new FormData()
                previews.forEach((item, index) => {
                    formData.append('file', item.file)
                    formData.append('type', 'developer-avatar')
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
            console.log(avatarUrl)
            const devRes = await apiClient("http://localhost:8080/saveDeveloper", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    website: data.website,
                    email: data.email,
                    contactNumber: data.contactNumber,
                    description: data.description,
                    avatar: avatarUrl
                }),
            }, window.location.pathname);


            if (devRes.ok) {
                const devData = await devRes.json();
                console.log(devData);
                form.reset();
                setPreviews([]);
                toast("Developer has been created : #"+devData?.data?.id, {
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


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
            >

                <div className="  ">
                    <FormLabel className="mb-2">Choose an Avatar</FormLabel>
                    <AvatarImageUpload previews={previews} setPreviews={setPreviews} setMessage={setMessage}
                                       message={message}/>
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

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Developer Name" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="developer@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+91-XXXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief about the developer..." {...field} />
                            </FormControl>
                            <FormMessage/>
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
