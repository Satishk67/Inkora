import { useEffect, useState } from "react";
import BlogCard from "../Components/BlogCard";
import LoadingPage from "./LoadingPage";
import Navbar from "../Components/Navbar"
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function AllBlogsPage() {
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLastPage,setIsLastPage] = useState(true);
  const [loadingMoreBlogs, setLoadingMoreBlogs] = useState(false);

  const go = useNavigate();

  const searchAuthorHandler = (e) => {
    e.preventDefault();
    const searchedUser = e.currentTarget.elements.searchedInput.value.trim();
    
    go(`/user/${searchedUser}`);
  }

  const fetchBlogs = async (category = selectedCategory, requestedPage = pageNumber, replace = false) => {
      setLoadingMoreBlogs(true);
      try {
        if(requestedPage === 1) setLoading(true);
        const response = await axios.get("/api/blogs", {
          params: {
            page: requestedPage,
            ...(category !== "all" && { category }),
          },
        });
        const { blogs: fetchedBlogs, errorMsg, isLast } = response.data;

        if (errorMsg) {
          console.log(`Backend Error : ${errorMsg}`);
          return;
        }

        setBlogs((prevBlogs) => replace ? fetchedBlogs : [...prevBlogs, ...fetchedBlogs]);

        setPageNumber(requestedPage + 1);
        setIsLastPage(isLast);
      } catch (e) {
        console.log(`Some error occured : ${e}`);
      } finally{
        setLoading(false);
        setLoadingMoreBlogs(false);
      }
  };

  const changeCategory = (category) => {
    if (category === selectedCategory) return;

    setSelectedCategory(category);
    setBlogs([]);
    setPageNumber(1);
    setIsLastPage(false);
    fetchBlogs(category, 1, true);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!pendingDeleteId) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) setPendingDeleteId(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingDeleteId, isDeleting]);

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
      toast.success("Story deleted successfully.");
    } catch (e) {
      toast.error(e.response?.data?.msg || e.message || "Unable to delete this story.");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
    <Navbar/>
      {/* FLOATING ORBS */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <main className="blog-feed-page">
        {/* SEARCH & WRITE ACTIONS */}
        <form
          className="feed-controls"
          id="blogSearchForm"
          onSubmit={searchAuthorHandler}
        >
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              name="searchedInput"
              className="search-input"
              placeholder="Search by author's userName"
              required
            />
          </div>

          <button type="submit" className="write-action-btn">
            <span>🔍 Search</span>
          </button>

          <Link to="/blog/create" style={{ textDecoration: "none" }}>
            <button type="button" className="write-action-btn">
              <span>✍ Start Writing</span>
            </button>
          </Link>
        </form>

        {/* CATEGORY FILTER PILLS */}
        <div className="category-filters" id="categoryFilters">
          {[
            { value: "all", label: "All Stories" },
            { value: "Technology", label: "Technology" },
            { value: "Artificial Intelligence", label: "AI" },
            { value: "Startups", label: "Startups" },
            { value: "Programming", label: "Programming" },
            { value: "Productivity", label: "Productivity" },
            { value: "Design", label: "Design" },
            { value: "Psychology", label: "Psychology" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`filter-pill${selectedCategory === value ? " active" : ""}`}
              aria-pressed={selectedCategory === value}
              onClick={() => changeCategory(value)}
              disabled={loadingMoreBlogs}
            >
              {label}
            </button>
          ))}
        </div>

        {/* BLOG MINIATURES GRID */}
        <div className={`blog-grid blog-grid-all${blogs.length === 0 ? " blog-grid-empty" : ""}`} id="blogGrid">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard
                key={blog._id || blog.id}
                blog={blog}
                deleteBlog={(blogId) => setPendingDeleteId(blogId)}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>{selectedCategory === "all" ? "No stories published yet" : `No ${selectedCategory} stories yet`}</h3>
              <p>
                {selectedCategory === "all"
                  ? "Be the first one to share your ideas, insights, or stories with the INKORA community."
                  : "Try another category or browse all stories."}
              </p>
              {selectedCategory === "all" && (
                <Link to="/blog/create" style={{ textDecoration: "none" }}>
                  <button className="primary-btn">✍ Publish First Story</button>
                </Link>
              )}
            </div>
          )}
        </div>

        {!isLastPage && (
          <div className="see-more-wrap">
            {
              (loadingMoreBlogs) ? (
                <span>Loading...</span>
              ) : (
                <button className="see-more-btn" onClick={() => fetchBlogs()}>
                  See more
                </button>
              )
            }
          </div>
        )}
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

export default AllBlogsPage;
