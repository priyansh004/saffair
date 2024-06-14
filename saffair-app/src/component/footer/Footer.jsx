import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faSquareInstagram,
  faSquareXTwitter,
  faLinkedin,
  faSquareYoutube
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
              <Link to="/events">
                <a className="centerItem1" onClick={scrollToTop}>
                  Campaigns
                </a>
              </Link>
              <br />
              <Link to="/blog">
                <a className="centerItem1" onClick={scrollToTop}>
                  Blogs
                </a>
              </Link>
              <br />

              <Link to="/news">
                <a className="centerItem1" onClick={scrollToTop}>
                  News
                </a>
              </Link>
              <br />

              <Link to="/Update">
                <a className="centerItem1" onClick={scrollToTop}>
                  Updates
                </a>
              </Link>
              <br />

              <Link to="/contactus">
                <a className="centerItem1" onClick={scrollToTop}>
                  Contact Us
                </a>
              </Link>
              <br />
              <Link to="/aboutus">
                <a className="centerItem1" onClick={scrollToTop}>
                  About Us
                </a>
              </Link>
            </ul>
            <ul className="foot2">
              <Link to="/dashboard?tab=profile">
                <a className="centerItem1" onClick={scrollToTop}>
                My Profile  
                </a>
              </Link>
              <br />
              <Link to="/dashboard?tab=mycoins">
                <a className="centerItem1" onClick={scrollToTop}>
                My Coins
                </a>
              </Link>
              <br />
            

              <Link to="/dashboard?tab=posts">
                <a className="centerItem1" onClick={scrollToTop}>
                My Posts
                </a>
              </Link>
              <br />
              <Link to="/dashboard?tab=voucherlist">
                <a className="centerItem1" onClick={scrollToTop}>
               Voucher
                </a>
              </Link>
              <br />
              <Link to="/dashboard?tab=dashbookmark">
                <a className="centerItem1" onClick={scrollToTop}>
               Bookmarks
                </a>
              </Link>
              <br />
              <Link to="/product">
                <a className="centerItem1" onClick={scrollToTop}>
               Products
                </a>
              </Link>

             

            </ul>
          </div>
          <div className="f3">
            <ul className="foot3">
              <p>Contact us</p>
              <a href="tel:+91989889889">
                <li>+91 989889889</li>
              </a>
              <a href="mailto:support@saffair.in">
                <li>support@saffair.in</li>
              </a>
            </ul>
            <ul className="social">
              <p className="text-align">Socials</p>
              <div className="socialapp">
                <a href="https://www.facebook.com/share/sYCKRUGcdDQR8exy/?mibextid=LQQJ4d" target="blank" className="icon1">
                  <FontAwesomeIcon icon={faSquareFacebook} />
                </a>
                <a href="https://www.instagram.com/saff_air?igsh=OWo5bm9lY2dud2t2&utm_source=qr" className="icon1" target="_blank">
                  <FontAwesomeIcon icon={faSquareInstagram} />
                </a>


                <a href="https://x.com/saff_air?s=21&t=vaXYQmjylPtSS4rtdTueDQ" target="blank" className="icon1">
                  <FontAwesomeIcon icon={faSquareXTwitter} />
                </a>
                <a href="https://www.linkedin.com/company/saffair/" target="blank" className="icon1">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="https://www.youtube.com/@Saffair-india" target="blank" className="icon1">
                  <FontAwesomeIcon icon={faSquareYoutube} />
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
