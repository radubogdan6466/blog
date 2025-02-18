// hooks/useIncrementViews.js
import { useEffect } from "react";
import { incrementView } from "../firebase"; // Importă funcția incrementView

const UseIncrementViews = (post) => {
  useEffect(() => {
    if (post) {
      const viewedKey = `viewed_${post.id}`;

      if (!sessionStorage.getItem(viewedKey)) {
        incrementView(post.id);
        sessionStorage.setItem(viewedKey, "true"); // Marchez postarea ca vizualizată
      }
    }
  }, [post]);
};

export default UseIncrementViews;
