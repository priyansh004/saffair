import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import "./postpage.css";
import Share1 from "../../../../component/share1/Share1";
import Post from "../../Post";
import Share2 from "../../../../component/share2/Share2";
import AdminInfo from "../../../../component/adminInfo/AdminInfo";
import TableOfContent from "../../../../component/tableofcontent/TableOfContent";
import Weatherbox from "../../../../component/weatherbox/Weatherbox";
import { Spinner } from "flowbite-react";
import CommentSection from "../../../../component/commentsection/CommentSection";
import BookMark from "../../../../component/bookmark/BookMark";
import { useSelector } from "react-redux";
import Qna from "../../../../component/QnA/Qna";
import Ratings from "../../../../component/Ratings/Ratings";
import "./../../component/homepageComponent/weatherupdates/weatherupdate.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faBookmarkFill } from '@fortawesome/free-solid-svg-icons';

//vvvvvvvvvv
export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [postInfo, setPostInfo] = useState(null);
  // const [postAdmin, setPostAdmin] = useState(null);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState("false");

  useEffect(() => {
    // Fetch posts from the server
    // setLoading(true);
    fetch("http://localhost:6600/post")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((posts) => {
        setPosts(posts);
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  useEffect(() => {
    // setLoading(true);
    fetch(`http://localhost:6600/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        return response.json();
      })
      .then((postInfo) => {
        let index = 0;
        const modifiedContent = postInfo.content.replace(
          /<h([1-6])[^>]*>(.*?)<\/h\1>/g,
          (match, level, content) => {
            const id = `heading-${index}`;
            index++;
            return `<h${level} id="${id}">${content}</h${level}>`;
          }
        );
        postInfo.content = modifiedContent;
        setPostInfo(postInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  const handleBookmarkToggle = async () => {
    try {
      const response = await fetch(`http://localhost:6600/bookmark/${id}`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked); // Toggle bookmark status locally if the request is successful
      } else {
        console.error("Failed to toggle bookmark status");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (!postInfo) return null;
  document.querySelectorAll(".feedback li").forEach((entry) =>
    entry.addEventListener("click", (e) => {
      if (!entry.classList.contains("active")) {
        document
          .querySelector(".feedback li.active")
          .classList.remove("active");
        entry.classList.add("active");
      }
      e.preventDefault();
    })
  );


  return (
    <>
      <div style={{ Height: "800px" }}>
        {loading ? (
          <div className="spinnerr" style={{ height: "90vh" }}>
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="postMainPage">
            <div className="postMainTopPage ">
              <div className="blogContainer">
                <div className="coverCon relative">
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "8px",
                      zIndex: "10",
                      fontSize: "35px",
                    }}
                  >
                    <BookMark post={postInfo} />
                  </div>
                  <img
                    src={postInfo.image}
                    className="postImg"
                    alt="post img"
                    srcSet=""
                    style={{ objectFit: "cover" }}
                  />

                  <div className="blurTitle glass">
                    <div className="tagline">
                      <p>{postInfo.category}</p>
                    </div>
                    <div className="tagsection">
                      <time className="duration">
                        {" "}
                        On &nbsp;
                        {format(new Date(postInfo.createdAt), "MMMM dd, yyyy")}
                      </time>
                      <h2 className="posttitle">{postInfo.title}</h2>
                    </div>
                  </div>
                </div>



                <div className="postDataCon">
                  <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: postInfo.content }}
                  />
                  {/* {postInfo.content} */}
                </div>
{/* 
                <button onClick={handleBookmarkToggle}>
                  <FontAwesomeIcon className="ic" icon={isBookmarked ? faBookmark :  faBookmark} />
                  <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button> */}


                <div className="authInfo">
                  <AdminInfo userId={postInfo.userId} />
                  <Share2 />
                </div>

                <div>
                  {/* <div>
                  <Ratings />
                </div> */}
                  <Qna
                    que={postInfo.quizQuestion}
                    options={postInfo.quizOptions}
                    ans={postInfo.correctAnswer}
                  />
                  <div>
                    <CommentSection postId={postInfo._id} />
                  </div>
                </div>
              </div>
              <div className="rightSide mt-6">
                <div style={{ marginTop: "10px" }}>
                  <Weatherbox />
                </div>
                <div className="share1">
                  <Share1 />
                </div>
                <div className="tocCon">
                  <TableOfContent postContent={postInfo.content} />
                </div>
                {posts.slice(0, 3).map((post) => (
                  <Post key={post._id} {...post} color="black" />
                ))}
              </div>
            </div>

            <div className="bottomPost">
              <div
                className="readingtitle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                  marginBottom: "20PX",
                }}
              >
                <h2 className="text-2xl font-bold">Readings</h2>
                <hr
                  style={{
                    width: "70%",
                    height: "2px",
                    margin: "10px",
                    backgroundColor: "#2196BA",
                    border: "none",
                  }}
                />
              </div>
              <div className="cards-wrapper" id="style-5">
                <div className="homeReadings">
                  {posts && posts.length > 0 ? (
                    posts.map((post) => <Post key={post._id} {...post} />)
                  ) : (
                    <p>No readings available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
