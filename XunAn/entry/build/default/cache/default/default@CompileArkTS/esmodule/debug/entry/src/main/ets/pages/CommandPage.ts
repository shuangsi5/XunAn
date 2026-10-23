if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommandPage_Params {
    sosList?: SOSInfo[];
    rescuerList?: RescuerInfo[];
    showAssignDialog?: boolean;
    selectedSOS?: SOSInfo | null;
    filterIndex?: number;
    statsHeight?: number;
    showRoleSwitchDialog?: boolean;
    userRoles?: Role[];
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { SOSStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { RescuerStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import type { RescuerInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import { getSOSList, getRescuerList, assignTask, getLoggedInPhone, getUserByPhone, setCurrentRole } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { SOSCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/SOSCard";
import { RescuerCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/RescuerCard";
import { BottomNavBar } from "@bundle:com.xunan.floodrescue/entry/ets/components/BottomNavBar";
import { AppColors, getRoleColor, getRoleBgColor, getRoleLabel, getRoleEmoji, getRolePage } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
const PAGE_ROLE = Role.COMMAND;
// 顶部统计卡片展开时的完整高度（含 padding，可微调）
const STATS_FULL_HEIGHT = 92;
class CommandPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__sosList = new ObservedPropertyObjectPU([], this, "sosList");
        this.__rescuerList = new ObservedPropertyObjectPU([], this, "rescuerList");
        this.__showAssignDialog = new ObservedPropertySimplePU(false, this, "showAssignDialog");
        this.__selectedSOS = new ObservedPropertyObjectPU(null, this, "selectedSOS");
        this.__filterIndex = new ObservedPropertySimplePU(0, this, "filterIndex");
        this.__statsHeight = new ObservedPropertySimplePU(STATS_FULL_HEIGHT, this, "statsHeight");
        this.__showRoleSwitchDialog = new ObservedPropertySimplePU(false, this, "showRoleSwitchDialog");
        this.__userRoles = new ObservedPropertyObjectPU([], this, "userRoles");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommandPage_Params) {
        if (params.sosList !== undefined) {
            this.sosList = params.sosList;
        }
        if (params.rescuerList !== undefined) {
            this.rescuerList = params.rescuerList;
        }
        if (params.showAssignDialog !== undefined) {
            this.showAssignDialog = params.showAssignDialog;
        }
        if (params.selectedSOS !== undefined) {
            this.selectedSOS = params.selectedSOS;
        }
        if (params.filterIndex !== undefined) {
            this.filterIndex = params.filterIndex;
        }
        if (params.statsHeight !== undefined) {
            this.statsHeight = params.statsHeight;
        }
        if (params.showRoleSwitchDialog !== undefined) {
            this.showRoleSwitchDialog = params.showRoleSwitchDialog;
        }
        if (params.userRoles !== undefined) {
            this.userRoles = params.userRoles;
        }
    }
    updateStateVars(params: CommandPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sosList.purgeDependencyOnElmtId(rmElmtId);
        this.__rescuerList.purgeDependencyOnElmtId(rmElmtId);
        this.__showAssignDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedSOS.purgeDependencyOnElmtId(rmElmtId);
        this.__filterIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__statsHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__showRoleSwitchDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__userRoles.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sosList.aboutToBeDeleted();
        this.__rescuerList.aboutToBeDeleted();
        this.__showAssignDialog.aboutToBeDeleted();
        this.__selectedSOS.aboutToBeDeleted();
        this.__filterIndex.aboutToBeDeleted();
        this.__statsHeight.aboutToBeDeleted();
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
    private __rescuerList: ObservedPropertyObjectPU<RescuerInfo[]>;
    get rescuerList() {
        return this.__rescuerList.get();
    }
    set rescuerList(newValue: RescuerInfo[]) {
        this.__rescuerList.set(newValue);
    }
    private __showAssignDialog: ObservedPropertySimplePU<boolean>;
    get showAssignDialog() {
        return this.__showAssignDialog.get();
    }
    set showAssignDialog(newValue: boolean) {
        this.__showAssignDialog.set(newValue);
    }
    private __selectedSOS: ObservedPropertyObjectPU<SOSInfo | null>;
    get selectedSOS() {
        return this.__selectedSOS.get();
    }
    set selectedSOS(newValue: SOSInfo | null) {
        this.__selectedSOS.set(newValue);
    }
    // 状态筛选：0=全部 1=待救援 2=救援中 3=已完成
    private __filterIndex: ObservedPropertySimplePU<number>;
    get filterIndex() {
        return this.__filterIndex.get();
    }
    set filterIndex(newValue: number) {
        this.__filterIndex.set(newValue);
    }
    // 顶部统计卡片当前高度
    private __statsHeight: ObservedPropertySimplePU<number>;
    get statsHeight() {
        return this.__statsHeight.get();
    }
    set statsHeight(newValue: number) {
        this.__statsHeight.set(newValue);
    }
    // 身份切换弹窗
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
    aboutToAppear() {
        this.refresh();
        this.loadUserRoles();
    }
    onPageShow() {
        this.refresh();
    }
    async refresh() {
        this.sosList = await getSOSList();
        this.rescuerList = await getRescuerList();
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
        if (role === PAGE_ROLE) {
            return;
        }
        setCurrentRole(role);
        AppStorage.setOrCreate('autoEnteredPage', true);
        router.replaceUrl({ url: getRolePage(role) });
    }
    getCount(index: number): number {
        if (index === 0) {
            return this.sosList.length;
        }
        if (index === 1) {
            return this.sosList.filter((s: SOSInfo) => s.status === SOSStatus.PENDING).length;
        }
        if (index === 2) {
            return this.sosList.filter((s: SOSInfo) => s.status === SOSStatus.RESCUING).length;
        }
        return this.sosList.filter((s: SOSInfo) => s.status === SOSStatus.COMPLETED).length;
    }
    getFilteredList(): SOSInfo[] {
        if (this.filterIndex === 1) {
            return this.sosList.filter((s: SOSInfo) => s.status === SOSStatus.PENDING);
        }
        if (this.filterIndex === 2) {
            return this.sosList.filter((s: SOSInfo) => s.status === SOSStatus.RESCUING);
        }
        if (this.filterIndex === 3) {
            return this.sosList.filter((s: SOSInfo) => s.status === SOSStatus.COMPLETED);
        }
        return this.sosList;
    }
    openAssign(sos: SOSInfo) {
        this.selectedSOS = sos;
        this.showAssignDialog = true;
    }
    doAssign(rescuer: RescuerInfo) {
        if (this.selectedSOS) {
            assignTask(this.selectedSOS.id, rescuer.id).then((success: boolean) => {
                if (success) {
                    this.showAssignDialog = false;
                    this.selectedSOS = null;
                    this.refresh();
                    promptAction.showToast({ message: '指派成功', duration: 2000 });
                }
                else {
                    promptAction.showToast({ message: '指派失败，请重试', duration: 2000 });
                }
            }).catch((err: Error) => {
                console.error('指派任务失败', err);
                promptAction.showToast({ message: '指派失败，请重试', duration: 2000 });
            });
        }
    }
    // 列表首项索引变化时，控制统计卡片收起 / 展开
    private handleScrollIndex(firstIndex: number) {
        if (firstIndex > 0 && this.statsHeight !== 0) {
            // 滚过第一条记录：收起
            this.statsHeight = 0;
        }
        else if (firstIndex === 0 && this.statsHeight !== STATS_FULL_HEIGHT) {
            // 回到顶部：展开
            this.statsHeight = STATS_FULL_HEIGHT;
        }
    }
    FilterItem(label: string, color: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.layoutWeight(1);
            Column.padding({ top: 14, bottom: 14 });
            Column.backgroundColor(this.filterIndex === index ? color : AppColors.card);
            Column.borderRadius(14);
            Column.border({ width: 1, color: this.filterIndex === index ? color : AppColors.divider });
            Column.onClick(() => {
                this.filterIndex = index;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getCount(index)}`);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.filterIndex === index ? Color.White : color);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(11);
            Text.fontColor(this.filterIndex === index ? Color.White : AppColors.textSecondary);
        }, Text);
        Text.pop();
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
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.alignItems(VerticalAlign.Center);
            // 标题栏
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('切换身份');
            Button.fontSize(11);
            Button.height(28);
            Button.padding({ left: 10, right: 10 });
            Button.backgroundColor(AppColors.successLight);
            Button.fontColor(AppColors.success);
            Button.borderRadius(14);
            Button.onClick(() => this.openRoleSwitchDialog());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('应急指挥部');
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
            // 统计筛选卡片（上滑收起，下滑展开）
            Row.create({ space: 8 });
            globalThis.Context.animation({ duration: 150, curve: Curve.EaseInOut });
            // 统计筛选卡片（上滑收起，下滑展开）
            Row.width('90%');
            // 统计筛选卡片（上滑收起，下滑展开）
            Row.margin({
                top: this.statsHeight > 0 ? 8 : 0,
                bottom: this.statsHeight > 0 ? 16 : 0
            });
            // 统计筛选卡片（上滑收起，下滑展开）
            Row.height(this.statsHeight);
            // 统计筛选卡片（上滑收起，下滑展开）
            Row.opacity(this.statsHeight / STATS_FULL_HEIGHT);
            // 统计筛选卡片（上滑收起，下滑展开）
            Row.clip(true);
            globalThis.Context.animation(null);
        }, Row);
        this.FilterItem.bind(this)('全部', AppColors.primary, 0);
        this.FilterItem.bind(this)('待救援', AppColors.danger, 1);
        this.FilterItem.bind(this)('救援中', AppColors.warning, 2);
        this.FilterItem.bind(this)('已完成', AppColors.success, 3);
        // 统计筛选卡片（上滑收起，下滑展开）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('查看全局地图');
            Button.width('90%');
            Button.height(40);
            Button.fontSize(14);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor(Color.White);
            Button.backgroundColor(AppColors.primary);
            Button.borderRadius(20);
            Button.margin({ bottom: 16 });
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/MapPage' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('90%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('求救信息列表');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`共 ${this.getFilteredList().length} 条`);
            Text.fontSize(12);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
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
                        Text.create('暂无求救信息');
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
                        List.width('90%');
                        List.layoutWeight(1);
                        List.padding({ bottom: 16 });
                        List.alignListItem(ListItemAlign.Start);
                        List.scrollBar(BarState.Off);
                        List.onScrollIndex((firstIndex: number) => {
                            this.handleScrollIndex(firstIndex);
                        });
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
                                                let componentCall = new SOSCard(this, {
                                                    sos: item,
                                                    onAssign: item.status === SOSStatus.PENDING ? ((): void => this.openAssign(item)) : undefined,
                                                    onDetail: (): void => {
                                                        router.pushUrl({
                                                            url: 'pages/SOSDetailPage',
                                                            params: { sosId: item.id }
                                                        });
                                                    }
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommandPage.ets", line: 256, col: 17 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        sos: item,
                                                        onAssign: item.status === SOSStatus.PENDING ? ((): void => this.openAssign(item)) : undefined,
                                                        onDetail: (): void => {
                                                            router.pushUrl({
                                                                url: 'pages/SOSDetailPage',
                                                                params: { sosId: item.id }
                                                            });
                                                        }
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
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new BottomNavBar(this, { activeTab: 0 }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommandPage.ets", line: 279, col: 9 });
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
            if (this.showAssignDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('85%');
                        Column.height('60%');
                        Column.padding(24);
                        Column.backgroundColor(AppColors.card);
                        Column.borderRadius(20);
                        Column.shadow({ radius: 24, color: 'rgba(0,0,0,0.2)' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择救援人员');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.textPrimary);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 8 });
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
                                                let componentCall = new RescuerCard(this, {
                                                    rescuer: item,
                                                    onSelect: (): void => this.doAssign(item)
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommandPage.ets", line: 299, col: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        rescuer: item,
                                                        onSelect: (): void => this.doAssign(item)
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    rescuer: item
                                                });
                                            }
                                        }, { name: "RescuerCard" });
                                    }
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.rescuerList.filter(r => r.status === RescuerStatus.IDLE), forEachItemGenFunction, (item: RescuerInfo) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.width('100%');
                        Button.height(44);
                        Button.fontSize(15);
                        Button.backgroundColor(AppColors.bgSecondary);
                        Button.fontColor(AppColors.textSecondary);
                        Button.borderRadius(22);
                        Button.margin({ top: 16 });
                        Button.onClick(() => this.showAssignDialog = false);
                    }, Button);
                    Button.pop();
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
        return "CommandPage";
    }
}
registerNamedRoute(() => new CommandPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/CommandPage", pageFullPath: "entry/src/main/ets/pages/CommandPage", integratedHsp: "false", moduleType: "followWithHap" });
