// IMPORT FROM FIRESTORE, AUTH & FIREBASECONFIG
import { getFirestore, getDocs, getDoc, collection, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"
import { app } from "./firebaseconfig/firebaseconfig.js"

// FIREBASE
const DB = getFirestore(app)
const auth = getAuth(app)

// collections
const shoppingListsColRef = collection(DB, "shoppingLists")
const usersColRef = collection(DB, "users")
let currentuser;

// UTILITY FUNCTION FOR ACCESSING ANY HTML ELEMENT
const getElement = (selector) => {
    const element = document.querySelector(selector)
    if (!element) {
        alert(`There's no elemtent with the specified selector: ${selector}`)
        return
    }
    return element
}

// HTML ELEMENTS
const backButtonEl = getElement("#back-btn")
const userImageEl = getElement("#user-image")
const shoppingListEl = getElement(".shopping-list")
const loaderEl = getElement("#loader")

// EDIT FORM ELEMENTS
const editItemTitleEl = getElement("#itemTitle")
const editItemFormEl = getElement("#edit-item-form")
const editItemNameEl = getElement("#itemName")
const editItemQuantityEl = getElement("#quantity")
const editItemUnitEl = getElement("#unit")
const editItemPriceEl = getElement("#price")
const editItemStatusEl = getElement("#status")
const editItemDescriptionEl = getElement("#description")
const editItemButtonEl = getElement("#edit-item-btn")


// const addItemButtonEl = getElement("#add-item-btn")

// DETECT THE AUTH STATE OF THE USER
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(usersColRef, user.uid)
        const userDocument = await getDoc(docRef)
        // RE-ASSIGN THE currentUser variable TO THE CURRENTLY LOGGED IN USER
        currentuser = userDocument.data()
        // FETCH THE USER'S SHOPPING LIST
        getShoppingList()
    } else {
        alert("You have to be logged in.")
        window.location.href = "./index.html"
    }
})

// START EDIT ITEM
const displayEditModal = async (itemId) => {
    try {
        // get the document with the itemId
        // Create a doc Ref for the shopping item that was clicked
        const docRef = doc(shoppingListsColRef, currentuser.id, "items", itemId)
        // get the docment that was clicked from firestore
        const docSnapShot = await getDoc(docRef)
        // destructure the data of the shopping item
        const { itemName, quantity, price, status, description, unit } = docSnapShot.data()

        // spread the data in the edit form
        editItemTitleEl.textContent = itemName
        editItemNameEl.value = itemName
        editItemQuantityEl.value = quantity
        editItemUnitEl.value = unit
        editItemDescriptionEl.value = description
        editItemStatusEl.value = status
        editItemPriceEl.value = price

        // call updateShoppingItem() when the "Save changes" button is clicked
        editItemButtonEl.addEventListener("click", ()=>{
            updateShoppingItem(itemId)
        })

    } catch (error) {
        console.log(error)
    }
}

// UPDATE ITEM
const updateShoppingItem = async (itemId) => {
    // disable the "Save changes" button
    editItemButtonEl.disabled = true
    // change the "Save changes" button's text to "Saving..." to show the loading state to the user
    editItemButtonEl.textContent = "Saving..."

    // create a object for containing the updated data in the edit form
    const newUpdate = {
        itemName: editItemNameEl.value,
        quantity: editItemQuantityEl.value,
        unit: editItemUnitEl.value,
        price: editItemPriceEl.value,
        status: editItemStatusEl.value,
        description: editItemDescriptionEl.value,
    }
    try {
        // document reference for the shopping item that wants to be updated
        const docRef = doc(shoppingListsColRef, currentuser.id, "items", itemId)
        // update the shopping list in firestore
        await updateDoc(docRef, newUpdate)
        // fetch the user's shopping list again to update the UI
        getShoppingList()
        // show a success message
        alert("Item updated successfully!")

    } catch (error) {
        console.log(error)
    } finally {
        editItemButtonEl.disabled = false
        editItemButtonEl.textContent = "Save changes"
    }
}



// GET USER'S SHOPPING LIST FROM FIRESTORE SUB-COLLECTION
const getShoppingList = async () => {
    // clear the shopping list element
    shoppingListEl.innerHTML = ""
    // show the loading spinner
    loaderEl.classList.remove("d-none")
    // this variable will be re-assigned after 
    
    try {
        // create a collection reference for the sub-collection of the user's shopping list
        const userShoppinListColRef = collection(shoppingListsColRef, currentuser.id, "items")
        // get all the documents from the user's shoppingList sub-collection
        const shoppingListSnapShot = await getDocs(userShoppinListColRef)

        // check is the response from the user's shopping list sub-collection is empty
        if (shoppingListSnapShot.size === 0) {
            // display a "no item" message to the user
            shoppingListEl.innerHTML = `
                <div class="empty">
                    <p>No item</p>
                </div>
            `
        } else {
            // IF the user's shopping list sub-collection is not empty, (1) stop the loader. (2)Render the items on the ".shopping-list" element
            loaderEl.classList.add("d-none")
            shoppingListSnapShot.forEach(doc => {
                const shoppingItem = doc.data()
                // give a class "edit-btn" to each buttons and add an attribute "itemId" to them ( this will be used from line 167 - 174)
                shoppingListEl.innerHTML += `
                    <div class="shopping-item ${shoppingItem.status === "completed" && "completed"}">
                    <div>
                        <input type="checkbox">
                    <span>${shoppingItem.itemName}</span>
                    </div>
                    <button type="button" itemId="${doc.id}" id="edit-btn-${doc.id}"  class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal">
                         Edit
                    </button>
                </div>
                `
            })
        }
        // get all the buttons with the classname of ".edit-btn"
        document.querySelectorAll(".edit-btn").forEach(ele => {
            // add an eventListener to each button
            ele.addEventListener("click", () => {
                // get the value of the clicked button's itemId
                const itemdId = ele.getAttribute("itemId")
                // call the displayEditModal function and send the itemId of the button that was clicked to it
                displayEditModal(itemdId)
            })
        })

    } catch (error) {
        console.log(error)
    } finally {
        // stop the loader
        loaderEl.classList.add("d-none")
    }
}

