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
import img from "./images/image.png"
const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <h2 className="about-title my-3">Welcome to Saffair</h2>

      <section
        className="flex justify-center items-center   bg-center h-auto py-10"
        id="sec-a483" s
      >
        <div className="w-full max-w-6xl px-4 bg-[#48a5c2]">
          <div className="flex flex-col md:flex-row justify-between">
            <div
              className="w-full md:w-1/2 lg:w-5/12 xl:w-1/3 p-4 align-middle flex flex-col justify-center items-center text-center animate__animated animate__fadeIn"
              style={{ animationDuration: '1500ms' }}
            >
              <div>
                <h2 className="text-4xl font-bold mb-4">About Us</h2>
                <div className="about-description"></div>
                <p className="mb-4 text-xl">
                  Saffair is a professional platform focused on environmental awareness.
                  Our goal is to transform our passion for environmental awareness into a thriving website.
                  We hope you enjoy our content as much as we enjoy sharing it.
                </p>
              </div>
            </div>
            <div
              className="w-full md:w-1/2 lg:w-7/12 xl:w-2/3 p-4 flex items-center justify-center animate__animated animate__fadeIn"
              style={{ animationDuration: '1500ms', animationDelay: '250ms' }}
            >
              <div className="w-full h-full bg-cover bg-center">
                <img src={img} alt="img" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>

      </section>
      <div className="about-content my-10">

      </div>
      <div className="vnms flex flex-col md:flex-row p-4 bg-gray-100 rounded-lg shadow-lg space-y-6 md:space-y-0 md:space-x-6">
        <div className="visions bg-white p-6 rounded-lg shadow-md flex-1">
          <div className="hh1s text-2xl font-semibold mb-4 text-teal-600">Vision</div>
          <div className="vgoals text-gray-700">
            <p>
              We're pioneering a world where sustainability isn't just a buzzword but a way of life.
              Through collaborative efforts and innovative design, we're ensuring cleaner air for
              everyone, today and tomorrow.
            </p>
          </div>
        </div>
        <div className="missions bg-white p-6 rounded-lg shadow-md flex-1">
          <div className="hh1s text-2xl font-semibold mb-4 text-teal-600">Mission</div>
          <div className="mgoals text-gray-700">
            <p>
              At Saffair, we're committed to democratizing clean air access.
              We're not just purifying air; we're empowering communities
              and building trust, ensuring that clean air remains a
              fundamental right for all.
            </p>
          </div>
        </div>
      </div>

      <div className="team-section">
        
      <h2 className="about-title my-3"> Meet Our Team</h2>
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