if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RescuerCard_Params {
    rescuer?: RescuerInfo;
    onSelect?: () => void;
}
import { RescuerStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import type { RescuerInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import { AppColors } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
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
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor(AppColors.card);
            Row.borderRadius(12);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.rescuer.name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.rescuer.phone);
            Text.fontSize(12);
            Text.fontColor(AppColors.textSecondary);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.rescuer.status);
            Text.fontSize(11);
            Text.fontColor(this.rescuer.status === RescuerStatus.IDLE ? AppColors.success : AppColors.warning);
            Text.backgroundColor(this.rescuer.status === RescuerStatus.IDLE ? AppColors.successLight : AppColors.warningLight);
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
                        Button.margin({ left: 10 });
                        Button.fontSize(12);
                        Button.height(32);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.primary);
                        Button.borderRadius(16);
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
