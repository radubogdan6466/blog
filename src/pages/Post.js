//Post.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosts } from "../firebase";
import RecentPosts from "../components/RecentPosts";
import PopularSevenDays from "../components/PopularSevenDays";
import UseIncrementViews from "../components/useIncrementViews"; // Importă hook-ul
import PostNavigation from "../components/PostNavigation"; // Importă componenta de navigare
import CommentSection from "../components/CommentSection";
import "./Post.css";

function Post() {
  const { slug } = useParams(); // Extrage slug-ul din URL
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]); // Stare pentru postările recente
  //views
  UseIncrementViews(post);

  // Dacă data este de tip Timestamp în Firebase
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();

    const dateOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("ro-RO", dateOptions);
    const formattedTime = date.toLocaleTimeString("ro-RO", timeOptions);

    return `${formattedDate}, ${formattedTime}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      const posts = await getPosts(); // Obține toate postările
      const foundPost = posts.find((p) => generateSlug(p.title) === slug); // Căutăm postarea care se potrivește cu slug-ul

      if (foundPost) {
        console.log("ID-ul postării găsite:", foundPost.id); // Afișează ID-ul postării
        setPost(foundPost); // Dacă găsim postarea, o setăm în starea componentului
      } else {
        setPost(null); // Dacă nu găsim, setăm post null
      }

      // Logica pentru postările recente (primele 3 postări)
      const recent = posts.slice(0, 3);
      setRecentPosts(recent);
    };

    fetchPost();
  }, [slug]);

  // Funcția pentru a crea slug-ul
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  if (!post) {
    return <div>Postarea nu a fost găsită</div>; // Mesaj dacă postarea nu este găsită
  }
  const convertUrlsToImages = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+(\.jpg|\.jpeg|\.png|\.gif))/gi;
    return content.replace(urlRegex, (match) => {
      return `<img src="${match}" alt="Image" />`;
    });
  };

  return (
    <div className="containerHome">
      <div className="blog">
        <div className="posts-container-postjs">
          {/* <div className="PrevNextPostjs">
            <p>Previous</p>
            <p>Next</p>
          </div> */}
          <PostNavigation currentSlug={slug} />

          <div className="blog-post">
            <hr className="hrpostjs" />
            <div>
              <div className="divPostTitlePostjs">
                <h2 className="PostTitlePostjs">{post.title}</h2>
              </div>
              <div className="UnderTitlePostjs">
                <div className="autorPostjs">
                  Autor: <p className="autor">Bogdan</p>
                </div>
                <p className="data">{formatDate(post.createdAt)}</p>
                <p className="views"> 👁 {post.views} </p>
                <p className="comments"> 💬 21 </p>
              </div>
            </div>

            {/* Aici folosim dangerouslySetInnerHTML pentru a permite HTML în content */}
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: convertUrlsToImages(post.content),
              }}
            />
          </div>
          <hr className="hrabovecommentsection" />
          <CommentSection postId={post.id} />
        </div>
      </div>
      <div className="right-some-container">
        <div className="recent-posts-container">
          {recentPosts.length > 0 && <RecentPosts posts={recentPosts} />}{" "}
        </div>
        <div className="popular-seven-days-container">
          <PopularSevenDays />
        </div>
      </div>
    </div>
  );
}

export default Post;
