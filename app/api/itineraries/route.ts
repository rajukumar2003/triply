import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, storage } from '@/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const userId = formData.get('userId') as string;
        const title = formData.get('title') as string;
        const destination = formData.get('destination') as string;
        const tripType = formData.get('tripType') as string;
        const activity = JSON.parse(formData.get('activity') as string);
        const image = formData.get('image') as File;

        if (!userId || !title || !destination || !tripType || !activity || !image) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid required fields. Please try again.' },
                { status: 400 }
            );
        }

        const storageRef = ref(storage, `images/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);

        const itineraryData = {
            userId,
            title,
            destination,
            tripType,
            activity,
            imageUrl,
            createdAt: new Date().toISOString(),
        };

        const itineraryRef = await addDoc(collection(db, 'itineraries'), itineraryData);

        return NextResponse.json(
            {
                success: true,
                message: 'Itinerary created successfully.',
                itineraryId: itineraryRef.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating itinerary:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while creating the itinerary.',
            },
            { status: 500 }
        );
    }
}


//GET method to get the itineraries
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const tripType = searchParams.get('tripType');
        const destination = searchParams.get('destination');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required.' },
                { status: 400 }
            );
        }

        let q = query(collection(db, 'itineraries'), where("userId", "==", userId));

        // Apply tripType filter only if it's provided and not 'all'
        if (tripType && tripType.toLowerCase() !== 'all') {
            q = query(q, where("tripType", "==", tripType));
        }

        if (destination) {
            
            const destLower = destination.toLowerCase();
            q = query(
                q,
                where("destination", ">=", destLower),
                where("destination", "<=", destLower + '\uf8ff')
            );
        }

        const querySnapshot = await getDocs(q);

        const itineraries = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(
            {
                success: true,
                itineraries: itineraries,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching itineraries.',
            },
            { status: 500 }
        );
    }
}
