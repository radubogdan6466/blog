import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../firebase";

const PostNavigation = ({ currentSlug }) => {
  const [posts, setPosts] = useState([]);
  const [previousPost, setPreviousPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPosts(); // Obține toate postările
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const currentIndex = posts.findIndex(
        (post) => generateSlug(post.title) === currentSlug
      );

      if (currentIndex !== -1) {
        setPreviousPost(posts[currentIndex + 1]); // Inversează ordinea: nextPost devine previous
        setNextPost(posts[currentIndex - 1]); // Inversează ordinea: previousPost devine next
      }
    }
  }, [posts, currentSlug]);

  // Funcția pentru a crea slug-ul
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  return (
    <div className="PrevNextPostjs">
      <p>
        {previousPost ? (
          <Link to={`/${generateSlug(previousPost.title)}`}>Previous</Link>
        ) : (
          ""
        )}
      </p>
      <p>
        {nextPost ? (
          <Link to={`/${generateSlug(nextPost.title)}`}>Next</Link>
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

export default PostNavigation;
