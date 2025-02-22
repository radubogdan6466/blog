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
  where,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getStorage } from "firebase/storage"; // Importăm modulul storage
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

const addPost = async (title, content, link, category) => {
  try {
    const slug = generateSlug(title);

    await addDoc(collection(db, "posts"), {
      title,
      slug,
      content,
      link: link, // Aici adaugi link-ul în câmpul 'link'
      likes: 0,
      category,
      comments: [],
      createdAt: new Date(),
      views: 0,
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
const updatePost = async (id, newTitle, newContent) => {
  try {
    await updateDoc(doc(db, "posts", id), {
      title: newTitle,
      content: newContent,
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

export const getCommentsBySlug = async (slug) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().comments || [];
  } else {
    return [];
  }
};
export const getRepliesBySlug = async (slug) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().replies || [];
  } else {
    return [];
  }
};
export const deleteComment = async (postId, commentId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const updatedComments = postData.comments.filter(
        (comment) => comment.id !== commentId
      );

      await updateDoc(postRef, { comments: updatedComments });
    }
  } catch (error) {
    console.error("Eroare la ștergerea comentariului:", error);
  }
};

export const deleteReply = async (postId, commentId, replyId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const updatedComments = postData.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            }
          : comment
      );

      await updateDoc(postRef, { comments: updatedComments });
    }
  } catch (error) {
    console.error("Eroare la ștergerea răspunsului:", error);
  }
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
  addComment,
  getComments,
  addReply,
}; // Exportă și getPosts
