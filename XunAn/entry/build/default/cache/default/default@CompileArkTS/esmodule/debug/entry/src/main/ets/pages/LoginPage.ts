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
import { AppColors } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
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
    // 根据角色列表决定默认跳转页面
    getDefaultPage(roles: Role[]): string {
        if (roles.includes(Role.CITIZEN)) {
            return 'pages/CitizenPage';
        }
        else if (roles.includes(Role.RESCUER)) {
            return 'pages/RescuerPage';
        }
        else if (roles.includes(Role.COMMAND)) {
            return 'pages/CommandPage';
        }
        return 'pages/CitizenPage';
    }
    // 根据角色列表决定默认当前角色
    getDefaultRole(roles: Role[]): Role {
        if (roles.includes(Role.CITIZEN)) {
            return Role.CITIZEN;
        }
        else if (roles.includes(Role.RESCUER)) {
            return Role.RESCUER;
        }
        else if (roles.includes(Role.COMMAND)) {
            return Role.COMMAND;
        }
        return Role.CITIZEN;
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
            let defaultRole = this.getDefaultRole(result.user.roles);
            let defaultPage = this.getDefaultPage(result.user.roles);
            setCurrentRole(defaultRole);
            AppStorage.setOrCreate('autoEnteredPage', true);
            promptAction.showToast({ message: '登录成功', duration: 2000 });
            router.replaceUrl({ url: defaultPage });
        }
        else {
            this.errorMsg = result.error || '登录失败，请检查网络';
        }
    }
    handleQuickSOS(): void {
        setCurrentRole(Role.CITIZEN);
        router.replaceUrl({ url: 'pages/CitizenPage' });
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
            Column.create({ space: 16 });
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.bg);
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 品牌标识
            Text.create('🌊');
            // 品牌标识
            Text.fontSize(56);
            // 品牌标识
            Text.margin({ top: 16 });
        }, Text);
        // 品牌标识
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('汛安');
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.primary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智慧防汛应急救援系统');
            Text.fontSize(13);
            Text.fontColor(AppColors.textSecondary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入区域卡片
            Column.create({ space: 12 });
            // 输入区域卡片
            Column.width('86%');
            // 输入区域卡片
            Column.padding(20);
            // 输入区域卡片
            Column.backgroundColor(AppColors.card);
            // 输入区域卡片
            Column.borderRadius(20);
            // 输入区域卡片
            Column.shadow({ radius: 12, color: 'rgba(0,0,0,0.06)' });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入手机号', text: { value: this.phone, changeEvent: newValue => { this.phone = newValue; } } });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(15);
            TextInput.type(InputType.Number);
            TextInput.maxLength(11);
            TextInput.backgroundColor(AppColors.bgSecondary);
            TextInput.borderRadius(12);
            TextInput.padding({ left: 14, right: 14 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(15);
            TextInput.type(InputType.Password);
            TextInput.maxLength(20);
            TextInput.backgroundColor(AppColors.bgSecondary);
            TextInput.borderRadius(12);
            TextInput.padding({ left: 14, right: 14 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.fontSize(13);
                        Text.fontColor(AppColors.danger);
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
            Button.width('100%');
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor(Color.White);
            Button.backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary);
            Button.borderRadius(24);
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
            // 快速求救按钮
            Button.width('86%');
            // 快速求救按钮
            Button.height(48);
            // 快速求救按钮
            Button.fontSize(16);
            // 快速求救按钮
            Button.fontWeight(FontWeight.Medium);
            // 快速求救按钮
            Button.fontColor(Color.White);
            // 快速求救按钮
            Button.backgroundColor(AppColors.danger);
            // 快速求救按钮
            Button.borderRadius(24);
            // 快速求救按钮
            Button.onClick(() => this.handleQuickSOS());
        }, Button);
        // 快速求救按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册链接
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('还没有账号？');
            Text.fontSize(13);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册账号');
            Text.fontSize(13);
            Text.fontColor(AppColors.primary);
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
