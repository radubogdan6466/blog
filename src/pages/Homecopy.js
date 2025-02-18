import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts } from "../firebase";
import "./Homecopy.css";
import RecentPosts from "../components/RecentPosts";
import PopularSevenDays from "../components/PopularSevenDays";
import Pagination from "../components/Pagination";
function Home() {
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]); // Stare pentru postările recente
  const [popularPosts, setPopularPosts] = useState([]); // Stare pentru postările populare
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(pageNumber) || 1; // Pagină implicită: 1
  const postsPerPage = 3;

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const options = {
      weekday: "long", // ziua săptămânii
      year: "numeric", // an
      month: "long", // luna
      day: "numeric", // ziua
      hour: "2-digit", // ora
      minute: "2-digit", // minutul
    };
    return date.toLocaleString("ro-RO", options); // Formatează data conform opțiunilor și în limba română
  };

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      const sortedPosts = fetchedPosts.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      );
      setPosts(sortedPosts);

      // Logica pentru a obține postările recente și populare (exemplu)
      const recent = sortedPosts.slice(0, 3); // Primele 3 postări sunt considerate recente
      const popular = sortedPosts.filter((post) => post.likes > 10); // Postările cu peste 10 like-uri sunt populare (exemplu)

      setRecentPosts(recent);
      setPopularPosts(popular);
    } catch (error) {
      console.error("Eroare la preluarea postărilor:", error);
    }
  };

  // Folosește useEffect pentru a apela fetchPosts doar o dată, la montare
  useEffect(() => {
    fetchPosts();
  }, []); // Array gol => se execută o singură dată la montare

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const getPreviewText = (text) => {
    const words = text.split(" ");
    if (words.length > 20) {
      // Am mărit numărul de cuvinte pentru preview
      return words.slice(0, 20).join(" ") + "...";
    }
    return text;
  };

  const handleReadMore = (slug) => {
    navigate(`/${slug}`);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const removeHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };
  const handlePageChange = (newPage) => {
    if (newPage === 1) {
      navigate("/"); // Pagina 1 → Navighează la "/"
    } else {
      navigate(`/page/${newPage}`); // Orice altă pagină → Navighează la "/page/{număr}"
    }
    window.scrollTo(0, 0); // Duce pagina în sus
  };
  return (
    <div className="containerHome">
      <div className="blog">
        <div className="posts-container-homejs">
          {currentPosts.map((post) => (
            <div className="blog-post" key={post.id}>
              <div className="post-imageHomejs">
                <img
                  className="postHomeImg"
                  src="https://zoso.ro/img/2025/02/artificial-intelligence-2-720x300.jpg"
                  alt={post.title}
                  onClick={() => handleReadMore(generateSlug(post.title))}
                />
              </div>
              <h2
                className="post-title"
                onClick={() => handleReadMore(generateSlug(post.title))}
              >
                {post.title}
              </h2>
              <p className="date">{formatDate(post.createdAt)}</p>
              <div className="content">
                <p>{getPreviewText(removeHtmlTags(post.content))}</p>
                <button
                  onClick={() => handleReadMore(generateSlug(post.title))}
                >
                  Citește mai mult
                </button>
              </div>
              <hr />
            </div>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(posts.length / postsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <div className="right-some-container">
        <div className="recent-posts-container">
          {recentPosts.length > 0 && <RecentPosts posts={recentPosts} />}
        </div>
        <div className="popular-seven-days-container">
          <PopularSevenDays posts={popularPosts} />
        </div>
      </div>
    </div>
  );
}

export default Home;
