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
const shoppingColRef = collection(DB, "shoppingLists")
let currentuser;

// ELEMENTS
const shoppingFormEl = document.getElementById("new-item-form")
const itemNameEl = document.getElementById("itemName")
const quantityEl = document.getElementById("quantity")
const unitEl = document.getElementById("unit")
const priceEl = document.getElementById("price")
const descriptionEl = document.getElementById("description")
const saveBtnEl = document.getElementById("add-item-btn")

onAuthStateChanged(auth, async (user)=>{
    if(user){
        const docRef = doc(userColRef, user.uid)
        const userCredential = await getDoc(docRef)
        currentuser = userCredential.data()
        

    } else{
        window.location.href = "./index.html"
    }
})

const addNewItem = async () => {
    saveBtnEl.textContent = "Saving..."
    saveBtnEl.disabled = true
    const newItem = {
        itemName: itemNameEl.value,
        quantity: quantityEl.value,
        unit: unitEl.value,
        price: priceEl.value,
        description: descriptionEl.value,
        status: "pending" // completed
    }
    try {
        console.log(currentuser.id)
        // const userItemsColRef = collection()
        const userItemsColRef = collection(shoppingColRef, currentuser.id, "items")
        const docSnapShot = await addDoc(userItemsColRef, newItem)
        if(docSnapShot){
            alert("Item added successfully")
        }
    } catch (error) {
        console.log(error)
    } finally {
        saveBtnEl.textContent = "Save"
        saveBtnEl.disabled = false
    }
}

shoppingFormEl.addEventListener("submit", (e)=>{
    e.preventDefault()
    addNewItem()
})