import { db } from './constant/firebaseConstant.js'
import { collection, addDoc, setDoc, doc  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const userContactCollection = "client";

const addClient = async (userContactRequest) => {
    const docRef = doc(collection(db, userContactCollection)) 
    userContactRequest.object_id = docRef.id;
    console.log(userContactRequest)
    await setDoc(docRef, { ...userContactRequest })
    
}

const constantData = {
    "client_name": "",
    "android_click_count": 0,
    "android_count": 0,
    "click_count": 0,
    "file_name": "",
    "file_path": "",
    "ios_count": 0,
    "ios_file_name": "",
    "ios_file_path": "",
    "iphone_click_count": 0,
    "is_audio_texture": null,
    "is_video_texture": null,
    "name": "Golden Gift Box",
    "object_id": "",
    "pc_click_count": 0,
    "poster_image": "",
    "render_count": 0,
    
    
}

const namesList = [
    { name: "Bala", removedSpace: "Bala" },
    // { name: "Vineet Budki", removedSpace: "Vineet-Budki" },
    // { name: "Bill Qian", removedSpace: "Bill-Qian" },
    // { name: "Bijan", removedSpace: "Bijan" },
    // { name: "Zulfikhar", removedSpace: "Zulfikhar" },
    // { name: "Leila", removedSpace: "Leila" },
    // { name: "Buhannad", removedSpace: "Buhannad" },
    // { name: "Peer Mohiadeen - Innowork", removedSpace: "Peer-Mohiadeen-Innowork" },
    // { name: "Jaleel", removedSpace: "Jaleel" },
    // { name: "Beide", removedSpace: "Beide" },
    // { name: "Nardos", removedSpace: "Nardos" },
    // { name: "June", removedSpace: "June" },
    // { name: "Tres", removedSpace: "Tres" },
    // { name: "Subodh", removedSpace: "Subodh" },
    // { name: "Lal Nallath", removedSpace: "Lal-Nallath" }
];

let clientData = [];
namesList.forEach(name => {
    let copyData = constantData;
    copyData.client_name = name.name;
    copyData.file_name =  `golden-box-${name.removedSpace}.glb`;
    copyData.name =  `Golden Gift Box - ${ name.name}`;
    clientData.push(copyData);
});

// for (let data of clientData) {
//    await addClient(data);
// }


