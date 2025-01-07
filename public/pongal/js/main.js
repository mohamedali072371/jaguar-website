const modelViewerGiftBox = document.querySelector("model-viewer#newYearGiftBox");
let stopLoopAnimation = false;
let hasInteracted = false;

let anniversaryVideoTexture = null;
try {
    customElements.whenDefined('model-viewer').then(async () => {
        // anniversaryVideoTexture = modelViewerGiftBox.createVideoTexture("./assets/video/anniversary-31-Jaguar.mp4");
        anniversaryVideoTexture = modelViewerGiftBox.createVideoTexture("./assets/video/rock-on.mp4");
    })
  }
  catch (e) {
    console.error('Error initializing video textures:', e);
  }


modelViewerGiftBox.addEventListener("load", async () => {
    // set anniversary video texture
    const anniversaryMeterial = await getMaterialByName("screen");
    // 
    // setVideoTexture(anniversaryMeterial, anniversaryVideoTexture);
    const {baseColorTexture} = anniversaryMeterial.pbrMetallicRoughness; 
    baseColorTexture.setTexture(anniversaryVideoTexture);
    
    anniversaryVideoTexture.source.element.volume = 0.1
    
    anniversaryVideoTexture.source.element.loop = false
    anniversaryVideoTexture.source.element.pause();
    
    const arButton = document.getElementById('ar-button');
    arButton.style.display = "block";
    playAnimation()
})


document.addEventListener('click', (event) =>{
    const material = modelViewerGiftBox.materialFromPoint(event.clientX, event.clientY);
    if (material != null) {
        let materialName = material.name;
        if (materialName == 'Material') {
            playVideoTexture(anniversaryVideoTexture);
        }
    }
})


 // checking the ar-status
modelViewerGiftBox.addEventListener('ar-status', async (event) => { 
    console.log(1);
    if (event.detail.status == 'session-started') {
        stopAnimation();
        stopVideoTexture(anniversaryVideoTexture);
    }
    else if (event.detail.status === 'object-placed') {
        playAnimation();
    }
    else if (event.detail.status === 'not-presenting') {
        playAnimation();
        stopVideoTexture(anniversaryVideoTexture);
    }
})  

const playVideoTexture = (videoTexture) => {
    if (videoTexture.source.element.paused) {
        videoTexture.source.element.currentTime = 0
        videoTexture.source.element.play();
        videoTexture.source.element.muted = false;
    }
}

const stopVideoTexture = (videoTexture) => {
    videoTexture.source.element.pause();
}

const playAnimation = () => {
    setTimeout(() => {
        modelViewerGiftBox.currentTime = 0; 
        modelViewerGiftBox.play();
        stopLoopAnimation = false;
        // loopAtAnimation();
    }, 1500)

}

const loopAtAnimation = () => {
    if (modelViewerGiftBox.currentTime >= 5 && !stopLoopAnimation) {
        modelViewerGiftBox.currentTime = 3;
        requestAnimationFrame(loopAtAnimation);
  
    } else {
        requestAnimationFrame(loopAtAnimation); // Keep checking the time
    }
}


const stopAnimation = () => {
    modelViewerGiftBox.currentTime = 0; 
    modelViewerGiftBox.pause();
    stopLoopAnimation = true;
}

const getMaterialByName = async (materialName) => {
    return await  modelViewerGiftBox.model.getMaterialByName(materialName)
}


