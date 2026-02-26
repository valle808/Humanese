import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore();
const auth = getAuth(app);

let ageInp = document.getElementById('age-input');
let nameInp = document.getElementById('name-input');
let emailInp = document.getElementById('email-input');
let passwordInp = document.getElementById('password-input');
let mainForm = document.getElementById('main-form');

let ageErrorMessage = document.getElementById('age-error-message');
let nameErrorMessage = document.getElementById('name-error-message');
let emailErrorMessage = document.getElementById('email-error-message');
let passwordErrorMessage = document.getElementById('password-error-message');

let RegisterUser = async (event) => {
    event.preventDefault();

    if (!validate(event)) {
        return;
    }

    // Start loading animation only after validation passes
    document.getElementById("create-account-button").classList.add('clicked');
    setTimeout(() => document.getElementById("create-account-button").classList.remove('clicked'), 300);
    document.getElementById('create-account-span').classList.add('hidden');
    document.getElementById('loading-balls-container').classList.remove('hidden');

    try {
        const credentials = await createUserWithEmailAndPassword(auth, emailInp.value, passwordInp.value);

        console.log("Account created successfully");

        const currentDate = new Date();

        const userDocRef = doc(db, 'UsersAuthList', credentials.user.uid);
        console.log(credentials.user);

        const dbref = doc(db, 'UsersAuthList', credentials.user.uid);

        // --- Prisma Synchronization ---
        try {
            const syncResponse = await fetch('/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: credentials.user.uid,
                    age: ageInp.value,
                    name: nameInp.value,
                    email: emailInp.value,
                    learnLang: localStorage.getItem('selectedLang') || 'en'
                })
            });
            if (syncResponse.ok) {
                const synchronizedUser = await syncResponse.json();
                console.log("Profile synchronized with Prisma successfully.");
                sessionStorage.setItem("user-info", JSON.stringify(synchronizedUser));
            } else {
                throw new Error("API sync failed");
            }
        } catch (syncError) {
            console.warn("Could not sync with Prisma, falling back to Firebase/SessionStorage. Error: ", syncError.message);
            // Fallback: Use original Firestore logic
            try {
                await setDoc(userDocRef, {
                    userId: credentials.user.uid,
                    age: ageInp.value,
                    name: nameInp.value,
                    email: emailInp.value,
                    gems: 500,
                    xp: 0,
                    hearts: 5,
                    creationDate: currentDate,
                    learnLang: localStorage.getItem('selectedLang') || 'en',
                    sectionNumber: 1,
                    completedUnits: 0,
                    completedChapters: 0,
                    currentLesson: 1,
                    profileImage: "../assets/svg/profile-image-temp.svg"
                });
                const docSnapshot = await getDoc(dbref);
                if (docSnapshot.exists()) {
                    sessionStorage.setItem("user-info", JSON.stringify(docSnapshot.data()));
                }
            } catch (dbError) {
                console.warn("Fallback Firestore save also failed.");
            }
        }

        // Hide loading balls and show success message regardless of DB rules
        document.getElementById('loading-balls-container').classList.add('hidden');
        document.getElementById('create-account-span').classList.remove('hidden');
        document.getElementById('success-message').style.display = 'block';

        // Wait 2 seconds before redirecting
        setTimeout(() => {
            window.location.href = "./learn.html";
        }, 2000);


    } catch (error) {

        document.getElementById('create-account-span').classList.remove('hidden');
        document.getElementById('loading-balls-container').classList.add('hidden');

        switch (error.code) {
            case "auth/email-already-in-use":
                emailErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Email Already In Use.</span>';
                emailInp.style.border = '2px solid #ff0000'; // Change border color to red
                break;
            case "auth/invalid-email":
                emailErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Invalid Email Id</span>';
                emailInp.style.border = '2px solid #ff0000'; // Change border color to red
                break;
            case "auth/weak-password":
                passwordErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Weak Password</span>';
                passwordInp.style.border = '2px solid #ff0000'; // Change border color to red
                break;
            case "permission-denied":
                alert("Authentication succeeded, but Database Permission was Denied. The administrator needs to enable Firestore read/write rules.");
                break;
            default:
                if (error.code && error.code.includes("permission-denied")) {
                    alert("Database Error: Permission Denied. Please contact support to fix database rules.");
                } else {
                    alert("Error: " + error.message);
                }
                break;
        }

        console.log(error.code);
        console.log(error.message);
    }
};

const validate = (event) => {
    event.preventDefault()

    let isValid = true;

    ageErrorMessage.textContent = '';
    nameErrorMessage.textContent = '';
    emailErrorMessage.textContent = '';
    passwordErrorMessage.textContent = '';

    if (!ageInp.value) {
        ageErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Please enter your age.</span>';
        ageInp.style.border = '2px solid #ff0000'; // Change border color to red
        document.getElementById('age-privacy-div').innerHTML = '';
        isValid = false;
    }
    else {
        ageErrorMessage.innerHTML = '';
        ageInp.style.border = ''; // Reset to the default border color
    }

    if (!nameInp.value) {
        console.log("Entering Name if Block"); // Add this line
        nameErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Please enter your Name.</span>';
        nameInp.style.border = '2px solid #ff0000'; // Change border color to red  
        isValid = false;
    }
    else {
        console.log("Name Input is not empty"); // Add this line
        nameErrorMessage.innerHTML = '';
        nameInp.style.border = ''; // Reset to the default border color
    }

    if (!emailInp.value) {
        emailErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Please enter your Email.</span>';
        emailInp.style.border = '2px solid #ff0000'; // Change border color to red
        isValid = false;
    }
    else {
        emailErrorMessage.innerHTML = '';
        emailInp.style.border = ''; // Reset to the default border color
    }

    if (!passwordInp.value) {
        passwordErrorMessage.innerHTML = '<img src="../assets/svg/error-message-icon.svg" alt=""> <span>Please enter your Password.</span>';
        passwordInp.style.border = '2px solid #ff0000'; // Change border color to red
        isValid = false;
    }
    else {
        passwordErrorMessage.innerHTML = '';
        passwordInp.style.border = ''; // Reset to the default border color
    }

    return isValid;
}

mainForm.addEventListener('submit', RegisterUser);