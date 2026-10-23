if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RescuerCard_Params {
    rescuer?: RescuerInfo;
    onSelect?: () => void;
}
import { RescuerStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import type { RescuerInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
export class RescuerCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__rescuer = new SynchedPropertyObjectOneWayPU(params.rescuer, this, "rescuer");
        this.onSelect = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RescuerCard_Params) {
        if (params.onSelect !== undefined) {
            this.onSelect = params.onSelect;
        }
    }
    updateStateVars(params: RescuerCard_Params) {
        this.__rescuer.reset(params.rescuer);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__rescuer.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__rescuer.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __rescuer: SynchedPropertySimpleOneWayPU<RescuerInfo>;
    get rescuer() {
        return this.__rescuer.get();
    }
    set rescuer(newValue: RescuerInfo) {
        this.__rescuer.set(newValue);
    }
    private onSelect?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/RescuerCard.ets(9:5)", "entry");
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Color.White);
            Row.borderRadius(8);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/RescuerCard.ets(10:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.rescuer.name);
            Text.debugLine("entry/src/main/ets/components/RescuerCard.ets(11:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.rescuer.phone);
            Text.debugLine("entry/src/main/ets/components/RescuerCard.ets(14:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#666');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.rescuer.status);
            Text.debugLine("entry/src/main/ets/components/RescuerCard.ets(22:7)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.rescuer.status === RescuerStatus.IDLE ? '#52C41A' : '#FAAD14');
            Text.backgroundColor(this.rescuer.status === RescuerStatus.IDLE ? '#F6FFED' : '#FFFBE6');
            Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.onSelect && this.rescuer.status === RescuerStatus.IDLE) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('选择');
                        Button.debugLine("entry/src/main/ets/components/RescuerCard.ets(30:9)", "entry");
                        Button.margin({ left: 8 });
                        Button.fontSize(12);
                        Button.height(32);
                        Button.type(ButtonType.Capsule);
                        Button.onClick(() => {
                            if (this.onSelect) {
                                this.onSelect();
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
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
