import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    deleteDoc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"
import { app } from "./firebaseconfig/firebaseconfig.js"

const auth = getAuth(app)
const DB = getFirestore(app)
const userColRef = collection(DB, "users")

// utils
const getElement = (selector) => {
    const element = document.querySelector(selector)
    if (!element) {
        console.log(`Invalid selector: ${element}`)
        return
    }
    return element
}

// ELEMENTS
const signupFormEl = getElement("#signup-form")
const signupEmailEl = getElement("#signup-email")
const signupPasswordEl = getElement("#signup-password")
const signupUsernameEl = getElement("#signup-username")
const signupButtonEl = getElement("#signup-btn")
const errorMessageEl = getElement("#error-message")


const handleSignup = async () => {
    signupButtonEl.textContent = "Authenticating..."
    signupButtonEl.disabled = true

    if(!signupEmailEl.value || !signupPasswordEl.value || signupUsernameEl.value){
        errorMessageEl.textContent = "All fields are required"
    }  else{
        errorMessageEl.textContent = ""
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, signupEmailEl.value, signupPasswordEl.value)
        const user = await userCredential.user
        if(!user){
            alert("User not created!")
            return
        }
        console.log(user.uid)
        // TODO: COLLECT USER ID AND ADD USER INFO TO THE DATABASE
        const newUser = {
            id: user.uid,
            username: signupUsernameEl.value,
            email: signupEmailEl.value,
            profilePic: `https://avatar.iran.liara.run/username?username=${signupUsernameEl.value}`
        }


        const docRef = doc(userColRef, user.uid)
        const userSnapshot = await setDoc(docRef, newUser)
       
        window.location.href = "./profile.html"

    } catch (error) {
        console.log(error)
    } finally {
        signupButtonEl.textContent = "Sign up"
        signupButtonEl.disabled = false
    }
}

signupFormEl.addEventListener("submit", (e)=>{
    e.preventDefault()
    handleSignup()
})