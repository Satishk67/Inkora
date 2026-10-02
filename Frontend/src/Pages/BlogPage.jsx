import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CommentCard from "../Components/CommentCard";
import { userContext } from "../Context/UserContext";

function BlogPage() {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [postingComment, setPostingComment] = useState(false);

  const { user } = useContext(userContext);
  const { blogId } = useParams();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.get(`/api/blogs/${blogId}`);
        const fetchedBlog = response.data.blog;
        const fetchedComments = response.data.comments;

        if (fetchedBlog) setBlog(fetchedBlog);
        if (fetchedComments) setComments(fetchedComments);
      } catch (e) {
        toast.error(`Unable to get the Blog : ${e}`);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, []);

  function getReadtime(content) {
    if (!content) return "1 min read";
    var words = content.trim().split(/\s+/).length;
    var minutes = Math.ceil(words / 200);
    return minutes + " min read";
  }

  function getPostDateInFormat(date) {
    if (!date) return "Recent";
    var d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!blog) {
    return <ErrorPage />;
  }

  const postDate = getPostDateInFormat(blog.createdAt);
  const readTime = getReadtime(blog.content);


  const postCommentHandler = async (e) => {
    e.preventDefault();
    const newComment = e.currentTarget.elements.comment.value.trim();
    try {
      setPostingComment(true);

      if (!user) {
        toast.error("Login to post a comment !!");
        return;
      }

      if (!newComment) {
        toast.error("Cant post an empty comment !!");
        return;
      }

      const response = await axios.post(
        `/api/comment/${blogId}`,
        {
          content: newComment,
        }
      );
      const currentComment = response.data?.comment;
      const msg = response.data?.msg;

      if (msg) {
        toast.error(msg);
        return;
      }

      if (currentComment) {
        toast.success("Comment added successfully !!");
      }

      // Add all comments
      setComments((currentComments) => [...currentComments, currentComment]);
    } catch (e) {
      toast.error(`Some error Occured : ${e}`);
    } finally {
      setPostingComment(false);
    }
  };

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied the link successfully !!");
  }

  return (
    <>
      <Navbar />

      <main className="article-page">
        <div className="article-back-nav">
          <Link to="/blog" className="back-btn">
            ← All Stories
          </Link>

          <button type="button" className="share-btn" id="shareStoryBtn" onClick={copyLinkHandler}>
            <span>🔗</span>
            <span>Copy Link</span>
          </button>
        </div>

        <header className="article-header">
          <span className="category-tag">{blog.category}</span>

          <h1 className="article-main-title">{blog.title}</h1>

          <div className="author-meta-card">
            <div className="author-info-left">
              <div className="account-btn">
                <img
                  src={blog.createdBy?.profilePicture}
                  alt="Profilepic"
                  className="profilepic"
                />
              </div>
              <div className="author-details">
                <span className="author-full-name">
                  {blog.author || "Anonymous Writer"}
                </span>
                <span className="article-published-date">{postDate}</span>
              </div>
            </div>

            <div className="article-stats-right">
              <span>📖 ~{readTime}</span>
            </div>
          </div>
        </header>

        {(blog.thumbnail && blog.thumbnail.trim()) !== "" && (
          <div className="article-cover-wrapper">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="article-cover-img"
              onError={(event) => {
                event.currentTarget.parentElement.style.display = "none";
              }}
            />
          </div>
        )}

        <article
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />

        <section className="comments-section">
          <h3 className="comments-heading">Comments</h3>

          <div className="comment-form-wrap">
            <form className="comment-form" onSubmit={postCommentHandler}>
              <textarea
                name="comment"
                className="comment-textarea"
                placeholder="Share your thoughts..."
                maxLength={150}
                required
                disabled={postingComment}
              ></textarea>

              <div className="comment-submit-row">
                <button
                  type="submit"
                  className="comment-submit-btn"
                  disabled={postingComment}
                >
                  <span>✍ Add Comment</span>
                </button>
              </div>
            </form>
          </div>

          {comments.length ? (
            comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))
          ) : (
            <div className="no-comments-box">No comments yet!!</div>
          )}
        </section>

        <footer className="article-footer-author">
          <div className="author-box-left">
            <div className="account-btn">
              <img
                src={blog.createdBy?.profilePicture}
                alt="Profilepic"
                className="profilepic"
              />
            </div>
            <div className="author-box-meta">
              <h4>Written by {blog.author || "INKORA Thinker"}</h4>
              <p>Published on INKORA — Where ideas find their voice.</p>
            </div>
          </div>

          <Link to={`/user/${blog.author}`} className="author-cta-btn">
            <span>📚</span>
            <span>More stories</span>
          </Link>
        </footer>
      </main>
      <Footer />
    </>
  );
}

export default BlogPage;
