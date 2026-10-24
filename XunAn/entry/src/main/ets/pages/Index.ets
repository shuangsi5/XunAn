import { router, promptAction } from '@kit.ArkUI';
import { Role } from '../model/Role';
import { User } from '../model/User';
import { getLoggedInPhone, getUserByPhone, clearLoggedIn, setCurrentRole } from '../utils/ApiService';
import { AppColors, getRoleLabel, getRoleEmoji, getRoleBgColor, getRolePage } from '../common/Theme';
import { isWearable } from '../common/DeviceAdaptive';

function getRoleSubtitle(role: Role): string {
  if (role === Role.CITIZEN) {
    return '发布求救信息';
  } else if (role === Role.RESCUER) {
    return '接收任务并前往救援';
  }
  return '调度指挥与监控';
}

function getDefaultRole(roles: Role[]): Role {
  if (roles.includes(Role.CITIZEN)) {
    return Role.CITIZEN;
  } else if (roles.includes(Role.RESCUER)) {
    return Role.RESCUER;
  } else if (roles.includes(Role.COMMAND)) {
    return Role.COMMAND;
  }
  return Role.CITIZEN;
}

@Entry
@Component
struct Index {
  @State currentUser: User | null = null;
  @State displayRoles: Role[] = [];
  @State isAutoNavigated: boolean = false;
  @State isWatch: boolean = false;

  aboutToAppear(): void {
    this.isWatch = isWearable();
    this.loadUser();
  }

  async loadUser(): Promise<void> {
    try {
      const phone = getLoggedInPhone();
      if (!phone) {
        return;
      }
      const user = await getUserByPhone(phone);
      if (user) {
        this.currentUser = user;
        // 强制按正确顺序显示：群众 → 救援人员 → 指挥部
        const roleOrder: Role[] = [Role.CITIZEN, Role.RESCUER, Role.COMMAND];
        this.displayRoles = roleOrder.filter((role: Role) => user.roles.includes(role));

        // 已登录用户自动跳转到默认身份页面（只执行一次）
        if (!this.isAutoNavigated && this.displayRoles.length > 0) {
          this.isAutoNavigated = true;
          let defaultRole = getDefaultRole(this.displayRoles);
          setCurrentRole(defaultRole);
          router.replaceUrl({ url: getRolePage(defaultRole) });
        }
      }
    } catch (err) {
      console.error('加载用户信息失败', JSON.stringify(err));
      promptAction.showToast({ message: '加载用户信息失败，请重新登录' });
    }
  }

  logout(): void {
    clearLoggedIn();
    this.currentUser = null;
    this.displayRoles = [];
    router.replaceUrl({ url: 'pages/LoginPage' });
  }

  selectRole(role: Role): void {
    try {
      setCurrentRole(role);
      router.pushUrl({ url: getRolePage(role) });
    } catch (err) {
      console.error('跳转失败', JSON.stringify(err));
      promptAction.showToast({ message: '页面跳转失败，请重试' });
    }
  }

  goToProfile(): void {
    try {
      router.pushUrl({ url: 'pages/ProfilePage' });
    } catch (err) {
      console.error('跳转个人中心失败', JSON.stringify(err));
      promptAction.showToast({ message: '页面跳转失败' });
    }
  }

  goToLogin(): void {
    try {
      router.pushUrl({ url: 'pages/LoginPage' });
    } catch (err) {
      console.error('跳转登录页失败', JSON.stringify(err));
    }
  }

  goToQuickSOS(): void {
    try {
      setCurrentRole(Role.CITIZEN);
      router.pushUrl({ url: 'pages/CitizenPage' });
    } catch (err) {
      console.error('快速求救跳转失败', JSON.stringify(err));
      promptAction.showToast({ message: '跳转失败，请重试' });
    }
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
    if (this.currentUser) {
      this.buildLoggedIn()
    } else {
      this.buildLoggedOut()
    }
  }

  // ===== 未登录：手机/平板 =====
  @Builder
  buildPhoneLoggedOut() {
    Column({ space: 16 }) {
      Text('🌊')
        .fontSize(56)
        .margin({ top: 16 })

      Text('智慧防汛应急救援系统')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor(AppColors.primary)

      Text('—— 汛安 ——')
        .fontSize(16)
        .fontColor(AppColors.textSecondary)

      Text('请登录以继续')
        .fontSize(14)
        .fontColor(AppColors.textSecondary)
        .margin({ top: 8, bottom: 4 })

      Button('登录')
        .width('80%')
        .height(48)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Color.White)
        .backgroundColor(AppColors.primary)
        .borderRadius(24)
        .onClick(() => this.goToLogin())

      Button('快速求救')
        .width('80%')
        .height(48)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Color.White)
        .backgroundColor(AppColors.danger)
        .borderRadius(24)
        .onClick(() => this.goToQuickSOS())

      Blank()
        .height(8)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  // ===== 未登录：手表（紧凑 + 可滚动，适配圆形小屏）=====
  @Builder
  buildWatchLoggedOut() {
    Scroll() {
      Column({ space: 10 }) {
        Text('🌊')
          .fontSize(30)

        Text('智慧防汛应急救援系统')
          .fontSize(15)
          .fontWeight(FontWeight.Bold)
          .fontColor(AppColors.primary)
          .textAlign(TextAlign.Center)

        Text('—— 汛安 ——')
          .fontSize(12)
          .fontColor(AppColors.textSecondary)

        Text('请登录以继续')
          .fontSize(12)
          .fontColor(AppColors.textSecondary)
          .margin({ top: 2, bottom: 2 })

        Button('登录')
          .width('74%')
          .height(40)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius(20)
          .onClick(() => this.goToLogin())

        Button('快速求救')
          .width('74%')
          .height(40)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(AppColors.danger)
          .borderRadius(20)
          .onClick(() => this.goToQuickSOS())
      }
      .width('100%')
      .constraintSize({ minHeight: '100%' })
      .justifyContent(FlexAlign.Center)
      .padding({ left: 26, right: 26, top: 16, bottom: 16 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }

  // ===== 已登录：手机/平板 =====
  @Builder
  buildPhoneLoggedIn() {
    Column({ space: 8 }) {
      // 用户信息栏
      Row() {
        Column({ space: 2 }) {
          Text(`欢迎，${this.currentUser!.name}`)
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          if (this.currentUser!.unit) {
            Text(`所属：${this.currentUser!.unit}`)
              .fontSize(12)
              .fontColor(AppColors.textTertiary)
          }
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Button('👤 个人中心')
          .fontSize(13)
          .height(32)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius(16)
          .margin({ right: 8 })
          .onClick(() => this.goToProfile())

        Button('退出登录')
          .fontSize(13)
          .height(32)
          .fontColor(Color.White)
          .backgroundColor(AppColors.danger)
          .borderRadius(16)
          .onClick(() => this.logout())
      }
      .width('85%')
      .padding({ top: 16, bottom: 4 })

      // 分隔提示
      Text('请选择您的身份')
        .fontSize(14)
        .fontColor(AppColors.textSecondary)
        .width('85%')
        .margin({ top: 8, bottom: 4 })

      // 角色卡片 - 按 displayRoles 顺序显示
      ForEach(this.displayRoles, (role: Role) => {
        Column({ space: 4 }) {
          Text(getRoleEmoji(role))
            .fontSize(40)
          Text(getRoleLabel(role))
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Text(getRoleSubtitle(role))
            .fontSize(11)
            .fontColor(AppColors.textTertiary)
        }
        .width('80%')
        .padding(16)
        .backgroundColor(getRoleBgColor(role))
        .borderRadius(16)
        .onClick(() => this.selectRole(role))
      }, (role: Role) => role.toString())

      Blank()
        .height(8)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
    .alignItems(HorizontalAlign.Center)
  }

  // ===== 已登录：手表（紧凑 + 可滚动）=====
  @Builder
  buildWatchLoggedIn() {
    Scroll() {
      Column({ space: 8 }) {
        Row() {
          Column({ space: 2 }) {
            Text(`欢迎，${this.currentUser!.name}`)
              .fontSize(13)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.textPrimary)
            if (this.currentUser!.unit) {
              Text(`所属：${this.currentUser!.unit}`)
                .fontSize(10)
                .fontColor(AppColors.textTertiary)
            }
          }
          .alignItems(HorizontalAlign.Start)

          Blank()

          Button('退出')
            .fontSize(11)
            .height(28)
            .fontColor(Color.White)
            .backgroundColor(AppColors.danger)
            .borderRadius(14)
            .onClick(() => this.logout())
        }
        .width('100%')
        .padding({ top: 8, bottom: 2 })

        Text('请选择您的身份')
          .fontSize(12)
          .fontColor(AppColors.textSecondary)
          .width('100%')
          .margin({ top: 4, bottom: 2 })

        ForEach(this.displayRoles, (role: Role) => {
          Column({ space: 2 }) {
            Text(getRoleEmoji(role))
              .fontSize(24)
            Text(getRoleLabel(role))
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.textPrimary)
            Text(getRoleSubtitle(role))
              .fontSize(10)
              .fontColor(AppColors.textTertiary)
          }
          .width('100%')
          .padding(10)
          .backgroundColor(getRoleBgColor(role))
          .borderRadius(12)
          .onClick(() => this.selectRole(role))
        }, (role: Role) => role.toString())
      }
      .width('100%')
      .padding({ left: 22, right: 22, top: 8, bottom: 12 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }

  @Builder
  buildLoggedOut() {
    if (this.isWatch) {
      this.buildWatchLoggedOut()
    } else {
      this.buildPhoneLoggedOut()
    }
  }

  @Builder
  buildLoggedIn() {
    if (this.isWatch) {
      this.buildWatchLoggedIn()
    } else {
      this.buildPhoneLoggedIn()
    }
  }
}
