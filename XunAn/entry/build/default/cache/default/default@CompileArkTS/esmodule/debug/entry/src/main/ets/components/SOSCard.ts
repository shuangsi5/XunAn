if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SOSCard_Params {
    sos?: SOSInfo;
    onAssign?: () => void;
    onDetail?: () => void;
}
import { EmergencyLevel, SOSStatus, getCategoryEmoji } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { AppColors, getStatusColor, getStatusBg } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
export class SOSCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__sos = new SynchedPropertyObjectOneWayPU(params.sos, this, "sos");
        this.onAssign = undefined;
        this.onDetail = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SOSCard_Params) {
        if (params.onAssign !== undefined) {
            this.onAssign = params.onAssign;
        }
        if (params.onDetail !== undefined) {
            this.onDetail = params.onDetail;
        }
    }
    updateStateVars(params: SOSCard_Params) {
        this.__sos.reset(params.sos);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sos.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sos.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __sos: SynchedPropertySimpleOneWayPU<SOSInfo>;
    get sos() {
        return this.__sos.get();
    }
    set sos(newValue: SOSInfo) {
        this.__sos.set(newValue);
    }
    private onAssign?: () => void;
    private onDetail?: () => void;
    getLevelColor(): string {
        switch (this.sos.level) {
            case EmergencyLevel.HIGH:
                return AppColors.danger;
            case EmergencyLevel.MEDIUM:
                return AppColors.warning;
            default:
                return AppColors.success;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(AppColors.card);
            Column.borderRadius(16);
            Column.shadow({ radius: 8, color: 'rgba(0,0,0,0.04)' });
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部：左侧姓名，右侧类型/级别/血型标签
            Row.create();
            // 顶部：左侧姓名，右侧类型/级别/血型标签
            Row.width('100%');
            // 顶部：左侧姓名，右侧类型/级别/血型标签
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧：图标 + 姓名
            Row.create({ space: 8 });
            // 左侧：图标 + 姓名
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getCategoryEmoji(this.sos.category));
            Text.fontSize(20);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        // 左侧：图标 + 姓名
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧：类型 + 级别 + 血型
            Row.create({ space: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.category);
            Text.fontSize(10);
            Text.fontColor(AppColors.textTertiary);
            Text.backgroundColor(AppColors.bgSecondary);
            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.level);
            Text.fontSize(10);
            Text.fontColor(Color.White);
            Text.backgroundColor(this.getLevelColor());
            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 【血型标签】放在“紧急”右侧
            if (this.sos.bloodType) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.sos.bloodType);
                        Text.fontSize(10);
                        Text.fontColor(this.sos.bloodType === '未知' ? AppColors.textTertiary : Color.White);
                        Text.backgroundColor(this.sos.bloodType === '未知' ? AppColors.bgSecondary : '#E53935');
                        Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                        Text.borderRadius(4);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 右侧：类型 + 级别 + 血型
        Row.pop();
        // 顶部：左侧姓名，右侧类型/级别/血型标签
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 地址
            Row.create({ space: 4 });
            // 地址
            Row.width('100%');
            // 地址
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📍');
            Text.fontSize(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.address);
            Text.fontSize(13);
            Text.fontColor(AppColors.textSecondary);
            Text.layoutWeight(1);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        // 地址
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 描述
            Text.create(this.sos.description);
            // 描述
            Text.fontSize(14);
            // 描述
            Text.fontColor(AppColors.textPrimary);
            // 描述
            Text.margin({ top: 6 });
            // 描述
            Text.maxLines(2);
            // 描述
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        // 描述
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 补充说明
            if (this.sos.notes) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📝 ${this.sos.notes}`);
                        Text.fontSize(12);
                        Text.fontColor(AppColors.textTertiary);
                        Text.margin({ top: 6 });
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                });
            }
            // 底部：状态标签 + 时间
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部：状态标签 + 时间
            Row.create();
            // 底部：状态标签 + 时间
            Row.width('100%');
            // 底部：状态标签 + 时间
            Row.margin({ top: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.status);
            Text.fontSize(11);
            Text.fontColor(getStatusColor(this.sos.status));
            Text.backgroundColor(getStatusBg(this.sos.status));
            Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.time);
            Text.fontSize(11);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 底部：状态标签 + 时间
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 操作按钮
            if (this.onAssign && this.sos.status === SOSStatus.PENDING) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('指派救援');
                        Button.width('100%');
                        Button.height(36);
                        Button.fontSize(14);
                        Button.fontWeight(FontWeight.Medium);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.primary);
                        Button.borderRadius(18);
                        Button.margin({ top: 12 });
                        Button.onClick(() => {
                            if (this.onAssign) {
                                this.onAssign();
                            }
                        });
                    }, Button);
                    Button.pop();
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
            if (this.onDetail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('查看详情');
                        Button.width('100%');
                        Button.height(36);
                        Button.fontSize(14);
                        Button.fontWeight(FontWeight.Medium);
                        Button.fontColor(AppColors.primary);
                        Button.backgroundColor(AppColors.primaryLight);
                        Button.borderRadius(18);
                        Button.margin({ top: this.onAssign && this.sos.status === SOSStatus.PENDING ? 8 : 12 });
                        Button.onClick(() => {
                            if (this.onDetail) {
                                this.onDetail();
                            }
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
