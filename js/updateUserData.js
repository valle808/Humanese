import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);


let userData = JSON.parse(sessionStorage.getItem("user-info"))
const effectiveUserId = userData.id || userData.userId;

const dbref = doc(db, 'UsersAuthList', effectiveUserId);

getDoc(dbref).then((docSnapshot) => {
  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
    console.log(userData);
  }
});
// localStorage.setItem("hearts",3);
let xpFromLesson = parseInt(localStorage.getItem("xpCount"));
let newHearts = parseInt(localStorage.getItem("hearts"));

let sectionData = JSON.parse(localStorage.getItem("sectionData"));

isNaN(xpFromLesson) ? xpFromLesson = -2 : 0
isNaN(newHearts) ? newHearts = 0 : 0

console.log(userData);


if (xpFromLesson > -1) {
  let newXp = userData.xp + xpFromLesson;
  userData.xp = newXp;
  userData.hearts = newHearts;
  if (xpFromLesson > 0) {
    userData.currentLesson += 1
    if (userData.currentLesson > 4) {
      userData.currentLesson = 1
      userData.completedChapters += 1
      if (userData.completedChapters >= 4) {
        userData.completedChapters = 0
        userData.completedUnits += 1
      }
    }
  }

  // --- Prisma Progress Sync ---
  try {
    const response = await fetch(`/api/users/${effectiveUserId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        xp: userData.xp,
        gems: userData.gems,
        hearts: userData.hearts,
        sectionNumber: userData.sectionNumber,
        completedUnits: userData.completedUnits,
        completedChapters: userData.completedChapters,
        currentLesson: userData.currentLesson
      })
    });
    if (response.ok) {
      console.log("Progress updated in Prisma successfully.");
    } else {
      throw new Error("Prisma update failed");
    }
  } catch (apiError) {
    console.warn("Prisma sync failed, falling back to Firebase. Error: ", apiError.message);
    await updateDoc(dbref, userData);
  }

  sessionStorage.setItem("user-info", JSON.stringify(userData));
  localStorage.removeItem("xpCount");
  setTimeout(() => location.reload(), 300);
}

