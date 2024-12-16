import { isChromeOrSafari, browserConstant, interactiveMaterialObject } from './constant/constant.js';

const browser = isChromeOrSafari();

let currentFeatureId = null;
// Register a custom component to handle video playback
AFRAME.registerComponent('business-card', {
  init: function () {
    // Get the video element
    const sceneEl = document.querySelector('a-scene');

    const video = document.getElementById("card");
    const nenonVideo = document.getElementById("nenon");
    // const scaninig = document.getElementById("example-scanning-overlay");
    var animatedPoster = document.getElementById("animated");
    const plane = this.el.querySelector("a-plane");
    const model = this.el.querySelector("a-gltf-model");

    let interactiveObjectEvennt;

    const env = document.getElementById("3dEnv");
    const placeProduct = document.getElementById("placeProduct");
    const animationPoster = document.getElementById("animationPoster");

    var nenonVideoTexture = new THREE.VideoTexture(nenonVideo);

    var envVideoTexture = new THREE.VideoTexture(env);
    var placeProductVideoTexture = new THREE.VideoTexture(placeProduct);
    var animationPosterVideoTexture = new THREE.VideoTexture(animationPoster);

    const interactivePosterObject = document.querySelector("#interactivePosterObject");
    const targetEntity = document.querySelector("#targetEntity");

    // Listen for the target being found
    this.el.addEventListener("targetFound", (evt) => {
      // scaninig.classList.add("hidden");
      const arSystem = sceneEl.systems["mindar-image-system"];
    const mindarSystem = sceneEl.systems['mindar-image'];
    // console.log(arSystem)
    // console.log(mindarSystem)
    //   console.log(plane)
    // const position  = interactivePosterObject.object3D.position.clone();
    // const rotation = interactivePosterObject.object3D.rotation.clone();

    // if (sceneEl.hasLoaded && sceneEl.xrSession) {
    //   const xrSession = sceneEl.xrSession;
      
    //   // Create the anchor using the WebXR API
    //   const anchor = xrSession.createAnchor(position, rotation);
    //   if (anchor) {
    //     // Apply anchor to object
    //     interactivePosterObject.setAttribute('position', position);
    //     interactivePosterObject.setAttribute('rotation', rotation);
        
    //     // Optionally, apply a persistent anchor (this will keep the position stable)
    //     interactivePosterObject.setAttribute('anchored', 'persistent: true');
    //   }
    // }
    // else {
    //   alert('No')
    // }

    // console.log(currentPosition)
    // console.log(currentRotation)
      // plane.setAttribute("animation", {
      //   property: "material.opacity",
      //   to: 1,
      //   dur: 2500,
      //   easing: "easeInOutQuad",
      // });
      

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
        }, 1500)
      }, 1000);
    });



    this.el.addEventListener('model-loaded', function  (evt) {
      interactiveObjectEvennt = evt;
      let videoPlayerMaterial = getMaterialByName('vplane');
      setDefaultNenonVideoTexture();
      // evt.detail.model.traverse(function(node) {
      //   if (node.material && node.material.name === "tplane1") {
      //       node.material.transparent = true;
      //       // node.material.opacity = 1;
      //       node.material.map = nenonVideoTexture;
      //       node.material.needsUpdate = true;
      //   }
      // })

        model.addEventListener('click', (event) => {
            const intersection = event.detail.intersection; // Get intersection details
            if (intersection && intersection.object) {
            const clickedMaterial = intersection.object.material;
            console.log(clickedMaterial.name)

            let materialData = interactiveMaterialObject.find(data => data.materialName == clickedMaterial.name)
            if (currentFeatureId != null) {
                stopPreviousFeature(currentFeatureId);
            }
            stopNenonTexture(clickedMaterial.name);
            currentFeatureId = materialData.id;
            setVideoTexture(materialData);
            }
        });

        const stopPreviousFeature = (featureId) => {
            let materialData = interactiveMaterialObject.find(data => data.id == featureId);
            let videoDataObject = getVideo(materialData);
            videoDataObject.video.pause();
        }

        const setVideoTexture= (materialData) => {
            let videoDataObject = getVideo(materialData);
            videoDataObject.video.currentTime = 0;
            videoDataObject.video.play()
            videoPlayerMaterial.material.map = videoDataObject.videoTexture;
            videoPlayerMaterial.material.needsUpdate = true;
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
          for (let data of  interactiveMaterialObject) {
            let material = getMaterialByName(data.materialName);
            material.material.transparent = true;
            material.material.map = texture;
            material.material.needsUpdate = true;
          }
        });
      }
    }

    const stopNenonTexture = (materialName) => {
        for (let key of  Object.keys(originalTextures)) {
            if (key != materialName) {
                let material = getMaterialByName(key);
                material.material.map = originalTextures[key];
                material.material.needsUpdate = true;
            }
            else {
                let material = getMaterialByName(materialName);
                material.material.transparent = true;
                material.material.map = nenonVideoTexture;
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
      model.removeAttribute('animation-mixer')
      video.pause();
    });
  }
});