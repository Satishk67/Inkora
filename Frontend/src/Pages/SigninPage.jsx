import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hide as HideIcon, show as ShowIcon } from "../Components/password";
import { userContext } from "../Context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

function SigninPage({ msg = "" }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [backendMsg, setbackendMsg] = useState(msg);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(userContext);
  const go = useNavigate();

  const togglePassword = () => {
    setIsPasswordVisible((visible) => !visible);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setbackendMsg("");
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const response = await axios.post("/api/user/login", data);
      const user = response.data.user;
      if (!user) {
        throw new Error(response.data.msg || "Unable to sign in");
      }
      setUser(user);
      toast.success(`Welcome back, ${user.userName}! Great to see you again. ✨`);
      go(-1);
    } catch (err) {
      setbackendMsg(
        err.response?.data?.msg || err.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="login-orb login-orb-1"></div>
      <div className="login-orb login-orb-2"></div>
      <div className="login-orb login-orb-3"></div>

      <div className="container signin-page">
        {/* LEFT SIDE */}

        <section className="branding">
          <div className="logo">
            <div className="logo-icon">I</div>
            INKORA
          </div>

          <div className="branding-content">
            <h1>
              Welcome
              <br />
              <span>back.</span>
            </h1>

            <p>
              Continue discovering ideas, stories, and perspectives from people
              around the world.
            </p>
          </div>

          <div className="quote">
            "A reader lives a thousand lives before they die. The person who
            never reads lives only one."
          </div>
        </section>

        {/* LOGIN FORM */}

        <section className="form-section">
          <h2>Welcome back 👋</h2>

          {backendMsg && <p className="subtitle-msg">{backendMsg}</p>}

          <p className="subtitle">Sign in to continue your journey</p>

          <form
            id="loginForm"
            action="/api/user/login"
            method="POST"
            onSubmit={formSubmitHandler}
          >
            {/* IDENTIFIER */}

            <div className="input-group">
              <label>Email or Username</label>

              <input
                type="text"
                id="identifier"
                name="identifier"
                placeholder="Enter your email or username"
                required
                autoComplete="username"
              />
            </div>

            {/* PASSWORD */}

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "52px" }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePassword}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {isPasswordVisible ? <HideIcon /> : <ShowIcon />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}

            <button type="submit" className="login-btn" id="loginBtn" disabled={isSubmitting}>
              {!isSubmitting ? "Log in to INKORA →" : "Logging in..."}
            </button>
          </form>

          <div className="divider">OR</div>

          <p className="signup-text">
            New to INKORA?
            <Link to="/user/signup">Create an account</Link>
          </p>
        </section>
      </div>
    </>
  );
}

export default SigninPage;
