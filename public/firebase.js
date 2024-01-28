// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCPqfWb6Uat0ZtgL0ga9XEXKYLAkvXc7Ww',
    authDomain: 'simontov-4784b.firebaseapp.com',
    projectId: 'simontov-4784b',
    storageBucket: 'simontov-4784b.appspot.com',
    messagingSenderId: '627891507329',
    appId: '1:627891507329:web:22dec7b35b196674853d80',
    measurementId: 'G-JWZ9DLE48P'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
