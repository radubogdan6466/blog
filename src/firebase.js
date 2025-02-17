import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  increment,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; // Importăm modulul storage

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "blog-12500.firebaseapp.com",
  projectId: "blog-12500",
  storageBucket: "blog-12500.firebasestorage.app",
  messagingSenderId: "917302715380",
  appId: "1:917302715380:web:98775a72d20b2b0c58cfa1",
  measurementId: "G-HQB5Q69CP6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app); // Inițializăm serviciul de storage

// Funcție pentru a adăuga un post

// Funcție pentru autentificare
const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Eroare autentificare:", error);
  }
};

// Funcție pentru delogare
const logout = async () => {
  await signOut(auth);
};
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};
const addPost = async (title, content, image) => {
  try {
    const slug = generateSlug(title);
    let imageUrl = null; // Inițializăm URL-ul imaginii la null

    if (image) {
      // Verificăm dacă a fost selectată o imagine
      const storageRef = ref(storage, `images/${image.name}`); // Referință la fișier în storage
      const uploadTask = uploadBytesResumable(storageRef, image); // Upload cu progres

      await new Promise((resolve, reject) => {
        // Promisiune pentru a aștepta finalizarea upload-ului
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Opțional: Afișează progresul upload-ului
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Eroare la upload:", error);
            reject(error);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref); // Obținem URL-ul după finalizare
            resolve();
          }
        );
      });
    }
    await addDoc(collection(db, "posts"), {
      title,
      slug,
      content,
      imageUrl, // Salvăm URL-ul imaginii (sau null)
      createdAt: new Date(),
      views: 0, // Inițializăm vizualizările
    });
  } catch (e) {
    console.error("Eroare la adăugarea documentului:", e);
  }
};
const incrementView = async (postId) => {
  const postRef = doc(db, "posts", postId);
  try {
    await updateDoc(postRef, {
      views: increment(1), // Folosește `increment` corect
    });
  } catch (e) {
    console.error("Eroare la incrementarea vizualizărilor:", e);
  }
};
// Funcție pentru ștergere postare
const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, "posts", id));
  } catch (e) {
    console.error("Eroare la ștergere:", e);
  }
};

// Funcție pentru actualizare postare
const updatePost = async (id, newTitle, newContent, image) => {
  // Parametru nou: image
  try {
    let imageUrl = null;

    if (image) {
      // Verificăm dacă a fost selectată o imagine
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Eroare la upload:", error);
            reject(error);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }

    await updateDoc(doc(db, "posts", id), {
      title: newTitle,
      content: newContent,
      imageUrl, // Actualizăm URL-ul imaginii (sau null)
      updatedAt: new Date(),
    });
  } catch (e) {
    console.error("Eroare la modificare:", e);
  }
};

// Funcție pentru a obține toate postările
const getPosts = async () => {
  const postsCol = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCol);
  const postsList = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return postsList;
};

export {
  app,
  db,
  auth,
  login,
  logout,
  deletePost,
  updatePost,
  addPost,
  getPosts,
  analytics,
  storage,
  increment,
  incrementView,
}; // Exportă și getPosts
