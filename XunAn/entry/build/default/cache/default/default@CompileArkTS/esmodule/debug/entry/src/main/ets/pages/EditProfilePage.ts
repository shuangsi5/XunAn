if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EditProfilePage_Params {
    field?: string;
    label?: string;
    icon?: string;
    value?: string;
    newPassword?: string;
    confirmPassword?: string;
    errorMsg?: string;
    phone?: string;
    isLoading?: boolean;
    currentName?: string;
    currentPassword?: string;
    currentUnit?: string;
    unitIndex?: number;
    unitOptions?: UnitOption[];
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { getLoggedInPhone, getUserByPhone, updateUserProfile, setLoggedInPhone } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { AppColors } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
class UnitOption {
    value: string;
    constructor(value: string) {
        this.value = value;
    }
}
class EditProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__field = new ObservedPropertySimplePU('', this, "field");
        this.__label = new ObservedPropertySimplePU('', this, "label");
        this.__icon = new ObservedPropertySimplePU('', this, "icon");
        this.__value = new ObservedPropertySimplePU('', this, "value");
        this.__newPassword = new ObservedPropertySimplePU('', this, "newPassword");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__currentName = new ObservedPropertySimplePU('', this, "currentName");
        this.__currentPassword = new ObservedPropertySimplePU('', this, "currentPassword");
        this.__currentUnit = new ObservedPropertySimplePU('', this, "currentUnit");
        this.__unitIndex = new ObservedPropertySimplePU(0, this, "unitIndex");
        this.unitOptions = [
            new UnitOption('消防'),
            new UnitOption('武警'),
            new UnitOption('社区'),
            new UnitOption('其他')
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EditProfilePage_Params) {
        if (params.field !== undefined) {
            this.field = params.field;
        }
        if (params.label !== undefined) {
            this.label = params.label;
        }
        if (params.icon !== undefined) {
            this.icon = params.icon;
        }
        if (params.value !== undefined) {
            this.value = params.value;
        }
        if (params.newPassword !== undefined) {
            this.newPassword = params.newPassword;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.currentName !== undefined) {
            this.currentName = params.currentName;
        }
        if (params.currentPassword !== undefined) {
            this.currentPassword = params.currentPassword;
        }
        if (params.currentUnit !== undefined) {
            this.currentUnit = params.currentUnit;
        }
        if (params.unitIndex !== undefined) {
            this.unitIndex = params.unitIndex;
        }
        if (params.unitOptions !== undefined) {
            this.unitOptions = params.unitOptions;
        }
    }
    updateStateVars(params: EditProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__field.purgeDependencyOnElmtId(rmElmtId);
        this.__label.purgeDependencyOnElmtId(rmElmtId);
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__newPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__currentName.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUnit.purgeDependencyOnElmtId(rmElmtId);
        this.__unitIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__field.aboutToBeDeleted();
        this.__label.aboutToBeDeleted();
        this.__icon.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__newPassword.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__currentName.aboutToBeDeleted();
        this.__currentPassword.aboutToBeDeleted();
        this.__currentUnit.aboutToBeDeleted();
        this.__unitIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __field: ObservedPropertySimplePU<string>;
    get field() {
        return this.__field.get();
    }
    set field(newValue: string) {
        this.__field.set(newValue);
    }
    private __label: ObservedPropertySimplePU<string>;
    get label() {
        return this.__label.get();
    }
    set label(newValue: string) {
        this.__label.set(newValue);
    }
    private __icon: ObservedPropertySimplePU<string>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: string) {
        this.__icon.set(newValue);
    }
    private __value: ObservedPropertySimplePU<string>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: string) {
        this.__value.set(newValue);
    }
    private __newPassword: ObservedPropertySimplePU<string>;
    get newPassword() {
        return this.__newPassword.get();
    }
    set newPassword(newValue: string) {
        this.__newPassword.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __phone: ObservedPropertySimplePU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    // 当前用户的完整信息（保存时只修改目标字段，其他保持原值）
    private __currentName: ObservedPropertySimplePU<string>;
    get currentName() {
        return this.__currentName.get();
    }
    set currentName(newValue: string) {
        this.__currentName.set(newValue);
    }
    private __currentPassword: ObservedPropertySimplePU<string>;
    get currentPassword() {
        return this.__currentPassword.get();
    }
    set currentPassword(newValue: string) {
        this.__currentPassword.set(newValue);
    }
    private __currentUnit: ObservedPropertySimplePU<string>;
    get currentUnit() {
        return this.__currentUnit.get();
    }
    set currentUnit(newValue: string) {
        this.__currentUnit.set(newValue);
    }
    // 单位下拉菜单
    private __unitIndex: ObservedPropertySimplePU<number>;
    get unitIndex() {
        return this.__unitIndex.get();
    }
    set unitIndex(newValue: number) {
        this.__unitIndex.set(newValue);
    }
    private unitOptions: UnitOption[];
    async aboutToAppear(): Promise<void> {
        let params = router.getParams() as Record<string, string>;
        this.field = params['field'] || '';
        this.value = params['value'] || '';
        this.phone = getLoggedInPhone();
        switch (this.field) {
            case 'name':
                this.label = '修改姓名';
                this.icon = '✏️';
                break;
            case 'unit':
                this.label = '修改单位';
                this.icon = '🏢';
                break;
            case 'password':
                this.label = '修改密码';
                this.icon = '🔒';
                break;
            case 'phone':
                this.label = '修改手机号';
                this.icon = '📱';
                break;
            default:
                this.label = '编辑';
                this.icon = '✏️';
        }
        // 获取当前用户完整信息
        if (this.phone) {
            let user = await getUserByPhone(this.phone);
            if (user) {
                let u = user; // 消除 null 推断问题
                this.currentName = u.name;
                this.currentPassword = u.password;
                this.currentUnit = u.unit;
                // 如果是修改单位，根据当前值设置下拉菜单选中项
                if (this.field === 'unit') {
                    let idx = this.unitOptions.findIndex(o => o.value === u.unit);
                    if (idx >= 0) {
                        this.unitIndex = idx;
                    }
                }
            }
        }
    }
    async handleSave(): Promise<void> {
        this.errorMsg = '';
        if (this.field === 'password') {
            // 修改密码校验
            if (!this.newPassword.trim()) {
                this.errorMsg = '请输入新密码';
                return;
            }
            if (this.newPassword.length < 4) {
                this.errorMsg = '密码至少4位';
                return;
            }
            if (this.newPassword !== this.confirmPassword) {
                this.errorMsg = '两次输入的密码不一致';
                return;
            }
        }
        else if (this.field === 'phone') {
            // 修改手机号校验
            let newPhone = this.value.trim();
            if (!newPhone) {
                this.errorMsg = '请输入手机号';
                return;
            }
            if (newPhone.length !== 11) {
                this.errorMsg = '手机号必须为11位';
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(newPhone)) {
                this.errorMsg = '请输入正确的手机号';
                return;
            }
        }
        else {
            // 姓名/单位校验
            if (this.field === 'name' && !this.value.trim()) {
                this.errorMsg = '姓名不能为空';
                return;
            }
        }
        this.isLoading = true;
        let name = this.currentName;
        let password = this.currentPassword;
        let unit = this.currentUnit;
        let newPhone = '';
        if (this.field === 'name') {
            name = this.value.trim();
        }
        else if (this.field === 'unit') {
            unit = this.unitOptions[this.unitIndex].value;
        }
        else if (this.field === 'password') {
            password = this.newPassword.trim();
        }
        else if (this.field === 'phone') {
            newPhone = this.value.trim();
        }
        let success = await updateUserProfile(this.phone, name, password, unit, newPhone);
        this.isLoading = false;
        if (success) {
            promptAction.showToast({ message: '修改成功', duration: 2000 });
            // 如果修改了手机号，更新本地存储的登录手机号
            if (this.field === 'phone' && newPhone) {
                setLoggedInPhone(newPhone);
            }
            router.back();
        }
        else {
            this.errorMsg = '修改失败，请重试';
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
            Row.padding({ left: 8, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('<');
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
            Text.create(this.label);
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
            Button.createWithLabel(this.isLoading ? '保存中...' : '保存');
            Button.fontSize(14);
            Button.height(32);
            Button.padding({ left: 14, right: 14 });
            Button.fontColor(Color.White);
            Button.backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary);
            Button.borderRadius(16);
            Button.enabled(!this.isLoading);
            Button.onClick(() => this.handleSave());
        }, Button);
        Button.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 编辑区域
            if (this.field === 'password') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 密码修改表单
                        Column.create({ space: 12 });
                        // 密码修改表单
                        Column.width('90%');
                        // 密码修改表单
                        Column.padding(16);
                        // 密码修改表单
                        Column.backgroundColor(AppColors.card);
                        // 密码修改表单
                        Column.borderRadius(16);
                        // 密码修改表单
                        Column.margin({ top: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔐');
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('新密码');
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textSecondary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入新密码（至少4位）', text: { value: this.newPassword, changeEvent: newValue => { this.newPassword = newValue; } } });
                        TextInput.width('100%');
                        TextInput.height(48);
                        TextInput.fontSize(15);
                        TextInput.type(InputType.Password);
                        TextInput.maxLength(20);
                        TextInput.backgroundColor(AppColors.bgSecondary);
                        TextInput.borderRadius(12);
                        TextInput.padding({ left: 12, right: 12 });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔐');
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确认密码');
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textSecondary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请再次输入新密码', text: { value: this.confirmPassword, changeEvent: newValue => { this.confirmPassword = newValue; } } });
                        TextInput.width('100%');
                        TextInput.height(48);
                        TextInput.fontSize(15);
                        TextInput.type(InputType.Password);
                        TextInput.maxLength(20);
                        TextInput.backgroundColor(AppColors.bgSecondary);
                        TextInput.borderRadius(12);
                        TextInput.padding({ left: 12, right: 12 });
                    }, TextInput);
                    // 密码修改表单
                    Column.pop();
                });
            }
            else if (this.field === 'unit') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 单位修改：下拉菜单
                        Column.create({ space: 12 });
                        // 单位修改：下拉菜单
                        Column.width('90%');
                        // 单位修改：下拉菜单
                        Column.padding(16);
                        // 单位修改：下拉菜单
                        Column.backgroundColor(AppColors.card);
                        // 单位修改：下拉菜单
                        Column.borderRadius(16);
                        // 单位修改：下拉菜单
                        Column.margin({ top: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.icon);
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.label);
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textSecondary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.unitOptions);
                        Select.selected(this.unitIndex);
                        Select.value(this.currentUnit || this.unitOptions[this.unitIndex]?.value || '');
                        Select.onSelect((index: number) => {
                            this.unitIndex = index;
                        });
                        Select.width('100%');
                        Select.height(48);
                        Select.font({ size: 15 });
                        Select.backgroundColor(AppColors.bgSecondary);
                        Select.borderRadius(12);
                    }, Select);
                    Select.pop();
                    // 单位修改：下拉菜单
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 姓名/手机号编辑
                        Column.create({ space: 12 });
                        // 姓名/手机号编辑
                        Column.width('90%');
                        // 姓名/手机号编辑
                        Column.padding(16);
                        // 姓名/手机号编辑
                        Column.backgroundColor(AppColors.card);
                        // 姓名/手机号编辑
                        Column.borderRadius(16);
                        // 姓名/手机号编辑
                        Column.margin({ top: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.icon);
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.label);
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textSecondary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({
                            placeholder: `请输入${this.label.replace('修改', '')}`,
                            text: { value: this.value, changeEvent: newValue => { this.value = newValue; } }
                        });
                        TextInput.width('100%');
                        TextInput.height(48);
                        TextInput.fontSize(15);
                        TextInput.type(this.field === 'phone' ? InputType.Number : InputType.Normal);
                        TextInput.maxLength(this.field === 'phone' ? 11 : 50);
                        TextInput.backgroundColor(AppColors.bgSecondary);
                        TextInput.borderRadius(12);
                        TextInput.padding({ left: 12, right: 12 });
                    }, TextInput);
                    // 姓名/手机号编辑
                    Column.pop();
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
                        Text.width('85%');
                        Text.margin({ top: 8 });
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
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "EditProfilePage";
    }
}
registerNamedRoute(() => new EditProfilePage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/EditProfilePage", pageFullPath: "entry/src/main/ets/pages/EditProfilePage", integratedHsp: "false", moduleType: "followWithHap" });
