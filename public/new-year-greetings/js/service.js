
// Import the functions you need from the SDKs you need
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db} from './constant/firebaseConstant.js'
// import { getStorage, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// Initialize Firebase

const objectCollection = "client";
let docId;

let objectData;
  
const  getObjectById = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    docId = urlParams.get('id');
    const docRef = doc(db, objectCollection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        objectData =  docSnap.data();
        const modelViewerAnimated = document.querySelector("model-viewer#newYearGiftBox");
        modelViewerAnimated.setAttribute("src", objectData.file_path);
        // modelViewerAnimated.setAttribute("poster", objectData.poster_image);
        modelViewerAnimated.setAttribute("ios-src", objectData.ios_file_path);
        
        modelViewerAnimated.addEventListener('load', (event) => {
          console.log('Works');
        })

    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
  }

  // Call the function to get data
  getObjectById();


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