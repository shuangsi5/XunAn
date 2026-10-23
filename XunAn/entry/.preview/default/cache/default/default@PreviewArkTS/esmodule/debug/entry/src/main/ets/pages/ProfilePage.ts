if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface InfoCard_Params {
    icon?: string;
    label?: string;
    value?: string;
    readonly?: boolean;
}
interface ProfilePage_Params {
    phone?: string;
    name?: string;
    password?: string;
    unit?: string;
    roles?: string;
    errorMsg?: string;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { getLoggedInPhone, getUserByPhone, updateUserProfile } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__unit = new ObservedPropertySimplePU('', this, "unit");
        this.__roles = new ObservedPropertySimplePU('', this, "roles");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfilePage_Params) {
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.name !== undefined) {
            this.name = params.name;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.unit !== undefined) {
            this.unit = params.unit;
        }
        if (params.roles !== undefined) {
            this.roles = params.roles;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
    }
    updateStateVars(params: ProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__unit.purgeDependencyOnElmtId(rmElmtId);
        this.__roles.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phone.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__unit.aboutToBeDeleted();
        this.__roles.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
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
    private __name: ObservedPropertySimplePU<string>;
    get name() {
        return this.__name.get();
    }
    set name(newValue: string) {
        this.__name.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __unit: ObservedPropertySimplePU<string>;
    get unit() {
        return this.__unit.get();
    }
    set unit(newValue: string) {
        this.__unit.set(newValue);
    }
    private __roles: ObservedPropertySimplePU<string>;
    get roles() {
        return this.__roles.get();
    }
    set roles(newValue: string) {
        this.__roles.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    aboutToAppear(): void {
        let phone = getLoggedInPhone();
        if (phone) {
            getUserByPhone(phone).then((user) => {
                if (user) {
                    this.phone = user.phone;
                    this.name = user.name;
                    this.password = user.password;
                    this.unit = user.unit || '';
                    this.roles = user.roles.join(' / ');
                }
            });
        }
    }
    async handleSave(): Promise<void> {
        this.errorMsg = '';
        if (!this.name.trim()) {
            this.errorMsg = '姓名不能为空';
            return;
        }
        if (!this.password.trim()) {
            this.errorMsg = '密码不能为空';
            return;
        }
        if (this.password.length < 4) {
            this.errorMsg = '密码至少4位';
            return;
        }
        let success = await updateUserProfile(this.phone, this.name.trim(), this.password.trim(), this.unit.trim());
        if (success) {
            promptAction.showToast({ message: '保存成功', duration: 2000 });
            router.back();
        }
        else {
            this.errorMsg = '保存失败，请重试';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(54:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ProfilePage.ets(56:7)", "entry");
            // 标题栏
            Row.width('90%');
            // 标题栏
            Row.margin({ top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('← 返回');
            Button.debugLine("entry/src/main/ets/pages/ProfilePage.ets(57:9)", "entry");
            Button.fontSize(15);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor('#1890FF');
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ProfilePage.ets(62:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人中心');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(63:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ProfilePage.ets(66:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 占位保持标题居中
            Button.createWithLabel('← 返回');
            Button.debugLine("entry/src/main/ets/pages/ProfilePage.ets(68:9)", "entry");
            // 占位保持标题居中
            Button.fontSize(15);
            // 占位保持标题居中
            Button.backgroundColor(Color.Transparent);
            // 占位保持标题居中
            Button.fontColor(Color.Transparent);
        }, Button);
        // 占位保持标题居中
        Button.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/ProfilePage.ets(76:7)", "entry");
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(77:9)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 头像区域 ──
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(80:11)", "entry");
            // ── 头像区域 ──
            Column.width('100%');
            // ── 头像区域 ──
            Column.padding({ top: 24, bottom: 24 });
            // ── 头像区域 ──
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('👤');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(81:13)", "entry");
            Text.fontSize(48);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.name || '用户');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(83:13)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.roles);
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(87:13)", "entry");
            Text.fontSize(13);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        // ── 头像区域 ──
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // ── 手机号（不可修改） ──
                    InfoCard(this, { icon: '📱', label: '手机号', value: this.phone, readonly: true }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ProfilePage.ets", line: 96, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: '📱',
                            label: '手机号',
                            value: this.phone,
                            readonly: true
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: '📱', label: '手机号', value: this.phone, readonly: true
                    });
                }
            }, { name: "InfoCard" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 姓名 ──
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(99:11)", "entry");
            // ── 姓名 ──
            Column.width('100%');
            // ── 姓名 ──
            Column.padding(16);
            // ── 姓名 ──
            Column.margin({ top: 12, left: 12, right: 12 });
            // ── 姓名 ──
            Column.backgroundColor(Color.White);
            // ── 姓名 ──
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/ProfilePage.ets(100:13)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✏️');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(101:15)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('姓名');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(103:15)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入姓名', text: { value: this.name, changeEvent: newValue => { this.name = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/ProfilePage.ets(109:13)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.fontSize(15);
            TextInput.backgroundColor('#F7F8FA');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 12, right: 12 });
        }, TextInput);
        // ── 姓名 ──
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 密码 ──
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(124:11)", "entry");
            // ── 密码 ──
            Column.width('100%');
            // ── 密码 ──
            Column.padding(16);
            // ── 密码 ──
            Column.margin({ top: 12, left: 12, right: 12 });
            // ── 密码 ──
            Column.backgroundColor(Color.White);
            // ── 密码 ──
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/ProfilePage.ets(125:13)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔒');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(126:15)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(128:15)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/ProfilePage.ets(134:13)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.fontSize(15);
            TextInput.type(InputType.Password);
            TextInput.maxLength(20);
            TextInput.backgroundColor('#F7F8FA');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 12, right: 12 });
        }, TextInput);
        // ── 密码 ──
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 所属单位 ──
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(151:11)", "entry");
            // ── 所属单位 ──
            Column.width('100%');
            // ── 所属单位 ──
            Column.padding(16);
            // ── 所属单位 ──
            Column.margin({ top: 12, left: 12, right: 12 });
            // ── 所属单位 ──
            Column.backgroundColor(Color.White);
            // ── 所属单位 ──
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/ProfilePage.ets(152:13)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🏢');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(153:15)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('所属单位');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(155:15)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入单位（选填）', text: { value: this.unit, changeEvent: newValue => { this.unit = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/ProfilePage.ets(161:13)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.fontSize(15);
            TextInput.backgroundColor('#F7F8FA');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 12, right: 12 });
        }, TextInput);
        // ── 所属单位 ──
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ── 错误信息 ──
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(177:13)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#FF4D4F');
                        Text.width('85%');
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                });
            }
            // ── 保存按钮 ──
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 保存按钮 ──
            Button.createWithLabel('保存修改');
            Button.debugLine("entry/src/main/ets/pages/ProfilePage.ets(185:11)", "entry");
            // ── 保存按钮 ──
            Button.width('85%');
            // ── 保存按钮 ──
            Button.height(48);
            // ── 保存按钮 ──
            Button.fontSize(17);
            // ── 保存按钮 ──
            Button.fontWeight(FontWeight.Bold);
            // ── 保存按钮 ──
            Button.fontColor(Color.White);
            // ── 保存按钮 ──
            Button.backgroundColor('#1890FF');
            // ── 保存按钮 ──
            Button.borderRadius(12);
            // ── 保存按钮 ──
            Button.margin({ top: 24, bottom: 30 });
            // ── 保存按钮 ──
            Button.shadow({ radius: 8, color: 'rgba(24,144,255,0.3)' });
            // ── 保存按钮 ──
            Button.onClick(() => this.handleSave());
        }, Button);
        // ── 保存按钮 ──
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ProfilePage.ets(197:11)", "entry");
            Blank.height(16);
        }, Blank);
        Blank.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProfilePage";
    }
}
class InfoCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__icon = new SynchedPropertySimpleOneWayPU(params.icon, this, "icon");
        this.__label = new SynchedPropertySimpleOneWayPU(params.label, this, "label");
        this.__value = new SynchedPropertySimpleOneWayPU(params.value, this, "value");
        this.__readonly = new SynchedPropertySimpleOneWayPU(params.readonly, this, "readonly");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: InfoCard_Params) {
        if (params.icon === undefined) {
            this.__icon.set('');
        }
        if (params.label === undefined) {
            this.__label.set('');
        }
        if (params.value === undefined) {
            this.__value.set('');
        }
        if (params.readonly === undefined) {
            this.__readonly.set(false);
        }
    }
    updateStateVars(params: InfoCard_Params) {
        this.__icon.reset(params.icon);
        this.__label.reset(params.label);
        this.__value.reset(params.value);
        this.__readonly.reset(params.readonly);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__label.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__readonly.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__icon.aboutToBeDeleted();
        this.__label.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__readonly.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __icon: SynchedPropertySimpleOneWayPU<string>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: string) {
        this.__icon.set(newValue);
    }
    private __label: SynchedPropertySimpleOneWayPU<string>;
    get label() {
        return this.__label.get();
    }
    set label(newValue: string) {
        this.__label.set(newValue);
    }
    private __value: SynchedPropertySimpleOneWayPU<string>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: string) {
        this.__value.set(newValue);
    }
    private __readonly: SynchedPropertySimpleOneWayPU<boolean>;
    get readonly() {
        return this.__readonly.get();
    }
    set readonly(newValue: boolean) {
        this.__readonly.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/ProfilePage.ets(220:5)", "entry");
            Row.width('100%');
            Row.padding(16);
            Row.margin({ top: 12, left: 12, right: 12 });
            Row.backgroundColor(Color.White);
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.icon);
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(221:7)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/ProfilePage.ets(223:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.label);
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(224:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.value || '未设置');
            Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(227:9)", "entry");
            Text.fontSize(15);
            Text.fontColor(this.readonly ? '#999' : '#333');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ProfilePage.ets(233:7)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.readonly) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('不可修改');
                        Text.debugLine("entry/src/main/ets/pages/ProfilePage.ets(236:9)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#BBB');
                        Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
                        Text.backgroundColor('#F5F5F5');
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
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new ProfilePage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/ProfilePage", pageFullPath: "entry/src/main/ets/pages/ProfilePage", integratedHsp: "false", moduleType: "followWithHap" });
