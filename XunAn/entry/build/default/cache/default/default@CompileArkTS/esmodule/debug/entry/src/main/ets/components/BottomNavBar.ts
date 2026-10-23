if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BottomNavBar_Params {
    activeTab?: number;
}
import router from "@ohos:router";
import { AppColors } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
export class BottomNavBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__activeTab = new SynchedPropertySimpleOneWayPU(params.activeTab, this, "activeTab");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BottomNavBar_Params) {
        if (params.activeTab === undefined) {
            this.__activeTab.set(0);
        }
    }
    updateStateVars(params: BottomNavBar_Params) {
        this.__activeTab.reset(params.activeTab);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__activeTab.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__activeTab.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 当前激活的标签：0 = 汛安(主页)，1 = 个人中心
    private __activeTab: SynchedPropertySimpleOneWayPU<number>;
    get activeTab() {
        return this.__activeTab.get();
    }
    set activeTab(newValue: number) {
        this.__activeTab.set(newValue);
    }
    goHome() {
        if (this.activeTab === 0) {
            return;
        }
        // 从个人中心返回身份主页
        router.back();
    }
    goProfile() {
        if (this.activeTab === 1) {
            return;
        }
        router.pushUrl({ url: 'pages/ProfilePage' });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.backgroundColor(AppColors.card);
            Row.border({ width: { top: 0.5 }, color: AppColors.divider });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 汛安（主页）
            Column.create({ space: 2 });
            // 汛安（主页）
            Column.layoutWeight(1);
            // 汛安（主页）
            Column.height('100%');
            // 汛安（主页）
            Column.justifyContent(FlexAlign.Center);
            // 汛安（主页）
            Column.onClick(() => this.goHome());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🌊');
            Text.fontSize(22);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('汛安');
            Text.fontSize(11);
            Text.fontWeight(this.activeTab === 0 ? FontWeight.Medium : FontWeight.Normal);
            Text.fontColor(this.activeTab === 0 ? AppColors.primary : AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 汛安（主页）
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 个人中心
            Column.create({ space: 2 });
            // 个人中心
            Column.layoutWeight(1);
            // 个人中心
            Column.height('100%');
            // 个人中心
            Column.justifyContent(FlexAlign.Center);
            // 个人中心
            Column.onClick(() => this.goProfile());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('👤');
            Text.fontSize(22);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人中心');
            Text.fontSize(11);
            Text.fontWeight(this.activeTab === 1 ? FontWeight.Medium : FontWeight.Normal);
            Text.fontColor(this.activeTab === 1 ? AppColors.primary : AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 个人中心
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
