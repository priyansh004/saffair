import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faSquareInstagram,
  faSquareXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
const img = "./assets/logofooter.png";

export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="footMain">
      <div className="foot-panel2">
        <div className="logo-foot">
          <img className="imgfooter" src={img} />
        </div>
        <div className="f1">
          <div className="f2">
            <ul className="foot1">
              <p>Learn More</p>
              <li>Environment</li>
              <li>Jobs</li>
              <Link to="/privacypolicy">
                <a className="centerItem1" onClick={scrollToTop}>
                  Privacy Policy
                </a>
              </Link>
<br/>
              <Link to="/contactus">
                <a className="centerItem1" onClick={scrollToTop}>
                  Contact Us
                </a>
              </Link>
              <br/>
              <Link to="/aboutus">
                <a className="centerItem1" onClick={scrollToTop}>
                  About Us
                </a>
              </Link>
            </ul>
            <ul className="foot2">
              <p>Products</p>
              <li>Sell products on Amazon</li>
              <li>Sell on Amazon Business</li>
              <li>Sell apps on Amazon</li>
              <li>Become an Affiliate</li>
              <li>Advertise Your Products</li>
            </ul>
          </div>
          <div className="f3">
            <ul className="foot3">
              <p>Contact us</p>
              <li>+91 989889889 </li>
              <li>support@saffair.in</li>
            </ul>
            <ul className="social">
              <p>Social</p>
              <div className="socialapp">
                <a href="#" className="icon1">
                  <FontAwesomeIcon icon={faSquareFacebook} />
                </a>
                <a href="#" className="icon1">
                  <FontAwesomeIcon icon={faSquareInstagram} />
                </a>
                <a href="#" className="icon1">
                  <FontAwesomeIcon icon={faSquareXTwitter} />
                </a>
              </div>
              <div className="playstore">
                <a class="btn btn-google" href="#" title="Google Play">
                  Google Play
                </a>
              </div>
              <div className="appstore">
                <a class="btn btn-apple" href="#" title="App Store">
                  App Store
                </a>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className="foot-panel4">
        <div className="pages">
          <a href="">Conditions of Use</a>
          <a href="">Privacy Notice</a>
          <a href="">Your Ads Privacy Choices</a>
        </div>
        <div className="copyright">
        <Link to="https://agevole.in/" target="_blank">  ©2024 Saffair All rights reserved | Design and Developed by Agevole Innovatio </Link>
        </div>
      </div>
    </footer>
  );
}
