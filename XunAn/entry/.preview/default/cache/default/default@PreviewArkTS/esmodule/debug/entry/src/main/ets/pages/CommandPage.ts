if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommandPage_Params {
    sosList?: SOSInfo[];
    rescuerList?: RescuerInfo[];
    showAssignDialog?: boolean;
    selectedSOS?: SOSInfo | null;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { SOSStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { RescuerStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import type { RescuerInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import { getSOSList, getRescuerList, assignTask } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { SOSCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/SOSCard";
import { RescuerCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/RescuerCard";
interface Stats {
    pending: number;
    rescuing: number;
    completed: number;
}
class CommandPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__sosList = new ObservedPropertyObjectPU([], this, "sosList");
        this.__rescuerList = new ObservedPropertyObjectPU([], this, "rescuerList");
        this.__showAssignDialog = new ObservedPropertySimplePU(false, this, "showAssignDialog");
        this.__selectedSOS = new ObservedPropertyObjectPU(null, this, "selectedSOS");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommandPage_Params) {
        if (params.sosList !== undefined) {
            this.sosList = params.sosList;
        }
        if (params.rescuerList !== undefined) {
            this.rescuerList = params.rescuerList;
        }
        if (params.showAssignDialog !== undefined) {
            this.showAssignDialog = params.showAssignDialog;
        }
        if (params.selectedSOS !== undefined) {
            this.selectedSOS = params.selectedSOS;
        }
    }
    updateStateVars(params: CommandPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sosList.purgeDependencyOnElmtId(rmElmtId);
        this.__rescuerList.purgeDependencyOnElmtId(rmElmtId);
        this.__showAssignDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedSOS.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sosList.aboutToBeDeleted();
        this.__rescuerList.aboutToBeDeleted();
        this.__showAssignDialog.aboutToBeDeleted();
        this.__selectedSOS.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __sosList: ObservedPropertyObjectPU<SOSInfo[]>;
    get sosList() {
        return this.__sosList.get();
    }
    set sosList(newValue: SOSInfo[]) {
        this.__sosList.set(newValue);
    }
    private __rescuerList: ObservedPropertyObjectPU<RescuerInfo[]>;
    get rescuerList() {
        return this.__rescuerList.get();
    }
    set rescuerList(newValue: RescuerInfo[]) {
        this.__rescuerList.set(newValue);
    }
    private __showAssignDialog: ObservedPropertySimplePU<boolean>;
    get showAssignDialog() {
        return this.__showAssignDialog.get();
    }
    set showAssignDialog(newValue: boolean) {
        this.__showAssignDialog.set(newValue);
    }
    private __selectedSOS: ObservedPropertyObjectPU<SOSInfo | null>;
    get selectedSOS() {
        return this.__selectedSOS.get();
    }
    set selectedSOS(newValue: SOSInfo | null) {
        this.__selectedSOS.set(newValue);
    }
    aboutToAppear() {
        this.refresh();
    }
    onPageShow() {
        this.refresh();
    }
    async refresh() {
        this.sosList = await getSOSList();
        this.rescuerList = await getRescuerList();
    }
    getStats(): Stats {
        let pending = this.sosList.filter(s => s.status === SOSStatus.PENDING).length;
        let rescuing = this.sosList.filter(s => s.status === SOSStatus.RESCUING).length;
        let completed = this.sosList.filter(s => s.status === SOSStatus.COMPLETED).length;
        return { pending, rescuing, completed };
    }
    openAssign(sos: SOSInfo) {
        this.selectedSOS = sos;
        this.showAssignDialog = true;
    }
    doAssign(rescuer: RescuerInfo) {
        if (this.selectedSOS) {
            assignTask(this.selectedSOS.id, rescuer.id).then((success: boolean) => {
                if (success) {
                    this.showAssignDialog = false;
                    this.selectedSOS = null;
                    this.refresh();
                    promptAction.showToast({ message: '指派成功', duration: 2000 });
                }
                else {
                    promptAction.showToast({ message: '指派失败，请重试', duration: 2000 });
                }
            }).catch((err: Error) => {
                console.error('指派任务失败', err);
                promptAction.showToast({ message: '指派失败，请重试', duration: 2000 });
            });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/CommandPage.ets(66:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CommandPage.ets(67:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CommandPage.ets(68:9)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('应急指挥部');
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(69:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/CommandPage.ets(72:11)", "entry");
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.debugLine("entry/src/main/ets/pages/CommandPage.ets(79:9)", "entry");
            Row.width('90%');
            Row.margin({ top: 8, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CommandPage.ets(80:11)", "entry");
            Column.layoutWeight(1);
            Column.padding(12);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getStats().pending}`);
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(81:13)", "entry");
            Text.fontSize(28);
            Text.fontColor('#FF4D4F');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('待救援');
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(85:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CommandPage.ets(94:11)", "entry");
            Column.layoutWeight(1);
            Column.padding(12);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getStats().rescuing}`);
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(95:13)", "entry");
            Text.fontSize(28);
            Text.fontColor('#FAAD14');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('救援中');
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(99:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CommandPage.ets(108:11)", "entry");
            Column.layoutWeight(1);
            Column.padding(12);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getStats().completed}`);
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(109:13)", "entry");
            Text.fontSize(28);
            Text.fontColor('#52C41A');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已完成');
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(113:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('查看全局地图');
            Button.debugLine("entry/src/main/ets/pages/CommandPage.ets(125:9)", "entry");
            Button.width('90%');
            Button.margin({ bottom: 16 });
            Button.type(ButtonType.Capsule);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/MapPage' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('求救信息列表');
            Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(133:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.width('90%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 12 });
            List.debugLine("entry/src/main/ets/pages/CommandPage.ets(139:9)", "entry");
            List.width('90%');
            List.layoutWeight(1);
            List.padding({ bottom: 16 });
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
                        ListItem.debugLine("entry/src/main/ets/pages/CommandPage.ets(141:13)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new SOSCard(this, {
                                        sos: item,
                                        onAssign: item.status === SOSStatus.PENDING ? ((): void => this.openAssign(item)) : undefined,
                                        onDetail: (): void => {
                                            router.pushUrl({
                                                url: 'pages/SOSDetailPage',
                                                params: { sosId: item.id }
                                            });
                                        }
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommandPage.ets", line: 142, col: 15 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            sos: item,
                                            onAssign: item.status === SOSStatus.PENDING ? ((): void => this.openAssign(item)) : undefined,
                                            onDetail: (): void => {
                                                router.pushUrl({
                                                    url: 'pages/SOSDetailPage',
                                                    params: { sosId: item.id }
                                                });
                                            }
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
            this.forEachUpdateFunction(elmtId, this.sosList, forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showAssignDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CommandPage.ets(164:9)", "entry");
                        Column.width('85%');
                        Column.height('60%');
                        Column.padding(24);
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(16);
                        Column.shadow({ radius: 16, color: 'rgba(0,0,0,0.2)' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择救援人员');
                        Text.debugLine("entry/src/main/ets/pages/CommandPage.ets(165:11)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 8 });
                        List.debugLine("entry/src/main/ets/pages/CommandPage.ets(170:11)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
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
                                    ListItem.debugLine("entry/src/main/ets/pages/CommandPage.ets(174:17)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new RescuerCard(this, {
                                                    rescuer: item,
                                                    onSelect: (): void => this.doAssign(item)
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommandPage.ets", line: 175, col: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        rescuer: item,
                                                        onSelect: (): void => this.doAssign(item)
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    rescuer: item
                                                });
                                            }
                                        }, { name: "RescuerCard" });
                                    }
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.rescuerList.filter(r => r.status === RescuerStatus.IDLE), forEachItemGenFunction, (item: RescuerInfo) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/CommandPage.ets(187:11)", "entry");
                        Button.width('100%');
                        Button.margin({ top: 16 });
                        Button.onClick(() => this.showAssignDialog = false);
                    }, Button);
                    Button.pop();
                    Column.pop();
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
        return "CommandPage";
    }
}
registerNamedRoute(() => new CommandPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/CommandPage", pageFullPath: "entry/src/main/ets/pages/CommandPage", integratedHsp: "false", moduleType: "followWithHap" });
