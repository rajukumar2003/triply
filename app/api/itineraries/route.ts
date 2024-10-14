import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '@/firebase/firebaseConfig';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, title, destination, tripType, activity, imageUrl } = body;

        // Validate input
        if (!userId || !title || !destination || !tripType || !activity || !imageUrl) {
            return NextResponse.json(
                { success: false, message: 'Missing or invalid required fields. Please try again.' },
                { status: 400 }
            );
        }

        const itineraryData = {
            userId,
            title,
            destination,
            tripType,
            activity: JSON.parse(activity), // Ensure activity is parsed as an object
            imageUrl,
            createdAt: new Date().toISOString(),
        };

        // Add itinerary to Firestore
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
