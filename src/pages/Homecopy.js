import React from "react";
import "./Homecopy.css";
import RecentPosts from "../components/RecentPosts";
import PopularSevenDays from "../components/PopularSevenDays";
import PostsList from "../getposts/PostsList";
function Home() {
  return (
    <div className="containerHome">
      <PostsList />
      <div className="right-some-container">
        <div className="recent-posts-container">
          <RecentPosts />
        </div>
        <div className="popular-seven-days-container">
          <PopularSevenDays />
        </div>
      </div>
    </div>
  );
}

export default Home;
