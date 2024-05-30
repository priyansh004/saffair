import React from "react";
import Vision from "../../component/homepageComponent/vision mission/Vision";
import "./aboutus.css";



const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      {/* <div className="about-title">About Us</div> */}
      <h2 className="about-title my-3">
        Welcome to Saffair
      </h2>
      <div className="about-content my-10">
        <div className="about-description ">
        Saffair is a professional platform focused on environmental awareness. We provide engaging content and reliable community-driven data. Our goal is to transform our passion for environmental awareness into a thriving website. We hope you enjoy our content as much as we enjoy sharing it. Your support is greatly appreciated, and we'll continue to post valuable information for you.
        </div>
      </div>
      {/* <div className="separator"></div> */}
      <div className="vnms flex p-4">

        <div className="visions">
          <div className="hh1s">Vision</div>
          <div className="vgoals">
            <p>
              Having a clear vision of the world your product and team are trying
              to create brings clarity to what projects you initiate, who you hire
              and what you focus on.
            </p>{" "}
            <br />
            
          </div>
          </div>
          <div className="missions">
            <div className="hh1s">Mission</div>
            <div className="mgoals">
              
            
              <p>
                Where your vision is for a future, often utopian state, a mission is
                what you are doing now and will form part of the journey towards
                this vision
              </p>
            </div>
           
          </div>
        </div>
        {/* <div className="separator"></div> */}
        <div >
          <div className="thanks-message">Thank you For Visiting Our Site </div>

          <div className="great-day-message">Have A Great Day !</div>
        </div>
      
    </div>
  );
};

export default AboutUsPage;
