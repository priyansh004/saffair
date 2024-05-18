import React from "react";
import Vision from "../../component/homepageComponent/vision mission/Vision";
import "./aboutus.css";



const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      {/* <div className="about-title">About Us</div> */}
      <h2 className="about-title">
        Welcome to Saffair
      </h2>
      <div className="about-content">
        <div className="about-description ">
          Saffair is a Professional Environmental Awareness Community Platform.
          Here we will only provide you with interesting content that you will
          enjoy very much. We are committed to providing you the best of
          Environmental Awareness Community, with a focus on reliability and
          Community and Data Given. We strive to turn our passion for
          Environmental Awareness Community into a thriving website. We hope you
          enjoy our Environmental Awareness Community as much as we enjoy giving
          them to you. I will keep on posting such valuable and knowledgeable
          information on my Website for all of you. Your love and support
          matters a lot.
        </div>
      </div>
      {/* <div className="separator"></div> */}
      <div className="vnms flex">

        <div className="visions">
          <div className="hh1s">Vision</div>
          <div className="vgoals">
            <p>
              Having a clear vision of the world your product and team are trying
              to create brings clarity to what projects you initiate, who you hire
              and what you focus on.
            </p>{" "}
            <br />
            <p>
              Where your vision is for a future, often utopian state, a mission is
              what you are doing now and will form part of the journey towards
              this vision.
            </p>
          </div>
          </div>
          <div className="missions">
            <div className="hh1s">Mission</div>
            <div className="mgoals">
              <p>
                Having a clear vision of the world your product and team are trying
                to create brings clarity to what projects you initiate, who you hire
                and what you focus on.
              </p>
              <br />
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
