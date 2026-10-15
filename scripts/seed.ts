import { initialProperties } from "../src/data/mockProperties";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKZrjTDlFjA8Wu6aS-Vhd2gzsygkMymic",
  authDomain: "remax-elite-real-estate.firebaseapp.com",
  projectId: "remax-elite-real-estate",
  storageBucket: "remax-elite-real-estate.firebasestorage.app",
  messagingSenderId: "866111421041",
  appId: "1:866111421041:web:e29d326cc8ee44b43cf9d0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`Starting Firestore sync for ${initialProperties.length} curated RE/MAX ELITE listings...`);
  for (const property of initialProperties) {
    const docRef = doc(db, "properties", property.id);
    await setDoc(docRef, property, { merge: true });
    console.log(`✓ Synchronized [${property.id}]: ${property.title}`);
  }

  const snap = await getDocs(collection(db, "properties"));
  console.log(`\n🎉 Success! Total documents in Firestore "properties" collection: ${snap.size}`);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
