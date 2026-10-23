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
import { AppColors, getStatusColor, getStatusBg } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
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
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.bg);
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
            Row.padding({ left: 8, right: 8, top: 12, bottom: 12 });
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
            Text.create('求救详情');
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
            Row.create();
            Row.width(40);
            Row.height(40);
        }, Row);
        Row.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sos) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Off);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 0 });
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 状态摘要卡
                        Column.create({ space: 8 });
                        // 状态摘要卡
                        Column.width('90%');
                        // 状态摘要卡
                        Column.padding(20);
                        // 状态摘要卡
                        Column.backgroundColor(AppColors.card);
                        // 状态摘要卡
                        Column.borderRadius(16);
                        // 状态摘要卡
                        Column.margin({ top: 8 });
                        // 状态摘要卡
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${getCategoryEmoji(this.sos.category)} ${this.sos.name}`);
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.textPrimary);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.sos.status);
                        Text.fontSize(13);
                        Text.fontColor(getStatusColor(this.sos.status));
                        Text.backgroundColor(getStatusBg(this.sos.status));
                        Text.padding({ left: 10, right: 10, top: 3, bottom: 3 });
                        Text.borderRadius(6);
                    }, Text);
                    Text.pop();
                    // 状态摘要卡
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 详情列表
                        Column.create({ space: 0 });
                        // 详情列表
                        Column.width('90%');
                        // 详情列表
                        Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                        // 详情列表
                        Column.backgroundColor(AppColors.card);
                        // 详情列表
                        Column.borderRadius(16);
                        // 详情列表
                        Column.margin({ top: 12, bottom: 24 });
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DetailRow(this, { label: '编号', value: this.sos.id }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 85, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '紧急类型', value: `${getCategoryEmoji(this.sos.category)} ${this.sos.category}` }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 86, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '姓名', value: this.sos.name }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 87, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '电话', value: this.sos.phone }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 88, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '血型', value: this.sos.bloodType || '未知' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 89, col: 15 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        label: '血型',
                                        value: this.sos.bloodType || '未知'
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
                                let componentCall = new DetailRow(this, { label: '地址', value: this.sos.address }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 90, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '描述', value: this.sos.description }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 91, col: 15 });
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
                                            let componentCall = new DetailRow(this, { label: '补充说明', value: this.sos.notes }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 93, col: 17 });
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.sos.imageUrl) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 8 });
                                    Column.width('100%');
                                    Column.padding({ top: 12, bottom: 12 });
                                    Column.border({ width: { bottom: 0.5 }, color: AppColors.divider });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('现场照片');
                                    Text.fontSize(14);
                                    Text.fontColor(AppColors.textSecondary);
                                    Text.width('100%');
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.sos.imageUrl);
                                    Image.width('100%');
                                    Image.height(200);
                                    Image.objectFit(ImageFit.Cover);
                                    Image.borderRadius(12);
                                }, Image);
                                Column.pop();
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
                                let componentCall = new DetailRow(this, { label: '紧急程度', value: this.sos.level }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 108, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '状态', value: this.sos.status }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 109, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '时间', value: this.sos.time }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 110, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '指派救援人员', value: this.sos.assignedRescuerName || this.sos.assignedRescuerId || '未指派' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 111, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '纬度', value: (Number(this.sos.latitude) || 0).toFixed(4) }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 112, col: 15 });
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
                                let componentCall = new DetailRow(this, { label: '经度', value: (Number(this.sos.longitude) || 0).toFixed(4) }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SOSDetailPage.ets", line: 113, col: 15 });
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
                    // 详情列表
                    Column.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('未找到信息');
                        Text.fontSize(16);
                        Text.fontColor(AppColors.textTertiary);
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
            Row.width('100%');
            Row.padding({ top: 12, bottom: 12 });
            Row.border({ width: { bottom: 0.5 }, color: AppColors.divider });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.label);
            Text.fontSize(14);
            Text.fontColor(AppColors.textSecondary);
            Text.width(96);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.value);
            Text.fontSize(14);
            Text.fontColor(AppColors.textPrimary);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.End);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new SOSDetailPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/SOSDetailPage", pageFullPath: "entry/src/main/ets/pages/SOSDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
