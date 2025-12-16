// hooks/useDeviceDetect.js
import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const getDeviceType = () => {
      if (/iphone|ipad|ipod|android|windows phone|webos/gi.test(userAgent)) {
        if (/ipad|android(?!.*mobi)/gi.test(userAgent)) {
          return 'tablet';
        }
        return 'mobile';
      }
      return 'desktop';
    };

    const getBrowserInfo = () => {
      let browserName = 'Unknown';
      let browserVersion = 'Unknown';

      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        browserName = 'Chrome';
        browserVersion = userAgent.match(/chrome\/(\S+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        browserName = 'Safari';
        browserVersion = userAgent.match(/version\/(\S+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('firefox')) {
        browserName = 'Firefox';
        browserVersion = userAgent.match(/firefox\/(\S+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('edg')) {
        browserName = 'Edge';
        browserVersion = userAgent.match(/edg[e\/]*(\S+)/)?.[1] || 'Unknown';
      }

      return { browserName, browserVersion };
    };

    const getOSInfo = () => {
      let osName = 'Unknown';
      let osVersion = 'Unknown';

      if (userAgent.includes('windows')) {
        osName = 'Windows';
        osVersion = userAgent.match(/windows nt (\S+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('mac')) {
        osName = 'macOS';
        osVersion = userAgent.match(/mac os x ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
      } else if (userAgent.includes('linux')) {
        osName = 'Linux';
      } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        osName = 'iOS';
        osVersion = userAgent.match(/os (\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('android')) {
        osName = 'Android';
        osVersion = userAgent.match(/android (\S+)/)?.[1] || 'Unknown';
      }

      return { osName, osVersion };
    };

    const browser = getBrowserInfo();
    const os = getOSInfo();

    const info = {
      deviceType: getDeviceType(),
      ...browser,
      ...os,
      userAgent: navigator.userAgent,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'N/A',
      hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
      language: navigator.language,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      timestamp: new Date().toISOString()
    };

    setDeviceInfo(info);
  }, []);

  return deviceInfo;
}
