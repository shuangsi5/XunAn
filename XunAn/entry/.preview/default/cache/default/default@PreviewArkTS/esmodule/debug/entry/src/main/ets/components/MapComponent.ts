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
        this.mapOptions = undefined;
        this.mapController = undefined;
        this.setInitiallyProvidedValue(params);
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/MapComponent.ets(29:5)", "entry");
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
                                this.markers.forEach(marker => {
                                    this.mapController?.addMarker(marker);
                                });
                                this.polylines.forEach(line => {
                                    this.mapController?.addPolyline(line);
                                });
                                if (this.myLocationEnabled) {
                                    this.mapController?.setMyLocationEnabled(true);
                                    this.mapController?.setMyLocationControlsEnabled(true);
                                }
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/MapComponent.ets", line: 30, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            mapOptions: this.mapOptions,
                            mapCallback: (err, controller) => {
                                if (!err && controller) {
                                    this.mapController = controller;
                                    this.markers.forEach(marker => {
                                        this.mapController?.addMarker(marker);
                                    });
                                    this.polylines.forEach(line => {
                                        this.mapController?.addPolyline(line);
                                    });
                                    if (this.myLocationEnabled) {
                                        this.mapController?.setMyLocationEnabled(true);
                                        this.mapController?.setMyLocationControlsEnabled(true);
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
