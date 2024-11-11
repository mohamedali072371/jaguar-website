
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDoc, doc, updateDoc, addDoc  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
// import { getStorage, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBksDlHjP6MlNnF_gdWnAgzntU905Dptdc",
authDomain: "testing-89681.firebaseapp.com",
projectId: "testing-89681",
storageBucket: "al-infaaq.appspot.com",
messagingSenderId: "312027157118",
appId: "1:312027157118:web:dfd01491d2c69883b6fe2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const objectCollection = "object";
const objectAnalysisCollection = "object_analysis";
let docId;

let objectData;
let isPlaced = false;
let objectPlacedStartTime = null; // To store the time when the object is placed
let objectPlacementDuration = 0;

//
let latitude = null;
let longitude = null;
let isLocationPermission = false;

async function getData() {
    try {
      const querySnapshot = await getDocs(collection(db, objectCollection));
      
      // Loop through each document and log its data
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());
      });
    } catch (error) {
      console.error("Error retrieving documents: ", error);
    }
  }
  
const  getObjectById = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    docId = urlParams.get('id');
    requestLocationAccess();

    const docRef = doc(db, objectCollection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        objectData =  docSnap.data();
        const modelViewerAnimated = document.querySelector("model-viewer#animated");
        modelViewerAnimated.setAttribute("src", objectData.file_path);
        modelViewerAnimated.setAttribute("ios-src", objectData.ios_file_path);


        modelViewerAnimated.addEventListener('load', (event) => {
          updateClickCount();
        })

         // checking the ar-status
         modelViewerAnimated.addEventListener('ar-status', (event) => { 
            if (event.detail.status === 'object-placed') {
                updateRenderCount();
                objectPlacedStartTime = Date.now();
                isPlaced = true;
            }

            if (event.detail.status === 'not-presenting') {
                if (isPlaced) {
                    isPlaced = false;
                    objectPlacementDuration = Date.now() - objectPlacedStartTime;
                    let totalPlacementDuration =  objectPlacementDuration / 1000;
                    addRenderDuration(totalPlacementDuration);
                    objectPlacementDuration = 0;
                }
                
            }
        });

    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
  }

  const updateRenderCount = async () => {
    try {
        const osType = getMobileOS();     
        let updatedObject = {
            render_count: objectData.render_count + 1
        }; 
        osType == 1 ? updatedObject.android_count = objectData.android_count + 1 : updatedObject.ios_count = objectData.ios_count + 1;
        
        const docRef = doc(db, objectCollection, docId);
        await updateDoc(docRef, updatedObject);
    } 
    catch (error) {
        console.error("Error updating document: ", error);
    }
  }

  const updateClickCount = async () => {
    try {
        const osType = getMobileOS();     
        let updatedObject = {
          click_count: objectData.click_count + 1
        }; 
    } 
    catch (error) {
        console.error("Error updating document: ", error);
    }
  }

  const addRenderDuration = async (duration) => {
    try {
        let renderObject = {
            is_android : getMobileOS() == 1 ? true : false,
            object_id: docId,
            render_duration: duration,
            created_on: Date.now(),
            latitude: latitude,
            longitude: longitude,
        }
    
        await addDoc(collection(db, objectAnalysisCollection), renderObject);
    }
    catch(e) {
        console.log(e)
    }
    
  }

  // Call the function to get data
  getObjectById();

  function getMobileOS() {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return 1
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 2
    }
  }

  let locationAlertCount = 0;
  function requestLocationAccess() {
    if ("geolocation" in navigator && !isLocationPermission) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: Position data is now available
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          isLocationPermission = true;
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            // locationAlertCount += 1;
            // if (locationAlertCount > 3) {
            //   clearInterval(intervalId);
            // }
            // alert("Please allow location access in your settings.");
          } else {
            console.error("An error occurred: ", error.message);
          }
        }
      );
    }
  }

  // Call the function every 10 seconds (10000 milliseconds)
  // let intervalId = setInterval(requestLocationAccess, 10000);


 const v = {
    "name": "Monitor",
    "android_count": 0,
    "ios_file_path": "https://firebasestorage.googleapis.com/v0/b/al-infaaq.appspot.com/o/3d-objects%2Fmonitor-ios.usdz?alt=media&token=baecd4d3-4b2d-40a2-9dcc-5b392c857933",
    "ios_file_name": "monitor-ios.usdz",
    "is_audio_texture": null,
    "file_path": "https://firebasestorage.googleapis.com/v0/b/al-infaaq.appspot.com/o/3d-objects%2FMonitor.glb?alt=media&token=0707896c-46b8-4649-a120-71c376ddb59c",
    "object_id": "BQojjJkRLTVU4U1ixoS5",
    "poster_image": "",
    "is_video_texture": null,
    "render_count": 0,
    "file_name": "Monitor.glb",
    "ios_count": 0
}