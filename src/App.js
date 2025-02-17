import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Home from "./pages/Homecopy";
import Post from "./pages/Post";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page/:pageNumber" element={<Home />} />
        <Route path="/:slug" element={<Post />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
