import "./homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Joinletter from "../../component/homepageComponent/joinletter/Joinletter";
import Post from "../blog/Post";
import { useState, useEffect } from "react";
import WeatherUpdate from "../../component/homepageComponent/weatherupdates/WeatherUpdate";
import Healthadvice from "../../component/homepageComponent/health advice/Healthadvice";
import Vision from "../../component/homepageComponent/vision mission/Vision";
import Event from "../../component/homepageComponent/Event/Event";
// import AqiData from "../../component/AqiData/AqiData";

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Fetch posts from the server
    fetch("http://localhost:6600/post")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);
  return (
    <>
      <div>
        <WeatherUpdate />
        {/* <Healthadvice /> */}

        <div>
          <Vision />
        </div>
        <div>
          <Event />
        </div>
        <div>
          <Joinletter />
        </div>
        <div style={{ width: "100%" }}>
          <div
            className="readingtitle"
            style={{ display: "flex", alignItems: "center", margin: "20px" }}
          >
            <h2 className="text-2xl font-bold">Readings</h2>
            <hr
              style={{
                width: "95%",
                height: "2px",
                margin: "10px",
                backgroundColor: "#2196BA",
                border: "none",
              }}
            />
          </div>
          <div class="cards-wrapper" id="style-5">
            <div className="homeReadings">
              {posts.map((post) => (
                <Post key={post._id} {...post} color="black" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
