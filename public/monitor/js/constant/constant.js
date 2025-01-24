export const  getMobileOS = () => {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return mobileOSConstant.android
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return mobileOSConstant.ios
    }
  }

export const browserConstant = {
    chrome: 'Chrome',
    safari: 'Safari',
};

export const mobileOSConstant = {
    android: 'Android',
    ios: 'IOS',
};