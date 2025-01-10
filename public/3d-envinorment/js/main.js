const modelViewerMonitor = document.querySelector("model-viewer#monitor");
let monitorScreenVideoTexture = null;
let lightVideoTexture = null;
let specImageTexture = null;

try {
    customElements.whenDefined('model-viewer').then(async () => {
        monitorScreenVideoTexture = modelViewerMonitor.createVideoTexture("./assets/video/color.mp4");
        lightVideoTexture = modelViewerMonitor.createVideoTexture("./assets/video/rock-on.mp4");
    })
}
catch (e) {
    console.error('Error initializing video textures:', e);
}

modelViewerMonitor.addEventListener("load", async () => {
    // set anniversary video texture
    specImageTexture = await modelViewerMonitor.createTexture("./assets/image/monitor-spec.jpg");

    const screenMeterial = await getMaterialByName("led-screen");
    const redLightMeterial = await getMaterialByName("lighting");
    const specMeterial = await getMaterialByName("screen-spec");

    // binding texture
    specMeterial.pbrMetallicRoughness.baseColorTexture.setTexture(specImageTexture);
    screenMeterial.pbrMetallicRoughness.baseColorTexture.setTexture(monitorScreenVideoTexture); 
    redLightMeterial.pbrMetallicRoughness.baseColorTexture.setTexture(lightVideoTexture); 
    
    const arButton = document.getElementById('ar-button');
    arButton.style.display = "block";
    
    const loader = document.getElementById("load");
    loader.style.display = "none";
    loader.pause();
})

const getMaterialByName = async (materialName) => {
    return await  modelViewerMonitor.model.getMaterialByName(materialName)
}