import React from "react";
import "./share2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSquareFacebook,
    faLinkedin,
    faSquareXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Share2() {
    return (
        <div className="share2con">
            <div className="Jack">
                <p className="share2">Like what you see? Share with your friend</p>
                <icons className="share2Icons">
                    <FontAwesomeIcon className="ic" icon={faSquareFacebook} />
                    <FontAwesomeIcon className="ic" icon={faSquareXTwitter} />
                    <FontAwesomeIcon className="ic" icon={faLinkedin} />
                </icons>
            </div>
        </div>
    );
}