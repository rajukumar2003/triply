import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,  } from "firebase/auth";
import { auth } from "./firebaseConfig";

const googleProvider = new GoogleAuthProvider();

export const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
};