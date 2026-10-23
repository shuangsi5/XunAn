if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    phone?: string;
    name?: string;
    password?: string;
    errorMsg?: string;
    selectedRoles?: Role[];
    roleOptions?: RoleOption[];
    unitOptions?: SelectOption[];
    unitIndex?: number;
    isLoading?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import { registerUser } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { AppColors } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
class SelectOption {
    value: string;
    constructor(value: string) {
        this.value = value;
    }
}
interface RoleOption {
    role: Role;
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
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
        this.__selectedRoles = new ObservedPropertyObjectPU([Role.CITIZEN], this, "selectedRoles");
        this.roleOptions = [
            { role: Role.CITIZEN, label: '群众', emoji: '👤', color: AppColors.primary, bgColor: AppColors.primaryLight },
            { role: Role.RESCUER, label: '救援人员', emoji: '🚑', color: AppColors.warning, bgColor: AppColors.warningLight },
            { role: Role.COMMAND, label: '指挥部', emoji: '🏢', color: AppColors.success, bgColor: AppColors.successLight }
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
        if (params.selectedRoles !== undefined) {
            this.selectedRoles = params.selectedRoles;
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
        this.__selectedRoles.purgeDependencyOnElmtId(rmElmtId);
        this.__unitIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phone.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__selectedRoles.aboutToBeDeleted();
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
    private __selectedRoles: ObservedPropertyObjectPU<Role[]>;
    get selectedRoles() {
        return this.__selectedRoles.get();
    }
    set selectedRoles(newValue: Role[]) {
        this.__selectedRoles.set(newValue);
    }
    private roleOptions: RoleOption[];
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
    toggleRole(role: Role): void {
        let newRoles = [...this.selectedRoles];
        const index = newRoles.indexOf(role);
        if (index > -1) {
            // 至少保留一个角色
            if (newRoles.length > 1) {
                newRoles.splice(index, 1);
            }
        }
        else {
            newRoles.push(role);
        }
        this.selectedRoles = newRoles;
    }
    hasNonCitizenRole(): boolean {
        return this.selectedRoles.some((r: Role) => r !== Role.CITIZEN);
    }
    async handleRegister(): Promise<void> {
        this.errorMsg = '';
        let phone = this.phone.trim();
        if (!phone) {
            this.errorMsg = '请输入手机号';
            return;
        }
        if (phone.length !== 11) {
            this.errorMsg = '手机号必须为11位';
            return;
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            this.errorMsg = '请输入正确的手机号';
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
        if (this.selectedRoles.length === 0) {
            this.errorMsg = '请至少选择一个身份';
            return;
        }
        this.isLoading = true;
        let unit = this.hasNonCitizenRole() ? this.unitOptions[this.unitIndex].value : '';
        let success = await registerUser(phone, this.name.trim(), this.password.trim(), this.selectedRoles, unit);
        this.isLoading = false;
        if (success) {
            promptAction.showToast({ message: '注册成功', duration: 2000 });
            router.back();
        }
        else {
            this.errorMsg = '注册失败，请检查网络后重试';
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
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.bg);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 标题栏
            Row.alignItems(VerticalAlign.Center);
            // 标题栏
            Row.padding({ left: 8, right: 8, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.fontSize(20);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(AppColors.textPrimary);
            Button.width(40);
            Button.height(40);
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('注册账号');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(40);
            Row.height(40);
        }, Row);
        Row.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 角色选择（多选）
            Text.create('选择身份（可多选）');
            // 角色选择（多选）
            Text.fontSize(14);
            // 角色选择（多选）
            Text.fontWeight(FontWeight.Medium);
            // 角色选择（多选）
            Text.fontColor(AppColors.textSecondary);
            // 角色选择（多选）
            Text.width('90%');
        }, Text);
        // 角色选择（多选）
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('90%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const option = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.width('28%');
                    Column.padding({ top: 12, bottom: 10 });
                    Column.backgroundColor(this.selectedRoles.includes(option.role) ? option.bgColor : AppColors.bgSecondary);
                    Column.borderRadius(12);
                    Column.border({
                        width: this.selectedRoles.includes(option.role) ? 1.5 : 0,
                        color: this.selectedRoles.includes(option.role) ? option.color : Color.Transparent
                    });
                    Column.alignItems(HorizontalAlign.Center);
                    Column.onClick(() => this.toggleRole(option.role));
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(option.emoji);
                    Text.fontSize(24);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(option.label);
                    Text.fontSize(13);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor(this.selectedRoles.includes(option.role) ? option.color : AppColors.textSecondary);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.selectedRoles.includes(option.role)) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('✓');
                                Text.fontSize(10);
                                Text.fontColor(option.color);
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(' ');
                                Text.fontSize(10);
                            }, Text);
                            Text.pop();
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.roleOptions, forEachItemGenFunction, (option: RoleOption) => option.role, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号
            TextInput.create({ placeholder: '手机号', text: { value: this.phone, changeEvent: newValue => { this.phone = newValue; } } });
            // 手机号
            TextInput.width('90%');
            // 手机号
            TextInput.height(48);
            // 手机号
            TextInput.fontSize(15);
            // 手机号
            TextInput.type(InputType.Number);
            // 手机号
            TextInput.maxLength(11);
            // 手机号
            TextInput.backgroundColor(AppColors.card);
            // 手机号
            TextInput.borderRadius(12);
            // 手机号
            TextInput.padding({ left: 14, right: 14 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 姓名
            TextInput.create({ placeholder: '姓名', text: { value: this.name, changeEvent: newValue => { this.name = newValue; } } });
            // 姓名
            TextInput.width('90%');
            // 姓名
            TextInput.height(48);
            // 姓名
            TextInput.fontSize(15);
            // 姓名
            TextInput.backgroundColor(AppColors.card);
            // 姓名
            TextInput.borderRadius(12);
            // 姓名
            TextInput.padding({ left: 14, right: 14 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码
            TextInput.create({ placeholder: '密码', text: { value: this.password, changeEvent: newValue => { this.password = newValue; } } });
            // 密码
            TextInput.width('90%');
            // 密码
            TextInput.height(48);
            // 密码
            TextInput.fontSize(15);
            // 密码
            TextInput.type(InputType.Password);
            // 密码
            TextInput.maxLength(20);
            // 密码
            TextInput.backgroundColor(AppColors.card);
            // 密码
            TextInput.borderRadius(12);
            // 密码
            TextInput.padding({ left: 14, right: 14 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 条件：包含救援或指挥角色时需选择单位
            if (this.hasNonCitizenRole()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('所属单位');
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(AppColors.textSecondary);
                        Text.width('90%');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.unitOptions);
                        Select.selected(this.unitIndex);
                        Select.onSelect((index: number) => {
                            this.unitIndex = index;
                        });
                        Select.width('90%');
                        Select.height(48);
                        Select.font({ size: 15 });
                        Select.backgroundColor(AppColors.card);
                        Select.borderRadius(12);
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
                        Text.fontSize(13);
                        Text.fontColor(AppColors.danger);
                        Text.width('90%');
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
            // 注册按钮
            Button.width('90%');
            // 注册按钮
            Button.height(48);
            // 注册按钮
            Button.fontSize(16);
            // 注册按钮
            Button.fontWeight(FontWeight.Medium);
            // 注册按钮
            Button.fontColor(Color.White);
            // 注册按钮
            Button.backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary);
            // 注册按钮
            Button.borderRadius(24);
            // 注册按钮
            Button.margin({ top: 16, bottom: 24 });
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
