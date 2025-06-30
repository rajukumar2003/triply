"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { X, Upload, MapPin, Calendar, BookOpen, Type } from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";

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

export default function NewItineraryPopup({
  isOpen,
  onClose,
  refreshItineraries,
}: NewItineraryPopupProps) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [activity, setActivity] = useState<Activity>({
    destination: "",
    description: "",
    date: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [tripType, setTripType] = useState("");


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const [userId, setUserId] = useState<string | null>(null);
  // Listen for authentication state changes to get the current user ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  async function uploadImageToFirebase(image: File) {
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = "";
    if (image) {
      try {
        imageUrl = await uploadImageToFirebase(image);
      } catch {
        toast.error("Failed to upload image");
        setIsLoading(false);
        return;
      }
    }

    const formData = {
      userId,
      title,
      destination,
      tripType,
      activity: JSON.stringify(activity),
      imageUrl,
    };

    if (!userId) {
      toast.error("Please login to create an itinerary");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/itineraries", formData);

      if (response.status === 201) {
        toast.success("Itinerary created successfully!");
        refreshItineraries();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to create itinerary");
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast.error("An error occurred while creating the itinerary");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-[#6d71f9] dark:text-purple-400">
              Create New Itinerary
            </h2>
            <button
              title="Close"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <Type className="w-4 h-4 text-[#6d71f9] dark:text-purple-400 mr-2" />
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Itinerary Title
                  </label>
                </div>
                <input
                  type="text"
                  id="title"
                  value={title}
                  placeholder="Enter itinerary title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] focus:ring-opacity-50 px-4 py-2 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-[#6d71f9] dark:text-purple-400 mr-2" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Destination
                  </label>
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] focus:ring-opacity-50 px-4 py-2 dark:placeholder-gray-400"
                  placeholder="Enter destination"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <BookOpen className="w-4 h-4 text-[#6d71f9] dark:text-purple-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trip Type
                </label>
              </div>
              <select
                title="Trip Type"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] focus:ring-opacity-50 px-4 py-2"
                required
              >
                <option value="">Select trip type</option>
                <option value="adventure">Adventure</option>
                <option value="leisure">Leisure</option>
                <option value="work">Work</option>
                <option value="family">Family</option>
              </select>
            </div>

            {/* Activity Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-3">
                <Calendar className="w-4 h-4 text-[#6d71f9] dark:text-purple-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Activity Details
                </label>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={activity.destination}
                  onChange={(e) =>
                    setActivity({ ...activity, destination: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] focus:ring-opacity-50 px-4 py-2 dark:placeholder-gray-400"
                  placeholder="Destination for this activity"
                  required
                />
                <textarea
                  value={activity.description}
                  onChange={(e) =>
                    setActivity({ ...activity, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] focus:ring-opacity-50 px-4 py-2 dark:placeholder-gray-400"
                  placeholder="Activity description"
                  rows={3}
                  required
                />
                <input
                  type="date"
                  title="Date"
                  value={activity.date}
                  onChange={(e) =>
                    setActivity({ ...activity, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] focus:ring-opacity-50 px-4 py-2 dark:[color-scheme:dark]" // For date picker icon color
                  required
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <div className="flex items-center mb-2">
                <Upload className="w-4 h-4 text-[#6d71f9] dark:text-purple-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trip Photo
                </label>
              </div>
              {imagePreview ? (
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Uploaded image"
                    width={300}
                    height={200}
                    className="w-full h-80 object-contain"
                  />
                  <button
                    type="button"
                    title="Remove photo"
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t dark:border-gray-700">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6d71f9] hover:bg-[#5a5ed3] dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition-colors shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Itinerary"}
                </button>
              </div>
            </div>
          </form>
          <Toaster position="bottom-center" />
        </div>
      </div>
    </div>
  );
}
