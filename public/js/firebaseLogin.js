import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);
const auth = getAuth(app);

let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let mainForm = document.getElementById("main-form");

let emailErrorMessage = document.getElementById('email-error-message');
let passwordErrorMessage = document.getElementById('password-error-message');

let signInUser = (event) => {
  console.log("Reached Signin");
  event.preventDefault();

  if (!validateEntry(event)) {
    return;
  }

  // Start loading animation only after validation passes
  document.getElementById("create-account-button").classList.add('clicked');
  setTimeout(() => document.getElementById("create-account-button").classList.remove('clicked'), 300);
  document.getElementById('login-span').classList.add('hidden');
  document.getElementById('loading-balls-container').classList.remove('hidden');

  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value).then((credentials) => {
    const dbref = doc(db, "UsersAuthList", credentials.user.uid);
    console.log(dbref);

    // --- Prisma Synchronization ---
    const prismaSync = async (uData) => {
      try {
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uData.userId,
            email: uData.email,
            name: uData.name,
            age: uData.age,
            learnLang: uData.learnLang,
            profileImage: uData.profileImage
          })
        });
        if (response.ok) {
          const synchronizedUser = await response.json();
          sessionStorage.setItem("user-info", JSON.stringify(synchronizedUser));
          console.log("Profile synchronized with Prisma successfully.");
        }
      } catch (err) {
        console.warn("Could not sync with Prisma on login. Using Firebase data.");
      }
    };

    getDoc(dbref).then(async (docSnapshot) => {
      console.log("Document data:", docSnapshot.data());
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log("userData = ", userData);
        sessionStorage.setItem("user-info", JSON.stringify(userData));
        await prismaSync(userData);
        window.location.href = "./learn.html";
      } else {
        // Fallback: The user authenticated successfully, but their Firestore profile is missing.
        console.warn("User authenticated, but no profile document found in Firestore. Creating a default session.");

        const fallbackData = {
          userId: credentials.user.uid,
          email: credentials.user.email,
          name: "User", // Default name
          gems: 500,
          xp: 0,
          hearts: 5,
          learnLang: localStorage.getItem('selectedLang') || 'en',
          sectionNumber: 1,
          completedUnits: 0,
          completedChapters: 0,
          currentLesson: 1,
          profileImage: "./assets/svg/profile-image-temp.svg"
        };

        sessionStorage.setItem("user-info", JSON.stringify(fallbackData));
        await prismaSync(fallbackData);
        window.location.href = "./learn.html";
      }
    }).catch(async (dbError) => {
      console.warn("Could not read profile from database due to rules, logging in with fallback session anyway. Error: ", dbError.message);

      const fallbackData = {
        userId: credentials.user.uid,
        email: credentials.user.email,
        name: "User", // Default name
        gems: 500,
        xp: 0,
        hearts: 5,
        learnLang: localStorage.getItem('selectedLang') || 'en',
        sectionNumber: 1,
        completedUnits: 0,
        completedChapters: 0,
        currentLesson: 1,
        profileImage: "./assets/svg/profile-image-temp.svg"
      };

      sessionStorage.setItem("user-info", JSON.stringify(fallbackData));
      window.location.href = "./learn.html";
    });
  })
    .catch((error) => {
      document.getElementById('login-span').classList.remove('hidden');
      document.getElementById('loading-balls-container').classList.add('hidden');

      switch (error.code) {
        case "wrong-password":
          passwordErrorMessage.innerHTML =
            '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Wrong Password.</span>';
          passwordInput.style.border = "2px solid #ff0000";
          break;
        case "user-not-found":
          emailErrorMessage.innerHTML =
            '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>User Not Found.</span>';
          emailInput.style.border = "2px solid #ff0000";
          break;
        case "auth/invalid-email":
          emailErrorMessage.innerHTML =
            '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Invalid Email</span>';
          emailInput.style.border = "2px solid #ff0000";
          break;
        case "auth/invalid-credential":
          emailErrorMessage.innerHTML =
            '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Invalid Credentials</span>';
          passwordErrorMessage.innerHTML =
            '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Invalid Credentials</span>';
          emailInput.style.border = "2px solid #ff0000";
          passwordInput.style.border = "2px solid #ff0000";
          break;
        default:
          alert("Login error: " + error.message);
          break;
      }
      console.log(error.message);
    });
};

const validateEntry = (event) => {
  event.preventDefault();

  let isValid = true;
  if (!emailInput.value) {
    emailErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Enter an Email</span>';
    emailInput.style.border = '2px solid #ff0000';
    isValid = false;
  }
  else {
    emailErrorMessage.innerHTML = '';
    emailInput.style.border = '';
  }

  if (!passwordInput.value) {
    passwordErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Enter a Password.</span>';
    passwordInput.style.border = '2px solid #ff0000';
    isValid = false;
  }
  else {
    passwordErrorMessage.innerHTML = '';
    passwordInput.style.border = '';
  }
  return isValid;
}

mainForm.addEventListener("submit", signInUser);
