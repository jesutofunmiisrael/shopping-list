import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";




const firebaseConfig = {
    apiKey: "AIzaSyDEnSoMvZ-7T7QGa-QUHXji9ATMXF4qwuc",
    authDomain: "new-web-717a3.firebaseapp.com",
    projectId: "new-web-717a3",
    storageBucket: "new-web-717a3.firebasestorage.app",
    messagingSenderId: "117111598546",
    appId: "1:117111598546:web:cc5a913d572344a9ab2c0b"
  }

  const app = initializeApp(firebaseConfig);
  export{
    app
  }