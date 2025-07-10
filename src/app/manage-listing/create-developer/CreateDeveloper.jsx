'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React, { useCallback, useMemo, useState } from 'react';
import { apiClient } from "@/lib/apiClient.mjs";
import AvatarImageUpload from "@/app/manage-listing/_components/AvatarImageUpload";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

// Constants
const API_ENDPOINT = 'http://localhost:8080/saveDeveloper';
const UPLOAD_ENDPOINT = '/api/upload/avatar';

// Zod Schema
const developerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  contactNumber: z.string().optional(),
  description: z.string().optional(),
});

const defaultFormValues = {
  name: '',
  website: '',
  email: '',
  contactNumber: '',
  description: '',};

export function CreateDeveloper() {
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const form = useForm({
    resolver: zodResolver(developerSchema),
    defaultValues: defaultFormValues,
  });

  const handleUploadAvatar = useCallback(async () => {
    if (!previews.length) return null;

    const formData = new FormData();
    formData.append('file', previews[0].file);
    formData.append('type', 'developer-avatar');

    try {
      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data?.file?.url;
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: 'Failed to upload avatar', type: 'error' });
      throw error;
    }
  }, [previews]);

  const onSubmit = useCallback(async (formData) => {
    try {
      setIsSubmitting(true);
      setMessage({ text: '', type: '' });

      const avatarUrl = await handleUploadAvatar();

      const response = await apiClient(
        API_ENDPOINT,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            avatar: avatarUrl,
          }),
        },
        window.location.pathname
      );

      if (!response.ok) {
        throw new Error('Failed to save developer');
      }

      const responseData = await response.json();
      
      form.reset();
      setPreviews([]);
      
      toast.success('developer created successfully', {
        description: `#${responseData?.data?.id}`,
        action: {
          label: 'Copy ID',
          onClick: () => navigator.clipboard.writeText(responseData?.data?.id)
        },
      });

    } catch (error) {
      console.error('Submission error:', error);
      setMessage({
        text: error.message || 'An error occurred',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, handleUploadAvatar]);

  const handleReset = useCallback(() => {
    form.reset(defaultFormValues);
    setPreviews([]);
    setMessage({ text: '', type: '' });
  }, [form]);

  const messageClass = useMemo(() => {
    return message.type === 'success' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }, [message.type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div>
          <FormLabel className="mb-2 block">Choose an Avatar</FormLabel>
          <AvatarImageUpload 
            previews={previews} 
            setPreviews={setPreviews} 
            setMessage={setMessage}
            message={message.text}
          />
          {message.text && (
            <div className={`mt-4 p-3 rounded-lg text-center ${messageClass}`}>
              {message.text}
            </div>
          )}
        </div>

        {['name', 'website', 'email', 'contactNumber'].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={
                      field === 'name' ? 'developer Name' :
                      field === 'website' ? 'https://example.com' :
                      field === 'email' ? 'developer@example.com' :
                      '+91-XXXXXXXXXX'
                    } 
                    type={field === 'email' ? 'email' : 'text'}
                    {...fieldProps} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief about the developer..." 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
