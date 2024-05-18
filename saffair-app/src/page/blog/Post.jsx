import "./post.css";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSelector } from "react-redux";

export default function Post({
  _id,
  title,
  createdAt,
  image,
  content,
  category,
  slug,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className="postContainer" onClick={scrollToTop}>
        <div className="card">
          <Link to={`/post/${_id}`}>
            <div className="card__header">
              <img
                src={image}
                alt="card__image"
                className="card__image"
                width="600"
                style={{objectFit:'cover'}}
              />
            </div>
          </Link>
          <div className="card__body">
            <span className="tag"> {category}</span>
            <Link to={`/post/${_id}`} className="link">
              <div className="postTitle">
                <h5>{title}</h5>
                {/* <p>{content}</p> */}
              </div>
            </Link>
          </div>
          <div className="card__footer">
            {/* Conditionally render user information if currentUser exists */}
            {currentUser && (
              <div className="user">
                <img
                  src={currentUser.profilePicture}
                  alt="user__image"
                  className="user__image"
                />
                <div className="user__info">
                  <h6>{currentUser.username}</h6>
                  <small>
                    <time>{format(new Date(createdAt), "MMMM dd, yyyy")}</time>
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
