import {  getMobileOS, mobileOSConstant } from './constant/constant.js';

const modelViewerMonitor = document.querySelector("model-viewer#animated");
const animationStopTime = 18;
const width = window.innerWidth; 

let monitorScreenVideoTexture = null;
let lightVideoTexture = null;
let monitorVideoBind = false;

deafultCameraPosition();   

try {
    customElements.whenDefined('model-viewer').then(async () => {
        monitorScreenVideoTexture = modelViewerMonitor.createVideoTexture("./assets/video/intro-video.mp4");
        lightVideoTexture = modelViewerMonitor.createVideoTexture("./assets/video/rock-on.mp4");
    })
}
catch (e) {
    console.error('Error initializing video textures:', e);
}

modelViewerMonitor.addEventListener("load", async () => { 
    const arButton = document.getElementById('ar-button');
    const arIosButton = document.getElementById('arButton');
   
    const osType = getMobileOS();
    if (osType == mobileOSConstant.ios) {
        arIosButton.style.display = "block";
    }
    else {
        arButton.style.display = "block";
    }
    playAnimation();

    document.addEventListener('click', async (event) => {
        const material = modelViewerMonitor.materialFromPoint(event.clientX, event.clientY);

        if (material != null) {
            let materialName = material.name;
            if (materialName == 'play-video') {
                bindMonitorVideoTexture();
            }
            else if (materialName == 'pause-video') {
                pauseVideo(monitorScreenVideoTexture);
                pauseVideo(lightVideoTexture);
            }
        }
    });

})


const bindMonitorVideoTexture = async () => {
    if (!monitorVideoBind) {
        monitorVideoBind = true;
        const screenMeterial = await getMaterialByName("led-screen");
        screenMeterial.pbrMetallicRoughness.baseColorTexture.setTexture(monitorScreenVideoTexture); 
        monitorScreenVideoTexture.source.element.muted = false;
        monitorScreenVideoTexture.source.element.volume = 0.4;

        const redLightMeterial = await getMaterialByName("lighting");
        redLightMeterial.pbrMetallicRoughness.baseColorTexture.setTexture(lightVideoTexture); 
    }
    else {
        playVideo(monitorScreenVideoTexture);
        playVideo(lightVideoTexture);
    }
}

const playVideo = (videoTexture) => {
    videoTexture.source.element.play();
}

const pauseVideo = (videoTexture) => {
    if (monitorVideoBind) {
        videoTexture.source.element.pause();
    }
}

const videoRestart = (videoTexture) => {
    if (monitorVideoBind) {
        videoTexture.source.element.currentTime = 0;
        playVideo(videoTexture);
        playVideo(lightVideoTexture);
    }
}

const getMaterialByName = async (materialName) => {
    return await  modelViewerMonitor.model.getMaterialByName(materialName)
}

modelViewerMonitor.addEventListener('ar-status', async (event) => { 
    if (event.detail.status == 'session-started') {
        stopAnimation();
        pauseVideo(monitorScreenVideoTexture);
        pauseVideo(lightVideoTexture);
    }
    else if (event.detail.status === 'object-placed') {
        playAnimation();
    }
    else if (event.detail.status === 'not-presenting') {
        pauseVideo(monitorScreenVideoTexture);
        pauseVideo(lightVideoTexture);
        playAnimation();
    }
})  

const playAnimation = () => {
    modelViewerMonitor.currentTime = 0;
    modelViewerMonitor.play({repetitions: 1});
    stopAnimationAtTime();
}

const stopAnimation = () => {
    modelViewerMonitor.pause();
}

const stopAnimationAtTime = () => {
    if (modelViewerMonitor.currentTime >= animationStopTime) {
        stopAnimation();
        if (monitorVideoBind) {
            videoRestart(monitorScreenVideoTexture);
        }
    } else {
        requestAnimationFrame(stopAnimationAtTime); // Keep checking the time
    }
}



function deafultCameraPosition() {
    if (width <= 480) { 
        modelViewerMonitor.setAttribute("camera-orbit", '2.177deg 86.32deg 15.11m');
        modelViewerMonitor.setAttribute("camera-target", '-1m 1m 0.001144m');
        // modelViewerMonitor.setAttribute("field-of-view", "18deg");
        // Mobile devices (<= 480px)
    } 
}