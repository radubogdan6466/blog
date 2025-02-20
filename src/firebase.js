import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  orderBy,
  query,
  arrayUnion,
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
import "firebase/database"; // or "firebase/firestore"

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
const firestore = getFirestore(app); // For firestore

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
      likes: 0,
      category: "",
      comments: [],
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
  // Creăm o interogare care sortează postările după data de creare, în ordine descrescătoare (cele mai recente postări la început)
  const postsQuery = query(postsCol, orderBy("createdAt", "desc"));
  const postsSnapshot = await getDocs(postsQuery);
  const postsList = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return postsList;
};

//This is working perfectly
// const addComment = async (postId, comment) => {
//   console.log("Comentariul:", comment); // Verifică dacă structura este corectă
//   try {
//     const postRef = doc(db, "posts", postId);
//     // Adaugă comentariul în array-ul 'comments' din Firebase
//     await updateDoc(postRef, {
//       comments: arrayUnion({
//         id: uuidv4(), // Generează un ID unic
//         text: comment.comment, // Folosește 'comment.comment' pentru text
//         author: comment.name, // Folosește 'comment.name' pentru author
//         createdAt: new Date(), // Folosește un timestamp pentru createdAt
//       }),
//     });
//   } catch (e) {
//     console.error("Eroare la adăugarea comentariului:", e);
//   }
// };
const addComment = async (postId, comment) => {
  console.log("Comentariul:", comment);
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment), // Nu mai generezi alt ID aici!
    });
  } catch (e) {
    console.error("Eroare la adăugarea comentariului:", e);
  }
};
const getComments = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId); // Ref la postarea cu postId
    const postSnap = await getDoc(postRef); // Obține documentul

    if (postSnap.exists()) {
      return postSnap.data().comments; // Returnează comentariile din postare
    } else {
      console.log("Postarea nu există!");
      return [];
    }
  } catch (e) {
    console.error("Eroare la obținerea comentariilor:", e);
    return [];
  }
};

// const getComments = async (postId) => {
//   try {
//     const commentsRef = firebase.database().ref(`posts/${postId}/comments`); // Adjust path as needed
//     const snapshot = await commentsRef.once("value");
//     const commentsData = snapshot.val();

//     if (commentsData) {
//       // Transform the object into an array with IDs
//       const commentsArray = Object.entries(commentsData).map(
//         ([id, comment]) => ({
//           id: id, // The Firebase key becomes the comment's ID
//           ...comment, // Spread the rest of the comment data
//         })
//       );
//       return commentsArray;
//     } else {
//       return []; // Return empty array if no comments
//     }
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return []; // Return empty array in case of error
//   }
// };

//reply function begin
const addReply = async (postId, commentId, reply) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      console.log("Postarea nu există!");
      return;
    }

    const postData = postSnap.data();
    const updatedComments = postData.comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    );

    await updateDoc(postRef, {
      comments: updatedComments,
    });
  } catch (e) {
    console.error("Eroare la adăugarea răspunsului:", e);
  }
};

//reply function end

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
  addComment,
  getComments,
  addReply,
}; // Exportă și getPosts
