export const interactiveMaterialObject = [
    {
        id: 1,
        materialName: 'tplane1',
        name: '3D envinorment',
        videoTexture: 'envVideoTexture',
        video: 'env'
    },
    {
        id: 2,
        materialName: 'tplane2',
        name: 'Animated Poster',
        videoTexture: 'placeProductVideoTexture',
        video: 'placeProduct'
    },
    {
        id: 3,
        materialName: 'tplane3',
        name: 'Place your product in live',
        videoTexture: 'animationPosterVideoTexture',
        video: 'animationPoster'
    },
]

export const isChromeOrSafari = () => {
    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor;
  
    if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) {
      return browserConstant.chrome;
    } else if (/Safari/.test(userAgent) && /Apple Computer/.test(vendor)) {
      return browserConstant.safari;
    } 
    else {
        return browserConstant.chrome;
    }
}

export const browserConstant = {
    chrome: 'Chrome',
    safari: 'Safari',
};