/* eslint-disable prettier/prettier */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBWECWfuxcDsf0WBfnbHgpW0Z1bHSGmebo",
    authDomain: "akilli-ilac-1b423.firebaseapp.com",
    projectId: "akilli-ilac-1b423",
    storageBucket: "akilli-ilac-1b423.appspot.com",
    messagingSenderId: "53737538330",
    appId: "1:53737538330:web:38a40873f3439d6a70e2a3"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);