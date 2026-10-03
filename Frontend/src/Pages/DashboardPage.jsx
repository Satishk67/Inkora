import { Link, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import BlogCard from "../Components/BlogCard";
import { userContext } from "../Context/UserContext";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import axios from "axios";

function DashboardPage() {
  const { userName } = useParams();
  const { user, loadingUser } = useContext(userContext);
  const [blogs, setBlogs] = useState([]);
  const [authorPic, setAuthorPic] = useState("/images/default_ProfilePic.svg");
  const [loading, setLoading] = useState(false);
  const [userExist, setUserExist] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLastPage, setIsLastPage] = useState(true);
  const [loadingMoreBlogs, setLoadingMoreBlogs] = useState(false);
  const [totalBlogsCount, setTotalBlogsCount] = useState(0);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestedUser = userName || user?.userName;

  const fetchBlogs = async (pageToFetch = pageNumber) => {
    setLoadingMoreBlogs(true);
    try {
      if (pageToFetch === 1) setLoading(true);
      const response = await axios.get(`/api/blogs/user/${requestedUser}`, {
        params: { page: pageToFetch },
      });

      const {
        blogs: newBlogs,
        authorPic,
        msg,
        userExist,
        isLast,
        totalUserBlogs,
      } = response.data;

      setUserExist(userExist);
      setTotalBlogsCount(totalUserBlogs);

      if (!userExist) {
        setBlogs([]);
        setPageNumber(1);
        return;
      }

      if (msg) {
        toast.error(msg);
        return;
      }
      setBlogs((prev) =>
        pageToFetch === 1 ? newBlogs : [...prev, ...newBlogs],
      );
      setPageNumber(pageToFetch + 1);
      setAuthorPic(authorPic);
      setIsLastPage(isLast);
    } catch (e) {
      toast.error(`Some error Occured : ${e}`);
    } finally {
      setLoading(false);
      setLoadingMoreBlogs(false);
    }
  };

  useEffect(() => {
    // reset everything
    setPageNumber(1);
    setBlogs([]);
    setTotalBlogsCount(0);
    setIsLastPage(false);
    setUserExist(true);
    setAuthorPic("/images/default_ProfilePic.svg");

    if (!requestedUser) {
      return;
    }
    fetchBlogs(1);
  }, [requestedUser]);

  useEffect(() => {
    if (!pendingDeleteId) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) setPendingDeleteId(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingDeleteId, isDeleting]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied successfully !!");
  };

  const deleteBlog = async (blogId) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/blogs/${blogId}`);
      const deletedBlogId = response.data?.blogId;

      if (!deletedBlogId) {
        toast.error(response.data?.msg || "Unable to delete this story.");
        return;
      }

      setBlogs((currentBlogs) =>
        currentBlogs.filter((blog) => String(blog._id) !== String(deletedBlogId)),
      );
      setTotalBlogsCount((count) => Math.max(0, count - 1));
      toast.success("Story deleted successfully.");
    } catch (e) {
      toast.error(e.response?.data?.msg || e.message || "Unable to delete this story.");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  if (loading || (!userName && loadingUser)) {
    return <LoadingPage />;
  }

  if (!userExist) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <div className="not-found-icon">🕵️‍♂️</div>
          <h1 className="not-found-title">Author Not Found</h1>
          {!requestedUser ? (
            <>
              <p className="not-found-desc">
                Couldn't find any author. Please Login to check your dashboard.
              </p>
              <Link to="/user/login" className="back-home-btn">
                <span>🏠</span> Login
              </Link>
            </>
          ) : (
            <>
              <p className="not-found-desc">
                We couldn't find any author with username as{" "}
                <b>{requestedUser}</b>. They may have changed their username or
                deleted their account.
              </p>
              <Link to="/" className="back-home-btn">
                <span>🏠</span> Return Home
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* FLOATING ORBS */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-shell">
          {/* SIDEBAR */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-badge">Author</div>

            <div className="account-btn" style={{ width: 90, height: 90 }}>
              <img src={authorPic} alt="Profilepic" className="profilepic" />
            </div>

            <h1 className="author-title">{requestedUser}</h1>
            <span className="author-handle">@{requestedUser}</span>

            <div className="author-stats">
              <div className="stat-item">
                <span className="stat-val">{totalBlogsCount}</span>
                <span className="stat-lbl">Stories</span>
              </div>
            </div>

            <div className="sidebar-actions">
              {user && user.userName === requestedUser && (
                <Link
                  to="/blog/create"
                  className="action-btn action-btn-primary"
                >
                  <span>✍️</span> Write a Story
                </Link>
              )}
              <button
                className="action-btn action-btn-secondary"
                onClick={copyProfileLink}
              >
                <span>🔗</span> Share Profile
              </button>
            </div>
          </aside>

          {/* MAIN WORKSPACE */}
          <section className="dashboard-main">
            <h2 className="dashboard-section-title">Published Stories</h2>

            <div className="blog-grid blog-grid-dashboard">
              {blogs && blogs.length ? (
                blogs.map((blog) => (
                  <BlogCard
                    key={blog._id || blog.id}
                    blog={blog}
                    deleteBlog={(blogId) => setPendingDeleteId(blogId)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✍️</div>
                  <h3>No stories yet</h3>
                  <p>This author has not published any stories on Inkora.</p>
                  {user && user.userName === requestedUser && (
                    <Link
                      to="/blog/create"
                      className="back-home-btn"
                      style={{ marginTop: 8 }}
                    >
                      <span>✨</span> Write Your First Story
                    </Link>
                  )}
                </div>
              )}
            </div>
            {!isLastPage && (
              <div className="see-more-wrap">
                {loadingMoreBlogs ? (
                  <span className="more-blogs-loading">Loading...</span>
                ) : (
                  <button
                    className="see-more-btn"
                    onClick={() => fetchBlogs(pageNumber)}
                  >
                    See more
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {pendingDeleteId && (
        <div
          className="confirm-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setPendingDeleteId(null);
            }
          }}
        >
          <section
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-description"
          >
            <h2 id="delete-confirm-title">Delete this story?</h2>
            <p id="delete-confirm-description">
              This will permanently remove the story. This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={() => setPendingDeleteId(null)}
                disabled={isDeleting}
                autoFocus
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={() => deleteBlog(pendingDeleteId)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete story"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default DashboardPage;
