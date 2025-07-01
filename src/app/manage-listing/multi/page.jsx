'use client'

import { useState } from 'react'

export default function MultiImageUpload() {
    const [previews, setPreviews] = useState([]) // [{ file, url, caption, isPrimary, order }]
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
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

    const handleUpload = async () => {
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

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            console.log(data?.data)
            if (res.ok) {
                setMessage('Images uploaded successfully!')
                setPreviews([]) // Clear preview after upload
            } else {
                setMessage(data.error || 'Upload failed.')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setMessage('Something went wrong during the upload.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className=" ">
            <div className=" ">

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-6 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
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
