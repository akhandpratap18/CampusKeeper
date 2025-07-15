// src/services/authService.js
import { auth, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// ⚠ Hardcoded OTP for demo only (do NOT use in production)
let lastSentOTP = "1234";

/**
 * Signup: create user, send verification email, store profile data in Firestore
 * @param {string} email
 * @param {string} password
 * @param {object} profileData
 * @returns {Promise<User>}
 */
export const signup = async (email, password, profileData) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCred.user);
  await setDoc(doc(db, "users", userCred.user.uid), profileData);
  return userCred.user;
};

/**
 * Signin user with email & password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const signin = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Get user profile from Firestore
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export const getUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
};
/**
 * Update user profile in Firestore (merge)
 * @param {string} uid
 * @param {object} data
 * @returns {Promise}
 */
export const updateUserProfile = async (uid, profileData) => {
  await updateDoc(doc(db, "users", uid), profileData);
};

/**
 * Send password reset email to user
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  console.log(`Pretend OTP "${lastSentOTP}" sent to ${email}`);
  return true;
};

/**
 * Verify entered OTP against hardcoded demo OTP
 * @param {string} inputOtp
 * @returns {Promise<boolean>}
 */
export const verifyOTP = async (inputOtp) => {
  if (inputOtp === lastSentOTP) {
    return true;
  } else {
    throw new Error("Invalid OTP");
  }
};

/**
 * Reset password for current signed-in user
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
export const resetPassword = async (newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in");
  await updatePassword(user, newPassword);
  return true;
};
