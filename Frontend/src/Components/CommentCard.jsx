import { Link } from "react-router-dom";

function CommentCard({ comment }) {
    const author = comment.createdBy?.userName || "Anonymous Reader";
    const date = comment.createdAt
        ? new Date(comment.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Just now";

    return (
        <article className="comment-card">
            <div className="comment-header">
                <div className="comment-user">
                    <div className="account-btn">
                        <Link to={`/user/${author}`}>
                        <img
                            src={comment.createdBy?.profilePicture || "/images/defaultProfilePic.svg"}
                            alt="commentedPerson"
                            className="profilepic"
                        />
                        </Link>
                    </div>
                    <div className="comment-meta">
                        <span className="comment-username">{author}</span>
                        <time className="comment-date" dateTime={comment.createdAt || undefined}>{date}</time>
                    </div>
                </div>
            </div>
            <p className="comment-content">{comment.content}</p>
        </article>
    );
}

export default CommentCard;