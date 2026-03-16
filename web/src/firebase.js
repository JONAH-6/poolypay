import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// If you plan to use Firestore, uncomment the next line
// import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDDGV_3K54V5lUC0kDbXSvIRgWGuuUwubE',
  authDomain: 'poolypay.firebaseapp.com',
  projectId: 'poolypay',
  storageBucket: 'poolypay.firebasestorage.app',
  messagingSenderId: '672173353560',
  appId: '1:672173353560:web:6e9c62c5e233d0d0caf82d',
  measurementId: 'G-HDJVHYJDZV',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
// export const db = getFirestore(app) // if you need Firestore
