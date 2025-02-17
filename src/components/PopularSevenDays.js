import React, { useEffect, useState } from "react";
import { getPosts } from "../firebase"; // Importă funcția getPosts
import { Link } from "react-router-dom"; // Importă Link pentru a crea legătura către postare
import "./right.css";
import { Timestamp } from "firebase/firestore";

function PopularSevenDays() {
  const [recentPosts, setRecentPosts] = useState([]);

  // Funcția care actualizează lista celor mai recente postări
  const fetchRecentPosts = async () => {
    const fetchedPosts = await getPosts(); // Obține postările din Firebase
    setRecentPosts(fetchedPosts.slice(0, 5)); // Alege primele 5 postări
  };

  useEffect(() => {
    fetchRecentPosts(); // Inițial, obține postările când se încarcă componenta
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      const options = { year: "numeric", month: "long", day: "numeric" }; // Configurare format
      return date.toLocaleDateString("ro-RO", options); // Formatează data
    } else {
      console.error("createdAt nu este un Timestamp:", timestamp);
      return "Dată invalidă";
    }
  };

  return (
    <div className="recent-posts">
      <div className="title-popular-seven">
        <h2>Top articole</h2>
        <h3 className="sevendayshastrei">7 zile</h3>
      </div>
      <hr />
      <ul>
        {recentPosts.map((post) => (
          <li key={post.id}>
            <div className="post-img-title">
              <Link
                to={`/${generateSlug(post.title)}`} // Schimbă '/post/' cu '/'
                className="link-post"
              >
                <div className="post-img-container">
                  <img
                    className="post-img"
                    src="https://zoso.ro/img/2024/03/idiot-head-hurts-30-100x100.jpg"
                    alt={post.title}
                  />
                </div>
              </Link>
              <div className="post-title-container">
                <Link
                  to={`/${generateSlug(post.title)}`} // Schimbă '/post/' cu '/'
                  className="link-post"
                >
                  <h3 className="post-title">{post.title}</h3>
                </Link>
                <p className="post-date">{formatDate(post.createdAt)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularSevenDays;
