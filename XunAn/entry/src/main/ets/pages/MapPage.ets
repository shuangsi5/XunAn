import { common } from '@kit.AbilityKit';
import { router } from '@kit.ArkUI';
import { MapComponent } from '../components/MapComponent';
import { MapMarker, MapPolyline } from '../model/MapTypes';
import { getCurrentPosition, reverseGeocode } from '../utils/LocationUtils';
import { getSOSList } from '../utils/ApiService';
import { SOSInfo, getCategoryEmoji } from '../model/SOSInfo';
import { AppColors, getStatusColor, getStatusBg } from '../common/Theme';

@Entry
@Component
struct MapPage {
  @State targetLat: number = 39.9100;
  @State targetLng: number = 116.4000;
  @State title: string = '全局监控';
  @State markers: MapMarker[] = [];
  @State polylines: MapPolyline[] = [];
  @State pickerMode: boolean = false;
  @State locating: boolean = false;
  @State sosMode: boolean = false;
  @State mapLat: number = 39.9100;
  @State mapLng: number = 116.4000;
  @State mapZoom: number = 12;
  @State showMyLocation: boolean = true;
  // 全量求救记录，用于点击标记时查询求救人员信息
  @State sosList: SOSInfo[] = [];
  // 当前选中的求救记录（点击标记后展示信息面板）
  @State selectedSOS: SOSInfo | null = null;

  aboutToAppear() {
    // 预加载求救记录，供点击标记时匹配
    this.loadSOSList();

    // 检查是否为选址模式（从 AppStorage 读取）
    let picker = AppStorage.get('mapPickerMode') as boolean;
    if (picker === true) {
      this.pickerMode = true;
      this.title = '选择位置';
      this.markers = [];
      this.showMyLocation = true;
      AppStorage.set('mapPickerMode', undefined);
      // 获取真实设备位置
      this.fetchRealLocation();
    } else {
      let params = router.getParams() as Record<string, number | string | boolean>;
      if (params && params['targetLat']) {
        this.targetLat = params['targetLat'] as number;
        this.targetLng = params['targetLng'] as number;
        this.mapLat = this.targetLat;
        this.mapLng = this.targetLng;
        this.mapZoom = 15;
        this.title = (params['title'] as string) || '目标位置';
        this.sosMode = true;
        this.showMyLocation = false; // 不使用系统蓝色定位点，改为手动添加标记
        let sosId = (params['sosId'] as string) || '';
        // 先放置求救标记，同时异步获取自身位置
        this.markers = [
          {
            position: { latitude: this.targetLat, longitude: this.targetLng },
            title: this.title,
            snippet: '📍 求救人员位置',
            id: sosId
          }
        ];
        // 异步获取自身位置并添加到地图上
        this.fetchMyLocationForSOS(sosId);
      } else {
        // 全局模式：从后端加载所有求救点标记
        this.showMyLocation = true;
        this.loadGlobalMarkers();
      }
    }
  }

  async loadSOSList() {
    this.sosList = await getSOSList();
  }

  // 全局模式：在地图上显示所有求救点
  loadGlobalMarkers() {
    getSOSList().then((sosList) => {
      this.sosList = sosList;
      let markers: MapMarker[] = [];
      for (let sos of sosList) {
        markers.push({
          position: { latitude: sos.latitude, longitude: sos.longitude },
          title: sos.name,
          snippet: `${sos.status} · ${sos.address}`,
          id: sos.id
        });
      }
      this.markers = markers;
    });
  }

  // 点击救援点标记：展示求救人员信息
  onMarkerClick(markerId: string) {
    if (!markerId || markerId === 'my-location') {
      return;
    }
    let sos = this.sosList.find((item: SOSInfo) => item.id === markerId);
    if (sos) {
      this.selectedSOS = sos;
    } else {
      // 列表尚未加载完成或记录较新，重新拉取一次再匹配
      getSOSList().then((list) => {
        this.sosList = list;
        let found = list.find((item: SOSInfo) => item.id === markerId);
        if (found) {
          this.selectedSOS = found;
        }
      });
    }
  }

  async fetchMyLocationForSOS(sosId: string) {
    this.locating = true;
    let ctx = getContext(this) as common.UIAbilityContext;
    let pos = await getCurrentPosition(ctx);
    // 将自身位置追加到标记列表，与求救标记显示在同一地图上
    this.markers = [
      {
        position: { latitude: this.targetLat, longitude: this.targetLng },
        title: this.title,
        snippet: '📍 求救人员位置',
        id: sosId
      },
      {
        position: { latitude: pos.latitude, longitude: pos.longitude },
        title: '我的位置',
        snippet: pos.address || '当前所在位置',
        id: 'my-location'
      }
    ];
    // 添加从自身位置到求救位置的救援路线（color 使用 ARGB 格式，带不透明度）
    let routeLine: MapPolyline = {
      points: [
        { latitude: pos.latitude, longitude: pos.longitude },
        { latitude: this.targetLat, longitude: this.targetLng }
      ],
      color: 0xFFE84026,
      width: 6
    };
    this.polylines = [routeLine];
    this.locating = false;
  }

  async fetchRealLocation() {
    this.locating = true;
    let ctx = getContext(this) as common.UIAbilityContext;
    let pos = await getCurrentPosition(ctx);
    this.targetLat = pos.latitude;
    this.targetLng = pos.longitude;
    this.mapLat = pos.latitude;
    this.mapLng = pos.longitude;
    // 在地图上标记当前位置
    this.markers = [
      {
        position: { latitude: pos.latitude, longitude: pos.longitude },
        title: '我的位置',
        snippet: pos.address,
        id: 'my-location'
      }
    ];
    this.locating = false;
  }

  async confirmLocation() {
    // 将真实坐标及地址存入 AppStorage，供 CitizenPage 读取
    this.locating = true;
    AppStorage.setOrCreate('pickedLat', this.targetLat);
    AppStorage.setOrCreate('pickedLng', this.targetLng);
    // 反向地理编码获取省市区等详细地址
    let geoAddr = await reverseGeocode(this.targetLat, this.targetLng);
    let addr: string;
    if (geoAddr) {
      addr = `${geoAddr} (纬度 ${this.targetLat.toFixed(5)}, 经度 ${this.targetLng.toFixed(5)})`;
    } else {
      addr = `纬度 ${this.targetLat.toFixed(5)}, 经度 ${this.targetLng.toFixed(5)}`;
    }
    AppStorage.setOrCreate('pickedAddress', addr);
    this.locating = false;
    router.back();
  }

  @Builder
  SOSInfoPanel() {
    if (this.selectedSOS) {
      Column({ space: 8 }) {
        Row() {
          Text(`${getCategoryEmoji(this.selectedSOS.category)} ${this.selectedSOS.name}`)
            .fontSize(17)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
            .layoutWeight(1)
          Button('✕')
            .width(28)
            .height(28)
            .fontSize(14)
            .backgroundColor(AppColors.bgSecondary)
            .fontColor(AppColors.textSecondary)
            .borderRadius(14)
            .onClick(() => { this.selectedSOS = null; })
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)

        Text(`📞 联系电话：${this.selectedSOS.phone}`)
          .fontSize(14)
          .fontColor(AppColors.textPrimary)
          .width('100%')
        Text(`📍 地址：${this.selectedSOS.address}`)
          .fontSize(13)
          .fontColor(AppColors.textSecondary)
          .width('100%')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
        Text(`📝 情况：${this.selectedSOS.description}`)
          .fontSize(13)
          .fontColor(AppColors.textSecondary)
          .width('100%')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Row({ space: 8 }) {
          Text(this.selectedSOS.status)
            .fontSize(12)
            .fontColor(getStatusColor(this.selectedSOS.status))
            .backgroundColor(getStatusBg(this.selectedSOS.status))
            .padding({ left: 8, right: 8, top: 2, bottom: 2 })
            .borderRadius(4)
          Text(this.selectedSOS.level)
            .fontSize(12)
            .fontColor(AppColors.warning)
            .backgroundColor(AppColors.warningLight)
            .padding({ left: 8, right: 8, top: 2, bottom: 2 })
            .borderRadius(4)
          Text(this.selectedSOS.time)
            .fontSize(11)
            .fontColor(AppColors.textTertiary)
        }
        .width('100%')
      }
      .width('90%')
      .padding(16)
      .backgroundColor(AppColors.card)
      .borderRadius(16)
      .shadow({ radius: 12, color: 'rgba(0,0,0,0.15)' })
      .margin({ bottom: 16 })
    }
  }

  // 鸿蒙原生式页面转场：push 从右滑入、pop 从左返回，旧页面淡出形成视差
  pageTransition() {
    PageTransitionEnter({ duration: 400, curve: Curve.Friction, type: RouteType.Push })
      .slide(SlideEffect.Right)
    PageTransitionExit({ duration: 400, curve: Curve.Friction, type: RouteType.Push })
      .slide(SlideEffect.Left)
      .opacity(0.6)
    PageTransitionEnter({ duration: 400, curve: Curve.Friction, type: RouteType.Pop })
      .slide(SlideEffect.Left)
    PageTransitionExit({ duration: 400, curve: Curve.Friction, type: RouteType.Pop })
      .slide(SlideEffect.Right)
      .opacity(0.6)
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Column() {
        // 标题栏
        Row() {
          Button('←')
            .fontSize(20)
            .backgroundColor(Color.Transparent)
            .fontColor(AppColors.textPrimary)
            .width(40)
            .height(40)
            .onClick(() => router.back())
          Blank()
          Text(this.title)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Blank()
          if (this.pickerMode) {
            Button(this.locating ? '定位中…' : '确认此位置')
              .fontSize(14)
              .height(36)
              .fontColor(Color.White)
              .backgroundColor(this.locating ? AppColors.textTertiary : AppColors.danger)
              .borderRadius(18)
              .enabled(!this.locating)
              .onClick(() => this.confirmLocation())
          } else {
            Row()
              .width(40)
              .height(40)
          }
        }
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
        .alignItems(VerticalAlign.Center)
        .padding({ left: 8, right: 16, top: 12, bottom: 12 })
        .backgroundColor(AppColors.card)

        MapComponent({
          markers: this.markers,
          polylines: this.polylines,
          myLocationEnabled: this.showMyLocation,
          initialLat: this.mapLat,
          initialLng: this.mapLng,
          zoomLevel: this.mapZoom,
          onMarkerClick: (markerId: string): void => {
            this.onMarkerClick(markerId);
          }
        })
          .layoutWeight(1)

        if (this.pickerMode) {
          Row() {
            Text(this.locating
              ? '📍 正在获取您的位置…'
              : '📍 蓝色圆点为您的当前位置，确认无误后点击上方按钮')
              .fontSize(12)
              .fontColor(AppColors.textSecondary)
              .textAlign(TextAlign.Center)
          }
          .width('100%')
          .padding(12)
          .backgroundColor(AppColors.warningLight)
        }

        if (this.sosMode) {
          Row() {
            Text(this.locating
              ? '📍 正在获取位置信息…'
              : '📍 红色标记为求救位置，蓝色标记为您当前所在位置，红色路线为救援路径')
              .fontSize(12)
              .fontColor(AppColors.textSecondary)
              .textAlign(TextAlign.Center)
          }
          .width('100%')
          .padding(12)
          .backgroundColor(AppColors.primaryLight)
        }
      }
      .width('100%')
      .height('100%')

      // 求救人员信息面板（覆盖在地图底部）
      if (this.selectedSOS) {
        this.SOSInfoPanel()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}
