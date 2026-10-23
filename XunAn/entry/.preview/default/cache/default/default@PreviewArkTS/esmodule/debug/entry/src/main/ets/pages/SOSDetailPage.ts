if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DetailRow_Params {
    label?: string;
    value?: string;
}
interface SOSDetailPage_Params {
    sos?: SOSInfo | null;
}
import router from "@ohos:router";
import { getCategoryEmoji } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { getSOSList } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
class SOSDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__sos = new ObservedPropertyObjectPU(null, this, "sos");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SOSDetailPage_Params) {
        if (params.sos !== undefined) {
            this.sos = params.sos;
        }
    }
    updateStateVars(params: SOSDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sos.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sos.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __sos: ObservedPropertyObjectPU<SOSInfo | null>;
    get sos() {
        return this.__sos.get();
    }
    set sos(newValue: SOSInfo | null) {
        this.__sos.set(newValue);
    }
    aboutToAppear() {
        let params = router.getParams() as Record<string, string>;
        if (params && params['sosId']) {
            getSOSList().then((list) => {
                this.sos = list.find(item => item.id === params['sosId']) || null;
            });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(20:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(21:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('求救详情');
            Text.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(22:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(25:9)", "entry");
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sos) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(33:9)", "entry");
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(34:11)", "entry");
                        Column.width('90%');
                        Column.padding(16);
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(12);
                        Column.margin({ top: 16 });
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '编号', value: this.sos.id }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 35, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '编号',
                                        value: this.sos.id
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '紧急类型', value: `${getCategoryEmoji(this.sos.category)} ${this.sos.category}` }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 36, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '紧急类型',
                                        value: `${getCategoryEmoji(this.sos.category)} ${this.sos.category}`
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '姓名', value: this.sos.name }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 37, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '姓名',
                                        value: this.sos.name
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '电话', value: this.sos.phone }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 38, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '电话',
                                        value: this.sos.phone
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '地址', value: this.sos.address }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 39, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '地址',
                                        value: this.sos.address
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '描述', value: this.sos.description }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 40, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '描述',
                                        value: this.sos.description
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.sos.notes) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new DetailRow(this, { label: '补充说明', value: this.sos.notes }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 42, col: 15 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    label: '补充说明',
                                                    value: this.sos.notes
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "DetailRow" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '紧急程度', value: this.sos.level }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 44, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '紧急程度',
                                        value: this.sos.level
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '状态', value: this.sos.status }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 45, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '状态',
                                        value: this.sos.status
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '时间', value: this.sos.time }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 46, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '时间',
                                        value: this.sos.time
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '指派救援人员', value: this.sos.assignedRescuerName || this.sos.assignedRescuerId || '未指派' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 47, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '指派救援人员',
                                        value: this.sos.assignedRescuerName || this.sos.assignedRescuerId || '未指派'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '纬度', value: (Number(this.sos.latitude) || 0).toFixed(4) }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 48, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '纬度',
                                        value: (Number(this.sos.latitude) || 0).toFixed(4)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '经度', value: (Number(this.sos.longitude) || 0).toFixed(4) }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 49, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '经度',
                                        value: (Number(this.sos.longitude) || 0).toFixed(4)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DetailRow" });
                    }
                    Column.pop();
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('未找到信息');
                        Text.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(59:9)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#999');
                        Text.margin({ top: 40 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SOSDetailPage";
    }
}
class DetailRow extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.label = '';
        this.value = '';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DetailRow_Params) {
        if (params.label !== undefined) {
            this.label = params.label;
        }
        if (params.value !== undefined) {
            this.value = params.value;
        }
    }
    updateStateVars(params: DetailRow_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private label: string;
    private value: string;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(77:5)", "entry");
            Row.width('100%');
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.label);
            Text.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(78:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.width(90);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.value);
            Text.debugLine("entry/src/main/ets/pages/SOSDetailPage.ets(82:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new SOSDetailPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/SOSDetailPage", pageFullPath: "entry/src/main/ets/pages/SOSDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
