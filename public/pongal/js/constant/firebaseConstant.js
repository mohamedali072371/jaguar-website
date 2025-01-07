import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBksDlHjP6MlNnF_gdWnAgzntU905Dptdc",
    authDomain: "testing-89681.firebaseapp.com",
    projectId: "testing-89681",
    storageBucket: "al-infaaq.appspot.com",
    messagingSenderId: "312027157118",
    appId: "1:312027157118:web:dfd01491d2c69883b6fe2f"
    };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);