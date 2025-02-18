import { useEffect, useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
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
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

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

function Admin() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  // Vom folosi această stare pentru a reține link-ul imaginii
  const [imageUrl, setImageUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const quillRef = useRef(null);

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
    setPosts(data);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString(); // Creați un timestamp pentru fiecare postare
    await addPost(title, editorHtml, imageUrl, timestamp); // Adăugați timestamp-ul la adăugarea postării
    setTitle("");
    setEditorHtml("");
    setImageUrl("");
    fetchPosts();
  };

  const handleDeletePost = async (id) => {
    await deletePost(id);
    fetchPosts();
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    // Folosim direct link-ul introdus, fără a încărca fișierul
    await updatePost(editId, editTitle, editorHtml, imageUrl);
    setEditId(null);
    setEditTitle("");
    setEditorHtml("");
    setImageUrl("");
    setIsEditMode(false); // Ieși din modul de editare
    fetchPosts();
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
                placeholder="Linkul imaginii"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ maxWidth: "200px" }}
                />
              )}

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
                      <input
                        type="text"
                        placeholder="Linkul imaginii"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          style={{ maxWidth: "200px" }}
                        />
                      )}
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
                      <h3>{post.title}</h3>
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          style={{ maxWidth: "200px" }}
                        />
                      )}
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
                            setImageUrl(post.imageUrl);
                            setIsEditMode(true); // Setează edit mode activ
                          }}
                        >
                          Modifică
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Admin;
