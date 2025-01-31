
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDoc, doc, updateDoc, addDoc  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// import { getStorage, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let app;
let db;


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


  const getUpdatedObjectById = async () => {
    const docRef = doc(db, objectCollection, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      objectData =  docSnap.data();
    }
  }
  
const  getObjectById = async () => {
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // docId = urlParams.get('id');
    docId = "EZ67W0iXUmdyBCR2xVyA";
    // requestLocationAccess();
    const docRef = doc(db, objectCollection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        objectData =  docSnap.data();
        const modelViewerAnimated = document.querySelector("model-viewer#animated");
        modelViewerAnimated.setAttribute("src", objectData.file_path);
        
        modelViewerAnimated.addEventListener('load', (event) => {
          console.log('Works');
          updateClickCount();
        })

         // checking the ar-status
         modelViewerAnimated.addEventListener('ar-status', async (event) => { 
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
                    await getUpdatedObjectById();
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
            
        let updatedObject = {
          click_count: objectData.click_count + 1,
        }; 
        updatedObject = {
          ...updatedObject,
          ...getOsTypeClickCount(),
        }
        const docRef = doc(db, objectCollection, docId);
        await updateDoc(docRef, updatedObject);
    } 
    catch (error) {
        console.error("Error updating document: ", error);
    }
  }

 const getOsTypeClickCount = () => {
    const osType = getOS();
    if (osType == 1) {
      return {android_click_count: objectData.android_click_count + 1}
    }
    else if (osType == 2) {
      return {iphone_click_count: objectData.iphone_click_count + 1}
    }
    else if (osType == 3) {
      return {pc_click_count: objectData.pc_click_count + 1}
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
        console.log(renderObject);
        await addDoc(collection(db, objectAnalysisCollection), renderObject);
    }
    catch(e) {
        console.log(e)
    }
    
  }

  const getFirebaseConfiguration = () => {
    fetch('./js/config/firebase-config.json')
        .then(response => response.json())
        .then(config => {
            app = initializeApp(config);
            db = getFirestore(app);
            getObjectById();
        })
        .catch(error => console.error("Error loading config:", error));
 }

  // Call the function to get data
  

  function getMobileOS() {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return 1
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 2
    }
  }

  function getOS() {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return 1; // android
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 2; // iphone
    }
    else {
      return 3; // pc
    }
  }

  function getOSt() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
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
            if (locationAlertCount == 0) {
              alert("Please allow location access in your settings.");
            }

            locationAlertCount += 1;
            if (locationAlertCount <= 5) {
              setTimeout(() => {
                requestLocationAccess()
              }, 5000)
            }
            
          } else {
            console.error("An error occurred: ", error.message);
          }
        }
      );
    }
  }

  getFirebaseConfiguration();

  // Call the function every 10 seconds (10000 milliseconds)
  // let intervalId = setInterval(requestLocationAccess, 5000);
