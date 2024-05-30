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
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate } from "date-fns";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PDFPreview from './PDFPreview';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [quizData, setQuizData] = useState({
    question: "",
    options: ["", "", ""],
    correctAnswer: "",
  });

  const [documentUploadError, setDocumentUploadError] = useState(null);
  const [documentUploadProgress, setDocumentUploadProgress] = useState(null);
  const [documentDownloadURL, setDocumentDownloadURL] = useState(null);
  const navigate = useNavigate();
  const handleImageORDocument = async () => {
    if (!file) {
      setImageUploadError("Please select a File");
    }
    else if (file.type === "image/jpeg" || file.type === "image/png") {
      await handleUpdloadImage();
    } else {
      await handleUploadDocument();
    }
  }
  const handleUpdloadImage = async () => {
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
            setFormData({ ...formData, image: downloadURL });
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

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...quizData.options];
    updatedOptions[index] = value;
    setQuizData({
      ...quizData,
      options: updatedOptions,
    });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      quizQuestion: quizData.question,
      quizOptions: quizData.options,
      correctAnswer: quizData.correctAnswer,
    });
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadDocument = () => {
    try {
      // console.log(file)
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
            // setDocumentUploadError("Document upload successfully");
            // Set the download URL in the state
            setDocumentDownloadURL(downloadURL);
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


  const [selectedOption, setSelectedOption] = useState("");

  const mediahandleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const mediahandleSubmit = () => {
    if (selectedOption === "upload") {
      // Handle upload
      console.log("Upload selected");
    } else {
      // Handle link
      console.log("Link selected");
    }
  };
  const chandleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const chandleSubmit = () => {
    if (selectedOption === "campaign") {
      // Handle campaign selection
      console.log("Join our campaigns selected");
    } else {
      // Handle other selections
      console.log("Other selection");
    }
  };
  const PDFViewer = ({ pdfUrl }) => {
    return (
      <div className="w-full h-72 object-cover">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
            defaultScale={1.5}
          />
        </Worker>
      </div>
    );
  };

  const [cselectedOption, csetSelectedOption] = useState("Blog");

  return (
    <div className="p-3 max-w-3xl mx-auto mt-8 min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create A Readings
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        
        {currentUser.isAdmin && (
          <Select

            onChange={(e) =>
              setFormData({ ...formData, readingType: e.target.value })
            }
          >
            <option value="Blog">Blog</option>
            <option value="News">News</option>
            <option value="Update">Update</option>
            <option value="legal">Legal Updates</option>
            <option value="Blog">innovation</option>
            <option value="community">get your voice bigger with community</option>
            <option value="Blog">suggest a reforms</option>
            <option value="campaign">join our campaigns</option>
            <option value="Blog">Donate/Sponser</option>
            <option value="Blog">Get outdoor Air Analyzer</option>
            <option value="support">Need Community Support/Suggestions/Survey</option>
          </Select>
        )}


        {formData.readingType === "campaign" ? (
          <div className="conditional-div gap-4">
            {/* Conditional div content for campaign */}
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

              <div className="my-1 flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput
                  type="file"

                  accept="pdf/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone="cyanToBlue"
                  size="sm"
                  outline
                  onClick={handleUpdloadImage}
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
                    "Upload Image"
                  )}
                </Button>
                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

              </div>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="upload"
                  className="w-full h-72 object-cover"
                />
              )}
            </div>

          </div>
        ) : (
          <div className="conditional-div">
            {/* Conditional div content for other selections */}
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
              <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <select
                  value={selectedOption}
                  onChange={mediahandleOptionChange}
                  className="border border-gray-300 rounded-md"
                >
                  <option value="upload">Upload</option>
                  <option value="link">Link</option>
                </select>

              </div>

            </div>
            {selectedOption === "link" ? (
              <div className="my-2 flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <input
                  type="text"
                  placeholder="Enter URL"
                  className="border border-gray-300 rounded-md flex-1"
                />

              </div>
            ) : (
              <div className="my-2 flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput
                  type="file"
                  accept="*/*"
                  // accept="application/pdf,image/jpeg,image/png,image/x-eps"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone="cyanToBlue"
                  size="sm"
                  outline
                  onClick={handleImageORDocument}
                  disabled={documentUploadProgress || imageUploadProgress}
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
            )}

            {(documentUploadError || imageUploadError) && <Alert color="failure">{(documentUploadError || imageUploadError)}</Alert>}
            {/* {(formData.pdf || formData.image) && (
              <img
                src={formData.pdf || formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
              />
            )} */}
            {
              (formData.image) ? <img
                src={formData.pdf || formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
              /> : <>
                {/* {documentDownloadURL && (
                <PDFPreview pdfPath={documentDownloadURL} />
              )} */}
                {
                  documentDownloadURL
                }
              </>

            }
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

        {currentUser.isAdmin ? (
          <div>
          <h2>Create Quiz</h2>
          <TextInput
            type="text"
            placeholder="Quiz heading"
            name="question"
            value={quizData.question}
            onChange={handleQuizChange}
            className="mb-2 mt-2"
          />
          {quizData.options.map((option, index) => (
            <TextInput
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mb-2"
            />
          ))}
          <TextInput
            type="text"
            placeholder="Correct Answer"
            name="correctAnswer"
            value={quizData.correctAnswer}
            onChange={handleQuizChange}
            className="mb-2"
          />
          <Button onClick={handleQuizSubmit}>Add Quiz</Button>
        </div>
        ):(
          <div></div>
        )}
        
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
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}