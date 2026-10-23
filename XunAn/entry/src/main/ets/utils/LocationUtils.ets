import { geoLocationManager } from '@kit.LocationKit';
import { abilityAccessCtrl, common, Permissions } from '@kit.AbilityKit';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  address: string;
}

const DEFAULT_LAT = 39.9100;
const DEFAULT_LNG = 116.4000;

function makeFallback(): GeoPosition {
  return { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG, address: '' };
}

function makePosition(lat: number, lng: number): GeoPosition {
  return {
    latitude: lat,
    longitude: lng,
    address: `纬度 ${lat.toFixed(5)}, 经度 ${lng.toFixed(5)}`
  };
}

// 反向地理编码：将经纬度转换为省市区等详细地址
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    let request: geoLocationManager.ReverseGeoCodeRequest = {
      locale: 'zh-Hans',
      latitude: latitude,
      longitude: longitude,
      maxItems: 1
    };
    let addresses = await geoLocationManager.getAddressesFromLocation(request);
    if (addresses && addresses.length > 0) {
      let addr = addresses[0];
      let parts: string[] = [];
      // 优先使用 placeName（完整格式化地址）
      if (addr.placeName) {
        return addr.placeName;
      }
      // 否则手动拼接：省 → 市 → 区/县 → 街道
      if (addr.administrativeArea) {
        parts.push(addr.administrativeArea);
      }
      if (addr.locality) {
        parts.push(addr.locality);
      }
      if (addr.subAdministrativeArea) {
        parts.push(addr.subAdministrativeArea);
      }
      if (addr.subLocality) {
        parts.push(addr.subLocality);
      }
      if (parts.length > 0) {
        return parts.join('');
      }
    }
    return '';
  } catch (err) {
    console.error('反向地理编码失败: ' + JSON.stringify(err));
    return '';
  }
}

// 运行时请求定位权限（回调版本，兼容性更好）
function ensureLocationPermission(ctx: common.UIAbilityContext): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    try {
      let atManager = abilityAccessCtrl.createAtManager();
      let permissions: Array<Permissions> = [
        'ohos.permission.LOCATION' as Permissions,
        'ohos.permission.APPROXIMATELY_LOCATION' as Permissions
      ];
      atManager.requestPermissionsFromUser(ctx, permissions, (err, data) => {
        if (err) {
          console.error('权限请求失败: ' + JSON.stringify(err));
          resolve(false);
          return;
        }
        for (let i = 0; i < data.authResults.length; i++) {
          if (data.authResults[i] !== 0) {
            console.error('定位权限被拒绝');
            resolve(false);
            return;
          }
        }
        resolve(true);
      });
    } catch (e) {
      console.error('权限请求异常: ' + JSON.stringify(e));
      resolve(false);
    }
  });
}

export async function getCurrentPosition(ctx: common.UIAbilityContext): Promise<GeoPosition> {
  // 1. 确保权限
  let permitted = await ensureLocationPermission(ctx);
  if (!permitted) {
    return makeFallback();
  }

  // 2. 获取当前位置
  try {
    let location = await geoLocationManager.getCurrentLocation();
    let pos = makePosition(location.latitude, location.longitude);
    // 反向地理编码获取省市区等详细地址
    let geoAddr = await reverseGeocode(location.latitude, location.longitude);
    if (geoAddr) {
      pos.address = geoAddr;
    }
    return pos;
  } catch (err) {
    console.error('getCurrentLocation 失败: ' + JSON.stringify(err));
  }

  // 3. 回退：获取上次已知位置
  try {
    let lastLocation = await geoLocationManager.getLastLocation();
    let pos = makePosition(lastLocation.latitude, lastLocation.longitude);
    let geoAddr = await reverseGeocode(lastLocation.latitude, lastLocation.longitude);
    if (geoAddr) {
      pos.address = geoAddr;
    }
    return pos;
  } catch (err2) {
    console.error('getLastLocation 也失败: ' + JSON.stringify(err2));
  }

  return makeFallback();
}
