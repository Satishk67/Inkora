import { useContext, useRef, useState } from "react";
import { hide as HideIcon, show as ShowIcon } from "../Components/password";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../Context/UserContext";
import axios from "axios";

function SignupPage({ msg = "" }) {

  const [backendMsg,setbackendMsg] = useState(msg);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const usernameCheckTimeout = useRef(null);
  const profileInputRef = useRef(null);
  const { setUser } = useContext(userContext);
  const go = useNavigate();

  const togglePassword = () => {
    setIsPasswordVisible((visible) => !visible);
  };

  const pwdAndUserNameValidation = (input, msgBox) => {
    if (input == "") {
      msgBox.textContent = "Fill me !!";
      msgBox.style.color = "#f43f5e";
      return false;
    }

    if (input.includes(" ")) {
      msgBox.textContent = "Spaces are not allowed!";
      msgBox.style.color = "#f43f5e";
      return false;
    }

    if (input.length > 15 || input.length < 8) {
      msgBox.textContent = "length must be within 8-15 range!";
      msgBox.style.color = "#f43f5e";
      return false;
    }

    if (!/\d/.test(input)) {
      msgBox.textContent = "Must have atleast one numeric value!";
      msgBox.style.color = "#f43f5e";
      return false;
    }

    msgBox.textContent = "Kudos! Good to go";
    msgBox.style.color = "#22c55e";

    return true;
  };

  function updatePasswordStrength(pwd) {
    const passwordStrengthBar = document.getElementById("passwordStrengthBar");
    if (!passwordStrengthBar) return;

    let strength = 0;

    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;

    strength = Math.min(strength, 100);

    passwordStrengthBar.style.width = strength + "%";

    if (strength <= 25) {
      passwordStrengthBar.style.background = "#f43f5e";
    } else if (strength <= 50) {
      passwordStrengthBar.style.background = "#fb923c";
    } else if (strength <= 75) {
      passwordStrengthBar.style.background = "#facc15";
    } else {
      passwordStrengthBar.style.background =
        "linear-gradient(90deg, #22c55e, #4ade80)";
    }
  }

  const validatePassword = (e) => {
    const passwordMsg = document.getElementById("passwordMsg");
    pwdAndUserNameValidation(e.target.value.trim(), passwordMsg);
    updatePasswordStrength(e.target.value.trim());
  };

  const validateUserName = (e) => {
    const userNameMsg = document.getElementById("usernameMsg");
    const input = e.target.value.trim();
    clearTimeout(usernameCheckTimeout.current);

    if (!pwdAndUserNameValidation(input, userNameMsg)) return;

    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/user/checkuser/${encodeURIComponent(input)}`);
        const data = response.data;
        userNameMsg.textContent = data.msg;
        userNameMsg.style.color = data.color === "red" ? "#f43f5e" : "#22c55e";
      } catch {
        userNameMsg.textContent = "Unable to check username";
        userNameMsg.style.color = "#f43f5e";
      }
    }, 1000);
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024*1024){
      alert("File size is more than the limit.")
      return ;
    }
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(null);
    if (profileInputRef.current) profileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);
    setbackendMsg("");
    const data = new FormData(e.currentTarget);

    try{
      const response = await axios.post("/api/user/signup", data);
      const user = response.data.user;
      const msg = response.data.msg;
      if(!user){
        throw new Error(msg || "Unable to create your account");
      }
      e.currentTarget.reset();
      setProfilePreview(null);
      setUser(user);
      toast.success(`Welcome to Inkora, ${user.userName} ✨`);
      go(-1);
    }
    catch(err){
      setbackendMsg(
        err.response?.data?.msg || err.message || "Unable to create your account. Please try again.",
      );
    }
    finally{
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="container">
        {/* BRANDING SECTION */}

        <section className="branding">
          <div className="logo">
            <div className="logo-icon">I</div>
            INKORA
          </div>

          <div>
            <h1>
              Start your
              <br />
              <span>story.</span>
            </h1>

            <p>
              Join a community of writers, thinkers and curious minds sharing
              ideas with the world.
            </p>
          </div>

          <ul className="benefits">
            <li>✍ Publish your stories</li>

            <li>🌍 Reach curious readers</li>

            <li>💡 Discover new ideas</li>
          </ul>
        </section>

        {/* SIGNUP FORM */}

        <section className="form-section">
          <h2>Create your account 🚀</h2>

          {backendMsg && <p className="subtitle-msg">{backendMsg}</p>}

          <form
            id="signupForm"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <fieldset disabled={isSubmitting}>

              {/* PROFILE IMAGE */}

              <div className="profile-upload">
                <button
                  type="button"
                  className="profile-preview"
                  id="profilePreview"
                  onClick={() => profileInputRef.current?.click()}
                  aria-label="Choose profile picture"
                >
                  {profilePreview ? <img src={profilePreview} alt="Profile preview" /> : "👤"}
                  <div className="upload-overlay">📷</div>
                </button>

                <div className="upload-info">
                  <div className="upload-actions">
                    <label htmlFor="profilePicture" className="upload-btn">
                      Upload profile picture
                    </label>
                    {profilePreview && (
                      <button type="button" className="remove-upload-btn" onClick={removeProfileImage}>
                        Remove
                      </button>
                    )}
                  </div>

                  <span className="upload-hint">JPG, PNG up to 5MB</span>

                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/png, image/jpeg, image/webp"
                    hidden
                    ref={profileInputRef}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                {/* FULL NAME  */}

                <div className="input-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Rohit Kumar"
                    required
                  />
                </div>

                {/* USERNAME */}

                <div className="input-group">
                  <label>
                    Username{" "}
                    <span id="usernameMsg" className="backend-msg"></span>
                  </label>

                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="dynamic578"
                    onChange={validateUserName}
                    required
                  />
                </div>

                {/* EMAIL*/}

                <div className="input-group full">
                  <label>
                    Email Address{" "}
                    <span id="emailMsg" className="backend-msg"></span>
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/*  GENDER */}

                <div className="input-group">
                  <label>Gender</label>

                  <select id="gender" name="gender" required>
                    <option value="">Select gender</option>

                    <option value="Male">Male</option>

                    <option value="Female">Female</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* PASSWORD */}

                <div className="input-group">
                  <label>
                    Password{" "}
                    <span id="passwordMsg" className="backend-msg"></span>
                  </label>

                  <div className="input-wrapper">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Create password"
                      onChange={validatePassword}
                      required
                      />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePassword}
                      >
                      {isPasswordVisible ? <HideIcon /> : <ShowIcon />}
                    </button>
                  </div>

                  {/* PASSWORD STRENGTH BAR */}
                  <div className="password-strength">
                    <div
                      className="password-strength-bar"
                      id="passwordStrengthBar"
                    ></div>
                  </div>
                </div>
              </div>

              {/* SIGNUP */}

              <button type="submit" className="signup-btn" id="signupBtn">
                {
                  (!isSubmitting) ? ("Create INKORA Account →") : ("Creating Account...")
                }
              </button>
            </fieldset>
          </form>

          <p className="login-text">
            Already have an account?
            <Link to="/user/login">Log in</Link>
          </p>
        </section>
      </div>
    </>
  );
}

export default SignupPage;
