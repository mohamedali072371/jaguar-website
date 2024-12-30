import { createChromaMaterial} from './constant/constant.js';

let bluetoothSpeakerObjectEvennt;

let videoBindingMaterials = ['light-info', 'pairing-info', 'texture-info'];

AFRAME.registerComponent('business-card', {
    init: function () {
        const speakerModel = this.el.querySelector("a-gltf-model");

        const lightGrowVideo = document.getElementById("lightGrowVideo");
        const growVideo = document.getElementById("growVideo");
        const spiralVideo = document.getElementById("spiralVideo");

        // const speakerImage = document.getElementById("speaker-body");
       

        const lightGrowVideoTexture = new THREE.VideoTexture(lightGrowVideo);
        const GrowVideoTexture = new THREE.VideoTexture(growVideo);
        const spiralVideoTexture = new THREE.VideoTexture(spiralVideo);



        this.el.addEventListener('model-loaded', function (evt) {
            bluetoothSpeakerObjectEvennt = evt;

            bindSpeakerImageTexture('./assets/image/speaker-texture.jpg');
            const texture = createChromaMaterial(GrowVideoTexture, 0x00ff00)
            const spiralVideoTransparentTexture = createChromaMaterial(spiralVideoTexture, 0x00ff00)

            let lightGrowMaterial = getMaterialByName('glow-light')
            let spiralMaterial = getMaterialByName('spiral-music');
           

            spiralMaterial.material = spiralVideoTransparentTexture;
            spiralMaterial.material.needsUpdate = true;

            lightGrowMaterial.material.transparent = true;
            lightGrowMaterial.material.map = lightGrowVideoTexture;
            lightGrowMaterial.material.needsUpdate = true;

            for (let materialName of videoBindingMaterials) {
              let material = getMaterialByName(materialName);
              material.material.transparent = true;
              material.material = texture;
              material.material.needsUpdate = true;
            }


            speakerModel.addEventListener('click', (event) => {
              const intersection = event.detail.intersection; 
              if (intersection && intersection.object) {
                const material = intersection.object.material;
                const materialName = material.name;

                if (materialName == 'play-btn') {
                  play();
                  console.log('play-btn')
                }
                else if (materialName == 'pause-btn') {
                  pause()
                  console.log('pause-btn')
                }
                else if (materialName == 'volume-up') {
                  volumeUp()
                  console.log('volume-up')
                }
                else if (materialName == 'volume-down') {
                  volumeDown()
                  console.log('volume-down')
                }
              }
            });

        })

        // Listen for the target being found
        this.el.addEventListener("targetFound", () => {
            lightGrowVideo.currentTime = 0
            lightGrowVideo.volume = 0.5;
            lightGrowVideo.play();
            growVideo.play();
            spiralVideo.play();
        });

        // Listen for the target being lost
        this.el.addEventListener("targetLost", () => {
            lightGrowVideo.pause();
            growVideo.pause();
            spiralVideo.pause();
        });

        const bindSpeakerImageTexture = (src) => {
          const loader = new THREE.TextureLoader();
          loader.load(src, (imageTexture) => {
            let bodyMaterial = getMaterialByName('body-texture');
            bodyMaterial.material.map = imageTexture;
            bodyMaterial.material.needsUpdate = true;
          })
        }

        const getMaterialByName = (materialName) => {
            let foundMaterial = null;
            bluetoothSpeakerObjectEvennt.detail.model.traverse(function (node) {
                // console.log(node)
              if (node.material && node.material.name === materialName) {
                foundMaterial = node;
              }
            })
            return foundMaterial;
        }

        const play = () => {
          if (lightGrowVideo.paused) {
            lightGrowVideo.play();
          }
        };

        const pause = () => {
          if (!lightGrowVideo.paused) {
            lightGrowVideo.pause();
          }
        };

        const volumeUp = () => {
          if (lightGrowVideo.volume < 1) {
            lightGrowVideo.volume = Math.min(lightGrowVideo.volume + 0.1, 1);
          }
        }

        const volumeDown = () => {
          if (lightGrowVideo.volume > 0) {
            lightGrowVideo.volume = Math.max(lightGrowVideo.volume - 0.1, 0);
          }
        }

        
    }

   

    

    
});