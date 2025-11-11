import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // ต้อง export storage จาก firebase.js
import { useNavigate } from "react-router-dom";

const PortfolioManager = ({ user }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // file จริง
  const [imagePreview, setImagePreview] = useState(null); // preview URL
  const [editingId, setEditingId] = useState(null);
  const [mode, setMode] = useState("edit"); // edit | view
  const [loading, setLoading] = useState(false);

  const collectionRef = collection(db, "portfolios");
  const navigate = useNavigate();

  // โหลด portfolio ของ user
  const fetchData = async () => {
    try {
      const q = query(collectionRef, where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPortfolios(data);
    } catch (err) {
      console.error("Error fetching portfolios:", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // handle image preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // upload image ไป Firebase Storage แล้วคืน URL
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `portfolio-images/${user.uid}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // Add new portfolio
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Please fill all fields");
    setLoading(true);

    try {
      let imageUrl = imagePreview || "https://via.placeholder.com/600x400";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await addDoc(collectionRef, {
        title,
        description,
        uid: user.uid,
        image: imageUrl,
        createdAt: new Date(),
      });

      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      fetchData();
      setMode("view");
    } catch (err) {
      console.error("Error adding portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit portfolio
  const handleEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setImagePreview(p.image);
    setImageFile(null);
    setMode("edit");
  };

  // Update portfolio
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);

    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const docRef = doc(db, "portfolios", editingId);
      await updateDoc(docRef, { title, description, image: imageUrl });

      setEditingId(null);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      fetchData();
      setMode("view");
    } catch (err) {
      console.error("Error updating portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete portfolio
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      try {
        const docRef = doc(db, "portfolios", id);
        await deleteDoc(docRef);
        fetchData();
      } catch (err) {
        console.error("Error deleting portfolio:", err);
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // === Layout: EditView ===
  const EditView = () => (
    <div className="min-h-screen bg-[#fafaf8] flex justify-center items-center">
      <div className="w-[90%] max-w-5xl bg-white rounded-3xl shadow-md flex overflow-hidden">
        {/* Left: Upload image */}
        <div className="flex-1 bg-gray-50 flex justify-center items-center relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded"
              className="object-cover w-full h-full opacity-90"
            />
          ) : (
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center text-gray-600"
            >
              <span className="text-3xl mb-2">⬆️</span>
              <p>Choose a file or drag and drop here</p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Right: Form */}
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="w-[40%] p-6 flex flex-col gap-4 bg-[#fdfdfc]"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Profile"
              className="rounded-full w-8 h-8"
            />
            <p className="text-sm text-gray-600">
              {user.email}
              <br />
              <span className="text-xs text-gray-400">
                {editingId ? "Editing now" : "Creating now"}
              </span>
            </p>
          </div>

          <div>
            <label className="font-semibold text-sm">Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2 h-32"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-400 text-white py-2 rounded-md hover:bg-pink-500"
            disabled={loading}
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
              ? "Update Portfolio"
              : "Save Portfolio"}
          </button>
          <button
            type="button"
            className="bg-gray-200 py-2 rounded-md hover:bg-gray-300"
            onClick={() => setMode("view")}
          >
            View Portfolios
          </button>
          <button
            onClick={handleLogout}
            type="button"
            className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );

  // === Layout: ViewMode ===
  const ViewMode = () => (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="flex flex-wrap justify-center w-[90%] max-w-6xl gap-4">
        {portfolios.length === 0 && (
          <div className="text-white text-lg">No Portfolio Found</div>
        )}

        {portfolios.map((p) => (
          <div
            key={p.id}
            className="flex-none w-[400px] bg-gray-50 rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={p.image}
              alt={p.title}
              className="object-cover w-full h-48"
            />
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-bold text-lg">{p.title}</h2>
              <p className="text-sm text-gray-700">{p.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-pink-400 text-white py-1 px-2 rounded hover:bg-pink-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-400 text-white py-1 px-2 rounded hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setMode("edit")}
        className="fixed bottom-10 right-10 bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
      >
        Add / Edit Portfolio
      </button>
    </div>
  );

  return mode === "edit" ? <EditView /> : <ViewMode />;
};

export default PortfolioManager;



