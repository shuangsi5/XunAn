export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  position: LatLng;
  title?: string;
  snippet?: string;
  // 用于标识标记对应的求救记录ID，点击标记时回传给父组件
  id?: string;
}

export interface MapPolyline {
  points: LatLng[];
  color?: number;
  width?: number;
}
