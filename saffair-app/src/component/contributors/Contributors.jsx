import { Alert, Button, Spinner, TextInput, Textarea } from "flowbite-react";
import { useRef,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { ToggleSwitch } from "flowbite-react";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../../redux/user/userSlice";
import { getAuth, signInWithPhoneNumber, confirmOTP, RecaptchaVerifier, updatePhoneNumber, RecaptchaVerifier_Instance, signInWithEmailAndPassword} from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import { app } from "../../firebase.js"


const employmentTypes = [
  { value: "", label: "Select Employment Type" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
  { value: "Trainee", label: "Trainee" },
];
const fieldTypes = [
  { value: "", label: "Select Field" },
  { value: "Sales", label: "Sales" },
  { value: "Project Management", label: "Project Management" },
  { value: "IT", label: "IT" },

];


const genderOptions = [
  { value: "", label: "Select Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const gradeOptions = [
  { value: "", label: "Select Grade" },
  { value: "A", label: "85-100%" },
  { value: "B", label: "70-84%" },
  { value: "C", label: "55-69%" },
  { value: "D", label: "35-54%" },
  { value: "E", label: "0-34%" },
];

export default function Contributors() {
  // const auth = getAuth(app);
  
  const {
    currentUser,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.user);
  const [bio, setBio] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEducationWork, setShowEducationWork] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [users, setUsers] = useState([]);
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const auth = getAuth(app); // Get the Auth instance from the initialized Firebase app
  const configureCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth,'sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        handleSendCode();
        console.log("Recaptcha verified");
      },
      'appVerificationDisabledForTesting': true, // Add this line if you're running tests
      defaultCountry: "IN"
    });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    configureCaptcha();
    const phoneNum = "+91" + phoneNumber;
    console.log(phoneNum);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNum, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");
      }).catch((error) => {
        // Error; SMS not sent
        console.log("SMS not sent", error);
      });
  };
  const handleVerifyCode = (event) => {
    let otp = verificationCode;
  
    if (otp.length === 6) {
      // Verify OTP
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        // User signed in successfully.
        let user = result.user;
        console.log(user);
        alert('User signed in successfully');
        // ...
      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        alert('User couldn\'t sign in (bad verification code?)');
      });
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const phandleChange = (e) => {
    setPhoneNumber(e.target.value);

    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const ohandleChange = (e) => {
    setVerificationCode(e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:6600/api/user/getusers`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            // setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false); // Hide any previous alert messages
    setShowForm(false); // Hide the form
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(
        `http://localhost:6600/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        setShowAlert(true);
      } else {
        dispatch(updateSuccess(data));
        setShowAlert(true);
        setUpdateUserSuccess(
          "YOU HAVE SUCCESSFULLY SUBMITTED YOUR RESPONSE ! "
        );
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      setShowAlert(true);
    }
  };
  const toggleIsReq = async (userId) => {
    try {
      // Make a PUT request to the backend API endpoint
      const res = await fetch(
        `http://localhost:6600/api/user/toggleReq/${userId}`,
        {
          method: "PUT",
          credentials: "include", // If needed
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        // Update the user list with updated isAdmin status
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isReq: !user.isReq } : user
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(formData);
  // const recaptchaContainerRef = React.createRef();

  
  // const configureCaptcha = () => {
  //   window.recaptchaVerifier = new app.auth.RecaptchaVerifier('sign-in-button', {
  //     'size': 'invisible',
  //     'callback': (response) => {
  //       // reCAPTCHA solved, allow signInWithPhoneNumber.
  //       this.state.onSignInSubmit();
  //       console.log("Recaptcha verified");
  //     },
  //     defaultCountry: "IN"
  //   });
  // };

  // const handleSendCode = async (e) => {
  //   e.preventDefault();
  //   configureCaptcha();
  //   const phoneNum = "+91" + phoneNumber;
  //   console.log(phoneNum);
  //   const appVerifier = window.recaptchaVerifier;
  //   app.auth().signInWithPhoneNumber(phoneNum, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       window.confirmationResult = confirmationResult;
  //       console.log("OTP has been sent");
  //     }).catch((error) => {
  //       // Error; SMS not sent
  //       console.log("SMS not sent", error);
  //     });
  // };

  // const handleVerifyCode = async (e) => {
  //   e.preventDefault();
  //   const code = this.state.otp;
  //   console.log(code);
  //   window.confirmationResult.confirm(code).then((result) => {
  //     // User signed in successfully.
  //     const user = result.user;
  //     console.log(JSON.stringify(user));
  //     alert("User is verified");
  //   }).catch((error) => {
  //     // User couldn't sign in (bad verification code?)
  //     console.log("Verification failed", error);
  //   });
  // };


  // const handleSendCode = (event) => {
  //   event.preventDefault();
  //   setHasFilled(true);
  //   generateRecaptcha();
  //   let appVerifier = window.recaptchaVerifier;
  //   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       window.confirmationResult = confirmationResult;
  //     }).catch((error) => {
  //       // Error; SMS not sent
  //       console.log(error);
  //     });
  // }
  
  // const handleVerifyCode = (event) => {
  //   let otp = verificationCode;
    

  //   if (otp.length === 6) {
  //     // verifu otp
  //     let confirmationResult = window.confirmationResult;
  //     confirmationResult.confirm(otp).then((result) => {
  //       // User signed in successfully.
  //       let user = result.user;
  //       console.log(user);
  //       alert('User signed in successfully');
  //       // ...
  //     }).catch((error) => {
  //       // User couldn't sign in (bad verification code?)
  //       // ...
  //       alert('User couldn\'t sign in (bad verification code?)');
  //     });
  //   }
  // }
  return (
    <div className="min-h-screen w-full">
      {currentUser.isReq ? (
        <Alert>SUBMITTED</Alert>
      ) : (
        <div className="flex max-w-8xl flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <form
              className="flex-col gap-4 mx-4"
              onSubmit={(e) => {
                handleSubmit(e);
                toggleIsReq(currentUser._id);
              }}
            >
              <div className="pdetails">
                <p className="pdetailstag mb-4 font-bold">Personal details</p>
                <div className="thenames grid grid-cols-1 mb-2 md:grid-cols-2 sm:grid-cols-2">
                  <div>
                    <label>
                      First Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="First Name"
                      id="firstName"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label>
                      Last Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="last Name"
                      id="lastName"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label>
                      Mobile Number<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex flex-col gap-3  align-middle ">
                      {/* <PhoneInput  showTitle={true} country={"in"} value={phoneNumber} onChange={phandleChange} /> */}

                      <TextInput
                        type="text"
                        id="phone"
                        value={phoneNumber}
                        onChange={phandleChange}
                        maxLength={10} // Maximum length including the country code
                        placeholder="XXXXXXXXXX" // Placeholder with country code
                        required
                      />
                      <div className="mb-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded sign-in-button" onClick={handleSendCode}>
                          Send OTP
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label>
                      Enter code:<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex flex-col gap-3 ">
                      <TextInput
                        type="number"
                        placeholder=""
                        id="number"
                        maxLength={4}
                        value={verificationCode}
                        onChange={ohandleChange}
                        required
                      />
                      <div className="mb-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleVerifyCode}>
                          Verify OTP
                        </button>
                      </div>
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                  </div>



                  <div>
                    <label>
                      Email ID<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="name@company.com"
                      id="email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>


                <label>Location</label>
                <div className="grid grid-cols-1 mb-2 md:grid-cols-4 sm:grid-cols-2 gap-4 mt-2">
                  {/* <div>
                    <label>
                      Country<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="Country"
                      id="country"
                      onChange={handleChange}
                      required
                    />
                  </div> */}
                  <div>
                    <label>
                      City<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="City"
                      id="city"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label>
                      State<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="State"
                      id="state"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label>
                      Pincode<span className="text-red-500 ml-1">*</span>
                    </label>
                    <TextInput
                      type="text"
                      placeholder="Pincode"
                      id="pincode"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="bio mb-3 grid sm:grid-cols-2">
                  <div>
                    <label>
                      Bio<span className="text-red-500 ml-1">*</span>
                    </label>
                    <br />
                    <Textarea
                      rows="4"
                      cols="40"
                      id="bio"
                      value={bio}
                      // onChange={handleChange}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                    <p className="text-gray-500 text-xs">
                      {200 - bio.length} characters remaining
                    </p>
                  </div>
                </div>
                <div className="sociallinks">
                  <label>Social Media Links</label>
                  <div className="personal-details grid grid-cols-1 mt-2 mb-2 md:grid-cols-2 sm:grid-cols-2 ">
                    <div className="facebookpart flex">
                      <FontAwesomeIcon
                        icon={faFacebook}
                        className="text-2xl mr-2 mt-2"
                      />
                      <TextInput
                        type="text"
                        placeholder="Facebook"
                        id="facebook"
                        name="facebook"
                        className="w-full"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="twitterpart flex">
                      <FontAwesomeIcon
                        icon={faTwitter}
                        className="text-2xl mr-2 mt-2"
                      />
                      <TextInput
                        type="text"
                        placeholder="Twitter"
                        id="twitter"
                        name="twitter"
                        className="w-full"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="instapart flex">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="text-2xl mr-2 mt-2"
                      />
                      <TextInput
                        type="text"
                        placeholder="Instagram"
                        id="instagram"
                        name="instagram"
                        className="w-full ml-1"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="linkedinpart flex">
                      <FontAwesomeIcon
                        icon={faLinkedin}
                        className="text-2xl mr-2 mt-2"
                      />
                      <TextInput
                        type="text"
                        placeholder="LinkedIn"
                        id="linkedin"
                        name="linkedin"
                        className="w-full ml-1"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <ToggleSwitch
                    className="mb-1"
                    checked={showEducationWork}
                    label="Job Alert"
                    onChange={() => setShowEducationWork(!showEducationWork)}
                  />
                </div>
              </div>

              {showEducationWork && (
                <>
                  <div className="personaldetails mt-3">
                    <p className="personaltag mb-4 font-bold">Personal Details</p>
                    <div className="mb-2">
                      <div className="grid grid-cols-1 mb-3 md:flex sm:grid-cols-2 gap-5 ">
                        <div>
                          <label>
                            Date of Birth

                          </label>
                          <TextInput
                            type="date"
                            id="dob"
                            onChange={handleChange}

                          />
                        </div>
                        <div>
                        </div>
                        <div>
                          <label>
                            Gender
                          </label><br />
                          <select id="gender" onChange={handleChange} >
                            {genderOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="hr-line border-1 border-black mt-3 opacity-30 mb-3"></hr>
                  <div className="Edudetails">
                    <p className="edutag mb-4 font-bold">Education Details</p>
                    <div className="thenames grid grid-cols-1 mb-2 md:grid-cols-4 sm:grid-cols-2">
                      <div>
                        <label>
                          Institute Name

                        </label>
                        <TextInput
                          type="text"
                          placeholder="institute Name"
                          id="instituteName"
                          onChange={handleChange}

                        />
                      </div>
                      <div>
                        <label>
                          Degree<span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="BTech"
                          id="degree"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label>
                          Field of Study
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="Mechanical"
                          id="fieldOfStudy"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label>Grade</label>
                        <br />
                        <select id="grade" onChange={handleChange}>
                          {gradeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-1 mb-3 md:flex sm:grid-cols-2 gap-5 ">
                        <div>
                          <label>
                            Start Date
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <TextInput
                            type="month"
                            id="startDate"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label>
                            End Date<span className="text-red-500 ml-1">*</span>
                          </label>
                          <TextInput
                            type="month"
                            id="endDate"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="hr-line border-1 border-black mt-3 opacity-30 mb-3"></hr>
                  <div className="workdetails">
                    <p className="workag mb-4 font-bold">Work Details</p>
                    <div className="thenames grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 mb-2">
                      <div>
                        <label>
                          Company Name
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="Company Name"
                          id="companyName"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label>
                          Position<span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="Content Writer"
                          id="position"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label>
                          Field
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <br />
                        <select
                          id="fieldType"
                          onChange={handleChange}
                          required
                        >
                          {fieldTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>
                          Employment Type
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <br />
                        <select
                          id="employmentType"
                          onChange={handleChange}
                          required
                        >
                          {employmentTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label>Company Location</label>
                    <div className="grid grid-cols-1 mb-2 md:grid-cols-4 sm:grid-cols-2 gap-4 mt-2">
                      {/* <div>
                        <label>
                          Country<span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="Country"
                          id="companyCountry"
                          onChange={handleChange}
                          required
                        />
                      </div> */}
                      <div>
                        <label>
                          City<span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="City"
                          id="companyCity"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label>
                          State<span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="State"
                          id="companyState"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label>
                          Pincode<span className="text-red-500 ml-1">*</span>
                        </label>
                        <TextInput
                          type="text"
                          placeholder="Pincode"
                          id="companyPincode"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <div className="grid grid-cols-1 mb-3 md:flex sm:grid-cols-2 gap-5 ">
                        <div>
                          <label>
                            Joining Date
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <TextInput
                            type="month"
                            id="companyJoiningDate"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label>
                            End Date<span className="text-red-500 ml-1">*</span>
                          </label>
                          <TextInput
                            type="month"
                            id="companyEndDate"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="justify-center mb-3">
                <Button
                  gradientDuoTone="cyanToBlue"
                  outline
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-1">Loading...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
            {showAlert && (
              <Alert
                className="mt-5"
                color={errorMessage ? "failure" : "success"}
              >
                {errorMessage
                  ? errorMessage
                  : "User's profile updated successfully and wait for the approval"}
              </Alert>
            )}
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
