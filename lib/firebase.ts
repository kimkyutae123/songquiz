import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { FirebaseSong, Genre } from '@/types';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// 노래 저장
export const addSong = async (song: Omit<FirebaseSong, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'songs'), {
        ...song,
        createdAt: Date.now(),
    });
    return docRef.id;
};

// 장르별 노래 가져오기
export const getSongsByGenre = async (genre: Genre): Promise<FirebaseSong[]> => {
    const q = genre === 'random'
        ? query(collection(db, 'songs'))
        : query(collection(db, 'songs'), where('genre', '==', genre));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as FirebaseSong[];
};