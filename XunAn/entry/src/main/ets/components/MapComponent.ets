import { MapComponent as HMSMap, map, mapCommon } from '@kit.MapKit';
import { MapMarker, MapPolyline } from '../model/MapTypes';

@Component
export struct MapComponent {
  @Prop @Watch('onMarkersChanged') markers: MapMarker[] = [];
  @Prop @Watch('onPolylinesChanged') polylines: MapPolyline[] = [];
  @Prop myLocationEnabled: boolean = false;
  @Prop initialLat: number = 39.9100;
  @Prop initialLng: number = 116.4000;
  @Prop zoomLevel: number = 12;
  onControllerReady?: (ctrl: map.MapComponentController) => void;
  onMarkerClick?: (markerId: string) => void;
  private mapOptions?: mapCommon.MapOptions;
  private mapController?: map.MapComponentController;

  aboutToAppear(): void {
    this.mapOptions = {
      position: {
        target: {
          latitude: this.initialLat,
          longitude: this.initialLng
        },
        zoom: this.zoomLevel
      }
    };
  }

  onMarkersChanged(): void {
    this.syncToMap();
  }

  onPolylinesChanged(): void {
    this.syncToMap();
  }

  // 将 markers 和 polylines 同步到地图（幂等，可重复调用）
  private syncToMap(): void {
    if (!this.mapController) {
      return;
    }
    // 先清除已有覆盖物，避免重复添加
    this.mapController.clear();
    // 添加标记：标记默认不可点击，需要显式开启 clickable
    this.markers.forEach((marker: MapMarker) => {
      const options: mapCommon.MarkerOptions = {
        position: { latitude: marker.position.latitude, longitude: marker.position.longitude },
        clickable: true
      };
      if (marker.title) {
        options.title = marker.title;
      }
      if (marker.snippet) {
        options.snippet = marker.snippet;
      }
      this.mapController!.addMarker(options).then((m: map.Marker) => {
        // 用 tag 记录标记对应的求救记录ID，供点击回调识别
        if (marker.id) {
          m.setTag(marker.id);
        }
      }).catch((err: Error) => {
        console.error('添加地图标记失败: ' + JSON.stringify(err));
      });
    });
    // 添加折线
    this.polylines.forEach((line: MapPolyline) => {
      this.mapController!.addPolyline(line).catch((err: Error) => {
        console.error('添加地图折线失败: ' + JSON.stringify(err));
      });
    });
    // 是否显示我的位置图层
    if (this.myLocationEnabled) {
      this.mapController!.setMyLocationEnabled(true);
      this.mapController!.setMyLocationControlsEnabled(true);
    }
  }

  build() {
    Stack() {
      HMSMap({
        mapOptions: this.mapOptions,
        mapCallback: (err, controller) => {
          if (!err && controller) {
            this.mapController = controller;
            // 监听标记点击事件，回传标记的 tag（即求救记录ID）
            controller.on('markerClick', (marker: map.Marker) => {
              const tag = marker.getTag();
              if (this.onMarkerClick && tag !== null && tag !== undefined) {
                this.onMarkerClick(String(tag));
              }
            });
            // 初次同步（处理 markers/polylines 在控制器就绪前已设置的情况）
            this.syncToMap();
            // 将控制器暴露给父组件，方便后续异步操作
            if (this.onControllerReady) {
              this.onControllerReady(controller);
            }
          }
        }
      })
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
