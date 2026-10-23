if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    phone?: string;
    name?: string;
    password?: string;
    errorMsg?: string;
    roleIndex?: number;
    roleOptions?: SelectOption[];
    unitOptions?: SelectOption[];
    unitIndex?: number;
    isLoading?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import { registerUser } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
class SelectOption {
    value: string;
    constructor(value: string) {
        this.value = value;
    }
}
class RegisterPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__roleIndex = new ObservedPropertySimplePU(0, this, "roleIndex");
        this.roleOptions = [
            new SelectOption('群众'),
            new SelectOption('救援人员'),
            new SelectOption('指挥部')
        ];
        this.unitOptions = [
            new SelectOption('消防'),
            new SelectOption('武警'),
            new SelectOption('社区'),
            new SelectOption('其他')
        ];
        this.__unitIndex = new ObservedPropertySimplePU(0, this, "unitIndex");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RegisterPage_Params) {
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.name !== undefined) {
            this.name = params.name;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.roleIndex !== undefined) {
            this.roleIndex = params.roleIndex;
        }
        if (params.roleOptions !== undefined) {
            this.roleOptions = params.roleOptions;
        }
        if (params.unitOptions !== undefined) {
            this.unitOptions = params.unitOptions;
        }
        if (params.unitIndex !== undefined) {
            this.unitIndex = params.unitIndex;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
    }
    updateStateVars(params: RegisterPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__roleIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__unitIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phone.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__roleIndex.aboutToBeDeleted();
        this.__unitIndex.aboutToBeDeleted();
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
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __roleIndex: ObservedPropertySimplePU<number>;
    get roleIndex() {
        return this.__roleIndex.get();
    }
    set roleIndex(newValue: number) {
        this.__roleIndex.set(newValue);
    }
    private roleOptions: SelectOption[];
    private unitOptions: SelectOption[];
    private __unitIndex: ObservedPropertySimplePU<number>;
    get unitIndex() {
        return this.__unitIndex.get();
    }
    set unitIndex(newValue: number) {
        this.__unitIndex.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    getSelectedRole(): Role {
        if (this.roleIndex === 0) {
            return Role.CITIZEN;
        }
        else if (this.roleIndex === 1) {
            return Role.RESCUER;
        }
        return Role.COMMAND;
    }
    async handleRegister(): Promise<void> {
        this.errorMsg = '';
        if (!this.phone.trim()) {
            this.errorMsg = '请输入手机号';
            return;
        }
        if (!this.name.trim()) {
            this.errorMsg = '请输入姓名';
            return;
        }
        if (!this.password.trim()) {
            this.errorMsg = '请输入密码';
            return;
        }
        if (this.password.length < 4) {
            this.errorMsg = '密码至少4位';
            return;
        }
        this.isLoading = true;
        let role = this.getSelectedRole();
        let unit = role !== Role.CITIZEN ? this.unitOptions[this.unitIndex].value : '';
        let success = await registerUser(this.phone.trim(), this.name.trim(), this.password.trim(), role, unit);
        this.isLoading = false;
        if (success) {
            promptAction.showToast({ message: '注册成功', duration: 2000 });
            router.back();
        }
        else {
            this.errorMsg = '注册失败，请检查网络后重试';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(75:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/RegisterPage.ets(76:7)", "entry");
            Row.width('90%');
            Row.margin({ top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/RegisterPage.ets(77:9)", "entry");
            Button.fontSize(14);
            Button.backgroundColor('#F5F5F5');
            Button.fontColor('#1890FF');
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/RegisterPage.ets(82:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册账号');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(83:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/RegisterPage.ets(86:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 占位保持标题居中
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/RegisterPage.ets(88:9)", "entry");
            // 占位保持标题居中
            Button.fontSize(14);
            // 占位保持标题居中
            Button.backgroundColor('#F5F5F5');
            // 占位保持标题居中
            Button.fontColor('#F5F5F5');
        }, Button);
        // 占位保持标题居中
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/RegisterPage.ets(96:7)", "entry");
            Scroll.layoutWeight(1);
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(97:9)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 角色选择
            Text.create('选择角色');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(99:11)", "entry");
            // 角色选择
            Text.fontSize(14);
            // 角色选择
            Text.fontColor('#666');
            // 角色选择
            Text.width('90%');
        }, Text);
        // 角色选择
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create(this.roleOptions);
            Select.debugLine("entry/src/main/ets/pages/RegisterPage.ets(104:11)", "entry");
            Select.selected(this.roleIndex);
            Select.onSelect((index: number) => {
                this.roleIndex = index;
                this.unitIndex = 0;
            });
            Select.width('85%');
            Select.height(44);
        }, Select);
        Select.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号
            TextInput.create({ placeholder: '手机号', text: { value: this.phone, changeEvent: newValue => { this.phone = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(114:11)", "entry");
            // 手机号
            TextInput.width('85%');
            // 手机号
            TextInput.height(44);
            // 手机号
            TextInput.type(InputType.Number);
            // 手机号
            TextInput.maxLength(11);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 姓名
            TextInput.create({ placeholder: '姓名', text: { value: this.name, changeEvent: newValue => { this.name = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(121:11)", "entry");
            // 姓名
            TextInput.width('85%');
            // 姓名
            TextInput.height(44);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码
            TextInput.create({ placeholder: '密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(126:11)", "entry");
            // 密码
            TextInput.width('85%');
            // 密码
            TextInput.height(44);
            // 密码
            TextInput.type(InputType.Password);
            // 密码
            TextInput.maxLength(20);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 条件：救援或指挥需选择单位
            if (this.roleIndex !== 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('所属单位');
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(134:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666');
                        Text.width('90%');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.unitOptions);
                        Select.debugLine("entry/src/main/ets/pages/RegisterPage.ets(140:13)", "entry");
                        Select.selected(this.unitIndex);
                        Select.onSelect((index: number) => {
                            this.unitIndex = index;
                        });
                        Select.width('85%');
                        Select.height(44);
                    }, Select);
                    Select.pop();
                });
            }
            // 错误信息
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(151:13)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#FF4D4F');
                        Text.width('85%');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            // 注册按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册按钮
            Button.createWithLabel(this.isLoading ? '注册中...' : '注册');
            Button.debugLine("entry/src/main/ets/pages/RegisterPage.ets(159:11)", "entry");
            // 注册按钮
            Button.width('85%');
            // 注册按钮
            Button.height(44);
            // 注册按钮
            Button.fontSize(16);
            // 注册按钮
            Button.backgroundColor(this.isLoading ? '#91CAFF' : '#1890FF');
            // 注册按钮
            Button.borderRadius(8);
            // 注册按钮
            Button.margin({ top: 16 });
            // 注册按钮
            Button.enabled(!this.isLoading);
            // 注册按钮
            Button.onClick(() => this.handleRegister());
        }, Button);
        // 注册按钮
        Button.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "RegisterPage";
    }
}
registerNamedRoute(() => new RegisterPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/RegisterPage", pageFullPath: "entry/src/main/ets/pages/RegisterPage", integratedHsp: "false", moduleType: "followWithHap" });
