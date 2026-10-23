if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentUser?: User | null;
    displayRoles?: Role[];
    isAutoNavigated?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import type { User } from '../model/User';
import { getLoggedInPhone, getUserByPhone, clearLoggedIn, setCurrentRole } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { AppColors, getRoleLabel, getRoleEmoji, getRoleBgColor, getRolePage } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
function getRoleSubtitle(role: Role): string {
    if (role === Role.CITIZEN) {
        return '发布求救信息';
    }
    else if (role === Role.RESCUER) {
        return '接收任务并前往救援';
    }
    return '调度指挥与监控';
}
function getDefaultRole(roles: Role[]): Role {
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
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__displayRoles = new ObservedPropertyObjectPU([], this, "displayRoles");
        this.__isAutoNavigated = new ObservedPropertySimplePU(false, this, "isAutoNavigated");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.displayRoles !== undefined) {
            this.displayRoles = params.displayRoles;
        }
        if (params.isAutoNavigated !== undefined) {
            this.isAutoNavigated = params.isAutoNavigated;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__displayRoles.purgeDependencyOnElmtId(rmElmtId);
        this.__isAutoNavigated.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__displayRoles.aboutToBeDeleted();
        this.__isAutoNavigated.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentUser: ObservedPropertyObjectPU<User | null>;
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: User | null) {
        this.__currentUser.set(newValue);
    }
    private __displayRoles: ObservedPropertyObjectPU<Role[]>;
    get displayRoles() {
        return this.__displayRoles.get();
    }
    set displayRoles(newValue: Role[]) {
        this.__displayRoles.set(newValue);
    }
    private __isAutoNavigated: ObservedPropertySimplePU<boolean>;
    get isAutoNavigated() {
        return this.__isAutoNavigated.get();
    }
    set isAutoNavigated(newValue: boolean) {
        this.__isAutoNavigated.set(newValue);
    }
    aboutToAppear(): void {
        this.loadUser();
    }
    async loadUser(): Promise<void> {
        try {
            const phone = getLoggedInPhone();
            if (!phone) {
                return;
            }
            const user = await getUserByPhone(phone);
            if (user) {
                this.currentUser = user;
                // 强制按正确顺序显示：群众 → 救援人员 → 指挥部
                const roleOrder: Role[] = [Role.CITIZEN, Role.RESCUER, Role.COMMAND];
                this.displayRoles = roleOrder.filter((role: Role) => user.roles.includes(role));
                // 已登录用户自动跳转到默认身份页面（只执行一次）
                if (!this.isAutoNavigated && this.displayRoles.length > 0) {
                    this.isAutoNavigated = true;
                    let defaultRole = getDefaultRole(this.displayRoles);
                    setCurrentRole(defaultRole);
                    router.replaceUrl({ url: getRolePage(defaultRole) });
                }
            }
        }
        catch (err) {
            console.error('加载用户信息失败', JSON.stringify(err));
            promptAction.showToast({ message: '加载用户信息失败，请重新登录' });
        }
    }
    logout(): void {
        clearLoggedIn();
        this.currentUser = null;
        this.displayRoles = [];
        router.replaceUrl({ url: 'pages/LoginPage' });
    }
    selectRole(role: Role): void {
        try {
            setCurrentRole(role);
            router.pushUrl({ url: getRolePage(role) });
        }
        catch (err) {
            console.error('跳转失败', JSON.stringify(err));
            promptAction.showToast({ message: '页面跳转失败，请重试' });
        }
    }
    goToProfile(): void {
        try {
            router.pushUrl({ url: 'pages/ProfilePage' });
        }
        catch (err) {
            console.error('跳转个人中心失败', JSON.stringify(err));
            promptAction.showToast({ message: '页面跳转失败' });
        }
    }
    goToLogin(): void {
        try {
            router.pushUrl({ url: 'pages/LoginPage' });
        }
        catch (err) {
            console.error('跳转登录页失败', JSON.stringify(err));
        }
    }
    goToQuickSOS(): void {
        try {
            setCurrentRole(Role.CITIZEN);
            router.pushUrl({ url: 'pages/CitizenPage' });
        }
        catch (err) {
            console.error('快速求救跳转失败', JSON.stringify(err));
            promptAction.showToast({ message: '跳转失败，请重试' });
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
            If.create();
            if (this.currentUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ===== 已登录状态（自动跳转后通常不会停留在此）=====
                        Column.create({ space: 8 });
                        // ===== 已登录状态（自动跳转后通常不会停留在此）=====
                        Column.width('100%');
                        // ===== 已登录状态（自动跳转后通常不会停留在此）=====
                        Column.height('100%');
                        // ===== 已登录状态（自动跳转后通常不会停留在此）=====
                        Column.backgroundColor(AppColors.bg);
                        // ===== 已登录状态（自动跳转后通常不会停留在此）=====
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户信息栏
                        Row.create();
                        // 用户信息栏
                        Row.width('85%');
                        // 用户信息栏
                        Row.padding({ top: 16, bottom: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 2 });
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`欢迎，${this.currentUser!.name}`);
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.textPrimary);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentUser!.unit) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`所属：${this.currentUser!.unit}`);
                                    Text.fontSize(12);
                                    Text.fontColor(AppColors.textTertiary);
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
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('👤 个人中心');
                        Button.fontSize(13);
                        Button.height(32);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.primary);
                        Button.borderRadius(16);
                        Button.margin({ right: 8 });
                        Button.onClick(() => this.goToProfile());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('退出登录');
                        Button.fontSize(13);
                        Button.height(32);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.danger);
                        Button.borderRadius(16);
                        Button.onClick(() => this.logout());
                    }, Button);
                    Button.pop();
                    // 用户信息栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分隔提示
                        Text.create('请选择您的身份');
                        // 分隔提示
                        Text.fontSize(14);
                        // 分隔提示
                        Text.fontColor(AppColors.textSecondary);
                        // 分隔提示
                        Text.width('85%');
                        // 分隔提示
                        Text.margin({ top: 8, bottom: 4 });
                    }, Text);
                    // 分隔提示
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 角色卡片 - 按 displayRoles 顺序显示
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const role = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 4 });
                                Column.width('80%');
                                Column.padding(16);
                                Column.backgroundColor(getRoleBgColor(role));
                                Column.borderRadius(16);
                                Column.onClick(() => this.selectRole(role));
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleEmoji(role));
                                Text.fontSize(40);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleLabel(role));
                                Text.fontSize(18);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor(AppColors.textPrimary);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleSubtitle(role));
                                Text.fontSize(11);
                                Text.fontColor(AppColors.textTertiary);
                            }, Text);
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.displayRoles, forEachItemGenFunction, (role: Role) => role.toString(), false, false);
                    }, ForEach);
                    // 角色卡片 - 按 displayRoles 顺序显示
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.height(8);
                    }, Blank);
                    Blank.pop();
                    // ===== 已登录状态（自动跳转后通常不会停留在此）=====
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ===== 未登录状态 =====
                        Column.create({ space: 16 });
                        // ===== 未登录状态 =====
                        Column.width('100%');
                        // ===== 未登录状态 =====
                        Column.height('100%');
                        // ===== 未登录状态 =====
                        Column.backgroundColor(AppColors.bg);
                        // ===== 未登录状态 =====
                        Column.justifyContent(FlexAlign.Center);
                        // ===== 未登录状态 =====
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🌊');
                        Text.fontSize(56);
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('智慧防汛应急救援系统');
                        Text.fontSize(24);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.primary);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('—— 汛安 ——');
                        Text.fontSize(16);
                        Text.fontColor(AppColors.textSecondary);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请登录以继续');
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textSecondary);
                        Text.margin({ top: 8, bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('登录');
                        Button.width('80%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontWeight(FontWeight.Medium);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.primary);
                        Button.borderRadius(24);
                        Button.onClick(() => this.goToLogin());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('快速求救');
                        Button.width('80%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontWeight(FontWeight.Medium);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.danger);
                        Button.borderRadius(24);
                        Button.onClick(() => this.goToQuickSOS());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.height(8);
                    }, Blank);
                    Blank.pop();
                    // ===== 未登录状态 =====
                    Column.pop();
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
