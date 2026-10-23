if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CitizenPage_Params {
    sosList?: SOSInfo[];
    sosProgress?: number;
    isPressing?: boolean;
    showSOSForm?: boolean;
    selectedCategory?: EmergencyCategory;
    formName?: string;
    formPhone?: string;
    formBloodType?: string;
    formAddress?: string;
    formNotes?: string;
    formLat?: number;
    formLng?: number;
    formLevel?: EmergencyLevel;
    formImageUrl?: string;
    isUploading?: boolean;
    bloodTypeValues?: string[];
    bloodTypeOptions?: SelectOption[];
    showHistorySheet?: boolean;
    filterIndex?: number;
    statusOptions?: FilterOption[];
    showRoleSwitchDialog?: boolean;
    userRoles?: Role[];
    pressTimer?: number;
    TOTAL_TICKS?: number;
    // 紧急类型：6 种（去掉“通讯中断”）
    categories?: EmergencyCategory[];
}
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { SOSInfo, EmergencyLevel, SOSStatus, EmergencyCategory, getCategoryEmoji } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import { addSOS, getSOSList, getLoggedInPhone, getUserByPhone, setCurrentRole, uploadImage } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { SOSCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/SOSCard";
import { BottomNavBar } from "@bundle:com.xunan.floodrescue/entry/ets/components/BottomNavBar";
import { getCurrentPosition } from "@bundle:com.xunan.floodrescue/entry/ets/utils/LocationUtils";
import { AppColors, STATUS_FILTER_OPTIONS, filterStatusByIndex, getRoleColor, getRoleBgColor, getRoleLabel, getRoleEmoji, getRolePage } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
import type { FilterOption } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
import picker from "@ohos:file.picker";
const PAGE_ROLE = Role.CITIZEN;
class CitizenPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__sosList = new ObservedPropertyObjectPU([], this, "sosList");
        this.__sosProgress = new ObservedPropertySimplePU(0, this, "sosProgress");
        this.__isPressing = new ObservedPropertySimplePU(false, this, "isPressing");
        this.__showSOSForm = new ObservedPropertySimplePU(false, this, "showSOSForm");
        this.__selectedCategory = new ObservedPropertySimplePU(EmergencyCategory.TRAPPED, this, "selectedCategory");
        this.__formName = new ObservedPropertySimplePU('', this, "formName");
        this.__formPhone = new ObservedPropertySimplePU('', this, "formPhone");
        this.__formBloodType = new ObservedPropertySimplePU('未知', this, "formBloodType");
        this.__formAddress = new ObservedPropertySimplePU('', this, "formAddress");
        this.__formNotes = new ObservedPropertySimplePU('', this, "formNotes");
        this.__formLat = new ObservedPropertySimplePU(39.9100, this, "formLat");
        this.__formLng = new ObservedPropertySimplePU(116.4000, this, "formLng");
        this.__formLevel = new ObservedPropertySimplePU(EmergencyLevel.MEDIUM, this, "formLevel");
        this.__formImageUrl = new ObservedPropertySimplePU('', this, "formImageUrl");
        this.__isUploading = new ObservedPropertySimplePU(false, this, "isUploading");
        this.bloodTypeValues = ['A型', 'B型', 'AB型', 'O型', '未知'];
        this.bloodTypeOptions = [
            { value: 'A型' },
            { value: 'B型' },
            { value: 'AB型' },
            { value: 'O型' },
            { value: '未知' }
        ];
        this.__showHistorySheet = new ObservedPropertySimplePU(false, this, "showHistorySheet");
        this.__filterIndex = new ObservedPropertySimplePU(0, this, "filterIndex");
        this.statusOptions = STATUS_FILTER_OPTIONS;
        this.__showRoleSwitchDialog = new ObservedPropertySimplePU(false, this, "showRoleSwitchDialog");
        this.__userRoles = new ObservedPropertyObjectPU([], this, "userRoles");
        this.pressTimer = -1;
        this.TOTAL_TICKS = 30;
        this.categories = [
            EmergencyCategory.TRAPPED,
            EmergencyCategory.NO_MEDICINE,
            EmergencyCategory.NO_WATER,
            EmergencyCategory.NO_FOOD,
            EmergencyCategory.INJURED,
            EmergencyCategory.NEED_WARMTH
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CitizenPage_Params) {
        if (params.sosList !== undefined) {
            this.sosList = params.sosList;
        }
        if (params.sosProgress !== undefined) {
            this.sosProgress = params.sosProgress;
        }
        if (params.isPressing !== undefined) {
            this.isPressing = params.isPressing;
        }
        if (params.showSOSForm !== undefined) {
            this.showSOSForm = params.showSOSForm;
        }
        if (params.selectedCategory !== undefined) {
            this.selectedCategory = params.selectedCategory;
        }
        if (params.formName !== undefined) {
            this.formName = params.formName;
        }
        if (params.formPhone !== undefined) {
            this.formPhone = params.formPhone;
        }
        if (params.formBloodType !== undefined) {
            this.formBloodType = params.formBloodType;
        }
        if (params.formAddress !== undefined) {
            this.formAddress = params.formAddress;
        }
        if (params.formNotes !== undefined) {
            this.formNotes = params.formNotes;
        }
        if (params.formLat !== undefined) {
            this.formLat = params.formLat;
        }
        if (params.formLng !== undefined) {
            this.formLng = params.formLng;
        }
        if (params.formLevel !== undefined) {
            this.formLevel = params.formLevel;
        }
        if (params.formImageUrl !== undefined) {
            this.formImageUrl = params.formImageUrl;
        }
        if (params.isUploading !== undefined) {
            this.isUploading = params.isUploading;
        }
        if (params.bloodTypeValues !== undefined) {
            this.bloodTypeValues = params.bloodTypeValues;
        }
        if (params.bloodTypeOptions !== undefined) {
            this.bloodTypeOptions = params.bloodTypeOptions;
        }
        if (params.showHistorySheet !== undefined) {
            this.showHistorySheet = params.showHistorySheet;
        }
        if (params.filterIndex !== undefined) {
            this.filterIndex = params.filterIndex;
        }
        if (params.statusOptions !== undefined) {
            this.statusOptions = params.statusOptions;
        }
        if (params.showRoleSwitchDialog !== undefined) {
            this.showRoleSwitchDialog = params.showRoleSwitchDialog;
        }
        if (params.userRoles !== undefined) {
            this.userRoles = params.userRoles;
        }
        if (params.pressTimer !== undefined) {
            this.pressTimer = params.pressTimer;
        }
        if (params.TOTAL_TICKS !== undefined) {
            this.TOTAL_TICKS = params.TOTAL_TICKS;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
    }
    updateStateVars(params: CitizenPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sosList.purgeDependencyOnElmtId(rmElmtId);
        this.__sosProgress.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressing.purgeDependencyOnElmtId(rmElmtId);
        this.__showSOSForm.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__formName.purgeDependencyOnElmtId(rmElmtId);
        this.__formPhone.purgeDependencyOnElmtId(rmElmtId);
        this.__formBloodType.purgeDependencyOnElmtId(rmElmtId);
        this.__formAddress.purgeDependencyOnElmtId(rmElmtId);
        this.__formNotes.purgeDependencyOnElmtId(rmElmtId);
        this.__formLat.purgeDependencyOnElmtId(rmElmtId);
        this.__formLng.purgeDependencyOnElmtId(rmElmtId);
        this.__formLevel.purgeDependencyOnElmtId(rmElmtId);
        this.__formImageUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__isUploading.purgeDependencyOnElmtId(rmElmtId);
        this.__showHistorySheet.purgeDependencyOnElmtId(rmElmtId);
        this.__filterIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showRoleSwitchDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__userRoles.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sosList.aboutToBeDeleted();
        this.__sosProgress.aboutToBeDeleted();
        this.__isPressing.aboutToBeDeleted();
        this.__showSOSForm.aboutToBeDeleted();
        this.__selectedCategory.aboutToBeDeleted();
        this.__formName.aboutToBeDeleted();
        this.__formPhone.aboutToBeDeleted();
        this.__formBloodType.aboutToBeDeleted();
        this.__formAddress.aboutToBeDeleted();
        this.__formNotes.aboutToBeDeleted();
        this.__formLat.aboutToBeDeleted();
        this.__formLng.aboutToBeDeleted();
        this.__formLevel.aboutToBeDeleted();
        this.__formImageUrl.aboutToBeDeleted();
        this.__isUploading.aboutToBeDeleted();
        this.__showHistorySheet.aboutToBeDeleted();
        this.__filterIndex.aboutToBeDeleted();
        this.__showRoleSwitchDialog.aboutToBeDeleted();
        this.__userRoles.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __sosList: ObservedPropertyObjectPU<SOSInfo[]>;
    get sosList() {
        return this.__sosList.get();
    }
    set sosList(newValue: SOSInfo[]) {
        this.__sosList.set(newValue);
    }
    private __sosProgress: ObservedPropertySimplePU<number>;
    get sosProgress() {
        return this.__sosProgress.get();
    }
    set sosProgress(newValue: number) {
        this.__sosProgress.set(newValue);
    }
    private __isPressing: ObservedPropertySimplePU<boolean>;
    get isPressing() {
        return this.__isPressing.get();
    }
    set isPressing(newValue: boolean) {
        this.__isPressing.set(newValue);
    }
    private __showSOSForm: ObservedPropertySimplePU<boolean>;
    get showSOSForm() {
        return this.__showSOSForm.get();
    }
    set showSOSForm(newValue: boolean) {
        this.__showSOSForm.set(newValue);
    }
    private __selectedCategory: ObservedPropertySimplePU<EmergencyCategory>;
    get selectedCategory() {
        return this.__selectedCategory.get();
    }
    set selectedCategory(newValue: EmergencyCategory) {
        this.__selectedCategory.set(newValue);
    }
    private __formName: ObservedPropertySimplePU<string>;
    get formName() {
        return this.__formName.get();
    }
    set formName(newValue: string) {
        this.__formName.set(newValue);
    }
    private __formPhone: ObservedPropertySimplePU<string>;
    get formPhone() {
        return this.__formPhone.get();
    }
    set formPhone(newValue: string) {
        this.__formPhone.set(newValue);
    }
    private __formBloodType: ObservedPropertySimplePU<string>;
    get formBloodType() {
        return this.__formBloodType.get();
    }
    set formBloodType(newValue: string) {
        this.__formBloodType.set(newValue);
    }
    private __formAddress: ObservedPropertySimplePU<string>;
    get formAddress() {
        return this.__formAddress.get();
    }
    set formAddress(newValue: string) {
        this.__formAddress.set(newValue);
    }
    private __formNotes: ObservedPropertySimplePU<string>;
    get formNotes() {
        return this.__formNotes.get();
    }
    set formNotes(newValue: string) {
        this.__formNotes.set(newValue);
    }
    private __formLat: ObservedPropertySimplePU<number>;
    get formLat() {
        return this.__formLat.get();
    }
    set formLat(newValue: number) {
        this.__formLat.set(newValue);
    }
    private __formLng: ObservedPropertySimplePU<number>;
    get formLng() {
        return this.__formLng.get();
    }
    set formLng(newValue: number) {
        this.__formLng.set(newValue);
    }
    private __formLevel: ObservedPropertySimplePU<EmergencyLevel>;
    get formLevel() {
        return this.__formLevel.get();
    }
    set formLevel(newValue: EmergencyLevel) {
        this.__formLevel.set(newValue);
    }
    private __formImageUrl: ObservedPropertySimplePU<string>;
    get formImageUrl() {
        return this.__formImageUrl.get();
    }
    set formImageUrl(newValue: string) {
        this.__formImageUrl.set(newValue);
    }
    private __isUploading: ObservedPropertySimplePU<boolean>;
    get isUploading() {
        return this.__isUploading.get();
    }
    set isUploading(newValue: boolean) {
        this.__isUploading.set(newValue);
    }
    private bloodTypeValues: string[];
    private bloodTypeOptions: SelectOption[];
    private __showHistorySheet: ObservedPropertySimplePU<boolean>;
    get showHistorySheet() {
        return this.__showHistorySheet.get();
    }
    set showHistorySheet(newValue: boolean) {
        this.__showHistorySheet.set(newValue);
    }
    private __filterIndex: ObservedPropertySimplePU<number>;
    get filterIndex() {
        return this.__filterIndex.get();
    }
    set filterIndex(newValue: number) {
        this.__filterIndex.set(newValue);
    }
    private statusOptions: FilterOption[];
    private __showRoleSwitchDialog: ObservedPropertySimplePU<boolean>;
    get showRoleSwitchDialog() {
        return this.__showRoleSwitchDialog.get();
    }
    set showRoleSwitchDialog(newValue: boolean) {
        this.__showRoleSwitchDialog.set(newValue);
    }
    private __userRoles: ObservedPropertyObjectPU<Role[]>;
    get userRoles() {
        return this.__userRoles.get();
    }
    set userRoles(newValue: Role[]) {
        this.__userRoles.set(newValue);
    }
    private pressTimer: number;
    private TOTAL_TICKS: number;
    // 紧急类型：6 种（去掉“通讯中断”）
    private categories: EmergencyCategory[];
    aboutToAppear() {
        this.refresh();
        this.loadUserInfo();
        this.loadUserRoles();
    }
    onPageShow() {
        this.refresh();
        let pickedLat = AppStorage.get('pickedLat') as number;
        let pickedLng = AppStorage.get('pickedLng') as number;
        let pickedAddr = AppStorage.get('pickedAddress') as string;
        if (pickedLat !== undefined && pickedLng !== undefined) {
            this.formLat = pickedLat;
            this.formLng = pickedLng;
            this.formAddress = pickedAddr || `纬度 ${this.formLat.toFixed(4)}, 经度 ${this.formLng.toFixed(4)}`;
            AppStorage.set('pickedLat', undefined);
            AppStorage.set('pickedLng', undefined);
            AppStorage.set('pickedAddress', undefined);
            this.showSOSForm = true;
        }
    }
    async refresh() {
        this.sosList = await getSOSList();
    }
    getFilteredList(): SOSInfo[] {
        let f = filterStatusByIndex(this.filterIndex);
        if (f === null) {
            return this.sosList;
        }
        return this.sosList.filter((s: SOSInfo) => s.status === f);
    }
    loadUserInfo() {
        let phone = getLoggedInPhone();
        if (phone) {
            getUserByPhone(phone).then((user) => {
                if (user) {
                    this.formName = user.name || '';
                    this.formPhone = user.phone || '';
                }
            });
        }
    }
    async loadUserRoles() {
        let phone = getLoggedInPhone();
        if (phone) {
            let user = await getUserByPhone(phone);
            if (user) {
                this.userRoles = user.roles;
            }
        }
    }
    openRoleSwitchDialog() {
        if (this.userRoles.length <= 1) {
            promptAction.showToast({ message: '暂无其他身份可切换' });
            return;
        }
        this.showRoleSwitchDialog = true;
    }
    switchToRole(role: Role) {
        this.showRoleSwitchDialog = false;
        if (role === PAGE_ROLE)
            return;
        setCurrentRole(role);
        AppStorage.setOrCreate('autoEnteredPage', true);
        router.replaceUrl({ url: getRolePage(role) });
    }
    handleTouchDown() {
        this.isPressing = true;
        this.sosProgress = 0;
        clearInterval(this.pressTimer);
        this.pressTimer = setInterval(() => {
            this.sosProgress += (100 / this.TOTAL_TICKS);
            if (this.sosProgress >= 100) {
                this.sosProgress = 100;
                clearInterval(this.pressTimer);
                this.isPressing = false;
                this.loadUserInfo();
                this.selectedCategory = EmergencyCategory.TRAPPED;
                this.formBloodType = '未知';
                this.formAddress = '';
                this.formNotes = '';
                this.formLevel = EmergencyLevel.MEDIUM;
                this.formImageUrl = '';
                this.formLat = 39.9100;
                this.formLng = 116.4000;
                this.showSOSForm = true;
                this.fetchAndFillLocation();
            }
        }, 100);
    }
    async fetchAndFillLocation() {
        let ctx = getContext(this) as common.UIAbilityContext;
        let pos = await getCurrentPosition(ctx);
        this.formLat = pos.latitude;
        this.formLng = pos.longitude;
        if (pos.address) {
            this.formAddress = pos.address;
        }
    }
    handleTouchUp() {
        clearInterval(this.pressTimer);
        if (this.sosProgress < 100) {
            this.sosProgress = 0;
        }
        this.isPressing = false;
    }
    openMapPicker() {
        this.showSOSForm = false;
        AppStorage.setOrCreate('mapPickerMode', true);
        router.pushUrl({ url: 'pages/MapPage' });
    }
    async submitSOS() {
        let id = Date.now().toString();
        let now = new Date().toLocaleString();
        let description = `${this.selectedCategory}：${this.formNotes || '紧急求救'}`;
        let sos = new SOSInfo(id, this.formName || '匿名', this.formPhone || '无', this.formBloodType || '未知', this.formLat, this.formLng, this.formAddress || '当前定位位置', description, this.formLevel, SOSStatus.PENDING, now, '', '', this.selectedCategory, this.formNotes, this.formImageUrl);
        await addSOS(sos);
        this.showSOSForm = false;
        this.refresh();
    }
    async selectAndUploadImage() {
        try {
            let photoSelectOptions = new picker.PhotoSelectOptions();
            photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
            photoSelectOptions.maxSelectNumber = 1;
            let photoPicker = new picker.PhotoViewPicker();
            let result = await photoPicker.select(photoSelectOptions);
            if (result.photoUris && result.photoUris.length > 0) {
                let uri = result.photoUris[0];
                this.isUploading = true;
                let ctx = getContext(this) as common.UIAbilityContext;
                let url = await uploadImage(ctx, uri);
                this.isUploading = false;
                if (url) {
                    this.formImageUrl = url;
                    promptAction.showToast({ message: '上传成功', duration: 2000 });
                }
                else {
                    promptAction.showToast({ message: '上传失败', duration: 2000 });
                }
            }
        }
        catch (err) {
            this.isUploading = false;
            console.error('选择或上传图片失败:', JSON.stringify(err));
            promptAction.showToast({ message: '操作失败', duration: 2000 });
        }
    }
    // 6 种紧急类型的描述文案
    getCategoryDesc(category: EmergencyCategory): string {
        switch (category) {
            case EmergencyCategory.TRAPPED: return '人员被困/无法移动';
            case EmergencyCategory.NO_MEDICINE: return '急需药品/医疗物资';
            case EmergencyCategory.NO_WATER: return '饮用水短缺';
            case EmergencyCategory.NO_FOOD: return '食品短缺';
            case EmergencyCategory.INJURED: return '有人受伤/需医疗急救';
            case EmergencyCategory.NEED_WARMTH: return '失温/缺少保暖物资';
            default: return '';
        }
    }
    HistorySheetBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 16, right: 16, top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的求救记录');
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
            Text.width('100%');
            Text.padding({ top: 8, bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`共 ${this.getFilteredList().length} 条`);
            Text.fontSize(12);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create(this.statusOptions);
            Select.selected(this.filterIndex);
            Select.onSelect((index: number) => { this.filterIndex = index; });
            Select.width(110);
            Select.height(30);
            Select.font({ size: 12 });
            Select.backgroundColor(AppColors.card);
            Select.borderRadius(15);
        }, Select);
        Select.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getFilteredList().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📭');
                        Text.fontSize(40);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无求救记录');
                        Text.fontSize(14);
                        Text.fontColor(AppColors.textTertiary);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 12 });
                        List.width('100%');
                        List.layoutWeight(1);
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new SOSCard(this, { sos: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CitizenPage.ets", line: 277, col: 15 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        sos: item
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    sos: item
                                                });
                                            }
                                        }, { name: "SOSCard" });
                                    }
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.getFilteredList(), forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
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
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.bg);
            Column.bindSheet({ value: this.showHistorySheet, changeEvent: newValue => { this.showHistorySheet = newValue; } }, { builder: () => {
                    this.HistorySheetBuilder.call(this);
                } }, {
                height: SheetSize.MEDIUM,
                dragBar: true,
                backgroundColor: AppColors.bg,
                onDisappear: () => { this.showHistorySheet = false; }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 顶部栏 ──
            Row.create();
            // ── 顶部栏 ──
            Row.width('100%');
            // ── 顶部栏 ──
            Row.height(56);
            // ── 顶部栏 ──
            Row.alignItems(VerticalAlign.Center);
            // ── 顶部栏 ──
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('切换身份');
            Button.fontSize(11);
            Button.height(28);
            Button.padding({ left: 10, right: 10 });
            Button.backgroundColor(AppColors.primaryLight);
            Button.fontColor(AppColors.primary);
            Button.borderRadius(14);
            Button.onClick(() => this.openRoleSwitchDialog());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('群众求救端');
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
        // ── 顶部栏 ──
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ── 中间 SOS 按钮区 ──
            Column.create();
            // ── 中间 SOS 按钮区 ──
            Column.width('100%');
            // ── 中间 SOS 按钮区 ──
            Column.layoutWeight(1);
            // ── 中间 SOS 按钮区 ──
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('紧急情况请长按下方按钮');
            Text.fontSize(13);
            Text.fontColor(AppColors.textTertiary);
            Text.margin({ bottom: 24 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(220);
            Stack.height(220);
            Stack.alignContent(Alignment.Center);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPressing || this.sosProgress > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(200);
                        Circle.height(200);
                        Circle.fill('rgba(232,64,38,0.08)');
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.width(200);
                        Circle.height(200);
                        Circle.fill('none');
                        Circle.stroke('rgba(232,64,38,0.2)');
                        Circle.strokeWidth(6);
                    }, Circle);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            globalThis.Context.animation({ duration: 200 });
            Column.width(180);
            Column.height(180);
            Column.borderRadius(90);
            Column.backgroundColor(this.isPressing ? '#C9341E' : AppColors.danger);
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.shadow({ radius: this.isPressing ? 8 : 20, color: 'rgba(232,64,38,0.35)' });
            Column.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.handleTouchDown();
                }
                else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.handleTouchUp();
                }
            });
            Column.scale({ x: this.isPressing ? 0.96 : 1.0, y: this.isPressing ? 0.96 : 1.0 });
            globalThis.Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('SOS');
            Text.fontSize(48);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isPressing ? '请按住...' : '长按求救');
            Text.fontSize(16);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPressing && this.sosProgress > 0 && this.sosProgress < 100) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Progress.create({ value: this.sosProgress, total: 100, type: ProgressType.Linear });
                        Progress.width('70%');
                        Progress.height(4);
                        Progress.color(Color.White);
                        Progress.backgroundColor('rgba(255,255,255,0.3)');
                    }, Progress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPressing && this.sosProgress < 100) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠️ 请持续按住3秒，松手将取消');
                        Text.fontSize(12);
                        Text.fontColor(AppColors.danger);
                        Text.margin({ top: 12 });
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
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('📋 我的求救记录');
            Button.width(180);
            Button.height(40);
            Button.fontSize(14);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor(AppColors.primary);
            Button.backgroundColor(AppColors.primaryLight);
            Button.borderRadius(20);
            Button.margin({ bottom: 20 });
            Button.onClick(() => { this.showHistorySheet = true; });
        }, Button);
        Button.pop();
        // ── 中间 SOS 按钮区 ──
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new BottomNavBar(this, { activeTab: 0 }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CitizenPage.ets", line: 409, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            activeTab: 0
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        activeTab: 0
                    });
                }
            }, { name: "BottomNavBar" });
        }
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ========== 求救表单 ==========
            if (this.showSOSForm) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor(AppColors.bg);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ left: 8, right: 8, top: 8, bottom: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(15);
                        Button.fontColor(AppColors.textSecondary);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => { this.showSOSForm = false; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('紧急求救');
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
                        Button.createWithLabel('取消');
                        Button.fontSize(15);
                        Button.fontColor(Color.Transparent);
                        Button.backgroundColor(Color.Transparent);
                    }, Button);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 0 });
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 紧急类型（6 种，三列两行）──
                        Column.create({ space: 12 });
                        // ── 紧急类型（6 种，三列两行）──
                        Column.width('100%');
                        // ── 紧急类型（6 种，三列两行）──
                        Column.padding(16);
                        // ── 紧急类型（6 种，三列两行）──
                        Column.margin({ top: 4, left: 12, right: 12 });
                        // ── 紧急类型（6 种，三列两行）──
                        Column.backgroundColor(AppColors.card);
                        // ── 紧急类型（6 种，三列两行）──
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择紧急类型');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(AppColors.textPrimary);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceBetween });
                        Flex.width('100%');
                    }, Flex);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const cat = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 4 });
                                Column.width('31%');
                                Column.padding({ top: 12, bottom: 10 });
                                Column.margin({ bottom: 8 });
                                Column.backgroundColor(this.selectedCategory === cat ? AppColors.dangerLight : AppColors.bgSecondary);
                                Column.borderRadius(12);
                                Column.border({
                                    width: this.selectedCategory === cat ? 1.5 : 0,
                                    color: this.selectedCategory === cat ? AppColors.danger : Color.Transparent
                                });
                                Column.alignItems(HorizontalAlign.Center);
                                Column.onClick(() => { this.selectedCategory = cat; });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getCategoryEmoji(cat));
                                Text.fontSize(22);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat);
                                Text.fontSize(12);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor(this.selectedCategory === cat ? AppColors.danger : AppColors.textSecondary);
                            }, Text);
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, (cat: EmergencyCategory) => cat, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Flex.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCategoryDesc(this.selectedCategory));
                        Text.fontSize(12);
                        Text.fontColor(AppColors.danger);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    // ── 紧急类型（6 种，三列两行）──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 个人信息（含血型）──
                        Column.create({ space: 10 });
                        // ── 个人信息（含血型）──
                        Column.width('100%');
                        // ── 个人信息（含血型）──
                        Column.padding(16);
                        // ── 个人信息（含血型）──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 个人信息（含血型）──
                        Column.backgroundColor(AppColors.card);
                        // ── 个人信息（含血型）──
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('个人信息');
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textTertiary);
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('姓名');
                        Text.fontSize(12);
                        Text.fontColor(AppColors.textTertiary);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入姓名', text: this.formName });
                        TextInput.layoutWeight(1);
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.backgroundColor(AppColors.bgSecondary);
                        TextInput.borderRadius(10);
                        TextInput.onChange((value: string) => { this.formName = value; });
                    }, TextInput);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('电话');
                        Text.fontSize(12);
                        Text.fontColor(AppColors.textTertiary);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入联系电话', text: this.formPhone });
                        TextInput.layoutWeight(1);
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.type(InputType.Number);
                        TextInput.maxLength(11);
                        TextInput.backgroundColor(AppColors.bgSecondary);
                        TextInput.borderRadius(10);
                        TextInput.onChange((value: string) => { this.formPhone = value; });
                    }, TextInput);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 血型下拉行
                        Row.create({ space: 10 });
                        // 血型下拉行
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('血型');
                        Text.fontSize(12);
                        Text.fontColor(AppColors.textTertiary);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.bloodTypeOptions);
                        Select.selected(this.bloodTypeValues.indexOf(this.formBloodType));
                        Select.value(this.formBloodType);
                        Select.font({ size: 14 });
                        Select.fontColor(AppColors.textPrimary);
                        Select.selectedOptionFont({ size: 14 });
                        Select.optionFont({ size: 14 });
                        Select.layoutWeight(1);
                        Select.height(40);
                        Select.backgroundColor(AppColors.bgSecondary);
                        Select.borderRadius(10);
                        Select.onSelect((index: number, value?: string) => {
                            this.formBloodType = this.bloodTypeValues[index] || this.formBloodType;
                        });
                    }, Select);
                    Select.pop();
                    // 血型下拉行
                    Row.pop();
                    // ── 个人信息（含血型）──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 位置 ──
                        Column.create({ space: 10 });
                        // ── 位置 ──
                        Column.width('100%');
                        // ── 位置 ──
                        Column.padding(16);
                        // ── 位置 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 位置 ──
                        Column.backgroundColor(AppColors.card);
                        // ── 位置 ──
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('具体位置');
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textTertiary);
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '手动输入地址', text: this.formAddress });
                        TextInput.width('100%');
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.backgroundColor(AppColors.bgSecondary);
                        TextInput.borderRadius(10);
                        TextInput.onChange((value: string) => { this.formAddress = value; });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('📍 从地图选取当前位置');
                        Button.width('100%');
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor(AppColors.primary);
                        Button.backgroundColor(AppColors.primaryLight);
                        Button.borderRadius(20);
                        Button.onClick(() => this.openMapPicker());
                    }, Button);
                    Button.pop();
                    // ── 位置 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 紧急程度 ──
                        Column.create({ space: 10 });
                        // ── 紧急程度 ──
                        Column.width('100%');
                        // ── 紧急程度 ──
                        Column.padding(16);
                        // ── 紧急程度 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 紧急程度 ──
                        Column.backgroundColor(AppColors.card);
                        // ── 紧急程度 ──
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('紧急程度');
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textTertiary);
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('一般');
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.fontSize(13);
                        Button.fontWeight(FontWeight.Medium);
                        Button.backgroundColor(this.formLevel === EmergencyLevel.LOW ? AppColors.success : AppColors.bgSecondary);
                        Button.fontColor(this.formLevel === EmergencyLevel.LOW ? Color.White : AppColors.textSecondary);
                        Button.borderRadius(18);
                        Button.onClick(() => { this.formLevel = EmergencyLevel.LOW; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('紧急');
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.fontSize(13);
                        Button.fontWeight(FontWeight.Medium);
                        Button.backgroundColor(this.formLevel === EmergencyLevel.MEDIUM ? AppColors.warning : AppColors.bgSecondary);
                        Button.fontColor(this.formLevel === EmergencyLevel.MEDIUM ? Color.White : AppColors.textSecondary);
                        Button.borderRadius(18);
                        Button.onClick(() => { this.formLevel = EmergencyLevel.MEDIUM; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('特急');
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.fontSize(13);
                        Button.fontWeight(FontWeight.Medium);
                        Button.backgroundColor(this.formLevel === EmergencyLevel.HIGH ? AppColors.danger : AppColors.bgSecondary);
                        Button.fontColor(this.formLevel === EmergencyLevel.HIGH ? Color.White : AppColors.textSecondary);
                        Button.borderRadius(18);
                        Button.onClick(() => { this.formLevel = EmergencyLevel.HIGH; });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    // ── 紧急程度 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 补充说明 ──
                        Column.create({ space: 10 });
                        // ── 补充说明 ──
                        Column.width('100%');
                        // ── 补充说明 ──
                        Column.padding(16);
                        // ── 补充说明 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 补充说明 ──
                        Column.backgroundColor(AppColors.card);
                        // ── 补充说明 ──
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('补充说明');
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textTertiary);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('（选填）');
                        Text.fontSize(11);
                        Text.fontColor(AppColors.textTertiary);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ placeholder: '请描述详细情况，如人数、伤情、具体需求等…', text: this.formNotes });
                        TextArea.width('100%');
                        TextArea.height(80);
                        TextArea.fontSize(14);
                        TextArea.backgroundColor(AppColors.bgSecondary);
                        TextArea.borderRadius(10);
                        TextArea.padding(10);
                        TextArea.onChange((value: string) => { this.formNotes = value; });
                    }, TextArea);
                    // ── 补充说明 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 现场照片 ──
                        Column.create({ space: 10 });
                        // ── 现场照片 ──
                        Column.width('100%');
                        // ── 现场照片 ──
                        Column.padding(16);
                        // ── 现场照片 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 现场照片 ──
                        Column.backgroundColor(AppColors.card);
                        // ── 现场照片 ──
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('现场照片');
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textTertiary);
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.formImageUrl) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create({ space: 8 });
                                    Column.width('100%');
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.formImageUrl);
                                    Image.width('100%');
                                    Image.height(180);
                                    Image.objectFit(ImageFit.Cover);
                                    Image.borderRadius(12);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('重新上传');
                                    Button.width('100%');
                                    Button.height(36);
                                    Button.fontSize(13);
                                    Button.fontColor(AppColors.primary);
                                    Button.backgroundColor(AppColors.primaryLight);
                                    Button.borderRadius(18);
                                    Button.enabled(!this.isUploading);
                                    Button.onClick(() => this.selectAndUploadImage());
                                }, Button);
                                Button.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel(this.isUploading ? '上传中...' : '📷 上传现场照片');
                                    Button.width('100%');
                                    Button.height(48);
                                    Button.fontSize(14);
                                    Button.fontColor(AppColors.primary);
                                    Button.backgroundColor(AppColors.primaryLight);
                                    Button.borderRadius(24);
                                    Button.enabled(!this.isUploading);
                                    Button.onClick(() => this.selectAndUploadImage());
                                }, Button);
                                Button.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    // ── 现场照片 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确认求救');
                        Button.width('92%');
                        Button.height(48);
                        Button.fontSize(17);
                        Button.fontWeight(FontWeight.Bold);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(AppColors.danger);
                        Button.borderRadius(24);
                        Button.margin({ top: 20, bottom: 30 });
                        Button.shadow({ radius: 8, color: 'rgba(232,64,38,0.3)' });
                        Button.onClick(() => this.submitSOS());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.height(16);
                    }, Blank);
                    Blank.pop();
                    Column.pop();
                    Scroll.pop();
                    Column.pop();
                });
            }
            // ========== 身份切换弹窗 ==========
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ========== 身份切换弹窗 ==========
            if (this.showRoleSwitchDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.End);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.onClick(() => { this.showRoleSwitchDialog = false; });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 16 });
                        Column.width('100%');
                        Column.padding(20);
                        Column.backgroundColor(AppColors.card);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('切换身份');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.textPrimary);
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const role = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 10 });
                                Row.width('100%');
                                Row.padding(14);
                                Row.backgroundColor(role === PAGE_ROLE ? getRoleBgColor(role) : AppColors.bgSecondary);
                                Row.borderRadius(12);
                                Row.border({
                                    width: role === PAGE_ROLE ? 1.5 : 0,
                                    color: role === PAGE_ROLE ? getRoleColor(role) : Color.Transparent
                                });
                                Row.onClick(() => this.switchToRole(role));
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleEmoji(role));
                                Text.fontSize(22);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getRoleLabel(role));
                                Text.fontSize(15);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor(getRoleColor(role));
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Blank.create();
                            }, Blank);
                            Blank.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (role === PAGE_ROLE) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('当前');
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
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.userRoles, forEachItemGenFunction, (role: Role) => role, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.width('100%');
                        Button.height(44);
                        Button.fontSize(15);
                        Button.backgroundColor(AppColors.bgSecondary);
                        Button.fontColor(AppColors.textSecondary);
                        Button.borderRadius(22);
                        Button.onClick(() => { this.showRoleSwitchDialog = false; });
                    }, Button);
                    Button.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CitizenPage";
    }
}
registerNamedRoute(() => new CitizenPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/CitizenPage", pageFullPath: "entry/src/main/ets/pages/CitizenPage", integratedHsp: "false", moduleType: "followWithHap" });
