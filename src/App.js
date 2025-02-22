import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Home from "./pages/Homecopy";
import Post from "./post/Post";
import Admin from "./pages/Admin";
import Navbar from "./Navbar/Navbar";
import HeadInfo from "./HeadInfo/HeadInfo";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <HeadInfo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page/:pageNumber" element={<Home />} />
        <Route path="/:slug" element={<Post />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/admin/:slug" element={<Admin />} /> */}
      </Routes>
    </div>
  );
}

export default App;
