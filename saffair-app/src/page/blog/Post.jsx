import "./post.css";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';

export default function Post({
  tags,
  _id,
  title,
  createdAt,
  image1,
  bookmark,
  content,
  category,
  slug,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isBookmarked, setIsBookmarked] = useState(bookmark);

  const handleBookmarkToggle = async () => {
    try {
      // Send a request to your backend API to toggle the bookmark status in the database
      const response = await fetch(`/api/posts/${_id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmark: !isBookmarked }),
      });
      if (response.ok) {
        setIsBookmarked(!isBookmarked); // Toggle bookmark status locally if the request is successful
      } else {
        console.error('Failed to toggle bookmark status');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>

      <div className="postContainer flex flex-col justify-evenly" onClick={scrollToTop}>
        <div className="card">
          <Link to={`/post/${_id}`}>
            <div className="card__header">
              <img
                src={image1}
                alt="card__image"
                className="card__image"
                width="600"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Link>
          <div className="card__body flex flex-col justify-evenly">
            <span className="tag text-blue-900 text-[14px]"> {category}</span>
            <Link to={`/post/${_id}`} className="link">
              <div className="postTitle">
                <h5 className="text-[20px]">{title}</h5>
                {/* <p>{content}</p> */}
              </div>
            </Link>
            <div className="flex flex-row gap-3">
            <p className="text-blue-500">tags:</p>
            <div className="flex flex-row gap-2">
              {tags.map((tag, index) => (
                <span key={index} className=""><p className="tag text-blue-600 text-[12px]">{tag}</p></span>
              ))}
            </div>
            </div>
            



          </div>
            {/* <div className="user">
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


            </div> */}
            {/* Conditionally render user information if currentUser exists */}

        </div>
      </div>
    </>
  );
}
