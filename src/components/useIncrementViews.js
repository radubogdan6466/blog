// hooks/useIncrementViews.js
import { useEffect } from "react";
import Cookies from "js-cookie"; // Importă librăria pentru cookies
import { incrementView } from "../firebase"; // Importă funcția corectă pentru a incrementa vizualizarea

const useIncrementViews = (post) => {
  useEffect(() => {
    if (post) {
      const viewedKey = `viewed_${post.id}`;

      // Verifică dacă postarea a fost deja vizualizată folosind cookies
      if (!Cookies.get(viewedKey)) {
        // Înregistrează vizualizarea pe server
        incrementView(post.id); // Trimiți cererea către server pentru a incrementa vizualizarea

        // Marchez postarea ca vizualizată pe client printr-un cookie
        Cookies.set(viewedKey, "true", { expires: 365 }); // Expiră după 1 an (sau alegi ce perioadă dorești)
      }
    }
  }, [post]);
};

export default useIncrementViews;
