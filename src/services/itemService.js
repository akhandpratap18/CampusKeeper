import { db, storage } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload image to Firebase Storage & return public download URL
 * @param {File} file - compressed image file
 * @returns {Promise<string>} download URL
 */
export const uploadImage = async (file) => {
  if (!file) return ""; // no file? return empty string

  try {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `images/${uniqueName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Upload image error:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Add a new item document to Firestore
 * @param {object} itemData
 * @returns {Promise}
 */
export const addItem = async (itemData) => {
  try {
    return await addDoc(collection(db, "items"), itemData);
  } catch (error) {
    console.error("Add item error:", error);
    throw new Error("Failed to add item to Firestore");
  }
};

/**
 * Get all items sorted by newest first
 * @returns {Promise<Array>}
 */
export const getItems = async () => {
  try {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get items error:", error);
    return []; // fail gracefully
  }
};

/**
 * Delete item by ID
 * @param {string} id
 * @returns {Promise}
 */
export const deleteItem = async (id) => {
  try {
    return await deleteDoc(doc(db, "items", id));
  } catch (error) {
    console.error("Delete item error:", error);
    throw new Error("Failed to delete item");
  }
};
