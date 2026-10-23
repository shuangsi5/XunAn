if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    phone?: string;
    password?: string;
    errorMsg?: string;
    isLoading?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import { loginUser, setLoggedInPhone, setCurrentRole } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import type { LoginResult } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phone.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __phone: ObservedPropertySimplePU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    async handleLogin(): Promise<void> {
        this.errorMsg = '';
        if (!this.phone.trim()) {
            this.errorMsg = '请输入手机号';
            return;
        }
        if (!this.password.trim()) {
            this.errorMsg = '请输入密码';
            return;
        }
        this.isLoading = true;
        let result: LoginResult = await loginUser(this.phone.trim(), this.password.trim());
        this.isLoading = false;
        if (result.user) {
            setLoggedInPhone(result.user.phone);
            promptAction.showToast({ message: '登录成功', duration: 2000 });
            router.replaceUrl({ url: 'pages/Index' });
        }
        else {
            this.errorMsg = result.error || '登录失败，请检查网络';
        }
    }
    handleQuickSOS(): void {
        setCurrentRole(Role.CITIZEN);
        router.replaceUrl({ url: 'pages/CitizenPage' });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(41:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 品牌标识
            Text.create('🌊');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(43:7)", "entry");
            // 品牌标识
            Text.fontSize(56);
            // 品牌标识
            Text.margin({ top: 16 });
        }, Text);
        // 品牌标识
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('汛安');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(47:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#1890FF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('—— 智慧防汛应急救援系统 ——');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(52:7)", "entry");
            Text.fontSize(13);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入区域卡片
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/pages/LoginPage.ets(57:7)", "entry");
            // 输入区域卡片
            Column.width('80%');
            // 输入区域卡片
            Column.padding(20);
            // 输入区域卡片
            Column.backgroundColor(Color.White);
            // 输入区域卡片
            Column.borderRadius(16);
            // 输入区域卡片
            Column.shadow({ radius: 8, color: 'rgba(0,0,0,0.1)' });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入手机号', text: { value: this.phone, changeEvent: newValue => { this.phone = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/LoginPage.ets(58:9)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.type(InputType.Number);
            TextInput.maxLength(11);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/LoginPage.ets(64:9)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.type(InputType.Password);
            TextInput.maxLength(20);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(71:11)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#FF4D4F');
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
            Button.createWithLabel(this.isLoading ? '登录中...' : '登录');
            Button.debugLine("entry/src/main/ets/pages/LoginPage.ets(76:9)", "entry");
            Button.width('100%');
            Button.height(44);
            Button.fontSize(16);
            Button.backgroundColor(this.isLoading ? '#91CAFF' : '#1890FF');
            Button.borderRadius(8);
            Button.margin({ top: 4 });
            Button.enabled(!this.isLoading);
            Button.onClick(() => this.handleLogin());
        }, Button);
        Button.pop();
        // 输入区域卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快速求救按钮
            Button.createWithLabel('快速求救');
            Button.debugLine("entry/src/main/ets/pages/LoginPage.ets(93:7)", "entry");
            // 快速求救按钮
            Button.width('80%');
            // 快速求救按钮
            Button.height(44);
            // 快速求救按钮
            Button.fontSize(16);
            // 快速求救按钮
            Button.fontColor(Color.White);
            // 快速求救按钮
            Button.backgroundColor('#FF4D4F');
            // 快速求救按钮
            Button.borderRadius(8);
            // 快速求救按钮
            Button.onClick(() => this.handleQuickSOS());
        }, Button);
        // 快速求救按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册链接
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/LoginPage.ets(103:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('还没有账号？');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(104:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册账号');
            Text.debugLine("entry/src/main/ets/pages/LoginPage.ets(107:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#1890FF');
            Text.onClick(() => {
                router.pushUrl({ url: 'pages/RegisterPage' });
            });
        }, Text);
        Text.pop();
        // 注册链接
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/LoginPage", pageFullPath: "entry/src/main/ets/pages/LoginPage", integratedHsp: "false", moduleType: "followWithHap" });
