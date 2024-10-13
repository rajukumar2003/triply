"use client"
//app/components/NewItineraryPopup.tsx
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/firebaseConfig'

interface NewItineraryPopupProps {
    isOpen: boolean;
    onClose: () => void;
    refreshItineraries: () => void;
}

interface Activity {
    destination: string;
    description: string;
    date: string;
}

export default function NewItineraryPopup({ isOpen, onClose, refreshItineraries }: NewItineraryPopupProps) {
    const [title, setTitle] = useState('')
    const [destination, setDestination] = useState('')
    const [activity, setActivity] = useState<Activity>({ destination: '', description: '', date: '' })
    const [image, setImage] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [tripType, setTripType] = useState('')

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(URL.createObjectURL(file))
        }
    }

    //getting the userId of the logged in user
    const [userId, setUserId] = useState<string | null>(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user?.uid || null)
        })
        return () => unsubscribe()
    }, [])


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData()
        if (userId) {
            formData.append('userId', userId)
        } else {
            toast.error('Please login to create an itinerary')
            return
        }
        formData.append('title', title)
        formData.append('destination', destination)
        formData.append('tripType', tripType)
        formData.append('activity', JSON.stringify(activity))

        if (image) {
            const response = await fetch(image)
            const blob = await response.blob()
            const file = new File([blob], title + '.jpg', { type: 'image/jpeg' })
            formData.append('image', file)
        }

        try {
            const response = await axios.post('/api/itineraries', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.status === 201) {
                toast.success('Itinerary created successfully!')
                refreshItineraries()  // Refreshing the itineraries after creating a new one
                onClose()
            } else {
                toast.error(response.data.message || 'Failed to create itinerary')
            }
        } catch (error) {
            console.error('Error creating itinerary:', error)
            toast.error('An error occurred while creating the itinerary')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Create New Itinerary</h2>
                        <button
                            title="Close"
                            onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Itinerary Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                placeholder="Enter itinerary title"
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9]"
                                placeholder="Enter destination"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
                            <select
                                title="Trip Type"
                                value={tripType}
                                onChange={(e) => setTripType(e.target.value)}
                                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9]"
                                required
                            >
                                <option value="">Select trip type</option>
                                <option value="adventure">Adventure</option>
                                <option value="leisure">Leisure</option>
                                <option value="work">Work</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={activity.destination}
                                    onChange={(e) => setActivity({ ...activity, destination: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9]"
                                    placeholder="Destination for this activity"
                                    required
                                />
                                <textarea
                                    value={activity.description}
                                    onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9]"
                                    placeholder="Activity description"
                                    rows={3}
                                    required
                                />
                                <input
                                    type="date"
                                    title="Date"
                                    value={activity.date}
                                    onChange={(e) => setActivity({ ...activity, date: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9]"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                            {image && (
                                <div className="relative mb-4">
                                    <Image src={image} alt="Uploaded image" width={100} height={100} className="rounded-md" />
                                    <button
                                        type="button"
                                        title="Remove photo"
                                        onClick={() => setImage('')}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#6d71f9] text-white rounded-md hover:bg-[#5a5ed6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6d71f9]"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Itinerary'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    )
}