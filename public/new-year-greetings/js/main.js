const modelViewerGiftBox = document.querySelector("model-viewer#newYearGiftBox");
let stopLoopAnimation = false;


let anniversaryVideoTexture = null;
try {
    customElements.whenDefined('model-viewer').then(async () => {
        anniversaryVideoTexture = modelViewerGiftBox.createVideoTexture("./assets/video/anniversary-31-Jaguar.mp4");
    })
  }
  catch (e) {
    console.error('Error initializing video textures:', e);
  }

modelViewerGiftBox.addEventListener("load", async () => {
    // set anniversary video texture
    const anniversaryMeterial = await getMaterialByName("anniversary");
    const logoMeterial = await getMaterialByName("logo");
    // setVideoTexture(anniversaryMeterial, anniversaryVideoTexture);
    const {baseColorTexture} = anniversaryMeterial.pbrMetallicRoughness; 
    baseColorTexture.setTexture(anniversaryVideoTexture);

    // const texture = await modelViewerGiftBox.createTexture(`./assets/image/logo.png`);
    // console.log(texture)
    // logoMeterial.pbrMetallicRoughness['baseColorTexture'].setTexture(texture);

    const arButton = document.getElementById('ar-button');
    arButton.style.display = "block";
    playAnimation()
})



 // checking the ar-status
modelViewerGiftBox.addEventListener('ar-status', async (event) => { 
    console.log(1);
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
    setTimeout(() => {
        modelViewerGiftBox.currentTime = 0; 
        modelViewerGiftBox.play();
        stopLoopAnimation = false;
        loopAtAnimation();
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


