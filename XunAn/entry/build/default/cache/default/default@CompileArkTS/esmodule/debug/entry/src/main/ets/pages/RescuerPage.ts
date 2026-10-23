if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RescuerPage_Params {
    currentIndex?: number;
    taskHallList?: SOSInfo[];
    myTasks?: SOSInfo[];
    rescuer?: RescuerInfo | null;
    filterIndex?: number;
    statsHeight?: number;
    showRoleSwitchDialog?: boolean;
    userRoles?: Role[];
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { SOSStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { RescuerInfo } from '../model/RescuerInfo';
import { Role } from "@bundle:com.xunan.floodrescue/entry/ets/model/Role";
import { getSOSList, getRescuerList, completeTask, getLoggedInPhone, getUserByPhone, setCurrentRole } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { SOSCard } from "@bundle:com.xunan.floodrescue/entry/ets/components/SOSCard";
import { BottomNavBar } from "@bundle:com.xunan.floodrescue/entry/ets/components/BottomNavBar";
import { AppColors, getRoleColor, getRoleBgColor, getRoleLabel, getRoleEmoji, getRolePage } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
const PAGE_ROLE = Role.RESCUER;
// 顶部统计卡片展开时的完整高度
const STATS_FULL_HEIGHT = 92;
class RescuerPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__taskHallList = new ObservedPropertyObjectPU([], this, "taskHallList");
        this.__myTasks = new ObservedPropertyObjectPU([], this, "myTasks");
        this.__rescuer = new ObservedPropertyObjectPU(null, this, "rescuer");
        this.__filterIndex = new ObservedPropertySimplePU(0, this, "filterIndex");
        this.__statsHeight = new ObservedPropertySimplePU(STATS_FULL_HEIGHT, this, "statsHeight");
        this.__showRoleSwitchDialog = new ObservedPropertySimplePU(false, this, "showRoleSwitchDialog");
        this.__userRoles = new ObservedPropertyObjectPU([], this, "userRoles");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RescuerPage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.taskHallList !== undefined) {
            this.taskHallList = params.taskHallList;
        }
        if (params.myTasks !== undefined) {
            this.myTasks = params.myTasks;
        }
        if (params.rescuer !== undefined) {
            this.rescuer = params.rescuer;
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
    updateStateVars(params: RescuerPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__taskHallList.purgeDependencyOnElmtId(rmElmtId);
        this.__myTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__rescuer.purgeDependencyOnElmtId(rmElmtId);
        this.__filterIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__statsHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__showRoleSwitchDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__userRoles.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__taskHallList.aboutToBeDeleted();
        this.__myTasks.aboutToBeDeleted();
        this.__rescuer.aboutToBeDeleted();
        this.__filterIndex.aboutToBeDeleted();
        this.__statsHeight.aboutToBeDeleted();
        this.__showRoleSwitchDialog.aboutToBeDeleted();
        this.__userRoles.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __taskHallList: ObservedPropertyObjectPU<SOSInfo[]>;
    get taskHallList() {
        return this.__taskHallList.get();
    }
    set taskHallList(newValue: SOSInfo[]) {
        this.__taskHallList.set(newValue);
    }
    private __myTasks: ObservedPropertyObjectPU<SOSInfo[]>;
    get myTasks() {
        return this.__myTasks.get();
    }
    set myTasks(newValue: SOSInfo[]) {
        this.__myTasks.set(newValue);
    }
    private __rescuer: ObservedPropertyObjectPU<RescuerInfo | null>;
    get rescuer() {
        return this.__rescuer.get();
    }
    set rescuer(newValue: RescuerInfo | null) {
        this.__rescuer.set(newValue);
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
        let phone = getLoggedInPhone();
        getRescuerList().then((list) => {
            this.rescuer = list.find(r => String(r.phone) === phone) || null;
            this.refresh();
        }).catch((err: Error) => {
            console.error('获取救援人员列表失败', err);
            this.refresh();
        });
        this.loadUserRoles();
    }
    async refresh() {
        let allSos = await getSOSList();
        let rescuerId = this.rescuer ? String(this.rescuer.id) : '';
        this.taskHallList = allSos.filter(s => s.status === SOSStatus.PENDING || String(s.assignedRescuerId) === rescuerId);
        if (this.rescuer) {
            this.myTasks = allSos.filter(s => String(s.assignedRescuerId) === rescuerId && s.status !== SOSStatus.COMPLETED);
        }
    }
    matchStatus(s: SOSInfo): boolean {
        if (this.filterIndex === 1) {
            return s.status === SOSStatus.PENDING;
        }
        if (this.filterIndex === 2) {
            return s.status === SOSStatus.RESCUING;
        }
        if (this.filterIndex === 3) {
            return s.status === SOSStatus.COMPLETED;
        }
        return true;
    }
    getCount(index: number): number {
        if (index === 0) {
            return this.taskHallList.length;
        }
        if (index === 1) {
            return this.taskHallList.filter((s: SOSInfo) => s.status === SOSStatus.PENDING).length;
        }
        if (index === 2) {
            return this.taskHallList.filter((s: SOSInfo) => s.status === SOSStatus.RESCUING).length;
        }
        return this.taskHallList.filter((s: SOSInfo) => s.status === SOSStatus.COMPLETED).length;
    }
    getFilteredTaskHall(): SOSInfo[] {
        return this.taskHallList.filter((s: SOSInfo) => this.matchStatus(s));
    }
    getFilteredMyTasks(): SOSInfo[] {
        return this.myTasks.filter((s: SOSInfo) => this.matchStatus(s));
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
    navigateToMap(sos: SOSInfo) {
        router.pushUrl({
            url: 'pages/MapPage',
            params: {
                targetLat: sos.latitude,
                targetLng: sos.longitude,
                title: sos.name,
                sosId: sos.id
            }
        });
    }
    async complete(sos: SOSInfo) {
        try {
            await completeTask(sos.id);
            promptAction.showToast({ message: '任务已完成' });
            this.refresh();
        }
        catch (err) {
            console.error('完成任务失败', err);
            promptAction.showToast({ message: '操作失败，请重试' });
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
    EmptyView(text: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📭');
            Text.fontSize(40);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(text);
            Text.fontSize(14);
            Text.fontColor(AppColors.textTertiary);
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
            Button.backgroundColor(AppColors.warningLight);
            Button.fontColor(AppColors.warning);
            Button.borderRadius(14);
            Button.onClick(() => this.openRoleSwitchDialog());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('救援端');
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
            // 状态分类筛选（上滑收起，下滑展开）
            Row.create({ space: 8 });
            globalThis.Context.animation({ duration: 150, curve: Curve.EaseInOut });
            // 状态分类筛选（上滑收起，下滑展开）
            Row.width('100%');
            // 状态分类筛选（上滑收起，下滑展开）
            Row.padding({
                left: 16,
                right: 16,
                top: this.statsHeight > 0 ? 4 : 0,
                bottom: this.statsHeight > 0 ? 12 : 0
            });
            // 状态分类筛选（上滑收起，下滑展开）
            Row.height(this.statsHeight);
            // 状态分类筛选（上滑收起，下滑展开）
            Row.opacity(this.statsHeight / STATS_FULL_HEIGHT);
            // 状态分类筛选（上滑收起，下滑展开）
            Row.clip(true);
            globalThis.Context.animation(null);
        }, Row);
        this.FilterItem.bind(this)('全部', AppColors.primary, 0);
        this.FilterItem.bind(this)('待救援', AppColors.danger, 1);
        this.FilterItem.bind(this)('救援中', AppColors.warning, 2);
        this.FilterItem.bind(this)('已完成', AppColors.success, 3);
        // 状态分类筛选（上滑收起，下滑展开）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ barPosition: BarPosition.Start });
            Tabs.width('100%');
            Tabs.layoutWeight(1);
            Tabs.barBackgroundColor(AppColors.card);
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.getFilteredTaskHall().length === 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.EmptyView.bind(this)('暂无任务');
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.height('100%');
                                Column.justifyContent(FlexAlign.Start);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create({ space: 12 });
                                List.width('100%');
                                List.layoutWeight(1);
                                List.alignListItem(ListItemAlign.Start);
                                List.padding({ left: 12, right: 12, bottom: 16 });
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
                                            ListItem.width('100%');
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SOSCard(this, {
                                                            sos: item,
                                                            onDetail: (): void => this.navigateToMap(item)
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RescuerPage.ets", line: 261, col: 25 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                sos: item,
                                                                onDetail: (): void => this.navigateToMap(item)
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
                                this.forEachUpdateFunction(elmtId, this.getFilteredTaskHall(), forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
                            }, ForEach);
                            ForEach.pop();
                            List.pop();
                            Column.pop();
                        });
                    }
                }, If);
                If.pop();
            });
            TabContent.tabBar('任务大厅');
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.getFilteredMyTasks().length === 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.EmptyView.bind(this)('暂无任务');
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.height('100%');
                                Column.justifyContent(FlexAlign.Start);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create({ space: 12 });
                                List.width('100%');
                                List.layoutWeight(1);
                                List.alignListItem(ListItemAlign.Start);
                                List.padding({ left: 12, right: 12, bottom: 16 });
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
                                            ListItem.width('100%');
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Column.create();
                                                Column.width('100%');
                                            }, Column);
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SOSCard(this, {
                                                            sos: item,
                                                            onDetail: (): void => this.navigateToMap(item)
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RescuerPage.ets", line: 297, col: 25 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                sos: item,
                                                                onDetail: (): void => this.navigateToMap(item)
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
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Button.createWithLabel('完成任务');
                                                Button.width('100%');
                                                Button.height(36);
                                                Button.fontSize(14);
                                                Button.fontWeight(FontWeight.Medium);
                                                Button.fontColor(Color.White);
                                                Button.backgroundColor(AppColors.success);
                                                Button.borderRadius(18);
                                                Button.margin({ top: 8 });
                                                Button.onClick(() => this.complete(item));
                                            }, Button);
                                            Button.pop();
                                            Column.pop();
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, this.getFilteredMyTasks(), forEachItemGenFunction, (item: SOSInfo) => item.id, false, false);
                            }, ForEach);
                            ForEach.pop();
                            List.pop();
                            Column.pop();
                        });
                    }
                }, If);
                If.pop();
            });
            TabContent.tabBar('我的任务');
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new BottomNavBar(this, { activeTab: 0 }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RescuerPage.ets", line: 337, col: 9 });
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
        return "RescuerPage";
    }
}
registerNamedRoute(() => new RescuerPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/RescuerPage", pageFullPath: "entry/src/main/ets/pages/RescuerPage", integratedHsp: "false", moduleType: "followWithHap" });
