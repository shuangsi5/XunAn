import { router, promptAction } from '@kit.ArkUI';
import { SOSInfo, SOSStatus } from '../model/SOSInfo';
import { RescuerInfo } from '../model/RescuerInfo';
import { Role } from '../model/Role';
import { getSOSList, getRescuerList, completeTask, getLoggedInPhone, getUserByPhone, setCurrentRole } from '../utils/ApiService';
import { SOSCard } from '../components/SOSCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { AppColors, getRoleColor, getRoleBgColor, getRoleLabel, getRoleEmoji, getRolePage } from '../common/Theme';

const PAGE_ROLE = Role.RESCUER;

// 顶部统计卡片展开时的完整高度
const STATS_FULL_HEIGHT = 92;

@Entry
@Component
struct RescuerPage {
  @State currentIndex: number = 0;
  @State taskHallList: SOSInfo[] = [];
  @State myTasks: SOSInfo[] = [];
  @State rescuer: RescuerInfo | null = null;
  // 状态筛选：0=全部 1=待救援 2=救援中 3=已完成
  @State filterIndex: number = 0;
  // 顶部统计卡片当前高度
  @State statsHeight: number = STATS_FULL_HEIGHT;

  // 身份切换弹窗
  @State showRoleSwitchDialog: boolean = false;
  @State userRoles: Role[] = [];

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
    this.taskHallList = allSos.filter(
      s => s.status === SOSStatus.PENDING || String(s.assignedRescuerId) === rescuerId
    );
    if (this.rescuer) {
      this.myTasks = allSos.filter(
        s => String(s.assignedRescuerId) === rescuerId && s.status !== SOSStatus.COMPLETED
      );
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
    } catch (err) {
      console.error('完成任务失败', err);
      promptAction.showToast({ message: '操作失败，请重试' });
    }
  }

  // 列表首项索引变化时，控制统计卡片收起 / 展开
  private handleScrollIndex(firstIndex: number) {
    if (firstIndex > 0 && this.statsHeight !== 0) {
      // 滚过第一条记录：收起
      this.statsHeight = 0;
    } else if (firstIndex === 0 && this.statsHeight !== STATS_FULL_HEIGHT) {
      // 回到顶部：展开
      this.statsHeight = STATS_FULL_HEIGHT;
    }
  }

  @Builder
  FilterItem(label: string, color: string, index: number) {
    Column({ space: 4 }) {
      Text(`${this.getCount(index)}`)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.filterIndex === index ? Color.White : color)
      Text(label)
        .fontSize(11)
        .fontColor(this.filterIndex === index ? Color.White : AppColors.textSecondary)
    }
    .layoutWeight(1)
    .padding({ top: 14, bottom: 14 })
    .backgroundColor(this.filterIndex === index ? color : AppColors.card)
    .borderRadius(14)
    .border({ width: 1, color: this.filterIndex === index ? color : AppColors.divider })
    .onClick(() => {
      this.filterIndex = index;
    })
  }

  @Builder
  EmptyView(text: string) {
    Column({ space: 8 }) {
      Text('📭')
        .fontSize(40)
      Text(text)
        .fontSize(14)
        .fontColor(AppColors.textTertiary)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  // 鸿蒙原生式页面转场：push 从右滑入、pop 从左返回，旧页面淡出形成视差
  pageTransition() {
    PageTransitionEnter({ duration: 400, curve: Curve.Friction, type: RouteType.Push })
      .slide(SlideEffect.Right)
    PageTransitionExit({ duration: 400, curve: Curve.Friction, type: RouteType.Push })
      .slide(SlideEffect.Left)
      .opacity(0.6)
    PageTransitionEnter({ duration: 400, curve: Curve.Friction, type: RouteType.Pop })
      .slide(SlideEffect.Left)
    PageTransitionExit({ duration: 400, curve: Curve.Friction, type: RouteType.Pop })
      .slide(SlideEffect.Right)
      .opacity(0.6)
  }

  build() {
    Stack() {
      Column() {
        // 标题栏
        Row() {
          Button('切换身份')
            .fontSize(11)
            .height(28)
            .padding({ left: 10, right: 10 })
            .backgroundColor(AppColors.warningLight)
            .fontColor(AppColors.warning)
            .borderRadius(14)
            .onClick(() => this.openRoleSwitchDialog())

          Blank()
          Text('救援端')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Blank()

          Row()
            .width(40)
            .height(40)
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        .padding({ left: 16, right: 16, top: 12, bottom: 12 })

        // 状态分类筛选（上滑收起，下滑展开）
        Row({ space: 8 }) {
          this.FilterItem('全部', AppColors.primary, 0)
          this.FilterItem('待救援', AppColors.danger, 1)
          this.FilterItem('救援中', AppColors.warning, 2)
          this.FilterItem('已完成', AppColors.success, 3)
        }
        .width('100%')
        .padding({
          left: 16,
          right: 16,
          top: this.statsHeight > 0 ? 4 : 0,
          bottom: this.statsHeight > 0 ? 12 : 0
        })
        .height(this.statsHeight)
        .opacity(this.statsHeight / STATS_FULL_HEIGHT)
        .clip(true)
        .animation({ duration: 150, curve: Curve.EaseInOut })

        Tabs({ barPosition: BarPosition.Start }) {
          // ===== 任务大厅 =====
          TabContent() {
            if (this.getFilteredTaskHall().length === 0) {
              this.EmptyView('暂无任务')
            } else {
              Column() {
                List({ space: 12 }) {
                  ForEach(
                    this.getFilteredTaskHall(),
                    (item: SOSInfo) => {
                      ListItem() {
                        SOSCard({
                          sos: item,
                          onDetail: (): void => this.navigateToMap(item)
                        })
                      }
                      .width('100%')
                    },
                    (item: SOSInfo) => item.id
                  )
                }
                .width('100%')
                .layoutWeight(1)
                .alignListItem(ListItemAlign.Start)
                .padding({ left: 12, right: 12, bottom: 16 })
                .scrollBar(BarState.Off)
                .onScrollIndex((firstIndex: number) => {
                  this.handleScrollIndex(firstIndex);
                })
              }
              .width('100%')
              .height('100%')
              .justifyContent(FlexAlign.Start)
            }
          }
          .tabBar('任务大厅')

          // ===== 我的任务 =====
          TabContent() {
            if (this.getFilteredMyTasks().length === 0) {
              this.EmptyView('暂无任务')
            } else {
              Column() {
                List({ space: 12 }) {
                  ForEach(this.getFilteredMyTasks(), (item: SOSInfo) => {
                    ListItem() {
                      Column() {
                        SOSCard({
                          sos: item,
                          onDetail: (): void => this.navigateToMap(item)
                        })
                        Button('完成任务')
                          .width('100%')
                          .height(36)
                          .fontSize(14)
                          .fontWeight(FontWeight.Medium)
                          .fontColor(Color.White)
                          .backgroundColor(AppColors.success)
                          .borderRadius(18)
                          .margin({ top: 8 })
                          .onClick(() => this.complete(item))
                      }
                      .width('100%')
                    }
                    .width('100%')
                  }, (item: SOSInfo) => item.id)
                }
                .width('100%')
                .layoutWeight(1)
                .alignListItem(ListItemAlign.Start)
                .padding({ left: 12, right: 12, bottom: 16 })
                .scrollBar(BarState.Off)
                .onScrollIndex((firstIndex: number) => {
                  this.handleScrollIndex(firstIndex);
                })
              }
              .width('100%')
              .height('100%')
              .justifyContent(FlexAlign.Start)
            }
          }
          .tabBar('我的任务')
        }
        .width('100%')
        .layoutWeight(1)
        .barBackgroundColor(AppColors.card)

        BottomNavBar({ activeTab: 0 })
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.bg)

      // ========== 身份切换弹窗 ==========
      if (this.showRoleSwitchDialog) {
        Column() {
          Column()
            .width('100%')
            .layoutWeight(1)
            .backgroundColor('rgba(0,0,0,0.5)')
            .onClick(() => { this.showRoleSwitchDialog = false; })

          Column({ space: 16 }) {
            Text('切换身份')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.textPrimary)
              .width('100%')
              .textAlign(TextAlign.Center)

            Column({ space: 10 }) {
              ForEach(
                this.userRoles,
                (role: Role) => {
                  Row({ space: 10 }) {
                    Text(getRoleEmoji(role))
                      .fontSize(22)
                    Text(getRoleLabel(role))
                      .fontSize(15)
                      .fontWeight(FontWeight.Medium)
                      .fontColor(getRoleColor(role))
                    Blank()
                    if (role === PAGE_ROLE) {
                      Text('当前')
                        .fontSize(12)
                        .fontColor(AppColors.textTertiary)
                    }
                  }
                  .width('100%')
                  .padding(14)
                  .backgroundColor(role === PAGE_ROLE ? getRoleBgColor(role) : AppColors.bgSecondary)
                  .borderRadius(12)
                  .border({
                    width: role === PAGE_ROLE ? 1.5 : 0,
                    color: role === PAGE_ROLE ? getRoleColor(role) : Color.Transparent
                  })
                  .onClick(() => this.switchToRole(role))
                },
                (role: Role) => role
              )
            }
            .width('100%')

            Button('取消')
              .width('100%')
              .height(44)
              .fontSize(15)
              .backgroundColor(AppColors.bgSecondary)
              .fontColor(AppColors.textSecondary)
              .borderRadius(22)
              .onClick(() => { this.showRoleSwitchDialog = false; })
          }
          .width('100%')
          .padding(20)
          .backgroundColor(AppColors.card)
          .borderRadius({ topLeft: 20, topRight: 20 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.End)
      }
    }
    .width('100%')
    .height('100%')
  }
}