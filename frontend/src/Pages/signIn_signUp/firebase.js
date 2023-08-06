import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyC__3V_H3bm0Eye-UWqczYnThIlw4jQ86o",
    authDomain: "tirviaapp.firebaseapp.com",
    projectId: "tirviaapp",
    storageBucket: "tirviaapp.appspot.com",
    messagingSenderId: "81613054998",
    appId: "1:81613054998:web:f02b5d69d7067a594c4137"
};

const firebase = initializeApp(firebaseConfig);

export const hostName = "https://qiuc1xjkaj.execute-api.us-east-1.amazonaws.com/dev/auth"

export const auth = getAuth();

export default firebase;