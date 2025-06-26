import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app } from "../firebaseconfig/firebaseconfig.js"

const DB = getFirestore(app)
const auth = getAuth(app)
const userColRef = collection(DB, "users")
let currentuser;

// ELEMENT
const welcomeEl = document.getElementById("welcome-message")
const usernameEl =document.getElementById("username")
const userEmailEl =document.getElementById("user-email")

onAuthStateChanged(auth, async (user)=>{
    if(user){
        const docRef = doc(userColRef, user.uid)
        const userCredential = await getDoc(docRef)
        currentuser = userCredential.data()
        usernameEl.textContent = currentuser.username
        userEmailEl.textContent = currentuser.email
    } else{
        window.location.href = "./index.html"
    }
})



