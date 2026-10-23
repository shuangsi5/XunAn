if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentUser?: User | null;
}
import router from "@ohos:router";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import type { User } from '../model/User';
import { getLoggedInPhone, getUserByPhone, clearLoggedIn, setCurrentRole } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
function getRoleLabel(role: Role): string {
    if (role === Role.CITIZEN) {
        return '群众';
    }
    else if (role === Role.RESCUER) {
        return '救援人员';
    }
    return '指挥部';
}
function getRoleEmoji(role: Role): string {
    if (role === Role.CITIZEN) {
        return '👤';
    }
    else if (role === Role.RESCUER) {
        return '🚑';
    }
    return '🏢';
}
function getRoleSubtitle(role: Role): string {
    if (role === Role.CITIZEN) {
        return '发布求救信息';
    }
    else if (role === Role.RESCUER) {
        return '接收任务并前往救援';
    }
    return '调度指挥与监控';
}
function getRoleBgColor(role: Role): string {
    if (role === Role.CITIZEN) {
        return '#E6F7FF';
    }
    else if (role === Role.RESCUER) {
        return '#FFF2E8';
    }
    return '#F6FFED';
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
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
    aboutToAppear(): void {
        let phone = getLoggedInPhone();
        if (phone) {
            getUserByPhone(phone).then((user) => {
                this.currentUser = user;
            });
        }
    }
    logout(): void {
        clearLoggedIn();
        this.currentUser = null;
    }
    selectRole(role: Role): void {
        setCurrentRole(role);
        if (role === Role.CITIZEN) {
            router.pushUrl({ url: 'pages/CitizenPage' });
        }
        else if (role === Role.RESCUER) {
            router.pushUrl({ url: 'pages/RescuerPage' });
        }
        else {
            router.pushUrl({ url: 'pages/CommandPage' });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ===== 已登录状态 =====
                        Column.create({ space: 8 });
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(75:7)", "entry");
                        // ===== 已登录状态 =====
                        Column.width('100%');
                        // ===== 已登录状态 =====
                        Column.height('100%');
                        // ===== 已登录状态 =====
                        Column.backgroundColor('#F5F5F5');
                        // ===== 已登录状态 =====
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户信息栏
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(77:9)", "entry");
                        // 用户信息栏
                        Row.width('85%');
                        // 用户信息栏
                        Row.padding({ top: 16, bottom: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 2 });
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(78:11)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`欢迎, ${this.currentUser!.name}`);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(79:13)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#333');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentUser!.unit) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`所属: ${this.currentUser!.unit}`);
                                    Text.debugLine("entry/src/main/ets/pages/Index.ets(84:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor('#999');
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
                        Blank.debugLine("entry/src/main/ets/pages/Index.ets(91:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('👤 个人中心');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(93:11)", "entry");
                        Button.fontSize(13);
                        Button.height(32);
                        Button.backgroundColor('#1890FF');
                        Button.fontColor(Color.White);
                        Button.borderRadius(6);
                        Button.margin({ right: 8 });
                        Button.onClick(() => {
                            router.pushUrl({ url: 'pages/ProfilePage' });
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('退出登录');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(104:11)", "entry");
                        Button.fontSize(13);
                        Button.height(32);
                        Button.backgroundColor('#FF4D4F');
                        Button.fontColor(Color.White);
                        Button.borderRadius(6);
                        Button.onClick(() => this.logout());
                    }, Button);
                    Button.pop();
                    // 用户信息栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分隔提示
                        Text.create('请选择您的身份');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(116:9)", "entry");
                        // 分隔提示
                        Text.fontSize(14);
                        // 分隔提示
                        Text.fontColor('#666');
                        // 分隔提示
                        Text.width('85%');
                        // 分隔提示
                        Text.margin({ top: 8, bottom: 4 });
                    }, Text);
                    // 分隔提示
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 动态角色卡片
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const role = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 4 });
                                Column.debugLine("entry/src/main/ets/pages/Index.ets(124:11)", "entry");
                                Column.width('80%');
                                Column.padding(16);
                                Column.backgroundColor(getRoleBgColor(role));
                                Column.borderRadius(16);
                                Column.onClick(() => this.selectRole(role));
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleEmoji(role));
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(125:13)", "entry");
                                Text.fontSize(40);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleLabel(role));
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(127:13)", "entry");
                                Text.fontSize(18);
                                Text.fontWeight(FontWeight.Bold);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleSubtitle(role));
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(130:13)", "entry");
                                Text.fontSize(11);
                                Text.fontColor('#999');
                            }, Text);
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.currentUser!.roles, forEachItemGenFunction, (role: Role) => role, false, false);
                    }, ForEach);
                    // 动态角色卡片
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Index.ets(141:9)", "entry");
                        Blank.height(8);
                    }, Blank);
                    Blank.pop();
                    // ===== 已登录状态 =====
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ===== 未登录状态 =====
                        Column.create({ space: 16 });
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(151:7)", "entry");
                        // ===== 未登录状态 =====
                        Column.width('100%');
                        // ===== 未登录状态 =====
                        Column.height('100%');
                        // ===== 未登录状态 =====
                        Column.backgroundColor('#F5F5F5');
                        // ===== 未登录状态 =====
                        Column.justifyContent(FlexAlign.Center);
                        // ===== 未登录状态 =====
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部大图标
                        Text.create('🌊');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(153:9)", "entry");
                        // 顶部大图标
                        Text.fontSize(56);
                        // 顶部大图标
                        Text.margin({ top: 16 });
                    }, Text);
                    // 顶部大图标
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 标题
                        Text.create('智慧防汛应急救援系统');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(158:9)", "entry");
                        // 标题
                        Text.fontSize(24);
                        // 标题
                        Text.fontWeight(FontWeight.Bold);
                        // 标题
                        Text.fontColor('#1890FF');
                    }, Text);
                    // 标题
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 副标题
                        Text.create('—— 汛安 ——');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(164:9)", "entry");
                        // 副标题
                        Text.fontSize(16);
                        // 副标题
                        Text.fontColor('#666');
                    }, Text);
                    // 副标题
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 提示文字
                        Text.create('请登录以继续');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(169:9)", "entry");
                        // 提示文字
                        Text.fontSize(14);
                        // 提示文字
                        Text.fontColor('#666');
                        // 提示文字
                        Text.margin({ top: 8, bottom: 4 });
                    }, Text);
                    // 提示文字
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 登录按钮
                        Button.createWithLabel('登录');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(175:9)", "entry");
                        // 登录按钮
                        Button.width('80%');
                        // 登录按钮
                        Button.height(44);
                        // 登录按钮
                        Button.fontSize(16);
                        // 登录按钮
                        Button.backgroundColor('#1890FF');
                        // 登录按钮
                        Button.borderRadius(8);
                        // 登录按钮
                        Button.onClick(() => {
                            router.pushUrl({ url: 'pages/LoginPage' });
                        });
                    }, Button);
                    // 登录按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 快速求救按钮
                        Button.createWithLabel('快速求救');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(186:9)", "entry");
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
                        Button.onClick(() => {
                            setCurrentRole(Role.CITIZEN);
                            router.pushUrl({ url: 'pages/CitizenPage' });
                        });
                    }, Button);
                    // 快速求救按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 底部留白
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Index.ets(199:9)", "entry");
                        // 底部留白
                        Blank.height(8);
                    }, Blank);
                    // 底部留白
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
