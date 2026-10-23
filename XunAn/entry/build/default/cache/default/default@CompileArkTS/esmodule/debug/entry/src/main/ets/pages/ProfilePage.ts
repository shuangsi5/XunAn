if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfilePage_Params {
    phone?: string;
    name?: string;
    unit?: string;
    avatarUrl?: string;
    roles?: Role[];
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import type common from "@ohos:app.ability.common";
import picker from "@ohos:file.picker";
import type { Role } from '../model/Role';
import { getLoggedInPhone, getUserByPhone, clearLoggedIn, uploadImage, updateUserProfile } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { BottomNavBar } from "@bundle:com.xunan.floodrescue/entry/ets/components/BottomNavBar";
import { AppColors, getRoleLabel } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
function maskPhone(phone: string): string {
    if (phone.length === 11) {
        return phone.substring(0, 3) + '******' + phone.substring(9);
    }
    return phone;
}
class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__unit = new ObservedPropertySimplePU('', this, "unit");
        this.__avatarUrl = new ObservedPropertySimplePU('', this, "avatarUrl");
        this.__roles = new ObservedPropertyObjectPU([], this, "roles");
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
        if (params.unit !== undefined) {
            this.unit = params.unit;
        }
        if (params.avatarUrl !== undefined) {
            this.avatarUrl = params.avatarUrl;
        }
        if (params.roles !== undefined) {
            this.roles = params.roles;
        }
    }
    updateStateVars(params: ProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__unit.purgeDependencyOnElmtId(rmElmtId);
        this.__avatarUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__roles.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phone.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__unit.aboutToBeDeleted();
        this.__avatarUrl.aboutToBeDeleted();
        this.__roles.aboutToBeDeleted();
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
    private __unit: ObservedPropertySimplePU<string>;
    get unit() {
        return this.__unit.get();
    }
    set unit(newValue: string) {
        this.__unit.set(newValue);
    }
    private __avatarUrl: ObservedPropertySimplePU<string>;
    get avatarUrl() {
        return this.__avatarUrl.get();
    }
    set avatarUrl(newValue: string) {
        this.__avatarUrl.set(newValue);
    }
    private __roles: ObservedPropertyObjectPU<Role[]>;
    get roles() {
        return this.__roles.get();
    }
    set roles(newValue: Role[]) {
        this.__roles.set(newValue);
    }
    aboutToAppear(): void {
        this.loadUser();
    }
    onPageShow(): void {
        this.loadUser();
    }
    async loadUser(): Promise<void> {
        let phone = getLoggedInPhone();
        console.log('ProfilePage loadUser 手机号:', phone);
        if (phone) {
            try {
                let user = await getUserByPhone(phone);
                console.log('ProfilePage loadUser 获取用户:', JSON.stringify(user));
                if (user) {
                    this.phone = user.phone;
                    this.name = user.name;
                    this.unit = user.unit || '';
                    this.avatarUrl = user.avatarUrl || '';
                    this.roles = user.roles;
                    console.log('ProfilePage loadUser 赋值后 name:', this.name, 'unit:', this.unit, 'avatar:', this.avatarUrl);
                }
                else {
                    console.log('ProfilePage loadUser getUserByPhone 返回 null');
                }
            }
            catch (err) {
                console.error('ProfilePage loadUser 异常:', JSON.stringify(err));
            }
        }
        else {
            console.log('ProfilePage loadUser 手机号为空');
        }
    }
    goToEdit(field: string, value: string): void {
        if (field === '')
            return;
        router.pushUrl({
            url: 'pages/EditProfilePage',
            params: { field: field, value: value }
        });
    }
    async handleUploadAvatar(): Promise<void> {
        try {
            let photoSelectOptions = new picker.PhotoSelectOptions();
            photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
            photoSelectOptions.maxSelectNumber = 1;
            let photoPicker = new picker.PhotoViewPicker();
            let result = await photoPicker.select(photoSelectOptions);
            if (result.photoUris && result.photoUris.length > 0) {
                let uri = result.photoUris[0];
                promptAction.showToast({ message: '正在上传头像...', duration: 2000 });
                let ctx = getContext(this) as common.UIAbilityContext;
                let url = await uploadImage(ctx, uri);
                if (url) {
                    // 上传成功，更新用户头像到服务器
                    let ok = await updateUserProfile(this.phone, this.name, '', this.unit, '', url);
                    if (ok) {
                        this.avatarUrl = url;
                        promptAction.showToast({ message: '头像更新成功', duration: 2000 });
                    }
                    else {
                        promptAction.showToast({ message: '头像保存失败', duration: 2000 });
                    }
                }
                else {
                    promptAction.showToast({ message: '头像上传失败', duration: 2000 });
                }
            }
        }
        catch (err) {
            console.error('选择或上传头像失败:', JSON.stringify(err as Error));
            promptAction.showToast({ message: '操作失败', duration: 2000 });
        }
    }
    handleLogout(): void {
        promptAction.showDialog({
            title: '确认退出',
            message: '确定要退出登录吗？',
            buttons: [
                { text: '取消', color: '#999' },
                { text: '退出', color: AppColors.danger }
            ]
        }).then((data) => {
            if (data.index === 1) {
                clearLoggedIn();
                promptAction.showToast({ message: '已退出登录', duration: 2000 });
                router.replaceUrl({ url: 'pages/LoginPage' });
            }
        }).catch(() => {
            // 取消
        });
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
            Text.create('个人中心');
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
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 头像区域 ──
            Column.create({ space: 8 });
            // ── 头像区域 ──
            Column.width('100%');
            // ── 头像区域 ──
            Column.padding({ top: 20, bottom: 24 });
            // ── 头像区域 ──
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.BottomEnd });
            Stack.width(72);
            Stack.height(72);
            Stack.onClick(() => this.handleUploadAvatar());
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.avatarUrl) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.avatarUrl);
                        Image.width(72);
                        Image.height(72);
                        Image.borderRadius(36);
                        Image.objectFit(ImageFit.Cover);
                        Image.border({ width: 2, color: AppColors.primary });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('👤');
                        Text.fontSize(52);
                        Text.width(72);
                        Text.height(72);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📷');
            Text.fontSize(14);
            Text.width(24);
            Text.height(24);
            Text.textAlign(TextAlign.Center);
            Text.backgroundColor(Color.White);
            Text.borderRadius(12);
            Text.shadow({ radius: 2, color: '#20000000' });
            Text.margin({ bottom: 2, right: 2 });
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.name || '用户');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.roles.map(r => getRoleLabel(r)).join(' / '));
            Text.fontSize(13);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        // ── 头像区域 ──
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 信息列表 ──
            Column.create({ space: 8 });
            // ── 信息列表 ──
            Column.width('90%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号
            Row.create({ space: 12 });
            // 手机号
            Row.width('100%');
            // 手机号
            Row.padding(16);
            // 手机号
            Row.backgroundColor(AppColors.card);
            // 手机号
            Row.borderRadius(12);
            // 手机号
            Row.onClick(() => this.goToEdit('phone', this.phone));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📱');
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('手机号');
            Text.fontSize(12);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(maskPhone(this.phone));
            Text.fontSize(15);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.fontSize(16);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 手机号
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 姓名
            Row.create({ space: 12 });
            // 姓名
            Row.width('100%');
            // 姓名
            Row.padding(16);
            // 姓名
            Row.backgroundColor(AppColors.card);
            // 姓名
            Row.borderRadius(12);
            // 姓名
            Row.onClick(() => this.goToEdit('name', this.name));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✏️');
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('姓名');
            Text.fontSize(12);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.name || '未设置');
            Text.fontSize(15);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.fontSize(16);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 姓名
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 所属单位
            Row.create({ space: 12 });
            // 所属单位
            Row.width('100%');
            // 所属单位
            Row.padding(16);
            // 所属单位
            Row.backgroundColor(AppColors.card);
            // 所属单位
            Row.borderRadius(12);
            // 所属单位
            Row.onClick(() => this.goToEdit('unit', this.unit));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🏢');
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('所属单位');
            Text.fontSize(12);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.unit || '未设置');
            Text.fontSize(15);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.fontSize(16);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 所属单位
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码
            Row.create({ space: 12 });
            // 密码
            Row.width('100%');
            // 密码
            Row.padding(16);
            // 密码
            Row.backgroundColor(AppColors.card);
            // 密码
            Row.borderRadius(12);
            // 密码
            Row.onClick(() => this.goToEdit('password', ''));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔒');
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录密码');
            Text.fontSize(12);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('••••••');
            Text.fontSize(15);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.fontSize(16);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        // 密码
        Row.pop();
        // ── 信息列表 ──
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 退出登录 ──
            Button.createWithLabel('退出登录');
            // ── 退出登录 ──
            Button.width('90%');
            // ── 退出登录 ──
            Button.height(48);
            // ── 退出登录 ──
            Button.fontSize(16);
            // ── 退出登录 ──
            Button.fontWeight(FontWeight.Medium);
            // ── 退出登录 ──
            Button.fontColor(AppColors.danger);
            // ── 退出登录 ──
            Button.backgroundColor(AppColors.dangerLight);
            // ── 退出登录 ──
            Button.borderRadius(24);
            // ── 退出登录 ──
            Button.margin({ top: 28, bottom: 30 });
            // ── 退出登录 ──
            Button.onClick(() => this.handleLogout());
        }, Button);
        // ── 退出登录 ──
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.height(16);
        }, Blank);
        Blank.pop();
        Column.pop();
        Scroll.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new BottomNavBar(this, { activeTab: 2 }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ProfilePage.ets", line: 295, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            activeTab: 2
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        activeTab: 2
                    });
                }
            }, { name: "BottomNavBar" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProfilePage";
    }
}
registerNamedRoute(() => new ProfilePage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/ProfilePage", pageFullPath: "entry/src/main/ets/pages/ProfilePage", integratedHsp: "false", moduleType: "followWithHap" });
