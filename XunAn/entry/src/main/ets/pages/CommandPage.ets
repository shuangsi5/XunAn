import { router, promptAction } from '@kit.ArkUI';
import { SOSInfo, SOSStatus } from '../model/SOSInfo';
import { RescuerInfo, RescuerStatus } from '../model/RescuerInfo';
import { Role } from '../model/Role';
import { getSOSList, getRescuerList, assignTask, getLoggedInPhone, getUserByPhone, setCurrentRole } from '../utils/ApiService';
import { SOSCard } from '../components/SOSCard';
import { RescuerCard } from '../components/RescuerCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { AppColors, getRoleColor, getRoleBgColor, getRoleLabel, getRoleEmoji, getRolePage } from '../common/Theme';

const PAGE_ROLE = Role.COMMAND;

// 顶部统计卡片展开时的完整高度（含 padding，可微调）
const STATS_FULL_HEIGHT = 92;

@Entry
@Component
struct CommandPage {
  @State sosList: SOSInfo[] = [];
  @State rescuerList: RescuerInfo[] = [];
  @State showAssignDialog: boolean = false;
  @State selectedSOS: SOSInfo | null = null;
  // 状态筛选：0=全部 1=待救援 2=救援中 3=已完成
  @State filterIndex: number = 0;
  // 顶部统计卡片当前高度
  @State statsHeight: number = STATS_FULL_HEIGHT;

  // 身份切换弹窗
  @State showRoleSwitchDialog: boolean = false;
  @State userRoles: Role[] = [];

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
        } else {
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
            .backgroundColor(AppColors.successLight)
            .fontColor(AppColors.success)
            .borderRadius(14)
            .onClick(() => this.openRoleSwitchDialog())

          Blank()
          Text('应急指挥部')
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

        // 统计筛选卡片（上滑收起，下滑展开）
        Row({ space: 8 }) {
          this.FilterItem('全部', AppColors.primary, 0)
          this.FilterItem('待救援', AppColors.danger, 1)
          this.FilterItem('救援中', AppColors.warning, 2)
          this.FilterItem('已完成', AppColors.success, 3)
        }
        .width('90%')
        .margin({
          top: this.statsHeight > 0 ? 8 : 0,
          bottom: this.statsHeight > 0 ? 16 : 0
        })
        .height(this.statsHeight)
        .opacity(this.statsHeight / STATS_FULL_HEIGHT)
        .clip(true)
        .animation({ duration: 150, curve: Curve.EaseInOut })

        Button('查看全局地图')
          .width('90%')
          .height(40)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius(20)
          .margin({ bottom: 16 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/MapPage' });
          })

        Row() {
          Text('求救信息列表')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Blank()
          Text(`共 ${this.getFilteredList().length} 条`)
            .fontSize(12)
            .fontColor(AppColors.textTertiary)
        }
        .width('90%')
        .margin({ bottom: 12 })

        if (this.getFilteredList().length === 0) {
          Column({ space: 8 }) {
            Text('📭')
              .fontSize(40)
            Text('暂无求救信息')
              .fontSize(14)
              .fontColor(AppColors.textTertiary)
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          List({ space: 12 }) {
            ForEach(this.getFilteredList(), (item: SOSInfo) => {
              ListItem() {
                SOSCard({
                  sos: item,
                  onAssign: item.status === SOSStatus.PENDING ? ((): void => this.openAssign(item)) : undefined,
                  onDetail: (): void => {
                    router.pushUrl({
                      url: 'pages/SOSDetailPage',
                      params: { sosId: item.id }
                    });
                  }
                })
              }
            }, (item: SOSInfo) => item.id)
          }
          .width('90%')
          .layoutWeight(1)
          .padding({ bottom: 16 })
          .alignListItem(ListItemAlign.Start)
          .scrollBar(BarState.Off)
          .onScrollIndex((firstIndex: number) => {
            this.handleScrollIndex(firstIndex);
          })
        }

        BottomNavBar({ activeTab: 0 })
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.bg)
      .alignItems(HorizontalAlign.Center)

      if (this.showAssignDialog) {
        Column() {
          Text('选择救援人员')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
            .margin({ bottom: 16 })

          List({ space: 8 }) {
            ForEach(
              this.rescuerList.filter(r => r.status === RescuerStatus.IDLE),
              (item: RescuerInfo) => {
                ListItem() {
                  RescuerCard({
                    rescuer: item,
                    onSelect: (): void => this.doAssign(item)
                  })
                }
              },
              (item: RescuerInfo) => item.id
            )
          }
          .width('100%')
          .layoutWeight(1)
          .scrollBar(BarState.Off)

          Button('取消')
            .width('100%')
            .height(44)
            .fontSize(15)
            .backgroundColor(AppColors.bgSecondary)
            .fontColor(AppColors.textSecondary)
            .borderRadius(22)
            .margin({ top: 16 })
            .onClick(() => this.showAssignDialog = false)
        }
        .width('85%')
        .height('60%')
        .padding(24)
        .backgroundColor(AppColors.card)
        .borderRadius(20)
        .shadow({ radius: 24, color: 'rgba(0,0,0,0.2)' })
      }

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