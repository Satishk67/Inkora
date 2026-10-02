import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../Context/UserContext";

function BlogCard ({blog,deleteBlog}) {

    const {user} = useContext(userContext);
    const maxLen = 110;
    const content = blog.content;

    const getSnippet = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    const text = div.textContent || "";

    return text.length > maxLength
        ? text.slice(0, maxLength) + "..."
        : text;
    };

    const snippet = getSnippet(content,maxLen)

    function getReadtime(content){
        if (!content) return '1 min read' ;
        var words = content.trim().split(/\s+/).length;
        var minutes = Math.ceil(words / 200);
        return minutes + ' min read';
    }

    function getPostDateInFormat(date){
        if (!date) return 'Recent';
        var d = new Date(blog.createdAt);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
    }

    const postDate = getPostDateInFormat(blog.createdAt);
    const readTime = getReadtime(content);

    return (
    
        <article className="mini-card" data-category={(blog.category || '').toLowerCase()}>
        <Link to={`/blog/${blog._id}`} className="mini-card-link">
        
        {/* THUMBNAIL / COVER */}
        <div className="mini-card-cover">
            
            <img 
                src={blog.thumbnail} 
                alt={blog.title} 
                className="mini-card-img" 
                loading="lazy" 
                onError={(event) => { event.currentTarget.style.display = "none"; }}
            />
        </div>

        {/* CONTENT BODY */}
        <div className="mini-card-body">
            
            <div className="mini-card-header">
                <span className="mini-card-category">
                    {(blog.category) ? blog.category : 'General' }
                </span>

                {
                (user && user.userName === blog.author) &&
                    (
                    <button
                        type="button"
                        className="card-delete-btn"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            deleteBlog(blog._id);
                        }}
                        title="Delete Story"
                        aria-label={`Delete ${blog.title}`}
                    >
                        <svg viewBox="0 0 24 24" className="delete-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                    )
                }
            </div>

            <h3 className="mini-card-title">
                 {blog.title}
            </h3>

            <p className="mini-card-excerpt">
                {snippet}
            </p>

            {/* META / AUTHOR FOOTER */}
            <div className="mini-card-footer">
                <div className="author-block">
                    <div className="account-btn">
                    <img src={blog.createdBy.profilePicture} alt="Profilepic" className="profilepic"/>
                </div>
                    <div className="author-meta">
                        <span className="author-name">
                            {
                                (blog.author) ? blog.author : 'Anonymous' 
                            }
                        </span>
                        <span className="post-date">{postDate}</span>
                    </div>
                </div>

                <div className="reading-time">
                    <span>📖 {readTime}</span>
                </div>
            </div>
        </div>

    </Link>
</article>
    
    )
}

export default BlogCard;