# 🌟 Campus Keeper – Lost & Found Portal for Graphic Era

**Campus Keeper** is a web-based application built to streamline the process of reporting and recovering lost and found items within the Graphic Era campus community. Users can post, search, and claim items while managing their profiles in a secure and intuitive interface.

---

## 🚀 Features

### 🔐 Authentication
- Sign up/login with **college email ID only** (`@geu.ac.in` or `@gehu.ac.in`)
- OTP verification sent via **EmailJS** (4-digit)
- Password reset also uses OTP-based flow

### 📝 User Profile
- Update name, course, section, phone number, college info
- View all items posted

### 📦 Post Lost/Found Items
- Input: Title, description, location, college, image upload
- Tags: “Lost” or “Found”
- Stored in **Firebase Firestore** & **Storage**

### 🗂️ View Items
- Sorted by newest first
- Displays: Image, title, date, tag, and college info
- Click to see full details and user contact

### 🔍 Search
- Case-insensitive title search
- Highlights matched keywords

### 🧹 Manage Posts
- Delete individual or multiple items
- Confirmation modal before deletion

---

## 🛠️ Tech Stack

- **Frontend:** React (Functional Components + Hooks)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **OTP:** EmailJS
- **Auth & Backend:** Firebase (Auth, Firestore, Storage)

---

## 📁 Project Structure

/src
├── /assets → Images and static files
├── /components → Reusable UI components
├── /contexts → Auth context for global user state
├── /pages → Page-level components (Home, Profile, etc.)
├── /services → Firebase & EmailJS logic
└── /utils → OTP generator, validators

---

## 🔐 Authentication Flow

1. User signs up with college email.
2. Receives a **4-digit OTP via EmailJS**.
3. After successful OTP verification, Firebase account is created.
4. Same OTP-based process is followed for password reset.

---

## 🏗️ How to Run Locally

### 1. Clone the repo

bash
git clone https://github.com/your-username/campus-keeper.git
cd campus-keeper

### 2. Install dependencies
bash
npm install

### 3. Add .env file

REACT_APP_FIREBASE_API_KEY=''
REACT_APP_FIREBASE_AUTH_DOMAIN=''
REACT_APP_FIREBASE_PROJECT_ID=''
REACT_APP_FIREBASE_STORAGE_BUCKET=''
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=''
REACT_APP_FIREBASE_APP_ID=''

### 4. Start the app

npm run dev

## 🏫 Target Audience
Students of:

Graphic Era Deemed to be University, Dehradun

GEHU Dehradun, Haldwani, Bhimtal campuses

## 📌 Motivation
Many students lose valuable items like ID cards, phones, books, and accessories on campus. Campus Keeper makes the process of reporting, finding, and claiming such items efficient and transparent.


