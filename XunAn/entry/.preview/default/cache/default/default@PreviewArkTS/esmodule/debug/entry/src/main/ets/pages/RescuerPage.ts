if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RescuerPage_Params {
    currentIndex?: number;
    taskHallList?: SOSInfo[];
    myTasks?: SOSInfo[];
    rescuer?: RescuerInfo | null;
}
import router from "@ohos:router";
import { SOSStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { RescuerInfo } from '../model/RescuerInfo';
import { getSOSList, getRescuerList, completeTask, getLoggedInPhone } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { SOSCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/SOSCard";
class RescuerPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__taskHallList = new ObservedPropertyObjectPU([], this, "taskHallList");
        this.__myTasks = new ObservedPropertyObjectPU([], this, "myTasks");
        this.__rescuer = new ObservedPropertyObjectPU(null, this, "rescuer");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RescuerPage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.taskHallList !== undefined) {
            this.taskHallList = params.taskHallList;
        }
        if (params.myTasks !== undefined) {
            this.myTasks = params.myTasks;
        }
        if (params.rescuer !== undefined) {
            this.rescuer = params.rescuer;
        }
    }
    updateStateVars(params: RescuerPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__taskHallList.purgeDependencyOnElmtId(rmElmtId);
        this.__myTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__rescuer.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__taskHallList.aboutToBeDeleted();
        this.__myTasks.aboutToBeDeleted();
        this.__rescuer.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __taskHallList: ObservedPropertyObjectPU<SOSInfo[]>;
    get taskHallList() {
        return this.__taskHallList.get();
    }
    set taskHallList(newValue: SOSInfo[]) {
        this.__taskHallList.set(newValue);
    }
    private __myTasks: ObservedPropertyObjectPU<SOSInfo[]>;
    get myTasks() {
        return this.__myTasks.get();
    }
    set myTasks(newValue: SOSInfo[]) {
        this.__myTasks.set(newValue);
    }
    private __rescuer: ObservedPropertyObjectPU<RescuerInfo | null>;
    get rescuer() {
        return this.__rescuer.get();
    }
    set rescuer(newValue: RescuerInfo | null) {
        this.__rescuer.set(newValue);
    }
    aboutToAppear() {
        let phone = getLoggedInPhone();
        getRescuerList().then((list) => {
            this.rescuer = list.find(r => String(r.phone) === phone) || null;
            this.refresh();
        }).catch((err: Error) => {
            console.error('获取救援人员列表失败', err);
            this.refresh();
        });
    }
    async refresh() {
        let allSos = await getSOSList();
        let rescuerId = this.rescuer ? String(this.rescuer.id) : '';
        this.taskHallList = allSos.filter(s => s.status === SOSStatus.PENDING || String(s.assignedRescuerId) === rescuerId);
        if (this.rescuer) {
            this.myTasks = allSos.filter(s => String(s.assignedRescuerId) === rescuerId && s.status !== SOSStatus.COMPLETED);
        }
    }
    navigateToMap(sos: SOSInfo) {
        router.pushUrl({
            url: 'pages/MapPage',
            params: {
                targetLat: sos.latitude,
                targetLng: sos.longitude,
                title: sos.name,
                sosId: sos.id
            }
        });
    }
    async complete(sos: SOSInfo) {
        await completeTask(sos.id);
        this.refresh();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RescuerPage.ets(57:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/RescuerPage.ets(58:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('救援端');
            Text.debugLine("entry/src/main/ets/pages/RescuerPage.ets(59:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/RescuerPage.ets(62:9)", "entry");
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ barPosition: BarPosition.End });
            Tabs.debugLine("entry/src/main/ets/pages/RescuerPage.ets(69:7)", "entry");
            Tabs.width('100%');
            Tabs.layoutWeight(1);
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    List.create({ space: 12 });
                    List.debugLine("entry/src/main/ets/pages/RescuerPage.ets(71:11)", "entry");
                    List.width('100%');
                    List.alignListItem(ListItemAlign.Center);
                    List.layoutWeight(1);
                    List.padding({ left: 12, right: 12, bottom: 16 });
                }, List);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const item = _item;
                        {
                            const itemCreation = (elmtId, isInitialRender) => {
                                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                ListItem.create(deepRenderFunction, true);
                                if (!isInitialRender) {
                                    ListItem.pop();
                                }
                                ViewStackProcessor.StopGetAccessRecording();
                            };
                            const itemCreation2 = (elmtId, isInitialRender) => {
                                ListItem.create(deepRenderFunction, true);
                                ListItem.width('100%');
                                ListItem.debugLine("entry/src/main/ets/pages/RescuerPage.ets(75:17)", "entry");
                            };
                            const deepRenderFunction = (elmtId, isInitialRender) => {
                                itemCreation(elmtId, isInitialRender);
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new SOSCard(this, {
                                                sos: item,
                                                onDetail: (): void => this.navigateToMap(item)
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RescuerPage.ets", line: 76, col: 19 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    sos: item,
                                                    onDetail: (): void => this.navigateToMap(item)
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                sos: item
                                            });
                                        }
                                    }, { name: "SOSCard" });
                                }
                                ListItem.pop();
                            };
                            this.observeComponentCreation2(itemCreation2, ListItem);
                            ListItem.pop();
                        }
                    };
                    this.forEachUpdateFunction(elmtId, this.taskHallList, forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
                }, ForEach);
                ForEach.pop();
                List.pop();
            });
            TabContent.tabBar('任务大厅');
            TabContent.debugLine("entry/src/main/ets/pages/RescuerPage.ets(70:9)", "entry");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.myTasks.length === 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('暂无任务');
                                Text.debugLine("entry/src/main/ets/pages/RescuerPage.ets(95:13)", "entry");
                                Text.fontSize(16);
                                Text.fontColor('#999');
                                Text.margin({ top: 40 });
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create({ space: 12 });
                                List.debugLine("entry/src/main/ets/pages/RescuerPage.ets(100:13)", "entry");
                                List.width('100%');
                                List.alignListItem(ListItemAlign.Center);
                                List.layoutWeight(1);
                                List.padding({ left: 12, right: 12, bottom: 16 });
                            }, List);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const item = _item;
                                    {
                                        const itemCreation = (elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            ListItem.create(deepRenderFunction, true);
                                            if (!isInitialRender) {
                                                ListItem.pop();
                                            }
                                            ViewStackProcessor.StopGetAccessRecording();
                                        };
                                        const itemCreation2 = (elmtId, isInitialRender) => {
                                            ListItem.create(deepRenderFunction, true);
                                            ListItem.width('100%');
                                            ListItem.debugLine("entry/src/main/ets/pages/RescuerPage.ets(102:17)", "entry");
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Column.create();
                                                Column.debugLine("entry/src/main/ets/pages/RescuerPage.ets(103:19)", "entry");
                                                Column.width('100%');
                                            }, Column);
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SOSCard(this, {
                                                            sos: item,
                                                            onDetail: (): void => this.navigateToMap(item)
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RescuerPage.ets", line: 104, col: 21 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                sos: item,
                                                                onDetail: (): void => this.navigateToMap(item)
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            sos: item
                                                        });
                                                    }
                                                }, { name: "SOSCard" });
                                            }
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Button.createWithLabel('完成任务');
                                                Button.debugLine("entry/src/main/ets/pages/RescuerPage.ets(108:21)", "entry");
                                                Button.width('100%');
                                                Button.margin({ top: 8 });
                                                Button.type(ButtonType.Capsule);
                                                Button.backgroundColor('#52C41A');
                                                Button.onClick(() => this.complete(item));
                                            }, Button);
                                            Button.pop();
                                            Column.pop();
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, this.myTasks, forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
                            }, ForEach);
                            ForEach.pop();
                            List.pop();
                        });
                    }
                }, If);
                If.pop();
            });
            TabContent.tabBar('我的任务');
            TabContent.debugLine("entry/src/main/ets/pages/RescuerPage.ets(93:9)", "entry");
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "RescuerPage";
    }
}
registerNamedRoute(() => new RescuerPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/RescuerPage", pageFullPath: "entry/src/main/ets/pages/RescuerPage", integratedHsp: "false", moduleType: "followWithHap" });
