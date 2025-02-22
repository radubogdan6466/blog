import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { getCommentsBySlug } from "../firebase";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  login,
  logout,
  addPost,
  deletePost,
  updatePost,
  getPosts,
  auth,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Admin.css";
import CommentSection from "../pages/AdminComments";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
  imageResize: {
    parchment: false,
    modules: ["Resize", "DisplaySize"],
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const Admin = ({ postId }) => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [link, setLink] = useState(""); // Stare pentru a ține valoarea link-ului

  const quillRef = useRef(null);
  console.log("Admin page for:", slug);
  const [showComments, setShowComments] = useState(false); // Starea pentru comentarii

  useEffect(() => {}, [postId]);
  console.log("PostId încărcat:", postId);

  const fetchCommentsForPost = async (postId) => {
    const commentsData = await getCommentsBySlug(postId); // Modifică să ia comentariile per postare
    return commentsData;
  };

  useEffect(() => {
    if (postId) {
      fetchCommentsForPost();
    }
  }, [slug]);

  useEffect(() => {
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
    onAuthStateChanged(auth, (currentUser) => {
      console.log("Current User:", currentUser); // Debugging

      if (currentUser && currentUser.email === adminEmail) {
        console.log("User is admin");
        setUser(currentUser);
        fetchPosts();
      } else {
        console.log("User is NOT admin");
        setUser(null);
      }
    });
  }, []);

  const fetchPosts = async () => {
    const data = await getPosts();
    console.log("Postări primite:", data); // 🔍 Verifică postările și ID-urile
    console.log("Id postare 1:", data[0]?.id);

    setPosts(data);
  };
  console.log("Link înainte de addPost:", link); // Verificare crucială!

  const handleAddPost = async (e) => {
    e.preventDefault();

    await addPost(title, editorHtml, link, category); // Trimit doar parametrii necesari

    setTitle("");
    setEditorHtml("");
    setCategory(""); // Resetăm categoria
    fetchPosts();
    setLink(""); // Resetăm starea `link`
  };

  const handleDeletePost = async (id) => {
    await deletePost(id);
    fetchPosts();
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    // Folosim direct link-ul introdus, fără a încărca fișierul
    await updatePost(editId, editTitle, editorHtml);
    setEditId(null);
    setEditTitle("");
    setEditorHtml("");

    setIsEditMode(false); // Ieși din modul de editare
    fetchPosts();
  };
  // Funcția pentru a comuta vizibilitatea comentariilor
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  return (
    <div className="admin-container">
      {!user ? (
        <button className="admin-login-button" onClick={login}>
          Autentificare cu Google
        </button>
      ) : (
        <>
          <div className="admin-header">
            <h2>Admin Dashboard</h2>
            <button className="admin-logout-button" onClick={logout}>
              Deconectare
            </button>
          </div>
          {!isEditMode && (
            <form className="admin-form" onSubmit={handleAddPost}>
              <input
                type="text"
                placeholder="Titlu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                id="postLink" // ID-ul este încă necesar pentru a putea fi găsit de etichetă (label)
                placeholder="Link (opțional)"
                name="postLink"
                value={link} // Legăm input-ul de starea `link`
                onChange={(e) => setLink(e.target.value)} // Actualizăm starea la schimbarea input-ului
              />
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selectează o categorie</option>
                <option value="AI">AI</option>
                <option value="fun">fun</option>
                <option value="news">news</option>
                <option value="other">other</option>
              </select>
              <ReactQuill
                ref={quillRef}
                className="admin-editor"
                value={editorHtml}
                onChange={setEditorHtml}
                modules={modules}
                formats={formats}
              />
              <button className="admin-submit-button" type="submit">
                Adaugă postare
              </button>
            </form>
          )}
          <ul className="admin-posts-list">
            {posts &&
              posts.map((post) => (
                <li key={post.id} className="admin-post">
                  {/* Link către detalii postare */}
                  {editId === post.id ? (
                    <form
                      className="admin-edit-form"
                      onSubmit={handleUpdatePost}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />

                      <ReactQuill
                        ref={quillRef}
                        className="admin-editor"
                        value={editorHtml}
                        onChange={setEditorHtml}
                        modules={modules}
                        formats={formats}
                      />
                      <button type="submit">Salvează</button>
                    </form>
                  ) : (
                    <>
                      <h3>
                        {post.title} (ID: {post.id})
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      <div className="admin-post-actions">
                        <button
                          className="admin-post-delete-button"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Șterge
                        </button>
                        <button
                          className="admin-post-edit-button"
                          onClick={() => {
                            setEditId(post.id);
                            setEditTitle(post.title);
                            setEditorHtml(post.content);
                            setIsEditMode(true); // Setează edit mode activ
                          }}
                        >
                          Modifică
                        </button>
                        <button onClick={toggleComments}>
                          {showComments
                            ? "Ascunde comentarii"
                            : "Afișează comentarii"}
                        </button>
                        {/* Afiseaza comentariile pentru fiecare postare */}
                        {/* Dacă showComments este adevărat, afișăm CommentSection */}
                      </div>
                      {showComments && <CommentSection postId={post.id} />}{" "}
                    </>
                  )}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Admin;
