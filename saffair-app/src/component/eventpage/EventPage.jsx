import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function EventPage() {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:6600/api/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEventInfo(data);
        } else {
          console.log("Error!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleUploadImage = async (imageNumber) => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            if (imageNumber === 1) {
              setFormData({ ...formData, image1: downloadURL });
            } else if (imageNumber === 2) {
              setFormData({ ...formData, image2: downloadURL });
            }
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      eventTitle: eventInfo.eventTitle,
    }));
    console.log(formData)

    try {
      const res = await fetch(
        `http://localhost:6600/api/events/addEntry/${id}/${currentUser._id}`,
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
      // console.log(data)
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/events`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const [links, setLinks] = useState(['']); // Initialize with an empty link field
  const [uploadErrors, setUploadErrors] = useState([]);

  const handleAddLink = () => {
    if (links.length < 2) {
      setLinks([...links, '']);
    } else {
      setUploadErrors(['Maximum 2 links allowed']);
    }
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };


  return (
    <>
      <div className="mt-20" >
        {eventInfo ? (
          <

            >
            <div className="flex justify-center text-3xl mb-4">Event name: {eventInfo.eventTitle}</div>
            <img src={eventInfo.eventImage} className="w-full h-screen object-cover" alt="eventImage" />
            <div
              className="post-content   mb-6 mt-4  ml-2"
              dangerouslySetInnerHTML={{ __html: eventInfo.eventDescription }}
            />


            <div className="p-3 max-w-3xl mx-auto mt-8 min-h-screen">

              <h1 className="text-center text-3xl my-7 font-semibold">
                Let's Participate
              </h1>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {currentUser.isAdmin && (
                  <Select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contributionType: e.target.value,
                      })
                    }
                  >

                    <option value="Campaigns">Join our Campaigns</option>

                  </Select>
                )}
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                  <TextInput
                    type="text"
                    placeholder="Title"
                    required
                    id="title"
                    className="flex-1"
                    value={eventInfo.eventTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, eventTitle: eventInfo.eventTitle })
                    }
                    disabled // Add the disabled attribute to make it read-only
                  />


                  <Select
                    value={eventInfo.category} // Assuming eventinfo is your state containing fetched data
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  // disabled // Add the disabled attribute to make it read-only
                  >
                    <option value="uncategorized">Select a category</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="bollywood">Bollywood</option>
                    <option value="business">Business</option>
                    <option value="crime">Crime</option>
                    <option value="economy">Economy</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="environment">Environment</option>
                    <option value="events">Events</option>
                    <option value="fashion">Fashion</option>
                    <option value="foreign">Foreign</option>
                    <option value="general">General</option>
                    <option value="health">Health</option>
                    <option value="hollywood">Hollywood</option>
                    <option value="international">International</option>
                    <option value="legal">Legal</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="national">National</option>
                    <option value="politics">Politics</option>
                    <option value="religious">Religious</option>
                    <option value="science">Science</option>
                    <option value="sports">Sports</option>
                    <option value="stock market">Stock Market</option>
                    <option value="technology">Technology</option>
                    <option value="weather">Weather</option>
                    <option value="other">Other</option>
                  </Select>

                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    gradientDuoTone="cyanToBlue"
                    size="sm"
                    outline
                    onClick={() => handleUploadImage(1)}
                    disabled={imageUploadProgress}
                  >
                    {imageUploadProgress ? (
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={imageUploadProgress}
                          text={`${imageUploadProgress || 0}%`}
                        />
                      </div>
                    ) : (
                      "Upload Image 1"
                    )}
                  </Button>
                </div>
                {imageUploadError && (
                  <Alert color="failure">{imageUploadError}</Alert>
                )}
                {formData.image1 && (
                  <img
                    src={formData.image1}
                    alt="upload"
                    className="w-full h-72 object-cover"
                  />
                )}
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    gradientDuoTone="cyanToBlue"
                    size="sm"
                    outline
                    onClick={() => handleUploadImage(2)}
                    disabled={imageUploadProgress}
                  >
                    {imageUploadProgress ? (
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={imageUploadProgress}
                          text={`${imageUploadProgress || 0}%`}
                        />
                      </div>
                    ) : (
                      "Upload Image 2"
                    )}
                  </Button>
                </div>
                {imageUploadError && (
                  <Alert color="failure">{imageUploadError}</Alert>
                )}
                {formData.image2 && (
                  <img
                    src={formData.image2}
                    alt="upload"
                    className="w-full h-72 object-cover"
                  />
                )}
                <ReactQuill
                  theme="snow"
                  placeholder="Write something..."
                  className="h-72 mb-12"
                  required
                  onChange={(value) => {
                    setFormData({ ...formData, content: value });
                  }}
                />
                {links.map((link, index) => (
                  <div key={index} className="my-2 flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <input
                      type="text"
                      value={index === 0 ? formData.link1 : formData.link2}
                      onChange={(e) => {
                        const updatedFormData = { ...formData };
                        if (index === 0) {
                          updatedFormData.link1 = e.target.value;
                        } else {
                          updatedFormData.link2 = e.target.value;
                        }
                        setFormData(updatedFormData);
                      }}
                      placeholder="Enter link"
                      className="flex-1 border border-gray-300 rounded-md py-1 px-3"
                    />
                    <Button
                      type="button"
                      gradientDuoTone="redToOrange"
                      size="sm"
                      outline
                      onClick={() => handleRemoveLink(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}


                <div className="flex gap-4">
                  <Button type="button" onClick={handleAddLink} gradientDuoTone="cyanToBlue">
                    Add more Link
                  </Button>

                </div>
                {uploadErrors.length > 0 && (
                  <Alert color="failure">{uploadErrors.join('\n')}</Alert>
                )}

                <Button type="submit" gradientDuoTone="cyanToBlue">
                  Publish
                </Button>
                {publishError && (
                  <Alert className="mt-5" color="failure">
                    {publishError}
                    
                  </Alert>
                )}
              </form>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
