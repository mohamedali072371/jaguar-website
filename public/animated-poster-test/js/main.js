import { isChromeOrSafari, browserConstant, interactiveMaterialObject, getMobileOS, mobileOSConstant } from './constant/constant.js';

const browser = isChromeOrSafari();

let currentFeatureId = null;
let videoPlayerMaterial = null;
// Register a custom component to handle video playback
AFRAME.registerComponent('business-card', {
  init: function () {

    // Get the video element
    const video = document.getElementById("card");
    const nenonVideo = document.getElementById("nenon");
    const plane = this.el.querySelector("a-plane");
    const model = this.el.querySelector("a-gltf-model");

    let interactiveObjectEvennt;

    const env = document.getElementById("3dEnv");
    const placeProduct = document.getElementById("placeProduct");
    const animationPoster = document.getElementById("animationPoster");

    var nenonVideoTexture = new THREE.VideoTexture(nenonVideo);
    var nenonImageTexture = null;

    var envVideoTexture = new THREE.VideoTexture(env);
    var placeProductVideoTexture = new THREE.VideoTexture(placeProduct);
    var animationPosterVideoTexture = new THREE.VideoTexture(animationPoster);

    // Listen for the target being found
    this.el.addEventListener("targetFound", (evt) => {

      video.currentTime = 0; // Restart video from the beginning
      setTimeout(() => {
        plane.setAttribute("visible", true);
        video.play().catch((error) => {
          console.log("Autoplay failed: ", error);
        });
      }, 2500)

      setTimeout(() => {
        if (!model.hasAttribute('animation-mixer')) {
          model.setAttribute('animation-mixer', { loop: 'once'});
          const mixer = model.components['animation-mixer'].mixer;
          console.log("Animation started after 3-second delay.");
        }

        setTimeout(() => {
          model.setAttribute('animation-mixer', { timeScale: 0 })
          if (currentFeatureId != null) {
            resumeVideo(currentFeatureId)
          }
        }, 1500)
      }, 1000);
    });



    this.el.addEventListener('model-loaded', function  (evt) {
      interactiveObjectEvennt = evt;
      videoPlayerMaterial = getMaterialByName('vplane');
      setDefaultNenonVideoTexture();
      model.addEventListener('click', (event) => {
          const intersection = event.detail.intersection; // Get intersection details
          if (intersection && intersection.object) {
          const clickedMaterial = intersection.object.material;
          console.log(clickedMaterial.name)

          let materialData = interactiveMaterialObject.find(data => data.materialName == clickedMaterial.name)
          if (materialData) {
            if (currentFeatureId != null) {
                stopPreviousFeature(currentFeatureId);
            }
            stopNenonTexture(clickedMaterial.name);
            currentFeatureId = materialData.id;
            setVideoTexture(materialData);
          }
          
          }
      });
    });

    let originalTextures  = {};
    const setDefaultNenonVideoTexture = () => {
      if (browser == browserConstant.chrome) {
        nenonVideo.play();
        for (let data of  interactiveMaterialObject) {
          let material = getMaterialByName(data.materialName);
          originalTextures[data.materialName] = material.material.map;

          material.material.transparent = true;
          material.material.map = nenonVideoTexture;
          material.material.needsUpdate = true;
        }
      }
      else {
        const loader = new THREE.TextureLoader();
        loader.load('./assets/image/neon.png', (texture) => {
          nenonImageTexture = texture;
          for (let data of  interactiveMaterialObject) {
            let material = getMaterialByName(data.materialName);
            originalTextures[data.materialName] = material.material.map;

            material.material.transparent = true;
            material.material.map = texture;
            material.material.needsUpdate = true;
          }
        });
      }
    }

    const setVideoTexture= (materialData) => {
      let videoDataObject = getVideo(materialData);
      videoDataObject.video.currentTime = 0;
      videoDataObject.video.play()
      videoPlayerMaterial.material.map = videoDataObject.videoTexture;
      videoPlayerMaterial.material.needsUpdate = true;
  }

    const stopPreviousFeature = (featureId) => {
      let materialData = interactiveMaterialObject.find(data => data.id == featureId);
      let videoDataObject = getVideo(materialData);
      videoDataObject.video.pause();
    }

    const resumeVideo = (featureId) => {
      let materialData = interactiveMaterialObject.find(data => data.id == featureId);
      let videoDataObject = getVideo(materialData);
      videoDataObject.video.play();
    }


    const getVideo = (materialData) => {
      if (materialData.videoTexture == 'envVideoTexture') {
          return { video: env, videoTexture: envVideoTexture }
      }
      else if (materialData.videoTexture == 'placeProductVideoTexture') {
          return { video: placeProduct, videoTexture: placeProductVideoTexture }
      }
      else if (materialData.videoTexture == 'animationPosterVideoTexture') {
          return { video: animationPoster, videoTexture: animationPosterVideoTexture }
      }
  }

    const stopNenonTexture = (materialName) => {
      for (let key of  Object.keys(originalTextures)) {
          if (key != materialName) {
            let material = getMaterialByName(key);
            material.material.map = originalTextures[key];
            material.material.needsUpdate = true;
          }

          if (browser == browserConstant.chrome) {
            let material = getMaterialByName(materialName);
            material.material.transparent = true;
            material.material.map = nenonVideoTexture;
            material.material.needsUpdate = true;
          }
          else {
            let material = getMaterialByName(materialName);
            material.material.transparent = true;
            material.material.map = nenonImageTexture;
            material.material.needsUpdate = true;
          }
      }
    }

    const getMaterialByName = (materialName) => {
      let foundMaterial = null;
      interactiveObjectEvennt.detail.model.traverse(function (node) {
        if (node.material && node.material.name === materialName) {
          foundMaterial = node;
        }
      })
      return foundMaterial;
    }
    
    // Listen for the target being lost
    this.el.addEventListener("targetLost", () => {
      // scaninig.classList.remove("hidden");
      // plane.setAttribute('material', { opacity: 0 })
      // plane.removeAttribute('animation');
      model.setAttribute('rotation', {x: 90, y: 0, z: 0});
      model.removeAttribute('animation-mixer')
      video.pause();
      if (currentFeatureId != null) {
        stopPreviousFeature(currentFeatureId)
      }
     
    });
  }
});

window.addEventListener('load', () => {

  const osType = getMobileOS();
  console.log(osType)
  if (osType == mobileOSConstant.ios) {
    const link = document.createElement('a');
    link.href = "./assets/glb/New Project 2.reality";
    link.id = "ar-link";
    link.rel = "ar";

    link.click();
  }
});
