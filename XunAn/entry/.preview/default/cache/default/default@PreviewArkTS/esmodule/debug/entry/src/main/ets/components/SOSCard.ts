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
    getLevelColor(): ResourceColor {
        switch (this.sos.level) {
            case EmergencyLevel.HIGH:
                return '#FF4D4F';
            case EmergencyLevel.MEDIUM:
                return '#FAAD14';
            default:
                return '#52C41A';
        }
    }
    getStatusColor(): ResourceColor {
        switch (this.sos.status) {
            case SOSStatus.PENDING:
                return '#FF4D4F';
            case SOSStatus.RESCUING:
                return '#FAAD14';
            default:
                return '#52C41A';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/SOSCard.ets(32:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(12);
            Column.shadow({ radius: 8, color: 'rgba(0,0,0,0.06)' });
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/SOSCard.ets(33:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/components/SOSCard.ets(34:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(getCategoryEmoji(this.sos.category));
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(35:11)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.name);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(37:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 4 });
            Row.debugLine("entry/src/main/ets/components/SOSCard.ets(42:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.category);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(43:11)", "entry");
            Text.fontSize(11);
            Text.fontColor('#722ED1');
            Text.backgroundColor('#F9F0FF');
            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.level);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(49:11)", "entry");
            Text.fontSize(11);
            Text.fontColor(Color.White);
            Text.backgroundColor(this.getLevelColor());
            Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.sos.address}`);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(60:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.sos.description}`);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(64:7)", "entry");
            Text.fontSize(14);
            Text.margin({ top: 4 });
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sos.notes) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📝 ${this.sos.notes}`);
                        Text.debugLine("entry/src/main/ets/components/SOSCard.ets(71:9)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                        Text.margin({ top: 4 });
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/SOSCard.ets(79:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`状态: ${this.sos.status}`);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(80:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.getStatusColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.sos.time);
            Text.debugLine("entry/src/main/ets/components/SOSCard.ets(83:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.onAssign && this.sos.status === SOSStatus.PENDING) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('指派救援');
                        Button.debugLine("entry/src/main/ets/components/SOSCard.ets(92:9)", "entry");
                        Button.width('100%');
                        Button.margin({ top: 8 });
                        Button.type(ButtonType.Capsule);
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
                        Button.debugLine("entry/src/main/ets/components/SOSCard.ets(103:9)", "entry");
                        Button.width('100%');
                        Button.margin({ top: 8 });
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor('#1890FF');
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
