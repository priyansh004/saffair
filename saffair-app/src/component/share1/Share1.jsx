import './share1.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faSquareInstagram, faSquareXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'
export default function Share1() {
    return (
        <>
            <div className="shareCon">
                <div className="shareconTagline">
                    <h3>Share with your community!</h3>
                </div>

                <div className="shareicons">
                    <FontAwesomeIcon className='icons' icon={faSquareFacebook} />
                    <FontAwesomeIcon className='icons' icon={faSquareInstagram} />
                    <FontAwesomeIcon className='icons' icon={faSquareXTwitter} />
                    <FontAwesomeIcon className='icons' icon={faLinkedin} />
                </div>

            </div>
        </>
    )
}
