import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "./Navbar.css"; // Importăm fișierul CSS

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Starea pentru search
  const searchRef = useRef(null); // Referință pentru input-ul de căutare
  const searchIconRef = useRef(null); // Referință pentru icon-ul de căutare

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen); // Schimbăm starea input-ului de căutare
  };

  // Event handler pentru a închide căutarea atunci când se face clic oriunde pe ecran
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !searchIconRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="Navbar">
      <div className="navbar-container">
        {/* Meniul din stânga */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <span>Menu</span>
        </div>

        {/* Meniu hamburger */}
        <div className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>Prima pagina</li>
            <li>Despre</li>
            <li>Something #1</li>
            <li>Something #2</li>
            <li>Something #3</li>
          </ul>
        </div>

        {/* Căutare și iconițe în dreapta */}
        <div className="right-side">
          <div className="social-icons">
            <FontAwesomeIcon icon={faTwitter} className="social-icon" />
            <FontAwesomeIcon icon={faInstagram} className="social-icon" />
            <FontAwesomeIcon icon={faYoutube} className="social-icon" />
            <FontAwesomeIcon icon={faTiktok} className="social-icon" />
          </div>
          <div className="search-container">
            <div>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                className={`search ${isSearchOpen ? "open" : ""}`}
              />
            </div>

            {/* Iconul de search */}
            <FontAwesomeIcon
              ref={searchIconRef}
              icon={faMagnifyingGlass}
              className="search-icon"
              onClick={toggleSearch} // Apelăm funcția pentru a deschide input-ul
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
