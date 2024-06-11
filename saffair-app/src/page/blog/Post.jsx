import "./post.css";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';

export default function Post({
  _id,
  title,
  createdAt,
  image1,
  bookmark,
  content,
  category,
  readingType,
  contributionType,
  updatedAt,
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
            <span className="tag text-blue-900 text-[14px]">{readingType}</span>
            <Link to={`/post/${_id}`} className="link">
              <div className="postTitle">
                <h5 className="text-[20px]">{title}</h5>
                {/* <p>{content}</p> */}
              </div>
            </Link>
            <div className="flex flex-row gap-3">
              <div className="flex flex-wrap gap-2">
                {category.map((tag, index) => (
                  <div key={index} className="flex items-center">
                    <p className="tag text-blue-600 text-[14px]">&bull; {tag}</p>
                    {/* <span className="text-gray-400 text-[12px]">&bull;</span>
                    <span className="text-blue-600 text-[12px]">{tag}</span> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
