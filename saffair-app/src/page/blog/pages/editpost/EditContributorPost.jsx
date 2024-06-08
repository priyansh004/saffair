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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditContributorPost() {

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const [coinHistory, setCoinHestory] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `http://localhost:6600/getposts?postId=${postId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = { ...formData, publish: true };
      const updatePostRes = await fetch(
        `http://localhost:6600/updatecontributorpost/${postId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
      const data = await updatePostRes.json();
      if (!updatePostRes.ok) {
        setPublishError(data.message);
        return;
      }

      if (updatePostRes.ok) {
        setPublishError(null);
        // navigate({`/post/${postId}`});
        navigate("/blog");
      }

      const updatedCoinHestory = {
        ...coinHistory,
        eventName: "post approved coin",
      };
      const coinRes = await fetch(
        `http://localhost:6600/api/user/add-event/${formData.userId}`,
        {
          method: "put",
          credentials: "include",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(updatedCoinHestory),
        }
      );
      if (!coinRes.ok) {
        alert("something went wrong");
      }
      if (coinRes.ok) {
        alert("successfully added coins");
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

  const handleRemoveImage = (x) => {
    // Create a copy to avoid modifying original formData
    const newFormData = { ...formData };

    // Delete the image property with the dynamic key
    delete newFormData[`image${x}`];

    // Update the state with the modified formData (assuming setFormData is a state setter)
    setFormData(newFormData);
  }

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
  console.log(formData.userId);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4  justify-between">
          <Select>
            <option >{formData.readingType}</option>
          </Select>
          <label htmlFor="title">Title:</label>
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={formData.category}>{formData.category}</option>
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





        {
          formData.image1 && (
            <div className="image-container">
              <img
                src={formData.image1}
                alt={formData.image1}
                className="w-full h-72 object-cover"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleRemoveImage(1)} // Pass image index
              >
                Remove Document
              </button>
            </div>
          )}

        {!formData.image1 && (
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
        )}
        {(documentUploadError || imageUploadError) && <Alert color="failure">{(documentUploadError || imageUploadError)}</Alert>}





        {formData.image2 && (
          <div className="image-container">
            <img
              src={formData.image2}
              alt={formData.image2}
              className="w-full h-72 object-cover"
            />
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleRemoveImage(2)} // Pass image index
            >
              Remove Image
            </button>
          </div>
        )}

        {!formData.image2 && (
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
        )}
        {(documentUploadError || imageUploadError) && <Alert color="failure">{(documentUploadError || imageUploadError)}</Alert>}


        <ReactQuill
          theme="snow"
          value={formData.content}
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

        <TextInput
          type="number"
          max={100}
          placeholder="Give Coins"
          required
          onChange={(event) => {
            setCoinHestory({ ...coinHistory, coinsEarned: event.target.value });
          }}
        />

        <Button type="submit" outline gradientDuoTone="cyanToBlue">
          Update post and publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
