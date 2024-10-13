import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required.' },
                { status: 400 }
            );
        }

        // Fetching favorite itinerary IDs for the user
        const favoritesQuery = query(
            collection(db, 'favorites'),
            where('userId', '==', userId)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const favoriteItineraryIds = favoritesSnapshot.docs.map(doc => doc.data().itineraryId);

        if (favoriteItineraryIds.length === 0) {
            return NextResponse.json(
                { success: true, itineraries: [] },
                { status: 200 }
            );
        }

        // Fetch itineraries based on favorite IDs
        const itinerariesQuery = query(
            collection(db, 'itineraries'),
            where('__name__', 'in', favoriteItineraryIds)
        );
        const itinerariesSnapshot = await getDocs(itinerariesQuery);
        const itineraries = itinerariesSnapshot.docs.map(doc => ({
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
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching favorites.',
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, itineraryId } = await req.json();

        if (!userId || !itineraryId) {
            return NextResponse.json(
                { success: false, message: 'User ID and Itinerary ID are required.' },
                { status: 400 }
            );
        }

        // Check if the favorite already exists to prevent duplicates
        const existingFavoriteQuery = query(
            collection(db, 'favorites'),
            where('userId', '==', userId),
            where('itineraryId', '==', itineraryId)
        );
        const existingFavorites = await getDocs(existingFavoriteQuery);

        if (!existingFavorites.empty) {
            return NextResponse.json(
                { success: false, message: 'Itinerary is already in favorites.' },
                { status: 400 }
            );
        }

        // Add favorite
        await addDoc(collection(db, 'favorites'), { userId, itineraryId });

        return NextResponse.json(
            { success: true, message: 'Itinerary added to favorites.' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while adding to favorites.',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId, itineraryId } = await req.json();

        if (!userId || !itineraryId) {
            return NextResponse.json(
                { success: false, message: 'User ID and Itinerary ID are required.' },
                { status: 400 }
            );
        }

        // Find the favorite document
        const favoriteQuery = query(
            collection(db, 'favorites'),
            where('userId', '==', userId),
            where('itineraryId', '==', itineraryId)
        );
        const favoriteSnapshot = await getDocs(favoriteQuery);

        if (favoriteSnapshot.empty) {
            return NextResponse.json(
                { success: false, message: 'Favorite not found.' },
                { status: 404 }
            );
        }

        // Delete the favorite
        const favoriteDoc = favoriteSnapshot.docs[0];
        await deleteDoc(doc(db, 'favorites', favoriteDoc.id));

        return NextResponse.json(
            { success: true, message: 'Itinerary removed from favorites.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while removing from favorites.',
            },
            { status: 500 }
        );
    }
}