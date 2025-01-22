const modelViewerTyre = document.querySelector("model-viewer#animated");
const animationStopTime = 11;
modelViewerTyre.addEventListener("load", async () => {
        
    const arButton = document.getElementById('ar-button');
    arButton.style.display = "block";
    playAnimation();


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