// import { db } from "./firebaseConfig";
// import { collection, addDoc, getDocs } from "firebase/firestore";

// // Example function to add itinerary
// export const addItinerary = async (data: any) => {
//     const itineraryCollection = collection(db, "itineraries");
//     return await addDoc(itineraryCollection, data);
// };

// // Example function to get itineraries
// export const getItineraries = async () => {
//     const itineraryCollection = collection(db, "itineraries");
//     const snapshot = await getDocs(itineraryCollection);
//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// ///triply/firebase/firestore.ts