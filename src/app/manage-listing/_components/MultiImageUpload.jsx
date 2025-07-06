'use client'

import { useState } from 'react'
import {Input} from "@/components/ui/input";

export default function MultiImageUpload({previews, setPreviews, message, setMessage}) {

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

    const updateImageData = (index, key, value) => {
        setPreviews((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        )
    }

    return (
        <div className=" ">
            <div className=" ">

                <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {previews.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

                                <label className="text-sm font-medium mb-1">Caption</label>
                                <input
                                    type="text"
                                    value={item.caption}
                                    onChange={(e) =>
                                        updateImageData(index, 'caption', e.target.value)
                                    }
                                    placeholder="Enter caption"
                                    className="mb-3 w-full px-3 py-1 border rounded-md text-sm"
                                />

                                <label className="text-sm font-medium mb-1">Order</label>
                                <input
                                    type="number"
                                    defaultValue={index+1}
                                    value={item.order}
                                    onChange={(e) =>
                                        updateImageData(index, 'order', parseInt(e.target.value))
                                    }
                                    min={1}
                                    className="mb-3 w-full px-3 py-1 border rounded-md text-sm"
                                />

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={item.isPrimary}
                                        onChange={(e) =>
                                            updateImageData(index, 'isPrimary', e.target.checked)
                                        }
                                    />
                                    Set as Primary Image
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/*<button*/}
                {/*    onClick={handleUpload}*/}
                {/*    disabled={uploading || previews.length === 0}*/}
                {/*    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold*/}
                {/*        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"*/}
                {/*>*/}
                {/*    {uploading ? 'Uploading...' : 'Upload All Images'}*/}
                {/*</button>*/}


            </div>

            {/* Full-size Image Modal */}
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
