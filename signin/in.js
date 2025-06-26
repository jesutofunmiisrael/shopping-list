// Import the functions you need from the SDKs you need

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {app} from "../firebaseconfig/firebaseconfig.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


  // Initialize Firebase
  
  const auth = getAuth(app)
  
const emailEl = document.getElementById("email")
const passwordEl = document.getElementById ("password")
const errormessageEl = document.getElementById("error-message")

const signIn = async()=>{
    console.log("signing in....")

    try {
       const userCredential = await
       signInWithEmailAndPassword(auth,emailEl.value,
        passwordEl.value)
        const user = await userCredential.user
        if (user){
            alert("welcome")
            window.location.href ="../Dashboard.html"
        }
    } catch (error) {
        console.log(error)
        console.log(error.code)
        if (error.code == "auth/invalid-credent ial"){
            errormessageEl.textContent = "Email or password incorrect"
            
        }else if (error.code == "auth/invalid-email"){
            errormessageEl.textContent = "invalid email"
        }
    }finally{
        console.log("Done!")
    }
}

const signInFormEL = document.getElementById("signIn-form")

signInFormEL.addEventListener("submit",(e) => {
    e.preventDefault()
    signIn()
})







