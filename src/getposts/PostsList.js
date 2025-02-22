import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "./postsSlice";
import Pagination from "../components/Pagination";

const PostsList = () => {
  const dispatch = useDispatch();
  const { items: posts, status } = useSelector((state) => state.posts);
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const currentPage = parseInt(pageNumber) || 1; // Pagină implicită: 1
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    console.time("Load Time With Redux"); // Începe măsurarea timpului

    if (status === "idle") {
      dispatch(fetchPosts());
    }

    // Închide timerul după ce datele sunt obținute din Redux
    return () => {
      if (status !== "loading") {
        console.timeEnd("Load Time With Redux"); // Închide timerul
      }
    };
  }, [status, dispatch]);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Transformă timestamp-ul (în secunde) într-un obiect Date
    const options = {
      weekday: "long", // ziua săptămânii
      year: "numeric", // an
      month: "long", // luna
      day: "numeric", // ziua
      hour: "2-digit", // ora
      minute: "2-digit", // minutul
    };
    return date.toLocaleString("ro-RO", options); // Formatează data în română
  };

  if (status === "loading") return <p>Se încarcă...</p>;
  if (status === "failed") return <p>Eroare la încărcare!</p>;
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };
  const handleReadMore = (slug) => {
    navigate(`/${slug}`);
  };
  const removeHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };
  const getPreviewText = (text) => {
    const words = text.split(" ");
    if (words.length > 20) {
      // Am mărit numărul de cuvinte pentru preview
      return words.slice(0, 20).join(" ") + "...";
    }
    return text;
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
    <div className="blog">
      <div className="posts-container-homejs">
        {posts && posts.length > 0 ? (
          currentPosts.map((post) => (
            <div className="blog-post" key={post.id}>
              <div className="post-imageHomejs">
                <img
                  className="postHomeImg"
                  src={
                    post.link ||
                    "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
                  }
                  alt={post.title}
                  onClick={() => handleReadMore(generateSlug(post.title))}
                />
              </div>

              <div className="dateviewshomejs">
                <p className="datee">{formatDate(post.createdAt)}</p>
                <p className="viewss"> 👁 {post.views} </p>
                <p className="category"> [{post.category}]</p>
              </div>
              <h2
                className="post-title"
                onClick={() => handleReadMore(generateSlug(post.title))}
              >
                {post.title}
              </h2>
              <div className="content">
                <p>{getPreviewText(removeHtmlTags(post.content))}</p>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>Nu sunt postări disponibile.</p>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(posts.length / postsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PostsList;
