import Homepage from "./Pages/HomePage";
import AllBlogsPage from "./Pages/AllBlogsPage";
import DashboardPage from "./Pages/DashboardPage";
import ErrorPage from "./Pages/ErrorPage";
import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import LoadingPage from "./Pages/LoadingPage";
import SignupPage from "./Pages/SignupPage";
import SigninPage from "./Pages/SigninPage";
import BlogFormPage from "./Pages/BlogFormPage";
import BlogPage from "./Pages/BlogPage"
import { Toaster } from "react-hot-toast";
import {userContext} from "./Context/UserContext";

function App() {
  const [loading, setLoading] = useState(true);
  const {user} = useContext(userContext)

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <Toaster
        toastOptions={{
          className: "toaster",

          success: {
            className: "success-toast",
          },

          error: {
            className: "error-toast",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route path="/blog" element={<AllBlogsPage />} />
        <Route path="/blog/create" element={<BlogFormPage />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />


        <Route path="/user" element={<DashboardPage />} />
        <Route path="/user/:userName" element={<DashboardPage />} />
        <Route path="/user/signup" element={<SignupPage />} />
        <Route path="/user/signin" element={<SigninPage />} />
        <Route path="/user/login" element={<SigninPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
