'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button";
import {CircleX} from "lucide-react";

export default function AvatarImageUpload({ previews, setPreviews, message, setMessage }) {

    const [modalImage, setModalImage] = useState(null)

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || [])
        const mapped = files.map((file, index) => ({
            file,
            url: URL.createObjectURL(file),
            caption: '',
            isPrimary: false,
            order: index + 1,
        }))
        setPreviews(mapped)
        setMessage('')
    }

    const removeImage = (indexToRemove) => {
        // setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove))
        setPreviews((prev) => {
            const updated = prev.filter((_, index) => index !== indexToRemove)
            if (updated.length === 0) {
                // Clear input value
                document.querySelector('input[type="file"]').value = ""
            }
            return updated
        })
    }


    return (
        <div>
            <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className=""
            />

            {previews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                    {previews.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col border rounded-lg p-4 bg-gray-50 shadow-sm relative"
                        >
                            <img
                                src={item.url}
                                alt={`Preview ${index}`}
                                onClick={() => setModalImage(item.url)}
                                className="w-full h-32 object-cover rounded mb-3 cursor-pointer hover:opacity-90"
                            />

                            {/* Remove button */}
                            <Button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 cursor-pointer flex items-center justify-center hover:bg-red-700"
                                title="Remove image"
                            >
                                <CircleX />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {modalImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setModalImage(null)}
                >
                    <img
                        src={modalImage}
                        alt="Full Preview"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setModalImage(null)}
                        className="absolute top-4 right-4 text-white text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    )
}
