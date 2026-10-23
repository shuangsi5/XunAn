if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MapPage_Params {
    targetLat?: number;
    targetLng?: number;
    title?: string;
    markers?: MapMarker[];
    polylines?: MapPolyline[];
    pickerMode?: boolean;
    locating?: boolean;
    sosMode?: boolean;
    mapLat?: number;
    mapLng?: number;
    mapZoom?: number;
    showMyLocation?: boolean;
    sosList?: SOSInfo[];
    selectedSOS?: SOSInfo | null;
}
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import { MapComponent } from "@bundle:com.xunan.floodrescue/entry/ets/components/MapComponent";
import type { MapMarker, MapPolyline } from '../model/MapTypes';
import { getCurrentPosition, reverseGeocode } from "@bundle:com.xunan.floodrescue/entry/ets/utils/LocationUtils";
import { getSOSList } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { getCategoryEmoji } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { AppColors, getStatusColor, getStatusBg } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
class MapPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__targetLat = new ObservedPropertySimplePU(39.9100, this, "targetLat");
        this.__targetLng = new ObservedPropertySimplePU(116.4000, this, "targetLng");
        this.__title = new ObservedPropertySimplePU('全局监控', this, "title");
        this.__markers = new ObservedPropertyObjectPU([], this, "markers");
        this.__polylines = new ObservedPropertyObjectPU([], this, "polylines");
        this.__pickerMode = new ObservedPropertySimplePU(false, this, "pickerMode");
        this.__locating = new ObservedPropertySimplePU(false, this, "locating");
        this.__sosMode = new ObservedPropertySimplePU(false, this, "sosMode");
        this.__mapLat = new ObservedPropertySimplePU(39.9100, this, "mapLat");
        this.__mapLng = new ObservedPropertySimplePU(116.4000, this, "mapLng");
        this.__mapZoom = new ObservedPropertySimplePU(12, this, "mapZoom");
        this.__showMyLocation = new ObservedPropertySimplePU(true, this, "showMyLocation");
        this.__sosList = new ObservedPropertyObjectPU([], this, "sosList");
        this.__selectedSOS = new ObservedPropertyObjectPU(null, this, "selectedSOS");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MapPage_Params) {
        if (params.targetLat !== undefined) {
            this.targetLat = params.targetLat;
        }
        if (params.targetLng !== undefined) {
            this.targetLng = params.targetLng;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.markers !== undefined) {
            this.markers = params.markers;
        }
        if (params.polylines !== undefined) {
            this.polylines = params.polylines;
        }
        if (params.pickerMode !== undefined) {
            this.pickerMode = params.pickerMode;
        }
        if (params.locating !== undefined) {
            this.locating = params.locating;
        }
        if (params.sosMode !== undefined) {
            this.sosMode = params.sosMode;
        }
        if (params.mapLat !== undefined) {
            this.mapLat = params.mapLat;
        }
        if (params.mapLng !== undefined) {
            this.mapLng = params.mapLng;
        }
        if (params.mapZoom !== undefined) {
            this.mapZoom = params.mapZoom;
        }
        if (params.showMyLocation !== undefined) {
            this.showMyLocation = params.showMyLocation;
        }
        if (params.sosList !== undefined) {
            this.sosList = params.sosList;
        }
        if (params.selectedSOS !== undefined) {
            this.selectedSOS = params.selectedSOS;
        }
    }
    updateStateVars(params: MapPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__targetLat.purgeDependencyOnElmtId(rmElmtId);
        this.__targetLng.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__markers.purgeDependencyOnElmtId(rmElmtId);
        this.__polylines.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerMode.purgeDependencyOnElmtId(rmElmtId);
        this.__locating.purgeDependencyOnElmtId(rmElmtId);
        this.__sosMode.purgeDependencyOnElmtId(rmElmtId);
        this.__mapLat.purgeDependencyOnElmtId(rmElmtId);
        this.__mapLng.purgeDependencyOnElmtId(rmElmtId);
        this.__mapZoom.purgeDependencyOnElmtId(rmElmtId);
        this.__showMyLocation.purgeDependencyOnElmtId(rmElmtId);
        this.__sosList.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedSOS.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__targetLat.aboutToBeDeleted();
        this.__targetLng.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__markers.aboutToBeDeleted();
        this.__polylines.aboutToBeDeleted();
        this.__pickerMode.aboutToBeDeleted();
        this.__locating.aboutToBeDeleted();
        this.__sosMode.aboutToBeDeleted();
        this.__mapLat.aboutToBeDeleted();
        this.__mapLng.aboutToBeDeleted();
        this.__mapZoom.aboutToBeDeleted();
        this.__showMyLocation.aboutToBeDeleted();
        this.__sosList.aboutToBeDeleted();
        this.__selectedSOS.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __targetLat: ObservedPropertySimplePU<number>;
    get targetLat() {
        return this.__targetLat.get();
    }
    set targetLat(newValue: number) {
        this.__targetLat.set(newValue);
    }
    private __targetLng: ObservedPropertySimplePU<number>;
    get targetLng() {
        return this.__targetLng.get();
    }
    set targetLng(newValue: number) {
        this.__targetLng.set(newValue);
    }
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __markers: ObservedPropertyObjectPU<MapMarker[]>;
    get markers() {
        return this.__markers.get();
    }
    set markers(newValue: MapMarker[]) {
        this.__markers.set(newValue);
    }
    private __polylines: ObservedPropertyObjectPU<MapPolyline[]>;
    get polylines() {
        return this.__polylines.get();
    }
    set polylines(newValue: MapPolyline[]) {
        this.__polylines.set(newValue);
    }
    private __pickerMode: ObservedPropertySimplePU<boolean>;
    get pickerMode() {
        return this.__pickerMode.get();
    }
    set pickerMode(newValue: boolean) {
        this.__pickerMode.set(newValue);
    }
    private __locating: ObservedPropertySimplePU<boolean>;
    get locating() {
        return this.__locating.get();
    }
    set locating(newValue: boolean) {
        this.__locating.set(newValue);
    }
    private __sosMode: ObservedPropertySimplePU<boolean>;
    get sosMode() {
        return this.__sosMode.get();
    }
    set sosMode(newValue: boolean) {
        this.__sosMode.set(newValue);
    }
    private __mapLat: ObservedPropertySimplePU<number>;
    get mapLat() {
        return this.__mapLat.get();
    }
    set mapLat(newValue: number) {
        this.__mapLat.set(newValue);
    }
    private __mapLng: ObservedPropertySimplePU<number>;
    get mapLng() {
        return this.__mapLng.get();
    }
    set mapLng(newValue: number) {
        this.__mapLng.set(newValue);
    }
    private __mapZoom: ObservedPropertySimplePU<number>;
    get mapZoom() {
        return this.__mapZoom.get();
    }
    set mapZoom(newValue: number) {
        this.__mapZoom.set(newValue);
    }
    private __showMyLocation: ObservedPropertySimplePU<boolean>;
    get showMyLocation() {
        return this.__showMyLocation.get();
    }
    set showMyLocation(newValue: boolean) {
        this.__showMyLocation.set(newValue);
    }
    // 全量求救记录，用于点击标记时查询求救人员信息
    private __sosList: ObservedPropertyObjectPU<SOSInfo[]>;
    get sosList() {
        return this.__sosList.get();
    }
    set sosList(newValue: SOSInfo[]) {
        this.__sosList.set(newValue);
    }
    // 当前选中的求救记录（点击标记后展示信息面板）
    private __selectedSOS: ObservedPropertyObjectPU<SOSInfo | null>;
    get selectedSOS() {
        return this.__selectedSOS.get();
    }
    set selectedSOS(newValue: SOSInfo | null) {
        this.__selectedSOS.set(newValue);
    }
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
        }
        else {
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
            }
            else {
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
        }
        else {
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
        }
        else {
            addr = `纬度 ${this.targetLat.toFixed(5)}, 经度 ${this.targetLng.toFixed(5)}`;
        }
        AppStorage.setOrCreate('pickedAddress', addr);
        this.locating = false;
        router.back();
    }
    SOSInfoPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedSOS) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.width('90%');
                        Column.padding(16);
                        Column.backgroundColor(AppColors.card);
                        Column.borderRadius(16);
                        Column.shadow({ radius: 12, color: 'rgba(0,0,0,0.15)' });
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${getCategoryEmoji(this.selectedSOS.category)} ${this.selectedSOS.name}`);
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.textPrimary);
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('✕');
                        Button.width(28);
                        Button.height(28);
                        Button.fontSize(14);
                        Button.backgroundColor(AppColors.bgSecondary);
                        Button.fontColor(AppColors.textSecondary);
                        Button.borderRadius(14);
                        Button.onClick(() => { this.selectedSOS = null; });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📞 联系电话：${this.selectedSOS.phone}`);
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textPrimary);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📍 地址：${this.selectedSOS.address}`);
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textSecondary);
                        Text.width('100%');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📝 情况：${this.selectedSOS.description}`);
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textSecondary);
                        Text.width('100%');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedSOS.status);
                        Text.fontSize(12);
                        Text.fontColor(getStatusColor(this.selectedSOS.status));
                        Text.backgroundColor(getStatusBg(this.selectedSOS.status));
                        Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
                        Text.borderRadius(4);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedSOS.level);
                        Text.fontSize(12);
                        Text.fontColor(AppColors.warning);
                        Text.backgroundColor(AppColors.warningLight);
                        Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
                        Text.borderRadius(4);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedSOS.time);
                        Text.fontSize(11);
                        Text.fontColor(AppColors.textTertiary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else // 鸿蒙原生式页面转场：push 从右滑入、pop 从左返回，旧页面淡出形成视差
             {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    // 鸿蒙原生式页面转场：push 从右滑入、pop 从左返回，旧页面淡出形成视差
    pageTransition() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransition.create();
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionEnter.create({ duration: 400, curve: Curve.Friction, type: RouteType.Push });
            PageTransitionEnter.slide(SlideEffect.Right);
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionExit.create({ duration: 400, curve: Curve.Friction, type: RouteType.Push });
            PageTransitionExit.slide(SlideEffect.Left);
            PageTransitionExit.opacity(0.6);
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionEnter.create({ duration: 400, curve: Curve.Friction, type: RouteType.Pop });
            PageTransitionEnter.slide(SlideEffect.Left);
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionExit.create({ duration: 400, curve: Curve.Friction, type: RouteType.Pop });
            PageTransitionExit.slide(SlideEffect.Right);
            PageTransitionExit.opacity(0.6);
        }, null);
        PageTransition.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor(AppColors.bg);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 标题栏
            Row.alignItems(VerticalAlign.Center);
            // 标题栏
            Row.padding({ left: 8, right: 16, top: 12, bottom: 12 });
            // 标题栏
            Row.backgroundColor(AppColors.card);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.fontSize(20);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(AppColors.textPrimary);
            Button.width(40);
            Button.height(40);
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.pickerMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.locating ? '定位中…' : '确认此位置');
                        Button.fontSize(14);
                        Button.height(36);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(this.locating ? AppColors.textTertiary : AppColors.danger);
                        Button.borderRadius(18);
                        Button.enabled(!this.locating);
                        Button.onClick(() => this.confirmLocation());
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(40);
                        Row.height(40);
                    }, Row);
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.layoutWeight(1);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new MapComponent(this, {
                        markers: this.markers,
                        polylines: this.polylines,
                        myLocationEnabled: this.showMyLocation,
                        initialLat: this.mapLat,
                        initialLng: this.mapLng,
                        zoomLevel: this.mapZoom,
                        onMarkerClick: (markerId: string): void => {
                            this.onMarkerClick(markerId);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MapPage.ets", line: 306, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            markers: this.markers,
                            polylines: this.polylines,
                            myLocationEnabled: this.showMyLocation,
                            initialLat: this.mapLat,
                            initialLng: this.mapLng,
                            zoomLevel: this.mapZoom,
                            onMarkerClick: (markerId: string): void => {
                                this.onMarkerClick(markerId);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        markers: this.markers,
                        polylines: this.polylines,
                        myLocationEnabled: this.showMyLocation,
                        initialLat: this.mapLat,
                        initialLng: this.mapLng,
                        zoomLevel: this.mapZoom
                    });
                }
            }, { name: "MapComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.pickerMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor(AppColors.warningLight);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.locating
                            ? '📍 正在获取您的位置…'
                            : '📍 蓝色圆点为您的当前位置，确认无误后点击上方按钮');
                        Text.fontSize(12);
                        Text.fontColor(AppColors.textSecondary);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sosMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor(AppColors.primaryLight);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.locating
                            ? '📍 正在获取位置信息…'
                            : '📍 红色标记为求救位置，蓝色标记为您当前所在位置，红色路线为救援路径');
                        Text.fontSize(12);
                        Text.fontColor(AppColors.textSecondary);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 求救人员信息面板（覆盖在地图底部）
            if (this.selectedSOS) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.SOSInfoPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MapPage";
    }
}
registerNamedRoute(() => new MapPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/MapPage", pageFullPath: "entry/src/main/ets/pages/MapPage", integratedHsp: "false", moduleType: "followWithHap" });
