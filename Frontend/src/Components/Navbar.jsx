import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../Context/UserContext";

function Navbar() {
  const themeValue = localStorage.getItem("inkora_theme") || "dark";

  const { user, logout, loadingUser } = useContext(userContext);
  const [theme, setTheme] = useState(themeValue);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("inkora_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!accountRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
        setIsThemeMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const changeTheme = (preference) => {
    setTheme(preference);
    setIsThemeMenuOpen(false);
  };

  const handleAccountMenu = () => {
    setIsMenuOpen((value) => !value);
    setIsThemeMenuOpen(false);
  };

  const handleThemeMenu = () => {
    setIsThemeMenuOpen((value) => !value);
  };

  return (
    <nav className="navbar" id="mainNavbar">
      <a href="/" className="logo">
        <div className="logo-icon">I</div>
        INKORA
      </a>

      {loadingUser ? (
        <p>Fetching User Details...</p>
      ) : (
        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/user/login">
                <button className="login-btn">Log in</button>
              </Link>

              <Link to="/user/signup">
                <button className="signup-btn">Sign up</button>
              </Link>
            </>
          ) : (
            // Account Information

            <div className="account" ref={accountRef}>
              <button
                type="button"
                className="account-btn"
                id="accountBtn"
                onClick={handleAccountMenu}
                aria-expanded={isMenuOpen}
                aria-controls="accountMenu"
                aria-label="Open account menu"
              >
                <img
                  src={user.profilePicture}
                  alt="Profile picture"
                  className="profilepic"
                />
              </button>

              <div className={`account-menu${isMenuOpen ? " active" : ""}`} id="accountMenu">
                <Link
                  to="/"
                  style={{ fontWeight: 700, color: "var(--text-primary)" }}
                  className="menu-link"
                >
                  <span style={{ marginRight: 8 }}>👤</span>
                  {user.userName}
                </Link>
                <Link
                  to="/user"
                  style={{ fontWeight: 700, color: "var(--text-primary)" }}
                  className="menu-link"
                >
                  <span style={{ marginRight: 8 }}>💹</span>
                  Dashboard
                </Link>

                {/* APPEARANCE DROPDOWN */}

                <div className="theme-dropdown-wrapper">
                  <button
                    type="button"
                    className="theme-toggle-btn"
                    id="appearanceBtn"
                    onClick={handleThemeMenu}
                    aria-expanded={isThemeMenuOpen}
                    aria-controls="themeSubmenu"
                  >
                    <span className="theme-toggle-label">
                      <span style={{ marginRight: 8 }}>🌓</span>
                      Appearance
                    </span>
                    <span className="menu-arrow" id="appearanceArrow">
                      ›
                    </span>
                  </button>

                  <div className={`theme-submenu${isThemeMenuOpen ? " active" : ""}`} id="themeSubmenu">
                    <button
                      type="button"
                      className="theme-option"
                      onClick={() => changeTheme("light")}
                      data-theme-value="light"
                      id="themeLightBtn"
                    >
                      <span className="theme-option-left">
                        <span className="theme-option-icon">☀️</span>
                        <span>Light</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="theme-option"
                      onClick={() => changeTheme("dark")}
                      data-theme-value="dark"
                      id="themeDarkBtn"
                    >
                      <span className="theme-option-left">
                        <span className="theme-option-icon">🌙</span>
                        <span>Dark</span>
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="menu-link"
                >
                  <span style={{ marginRight: 8 }}>🚪</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
