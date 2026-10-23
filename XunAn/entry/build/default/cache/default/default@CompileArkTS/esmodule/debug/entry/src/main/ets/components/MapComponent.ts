if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MapComponent_Params {
    markers?: MapMarker[];
    polylines?: MapPolyline[];
    myLocationEnabled?: boolean;
    initialLat?: number;
    initialLng?: number;
    zoomLevel?: number;
    onControllerReady?: (ctrl: map.MapComponentController) => void;
    onMarkerClick?: (markerId: string) => void;
    mapOptions?: mapCommon.MapOptions;
    mapController?: map.MapComponentController;
}
import { MapComponent as HMSMap } from "@bundle:com.huawei.hms.mapservice.kit/mapLibrary/ets/MapComponent";
import type map from "@bundle:com.huawei.hms.mapservice.kit/mapLibrary/ets/map";
import type mapCommon from "@bundle:com.huawei.hms.mapservice.kit/mapLibrary/ets/mapCommon";
import type { MapMarker, MapPolyline } from '../model/MapTypes';
export class MapComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__markers = new SynchedPropertyObjectOneWayPU(params.markers, this, "markers");
        this.__polylines = new SynchedPropertyObjectOneWayPU(params.polylines, this, "polylines");
        this.__myLocationEnabled = new SynchedPropertySimpleOneWayPU(params.myLocationEnabled, this, "myLocationEnabled");
        this.__initialLat = new SynchedPropertySimpleOneWayPU(params.initialLat, this, "initialLat");
        this.__initialLng = new SynchedPropertySimpleOneWayPU(params.initialLng, this, "initialLng");
        this.__zoomLevel = new SynchedPropertySimpleOneWayPU(params.zoomLevel, this, "zoomLevel");
        this.onControllerReady = undefined;
        this.onMarkerClick = undefined;
        this.mapOptions = undefined;
        this.mapController = undefined;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("markers", this.onMarkersChanged);
        this.declareWatch("polylines", this.onPolylinesChanged);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MapComponent_Params) {
        if (params.markers === undefined) {
            this.__markers.set([]);
        }
        if (params.polylines === undefined) {
            this.__polylines.set([]);
        }
        if (params.myLocationEnabled === undefined) {
            this.__myLocationEnabled.set(false);
        }
        if (params.initialLat === undefined) {
            this.__initialLat.set(39.9100);
        }
        if (params.initialLng === undefined) {
            this.__initialLng.set(116.4000);
        }
        if (params.zoomLevel === undefined) {
            this.__zoomLevel.set(12);
        }
        if (params.onControllerReady !== undefined) {
            this.onControllerReady = params.onControllerReady;
        }
        if (params.onMarkerClick !== undefined) {
            this.onMarkerClick = params.onMarkerClick;
        }
        if (params.mapOptions !== undefined) {
            this.mapOptions = params.mapOptions;
        }
        if (params.mapController !== undefined) {
            this.mapController = params.mapController;
        }
    }
    updateStateVars(params: MapComponent_Params) {
        this.__markers.reset(params.markers);
        this.__polylines.reset(params.polylines);
        this.__myLocationEnabled.reset(params.myLocationEnabled);
        this.__initialLat.reset(params.initialLat);
        this.__initialLng.reset(params.initialLng);
        this.__zoomLevel.reset(params.zoomLevel);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__markers.purgeDependencyOnElmtId(rmElmtId);
        this.__polylines.purgeDependencyOnElmtId(rmElmtId);
        this.__myLocationEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__initialLat.purgeDependencyOnElmtId(rmElmtId);
        this.__initialLng.purgeDependencyOnElmtId(rmElmtId);
        this.__zoomLevel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__markers.aboutToBeDeleted();
        this.__polylines.aboutToBeDeleted();
        this.__myLocationEnabled.aboutToBeDeleted();
        this.__initialLat.aboutToBeDeleted();
        this.__initialLng.aboutToBeDeleted();
        this.__zoomLevel.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __markers: SynchedPropertySimpleOneWayPU<MapMarker[]>;
    get markers() {
        return this.__markers.get();
    }
    set markers(newValue: MapMarker[]) {
        this.__markers.set(newValue);
    }
    private __polylines: SynchedPropertySimpleOneWayPU<MapPolyline[]>;
    get polylines() {
        return this.__polylines.get();
    }
    set polylines(newValue: MapPolyline[]) {
        this.__polylines.set(newValue);
    }
    private __myLocationEnabled: SynchedPropertySimpleOneWayPU<boolean>;
    get myLocationEnabled() {
        return this.__myLocationEnabled.get();
    }
    set myLocationEnabled(newValue: boolean) {
        this.__myLocationEnabled.set(newValue);
    }
    private __initialLat: SynchedPropertySimpleOneWayPU<number>;
    get initialLat() {
        return this.__initialLat.get();
    }
    set initialLat(newValue: number) {
        this.__initialLat.set(newValue);
    }
    private __initialLng: SynchedPropertySimpleOneWayPU<number>;
    get initialLng() {
        return this.__initialLng.get();
    }
    set initialLng(newValue: number) {
        this.__initialLng.set(newValue);
    }
    private __zoomLevel: SynchedPropertySimpleOneWayPU<number>;
    get zoomLevel() {
        return this.__zoomLevel.get();
    }
    set zoomLevel(newValue: number) {
        this.__zoomLevel.set(newValue);
    }
    private onControllerReady?: (ctrl: map.MapComponentController) => void;
    private onMarkerClick?: (markerId: string) => void;
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.width('100%');
            __Common__.height('100%');
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new HMSMap(this, {
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
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/MapComponent.ets", line: 80, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
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
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "HMSMap" });
        }
        __Common__.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
