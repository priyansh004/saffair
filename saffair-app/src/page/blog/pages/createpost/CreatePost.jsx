import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate } from "date-fns";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PDFViewer from "./PDFViewer";
import { Document, Page } from 'react-pdf';

export default function CreatePost() {

  ////////Quiz functions
  const [quizVisible, setQuizVisible] = useState(false);

  const [quizData, setQuizData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswerIndex: null,
  });


  const handleOptionChange = (index, value) => {
    const updatedOptions = [...quizData.options];
    updatedOptions[index] = value;
    setQuizData({
      ...quizData,
      options: updatedOptions,
    });
  };

  const handleCorrectAnswerChange = (index) => {
    setQuizData({
      ...quizData,
      correctAnswerIndex: index,
    });
  };
  const handleAddQuiz = () => {
    const updatedFormData = {
      ...formData,
      quiz: [
        ...(formData.quiz || []),
        {
          quizQuestion: quizData.question,
          quizOptions: quizData.options,
          correctAnswer: quizData.options[quizData.correctAnswerIndex] || "",
        },
      ],
    };
    setFormData(updatedFormData);
    console.log(updatedFormData);
  };

  /////////Form publiched API
  const [publishError, setPublishError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:6600/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        // navigate(`/post/${data.slug}`);
        navigate(`/blog`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  /////////Tag adding functions


  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleTagAdd = () => {
    if (newTag.trim() !== '' && tags.length < 3 && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
      // Add the following line to update formData
      setFormData({ ...formData, tags: [...tags, newTag] });
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    // Add the following line to update formData
    setFormData({ ...formData, tags: tags.filter(tag => tag !== tagToRemove) });
  };


  /////////Documents upload functions

  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    tags: [],
  });

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [documentUploadError, setDocumentUploadError] = useState(null);
  const [documentUploadProgress, setDocumentUploadProgress] = useState(null);
  // const [documentDownloadURL, setDocumentDownloadURL] = useState(null);
  const navigate = useNavigate();


  const handleImageORDocument = async (x) => {
    if (!file) {
      setImageUploadError("Please select a File");
    }
    else if (file.type === "image/jpeg" || file.type === "image/png") {
      await handleUpdloadImage(x);
    } else {
      await handleUploadDocument(x);
    }
  }
  const handleUpdloadImage = async (x) => {
    try {
      console.log("file = ", file)
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
            if (x === 1) {
              setFormData({ ...formData, image1: downloadURL });
            }
            else if (x === 2) {
              setFormData({ ...formData, image2: downloadURL });
            }
            else if (x === 3) {
              setFormData({ ...formData, image3: downloadURL });
            }
          });
        }
      );
    } catch (error) {
      console.log("object");
      setImageUploadError("Image upload failed.....");
      setImageUploadProgress(null);
      console.log(error);
    }
  };


  const handleUploadDocument = (x) => {
    try {
      // console.log(file)
      console.log("file = ", file)

      if (!file) {
        setDocumentUploadError("Please select a document");
        return;
      }

      setDocumentUploadError(null);

      // Get reference to Firebase Storage
      const storage = getStorage();

      // Generate a unique file name
      const fileName = new Date().getTime() + "-" + file.name;

      // Create a reference to the storage location
      const storageRef = ref(storage, fileName);

      // Upload the file
      //  const metadata = {
      //           contentType: file.mimetype,
      //       };

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setDocumentUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setDocumentUploadError("Document upload failed");
          setDocumentUploadProgress(null);
        },
        () => {
          // Once upload is complete, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDocumentUploadProgress(null);
            setDocumentUploadError("Document upload successfully");
            // Set the download URL in the state
            if (x === 1) {
              setFormData({ ...formData, image1: downloadURL });
            }
            else if (x === 2) {
              setFormData({ ...formData, image2: downloadURL });
            }
            else if (x === 3) {
              setFormData({ ...formData, image3: downloadURL });
            }
          });
        }
      );
    } catch (error) {
      console.log("object")
      setDocumentUploadError("Document upload failed");
      setDocumentUploadProgress(null);
      console.error('=>>>> ', error);
    }
  };



  const [cselectedOption, csetSelectedOption] = useState("Blog");
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

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };
  const [isDivVisible2, setDivVisible2] = useState(false);

  const showDiv2 = () => {
    setDivVisible2(true);
  };
  const hideDiv2 = () => {
    setDivVisible2(false);
  };

  const [isDivVisible3, setDivVisible3] = useState(false);

  const showDiv3 = () => {
    setDivVisible3(true);
  };
  const hideDiv3 = () => {
    setDivVisible3(false);
  };

  useEffect(() => {
    // Fetch events from backend
    fetchEventsFromBackend();
  }, []);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  const fetchEventsFromBackend = async () => {
    try {
      // Fetch events data from backend
      const response = await fetch('http://localhost:6600/eventstitle');
      const data = await response.json();

      // Assuming events data is an array of objects with a 'title' property
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const isImage = (url) => {
    return /\.(jpeg|jpg|gif|png)$/.test(url);
  };

  return (
    <div className="mb-6 p-3 max-w-3xl mx-auto mt-8 min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create A Readings
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="Select reading type" className="block text-sm font-medium text-gray-700">
          Select reading type
        </label>
        <Select

          onChange={(e) =>
            setFormData({ ...formData, readingType: e.target.value })
          }
        >
          <option value="Blog">Blog</option>
          <option value="News">News</option>
          <option value="Update">Update</option>
          <option value="Legal Updates">Legal Updates</option>
          <option value="innovation">innovation</option>
          <option value="get your voice bigger with community">get your voice bigger with community</option>
          <option value="suggest a reforms">suggest a reforms</option>
          <option value="campaign">join our campaigns</option>
          <option value="Donate/Sponser">Donate/Sponser</option>
          <option value="Get outdoor Air Analyzer">Get outdoor Air Analyzer</option>
          <option value="Need Community Support/Suggestions/Survey">Need Community Support/Suggestions/Survey</option>
        </Select>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="uncategorized">Uncategorized</option>
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
          </select>
        </div>
        {formData.readingType === "campaign" ? (
          <div className="conditional-div gap-4">
            {/* Conditional div content for campaign */}
            <div>
              <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <select
                id="Title"
                name="Title"
                value={selectedEvent}
                onChange={handleEventChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.title}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-4 justify-between">

              <TextInput
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              < div className=" gap-2">
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
                    onClick={() => handleImageORDocument(1)}
                    disabled={imageUploadProgress || documentUploadProgress}
                  >
                    {(documentUploadProgress || imageUploadProgress) ? (
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={documentUploadProgress || imageUploadProgress}
                          text={`${(documentUploadProgress || imageUploadProgress) || 0}%`}
                        />
                      </div>
                    ) : (
                      "Upload image"
                    )}
                  </Button>
                </div>
                {(documentUploadError || imageUploadError) && <Alert color="failure">{(documentUploadError || imageUploadError)}</Alert>}
                {/* {(formData.pdf || formData.image) && (
              <img
                src={formData.pdf || formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
              />
            )} */}
                {
                  (formData.image1) ? <img
                    src={formData.image1}
                    alt={formData.image1}
                    className="w-full h-72 object-cover"
                  /> : <>
                    {/* {documentDownloadURL && (
                <PDFPreview pdfPath={documentDownloadURL} />
              )} */}

                  </>

                }


                {!isDivVisible2 && (
                  <Button onClick={showDiv2} gradientDuoTone="cyanToBlue" className=" text-white my-2 py-2 px-4 rounded">add more</Button>
                )}
                {isDivVisible2 && (
                  <div>
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
                        onClick={() => handleImageORDocument(2)}
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
                      <Button onClick={hideDiv2}>Remove</Button>

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
                  </div>
                )}


                {/* 
                {!isDivVisible3 && (

                  <Button onClick={showDiv3} gradientDuoTone="cyanToBlue" className=" text-white my-2 py-2 px-4 rounded">add third document</Button>
                )}
                {isDivVisible2 && (
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
                      onClick={() => handleImageORDocument(3)}
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
                        "Upload Image 3"
                      )}
                    </Button>
                    <Button onClick={hideDiv3}>Remove</Button>

                  </div>
                )} */}

{/* 
                {imageUploadError && (
                  <Alert color="failure">{imageUploadError}</Alert>
                )}
                {formData.image3 && (
                  <img
                    src={formData.image3}
                    alt="upload"
                    className="w-full h-72 object-cover"
                  />
                )} */}


              </div>
            </div>

          </div>
        ) : (
          <div className="conditional-div">
            {/* Conditional div content for other selections */}
            <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />


            </div>
            < div className="my-2 gap-10">
              <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput
                  type="file"
                  accept="*/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone="cyanToBlue"
                  size="sm"
                  outline
                  onClick={() => handleImageORDocument(1)}
                  disabled={imageUploadProgress || documentUploadProgress}
                >
                  {(documentUploadProgress || imageUploadProgress) ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={documentUploadProgress || imageUploadProgress}
                        text={`${(documentUploadProgress || imageUploadProgress) || 0}%`}
                      />
                    </div>
                  ) : (
                    "Upload document"
                  )}
                </Button>
              </div>
              {(documentUploadError || imageUploadError) && <Alert color="failure">{(documentUploadError || imageUploadError)}</Alert>}
             
              {
                (formData.image1) ? <img
                  src={formData.image1}
                  alt={formData.image1}
                  className="w-full h-72 object-cover"
                /> : <>
                  {/* {documentDownloadURL && (
                <PDFPreview pdfPath={documentDownloadURL} />
              )} */}

                </>

              }
              






              {!isDivVisible2 && (
                <Button onClick={showDiv2} gradientDuoTone="cyanToBlue" className=" text-white my-2 py-2 px-4 rounded">add more</Button>
              )}
              {isDivVisible2 && (
                <div>
                  <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput
                      type="file"
                      accept="*/*"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                      type="button"
                      gradientDuoTone="cyanToBlue"
                      size="sm"
                      outline
                      onClick={() => handleImageORDocument(2)}
                      disabled={imageUploadProgress || documentUploadProgress}
                    >
                      {(documentUploadProgress || imageUploadProgress) ? (
                        <div className="w-16 h-16">
                          <CircularProgressbar
                            value={documentUploadProgress || imageUploadProgress}
                            text={`${(documentUploadProgress || imageUploadProgress) || 0}%`}
                          />
                        </div>
                      ) : (
                        "Upload document"
                      )}
                    </Button>
                  </div>
                  {(documentUploadError || imageUploadError) && <Alert color="failure">{(documentUploadError || imageUploadError)}</Alert>}
                  {/* {(formData.pdf || formData.image) && (
              <img
                src={formData.pdf || formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
              />
            )} */}
                  {
                    (formData.image2) ? <img
                      src={formData.image2}
                      alt={formData.image2}
                      className="w-full h-72 object-cover"
                    /> : <>
                      {/* {documentDownloadURL && (
                <PDFPreview pdfPath={documentDownloadURL} />
              )} */}

                    </>

                  }

                </div>
              )}


              {/* 
                {!isDivVisible3 && (

                  <Button onClick={showDiv3} gradientDuoTone="cyanToBlue" className=" text-white my-2 py-2 px-4 rounded">add third document</Button>
                )}
                {isDivVisible2 && (
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
                      onClick={() => handleImageORDocument(3)}
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
                        "Upload Image 3"
                      )}
                    </Button>
                    <Button onClick={hideDiv3}>Remove</Button>

                  </div>
                )} */}


              {imageUploadError && (
                <Alert color="failure">{imageUploadError}</Alert>
              )}
              {formData.image3 && (
                <img
                  src={formData.image3}
                  alt="upload"
                  className="w-full h-72 object-cover"
                />
              )}


            </div>


          </div>
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


        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1">
              <span>{tag}</span>
              <button type="button" onClick={() => handleTagRemove(tag)} className="ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.707 6.707a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586 6.707 5.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {tags.length < 3 && (
            <div className="flex items-center bg-gray-200 rounded-full px-3 py-1">
              <input
                type="text"
                value={newTag}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none focus:outline-none"
                placeholder="Add tag"
              />
              <button type="button" onClick={handleTagAdd}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 012 0v4h4a1 1 0 010 2h-4v4a1 1 0 01-2 0v-4H5a1 1 0 010-2h4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>


        <div>
          <Button gradientDuoTone="cyanToBlue" onClick={() => setQuizVisible(!quizVisible)} className="my-4">
            {quizVisible ? 'Hide Quiz Form' : 'Add Quiz'}
          </Button>

          {quizVisible && (
            <div>
              <label htmlFor="Qna" className="block text-sm font-medium text-gray-700">
                QNA (select the right answer below the option)
              </label>
              <TextInput
                type="text"
                placeholder="Quiz heading"
                value={quizData.question}
                onChange={(e) => setQuizData({ ...quizData, question: e.target.value })}
                className="mb-4 mt-2"
              />
              {quizData.options.map((option, index) => (
                <div key={index} className="gap-5">
                  <TextInput
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="m-3"
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={quizData.correctAnswerIndex === index}
                    onChange={() => handleCorrectAnswerChange(index)}
                  />
                  <label className="m-3">Correct Answer</label>
                </div>
              ))}
              <Button onClick={handleAddQuiz} className="my-4">Save Quiz</Button>
            </div>
          )}
        </div>

        {currentUser.isAdmin ? (
          <Button type="submit" gradientDuoTone="cyanToBlue">
            Publish
          </Button>
        ) : (
          <Button type="submit" gradientDuoTone="cyanToBlue">
            Upload
          </Button>
        )}
        {publishError && (
          <>
            {console.log(publishError)}
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          </>
        )}

      </form>
    </div>
  );
}