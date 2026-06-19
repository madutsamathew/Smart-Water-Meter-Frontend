// import { initializeApp } from "firebase/app";

// import { getDatabase, ref, onValue } from "firebase/database";

// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyD6O57B0zXV2L_dcJ3ZYVsP4347CRTXFEA",
//   authDomain: "water-quality-system-46fa9.firebaseapp.com",
//   databaseURL:
//     "https://water-quality-system-46fa9-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "water-quality-system-46fa9",
//   storageBucket: "water-quality-system-46fa9.firebasestorage.app",
//   messagingSenderId: "294149219376",
//   appId: "1:294149219376:web:4f6f3c541984018d0eb9f5",
// };

// const app = initializeApp(firebaseConfig);

// const db = getDatabase(app);

// const auth = getAuth(app);

// export { db, auth, ref, onValue };

// NEW

import { initializeApp } from "firebase/app";

import { getDatabase, ref, onValue } from "firebase/database";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6O57B0zXV2L_dcJ3ZYVsP4347CRTXFEA",
  authDomain: "water-quality-system-46fa9.firebaseapp.com",
  databaseURL:
    "https://water-quality-system-46fa9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "water-quality-system-46fa9",
  storageBucket: "water-quality-system-46fa9.firebasestorage.app",
  messagingSenderId: "294149219376",
  appId: "1:294149219376:web:4f6f3c541984018d0eb9f5",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth, ref, onValue };
