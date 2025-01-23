import {  getMobileOS, mobileOSConstant } from './constant/constant.js';

const modelViewerTyre = document.querySelector("model-viewer#animated");
const animationStopTime = 18;
const width = window.innerWidth; 

deafultCameraPosition();   

modelViewerTyre.addEventListener("load", async () => { 
    const arButton = document.getElementById('ar-button');
    arButton.style.display = "block";
    playAnimation();

    arButton.addEventListener("click", () => {
        const osType = getMobileOS();
        if (osType == mobileOSConstant.ios) {
          const link = document.createElement('a');
          link.href = "./assets/glb/tyre-branding.reality";
          link.id = "ar-link";
          link.rel = "ar";
      
          link.click();
        }
    });

    document.addEventListener('click', async (event) => {
        const material = modelViewerTyre.materialFromPoint(event.clientX, event.clientY);

        if (material != null) {
            let materialName = material.name;
            if (materialName == 'play-again') {
                playAnimation();
            }
        }
    });

})

modelViewerTyre.addEventListener('ar-status', async (event) => { 
    if (event.detail.status == 'session-started') {
        stopAnimation();
    }
    else if (event.detail.status === 'object-placed') {
        playAnimation();
    }
    else if (event.detail.status === 'not-presenting') {
        playAnimation();
    }
})  

const playAnimation = () => {
    modelViewerTyre.currentTime = 0;
    modelViewerTyre.play({repetitions: 1});
    stopAnimationAtTime();
}

const stopAnimation = () => {
    modelViewerTyre.pause();
}

const stopAnimationAtTime = () => {
    if (modelViewerTyre.currentTime >= animationStopTime) {
        stopAnimation();
    } else {
        requestAnimationFrame(stopAnimationAtTime); // Keep checking the time
    }
}



function deafultCameraPosition() {
    console.log(width)
    if (width <= 480) { 
        console.log('Works')
        modelViewerTyre.setAttribute("camera-orbit", '2.177deg 86.32deg 15.11m');
        modelViewerTyre.setAttribute("camera-target", '-1m 1m 0.001144m');
        // modelViewerTyre.setAttribute("field-of-view", "18deg");
        // Mobile devices (<= 480px)
    } 
}