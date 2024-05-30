import React from "react";
import "./share2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSquareFacebook,
    faLinkedin,
    faSquareXTwitter,
    faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

export default function Share2() {

    const shareToWhatsApp = () => {
        // Get the current URL
        const currentUrl = window.location.href;
      
        // Construct the WhatsApp share URL
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`;
      
        // Open the WhatsApp share URL in a new tab
        window.open(whatsappUrl, "_blank");
      };
      
    return (
        <div className="share2con">
            <div className="Jack">
                <p className="share2">Like what you see? Share with your friend</p>
                <icons className="share2Icons">
                    <FontAwesomeIcon className="ic" icon={faSquareFacebook} />
                    <FontAwesomeIcon className="ic" icon={faSquareXTwitter} />
                    <FontAwesomeIcon className="ic" icon={faLinkedin} />
                    <FontAwesomeIcon className="ic" icon={faWhatsapp} onClick={shareToWhatsApp}/>
                </icons>
            </div>
        </div>
    );
}