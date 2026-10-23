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
    formAddress?: string;
    formNotes?: string;
    formLat?: number;
    formLng?: number;
    formLevel?: EmergencyLevel;
    pressTimer?: number;
    TOTAL_TICKS?: number;
    categories?: EmergencyCategory[];
}
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import { SOSInfo, EmergencyLevel, SOSStatus, EmergencyCategory, getCategoryEmoji } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { addSOS, getSOSList, getLoggedInPhone, getUserByPhone } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { SOSCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/SOSCard";
import { getCurrentPosition } from "@bundle:com.xunan.floodrescue/entry/ets/utils/LocationUtils";
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
        this.__formAddress = new ObservedPropertySimplePU('', this, "formAddress");
        this.__formNotes = new ObservedPropertySimplePU('', this, "formNotes");
        this.__formLat = new ObservedPropertySimplePU(39.9100, this, "formLat");
        this.__formLng = new ObservedPropertySimplePU(116.4000, this, "formLng");
        this.__formLevel = new ObservedPropertySimplePU(EmergencyLevel.MEDIUM, this, "formLevel");
        this.pressTimer = -1;
        this.TOTAL_TICKS = 30;
        this.categories = [
            EmergencyCategory.TRAPPED, EmergencyCategory.NO_MEDICINE,
            EmergencyCategory.NO_WATER, EmergencyCategory.NO_FOOD
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
        this.__formAddress.purgeDependencyOnElmtId(rmElmtId);
        this.__formNotes.purgeDependencyOnElmtId(rmElmtId);
        this.__formLat.purgeDependencyOnElmtId(rmElmtId);
        this.__formLng.purgeDependencyOnElmtId(rmElmtId);
        this.__formLevel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sosList.aboutToBeDeleted();
        this.__sosProgress.aboutToBeDeleted();
        this.__isPressing.aboutToBeDeleted();
        this.__showSOSForm.aboutToBeDeleted();
        this.__selectedCategory.aboutToBeDeleted();
        this.__formName.aboutToBeDeleted();
        this.__formPhone.aboutToBeDeleted();
        this.__formAddress.aboutToBeDeleted();
        this.__formNotes.aboutToBeDeleted();
        this.__formLat.aboutToBeDeleted();
        this.__formLng.aboutToBeDeleted();
        this.__formLevel.aboutToBeDeleted();
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
    // 长按进度
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
    // 求救表单显隐
    private __showSOSForm: ObservedPropertySimplePU<boolean>;
    get showSOSForm() {
        return this.__showSOSForm.get();
    }
    set showSOSForm(newValue: boolean) {
        this.__showSOSForm.set(newValue);
    }
    // 选中的紧急类型
    private __selectedCategory: ObservedPropertySimplePU<EmergencyCategory>;
    get selectedCategory() {
        return this.__selectedCategory.get();
    }
    set selectedCategory(newValue: EmergencyCategory) {
        this.__selectedCategory.set(newValue);
    }
    // 表单字段
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
    private pressTimer: number;
    private TOTAL_TICKS: number;
    private categories: EmergencyCategory[];
    aboutToAppear() {
        this.refresh();
        this.loadUserInfo();
    }
    onPageShow() {
        this.refresh();
        // 检查是否从地图选址返回
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
    // ========== 长按处理 ==========
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
                // 重置表单并打开
                this.loadUserInfo();
                this.selectedCategory = EmergencyCategory.TRAPPED;
                this.formAddress = '';
                this.formNotes = '';
                this.formLevel = EmergencyLevel.MEDIUM;
                this.formLat = 39.9100;
                this.formLng = 116.4000;
                this.showSOSForm = true;
                // 异步获取真实位置
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
    // ========== 地图选点 ==========
    openMapPicker() {
        this.showSOSForm = false;
        AppStorage.setOrCreate('mapPickerMode', true);
        router.pushUrl({ url: 'pages/MapPage' });
    }
    // ========== 提交求救 ==========
    async submitSOS() {
        let id = Date.now().toString();
        let now = new Date().toLocaleString();
        let description = `${this.selectedCategory}：${this.formNotes || '紧急求救'}`;
        let sos = new SOSInfo(id, this.formName || '匿名', this.formPhone || '无', this.formLat, this.formLng, this.formAddress || '当前定位位置', description, this.formLevel, SOSStatus.PENDING, now, '', '', this.selectedCategory, this.formNotes);
        await addSOS(sos);
        this.showSOSForm = false;
        this.refresh();
    }
    // ========== 类别描述 ==========
    getCategoryDesc(category: EmergencyCategory): string {
        switch (category) {
            case EmergencyCategory.TRAPPED:
                return '人员被困/无法移动';
            case EmergencyCategory.NO_MEDICINE:
                return '急需药品/医疗物资';
            case EmergencyCategory.NO_WATER:
                return '饮用水短缺';
            case EmergencyCategory.NO_FOOD:
                return '食品短缺';
            default:
                return '';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/CitizenPage.ets(168:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ========== 主页面 ==========
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(170:7)", "entry");
            // ========== 主页面 ==========
            Column.width('100%');
            // ========== 主页面 ==========
            Column.height('100%');
            // ========== 主页面 ==========
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(172:9)", "entry");
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 标题栏
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('群众求救端');
            Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(173:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(176:11)", "entry");
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 长按求救按钮区
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(184:9)", "entry");
            // 长按求救按钮区
            Column.width('100%');
            // 长按求救按钮区
            Column.alignItems(HorizontalAlign.Center);
            // 长按求救按钮区
            Column.margin({ top: 20, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('紧急情况请长按下方按钮');
            Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(185:11)", "entry");
            Text.fontSize(13);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/CitizenPage.ets(189:11)", "entry");
            Stack.width(140);
            Stack.height(140);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPressing || this.sosProgress > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.debugLine("entry/src/main/ets/pages/CitizenPage.ets(191:15)", "entry");
                        Circle.width(140);
                        Circle.height(140);
                        Circle.fill('rgba(255,77,79,0.08)');
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.debugLine("entry/src/main/ets/pages/CitizenPage.ets(194:15)", "entry");
                        Circle.width(140);
                        Circle.height(140);
                        Circle.fill('none');
                        Circle.stroke('rgba(255,77,79,0.2)');
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
            If.create();
            if (this.isPressing && this.sosProgress > 0 && this.sosProgress < 100) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${Math.ceil(this.sosProgress / 100 * 3)}秒`);
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(202:15)", "entry");
                        Text.fontSize(14);
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
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(207:13)", "entry");
            globalThis.Context.animation({ duration: 200 });
            Column.width(120);
            Column.height(120);
            Column.borderRadius(60);
            Column.backgroundColor(this.isPressing ? '#D9363E' : '#FF4D4F');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.shadow({ radius: this.isPressing ? 8 : 16, color: 'rgba(255,77,79,0.4)' });
            Column.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.handleTouchDown();
                }
                else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.handleTouchUp();
                }
            });
            globalThis.Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🆘');
            Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(208:15)", "entry");
            Text.fontSize(36);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isPressing ? '请按住...' : '长按求救');
            Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(210:15)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPressing && this.sosProgress > 0 && this.sosProgress < 100) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Progress.create({ value: this.sosProgress, total: 100, type: ProgressType.Linear });
                        Progress.debugLine("entry/src/main/ets/pages/CitizenPage.ets(215:17)", "entry");
                        Progress.width('80%');
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
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(239:13)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#FF4D4F');
                        Text.margin({ top: 4 });
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
        // 长按求救按钮区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(250:9)", "entry");
            // 分隔
            Row.width('90%');
            // 分隔
            Row.height(1);
            // 分隔
            Row.backgroundColor('#E8E8E8');
            // 分隔
            Row.margin({ top: 8, bottom: 4 });
        }, Row);
        // 分隔
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 记录标题
            Text.create('我的求救记录');
            Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(256:9)", "entry");
            // 记录标题
            Text.fontSize(16);
            // 记录标题
            Text.fontWeight(FontWeight.Bold);
            // 记录标题
            Text.width('90%');
            // 记录标题
            Text.margin({ top: 16, bottom: 12 });
        }, Text);
        // 记录标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sosList.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无求救记录');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(263:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.margin({ top: 20 });
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
            List.create({ space: 12 });
            List.debugLine("entry/src/main/ets/pages/CitizenPage.ets(269:9)", "entry");
            List.width('90%');
            List.layoutWeight(1);
            List.padding({ bottom: 16 });
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
                        ListItem.debugLine("entry/src/main/ets/pages/CitizenPage.ets(271:13)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new SOSCard(this, { sos: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CitizenPage.ets", line: 272, col: 15 });
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
            this.forEachUpdateFunction(elmtId, this.sosList, forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        // ========== 主页面 ==========
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ========== 求救表单（全屏覆盖，单页设计） ==========
            if (this.showSOSForm) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(285:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#F0F2F5');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部导航栏
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(287:11)", "entry");
                        // 顶部导航栏
                        Row.width('100%');
                        // 顶部导航栏
                        Row.padding({ left: 8, right: 8, top: 8, bottom: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(288:13)", "entry");
                        Button.fontSize(15);
                        Button.fontColor('#666');
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => { this.showSOSForm = false; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CitizenPage.ets(293:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('紧急求救');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(294:13)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CitizenPage.ets(297:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(298:13)", "entry");
                        Button.fontSize(15);
                        Button.fontColor(Color.Transparent);
                        Button.backgroundColor(Color.Transparent);
                    }, Button);
                    Button.pop();
                    // 顶部导航栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 可滚动表单内容
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/CitizenPage.ets(307:11)", "entry");
                        // 可滚动表单内容
                        Scroll.layoutWeight(1);
                        // 可滚动表单内容
                        Scroll.scrollBar(BarState.Off);
                        // 可滚动表单内容
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 0 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(308:13)", "entry");
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 紧急类型选择 ──
                        Column.create({ space: 12 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(311:15)", "entry");
                        // ── 紧急类型选择 ──
                        Column.width('100%');
                        // ── 紧急类型选择 ──
                        Column.padding(16);
                        // ── 紧急类型选择 ──
                        Column.margin({ top: 4, left: 12, right: 12 });
                        // ── 紧急类型选择 ──
                        Column.backgroundColor(Color.White);
                        // ── 紧急类型选择 ──
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择紧急类型');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(312:17)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#333');
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(318:17)", "entry");
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const cat = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 4 });
                                Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(322:23)", "entry");
                                Column.width('22%');
                                Column.padding({ top: 12, bottom: 10 });
                                Column.backgroundColor(this.selectedCategory === cat ? '#FFF1F0' : '#F5F5F5');
                                Column.borderRadius(10);
                                Column.border({
                                    width: this.selectedCategory === cat ? 1.5 : 0,
                                    color: this.selectedCategory === cat ? '#FF4D4F' : Color.Transparent
                                });
                                Column.alignItems(HorizontalAlign.Center);
                                Column.onClick(() => { this.selectedCategory = cat; });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(getCategoryEmoji(cat));
                                Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(323:25)", "entry");
                                Text.fontSize(22);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat);
                                Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(325:25)", "entry");
                                Text.fontSize(12);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor(this.selectedCategory === cat ? '#FF4D4F' : '#666');
                            }, Text);
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, (cat: EmergencyCategory) => cat, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 选中类型提示
                        Text.create(this.getCategoryDesc(this.selectedCategory));
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(348:17)", "entry");
                        // 选中类型提示
                        Text.fontSize(12);
                        // 选中类型提示
                        Text.fontColor('#FF4D4F');
                        // 选中类型提示
                        Text.width('100%');
                    }, Text);
                    // 选中类型提示
                    Text.pop();
                    // ── 紧急类型选择 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 个人信息 ──
                        Column.create({ space: 10 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(360:15)", "entry");
                        // ── 个人信息 ──
                        Column.width('100%');
                        // ── 个人信息 ──
                        Column.padding(16);
                        // ── 个人信息 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 个人信息 ──
                        Column.backgroundColor(Color.White);
                        // ── 个人信息 ──
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('个人信息');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(361:17)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#999');
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(367:17)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(368:19)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('姓名');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(369:21)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入姓名', text: this.formName });
                        TextInput.debugLine("entry/src/main/ets/pages/CitizenPage.ets(373:19)", "entry");
                        TextInput.layoutWeight(1);
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.backgroundColor('#F7F8FA');
                        TextInput.borderRadius(8);
                        TextInput.onChange((value: string) => { this.formName = value; });
                    }, TextInput);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(383:17)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(384:19)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('电话');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(385:21)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入联系电话', text: this.formPhone });
                        TextInput.debugLine("entry/src/main/ets/pages/CitizenPage.ets(389:19)", "entry");
                        TextInput.layoutWeight(1);
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.type(InputType.Number);
                        TextInput.maxLength(11);
                        TextInput.backgroundColor('#F7F8FA');
                        TextInput.borderRadius(8);
                        TextInput.onChange((value: string) => { this.formPhone = value; });
                    }, TextInput);
                    Row.pop();
                    // ── 个人信息 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 位置 ──
                        Column.create({ space: 10 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(408:15)", "entry");
                        // ── 位置 ──
                        Column.width('100%');
                        // ── 位置 ──
                        Column.padding(16);
                        // ── 位置 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 位置 ──
                        Column.backgroundColor(Color.White);
                        // ── 位置 ──
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('具体位置');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(409:17)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#999');
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '手动输入地址', text: this.formAddress });
                        TextInput.debugLine("entry/src/main/ets/pages/CitizenPage.ets(415:17)", "entry");
                        TextInput.width('100%');
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.backgroundColor('#F7F8FA');
                        TextInput.borderRadius(8);
                        TextInput.onChange((value: string) => { this.formAddress = value; });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('📍 从地图选取当前位置');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(423:17)", "entry");
                        Button.width('100%');
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor('#1890FF');
                        Button.backgroundColor('#E6F7FF');
                        Button.borderRadius(8);
                        Button.onClick(() => this.openMapPicker());
                    }, Button);
                    Button.pop();
                    // ── 位置 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 紧急程度 ──
                        Column.create({ space: 10 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(439:15)", "entry");
                        // ── 紧急程度 ──
                        Column.width('100%');
                        // ── 紧急程度 ──
                        Column.padding(16);
                        // ── 紧急程度 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 紧急程度 ──
                        Column.backgroundColor(Color.White);
                        // ── 紧急程度 ──
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('紧急程度');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(440:17)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#999');
                        Text.fontWeight(FontWeight.Medium);
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(446:17)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('一般');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(447:19)", "entry");
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.fontSize(13);
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor(this.formLevel === EmergencyLevel.LOW ? '#52C41A' : '#F5F5F5');
                        Button.fontColor(this.formLevel === EmergencyLevel.LOW ? Color.White : '#666');
                        Button.onClick(() => { this.formLevel = EmergencyLevel.LOW; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('紧急');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(455:19)", "entry");
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.fontSize(13);
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor(this.formLevel === EmergencyLevel.MEDIUM ? '#FAAD14' : '#F5F5F5');
                        Button.fontColor(this.formLevel === EmergencyLevel.MEDIUM ? Color.White : '#666');
                        Button.onClick(() => { this.formLevel = EmergencyLevel.MEDIUM; });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('特急');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(463:19)", "entry");
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.fontSize(13);
                        Button.type(ButtonType.Capsule);
                        Button.backgroundColor(this.formLevel === EmergencyLevel.HIGH ? '#FF4D4F' : '#F5F5F5');
                        Button.fontColor(this.formLevel === EmergencyLevel.HIGH ? Color.White : '#666');
                        Button.onClick(() => { this.formLevel = EmergencyLevel.HIGH; });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    // ── 紧急程度 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 补充说明 ──
                        Column.create({ space: 10 });
                        Column.debugLine("entry/src/main/ets/pages/CitizenPage.ets(481:15)", "entry");
                        // ── 补充说明 ──
                        Column.width('100%');
                        // ── 补充说明 ──
                        Column.padding(16);
                        // ── 补充说明 ──
                        Column.margin({ top: 12, left: 12, right: 12 });
                        // ── 补充说明 ──
                        Column.backgroundColor(Color.White);
                        // ── 补充说明 ──
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CitizenPage.ets(482:17)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('补充说明');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(483:19)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#999');
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('（选填）');
                        Text.debugLine("entry/src/main/ets/pages/CitizenPage.ets(487:19)", "entry");
                        Text.fontSize(11);
                        Text.fontColor('#BBB');
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ placeholder: '请描述详细情况，如人数、伤情、具体需求等…', text: this.formNotes });
                        TextArea.debugLine("entry/src/main/ets/pages/CitizenPage.ets(492:17)", "entry");
                        TextArea.width('100%');
                        TextArea.height(80);
                        TextArea.fontSize(14);
                        TextArea.backgroundColor('#F7F8FA');
                        TextArea.borderRadius(8);
                        TextArea.padding(10);
                        TextArea.onChange((value: string) => { this.formNotes = value; });
                    }, TextArea);
                    // ── 补充说明 ──
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ── 提交按钮 ──
                        Button.createWithLabel('确认求救');
                        Button.debugLine("entry/src/main/ets/pages/CitizenPage.ets(508:15)", "entry");
                        // ── 提交按钮 ──
                        Button.width('92%');
                        // ── 提交按钮 ──
                        Button.height(48);
                        // ── 提交按钮 ──
                        Button.fontSize(17);
                        // ── 提交按钮 ──
                        Button.fontWeight(FontWeight.Bold);
                        // ── 提交按钮 ──
                        Button.fontColor(Color.White);
                        // ── 提交按钮 ──
                        Button.backgroundColor('#FF4D4F');
                        // ── 提交按钮 ──
                        Button.borderRadius(12);
                        // ── 提交按钮 ──
                        Button.margin({ top: 20, bottom: 30 });
                        // ── 提交按钮 ──
                        Button.shadow({ radius: 8, color: 'rgba(255,77,79,0.3)' });
                        // ── 提交按钮 ──
                        Button.onClick(() => this.submitSOS());
                    }, Button);
                    // ── 提交按钮 ──
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 底部安全区留白
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CitizenPage.ets(521:15)", "entry");
                        // 底部安全区留白
                        Blank.height(16);
                    }, Blank);
                    // 底部安全区留白
                    Blank.pop();
                    Column.pop();
                    // 可滚动表单内容
                    Scroll.pop();
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
