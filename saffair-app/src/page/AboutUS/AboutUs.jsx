import React from "react";
import "./aboutus.css";
import akshat from "./images/Akshat 6.png"
import karishma from "./images/Karishma_1.png"
import nirmit from "./images/nimit.png"
import {
  faSquareFacebook,
  faSquareInstagram,
 
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <h2 className="about-title my-3">Welcome to Saffair</h2>
      <div className="about-content my-10">
        <div className="about-description">
          Saffair is a professional platform focused on environmental awareness. 
          Our goal is to transform our passion for environmental awareness into a thriving website.
          We hope you enjoy our content as much as we enjoy sharing it.
        </div>
      </div>
      <div className="vnms flex p-4">
        <div className="visions">
          <div className="hh1s">Vision</div>
          <div className="vgoals">
            <p>
              We're pioneering a world where sustainability isn't just a buzzword but a way of life. 
              Through collaborative efforts and innovative design, we're ensuring cleaner air for 
              everyone, today and tomorrow.
            </p>
          </div>
        </div>
        <div className="missions">
          <div className="hh1s">Mission</div>
          <div className="mgoals">
            <p>
              At Saffair, we're committed to democratizing clean air access.  
              we're not just purifying air; we're empowering communities 
              and building trust, ensuring that clean air remains a 
              fundamental right for all.
            </p>
          </div>
        </div>
      </div>
      <div className="team-section">
        <h3>Our Team</h3>
        <div className="team-members">
          <div className="team-member">
            <img src={akshat} alt="Akshat Shah" className="profile-pic" />
            <h4>Akshat Shah</h4>
            <a href="https://www.instagram.com/who.is.akshat.shah?igsh=OGVsODFleHV3OTZl" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareInstagram} />

            </a> | 
            <a href="https://www.facebook.com/akshat.shah.75839" target="_blank" rel="noopener noreferrer">      
                        <FontAwesomeIcon icon={faSquareFacebook} />
            </a>
          </div>
          <div className="team-member">
            <img src={nirmit} alt="Nimit Shah" className="profile-pic" />
            <h4>Nimit Shah</h4>
            <a href="https://www.instagram.com/nimit.r.shah?igsh=NWs2YjZrdjRzc2Q3" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareInstagram} />

            </a> | 
            <a href="https://www.facebook.com/nimit.r.shah" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareFacebook} />

            </a>
          </div>
          <div className="team-member">
            <img src={karishma} alt="Karishma Shah" className="profile-pic" />
            <h4>Karishma Shah</h4>
            <a href="https://www.instagram.com/karishama.shah?igsh=MW9pajlsdHA5N3o4Yg==" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareInstagram} />

            </a> | 
            <a href="https://www.facebook.com/karishma.shah.503645" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareFacebook} />

            </a>
          </div>
        </div>
      </div>
      <div className="thanks-section">
        <div className="thanks-message">Thank you For Visiting Our Site </div>
        <div className="great-day-message">Have A Great Day !</div>
      </div>
    </div>
  );
};

export default AboutUsPage;