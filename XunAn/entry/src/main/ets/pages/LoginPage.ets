import { router, promptAction } from '@kit.ArkUI';
import { Role } from '../model/Role';
import { loginUser, LoginResult, setLoggedInPhone, setCurrentRole } from '../utils/ApiService';
import { AppColors } from '../common/Theme';
import { isWearable } from '../common/DeviceAdaptive';

@Entry
@Component
struct LoginPage {
  @State phone: string = '';
  @State password: string = '';
  @State errorMsg: string = '';
  @State isLoading: boolean = false;
  @State isWatch: boolean = false;

  aboutToAppear(): void {
    this.isWatch = isWearable();
  }

  // 根据角色列表决定默认跳转页面
  getDefaultPage(roles: Role[]): string {
    if (roles.includes(Role.CITIZEN)) {
      return 'pages/CitizenPage';
    } else if (roles.includes(Role.RESCUER)) {
      return 'pages/RescuerPage';
    } else if (roles.includes(Role.COMMAND)) {
      return 'pages/CommandPage';
    }
    return 'pages/CitizenPage';
  }

  // 根据角色列表决定默认当前角色
  getDefaultRole(roles: Role[]): Role {
    if (roles.includes(Role.CITIZEN)) {
      return Role.CITIZEN;
    } else if (roles.includes(Role.RESCUER)) {
      return Role.RESCUER;
    } else if (roles.includes(Role.COMMAND)) {
      return Role.COMMAND;
    }
    return Role.CITIZEN;
  }

  async handleLogin(): Promise<void> {
    this.errorMsg = '';
    if (!this.phone.trim()) {
      this.errorMsg = '请输入手机号';
      return;
    }
    if (!this.password.trim()) {
      this.errorMsg = '请输入密码';
      return;
    }
    this.isLoading = true;
    let result: LoginResult = await loginUser(this.phone.trim(), this.password.trim());
    this.isLoading = false;
    if (result.user) {
      setLoggedInPhone(result.user.phone);
      let defaultRole = this.getDefaultRole(result.user.roles);
      let defaultPage = this.getDefaultPage(result.user.roles);
      setCurrentRole(defaultRole);
      AppStorage.setOrCreate('autoEnteredPage', true);
      promptAction.showToast({ message: '登录成功', duration: 2000 });
      router.replaceUrl({ url: defaultPage });
    } else {
      this.errorMsg = result.error || '登录失败，请检查网络';
    }
  }

  handleQuickSOS(): void {
    setCurrentRole(Role.CITIZEN);
    router.replaceUrl({ url: 'pages/CitizenPage' });
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
    if (this.isWatch) {
      this.buildWatch()
    } else {
      this.buildPhone()
    }
  }

  // ===== 手机/平板 =====
  @Builder
  buildPhone() {
    Column({ space: 16 }) {
      // 品牌标识
      Text('🌊')
        .fontSize(56)
        .margin({ top: 16 })

      Text('汛安')
        .fontSize(26)
        .fontWeight(FontWeight.Bold)
        .fontColor(AppColors.primary)

      Text('智慧防汛应急救援系统')
        .fontSize(13)
        .fontColor(AppColors.textSecondary)

      // 输入区域卡片
      Column({ space: 12 }) {
        TextInput({ placeholder: '请输入手机号', text: $$this.phone })
          .width('100%')
          .height(48)
          .fontSize(15)
          .type(InputType.Number)
          .maxLength(11)
          .backgroundColor(AppColors.bgSecondary)
          .borderRadius(12)
          .padding({ left: 14, right: 14 })

        TextInput({ placeholder: '请输入密码', text: $$this.password })
          .width('100%')
          .height(48)
          .fontSize(15)
          .type(InputType.Password)
          .maxLength(20)
          .backgroundColor(AppColors.bgSecondary)
          .borderRadius(12)
          .padding({ left: 14, right: 14 })

        if (this.errorMsg) {
          Text(this.errorMsg)
            .fontSize(13)
            .fontColor(AppColors.danger)
        }

        Button(this.isLoading ? '登录中...' : '登录')
          .width('100%')
          .height(48)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary)
          .borderRadius(24)
          .margin({ top: 4 })
          .enabled(!this.isLoading)
          .onClick(() => this.handleLogin())
      }
      .width('86%')
      .padding(20)
      .backgroundColor(AppColors.card)
      .borderRadius(20)
      .shadow({ radius: 12, color: 'rgba(0,0,0,0.06)' })

      // 快速求救按钮
      Button('快速求救')
        .width('86%')
        .height(48)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Color.White)
        .backgroundColor(AppColors.danger)
        .borderRadius(24)
        .onClick(() => this.handleQuickSOS())

      // 注册链接
      Row() {
        Text('还没有账号？')
          .fontSize(13)
          .fontColor(AppColors.textTertiary)
        Text('注册账号')
          .fontSize(13)
          .fontColor(AppColors.primary)
          .onClick(() => {
            router.pushUrl({ url: 'pages/RegisterPage' });
          })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  // ===== 手表（紧凑 + 可滚动，适配圆形小屏）=====
  @Builder
  buildWatch() {
    Scroll() {
      Column({ space: 10 }) {
        Text('🌊')
          .fontSize(28)

        Text('汛安')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(AppColors.primary)

        Text('智慧防汛应急救援系统')
          .fontSize(11)
          .fontColor(AppColors.textSecondary)

        // 输入区域卡片
        Column({ space: 8 }) {
          TextInput({ placeholder: '请输入手机号', text: $$this.phone })
            .width('100%')
            .height(38)
            .fontSize(13)
            .type(InputType.Number)
            .maxLength(11)
            .backgroundColor(AppColors.bgSecondary)
            .borderRadius(10)
            .padding({ left: 10, right: 10 })

          TextInput({ placeholder: '请输入密码', text: $$this.password })
            .width('100%')
            .height(38)
            .fontSize(13)
            .type(InputType.Password)
            .maxLength(20)
            .backgroundColor(AppColors.bgSecondary)
            .borderRadius(10)
            .padding({ left: 10, right: 10 })

          if (this.errorMsg) {
            Text(this.errorMsg)
              .fontSize(11)
              .fontColor(AppColors.danger)
          }

          Button(this.isLoading ? '登录中...' : '登录')
            .width('100%')
            .height(38)
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor(Color.White)
            .backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary)
            .borderRadius(19)
            .margin({ top: 2 })
            .enabled(!this.isLoading)
            .onClick(() => this.handleLogin())
        }
        .width('84%')
        .padding(14)
        .backgroundColor(AppColors.card)
        .borderRadius(16)

        Button('快速求救')
          .width('84%')
          .height(38)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(AppColors.danger)
          .borderRadius(19)
          .onClick(() => this.handleQuickSOS())

        Row() {
          Text('还没有账号？')
            .fontSize(11)
            .fontColor(AppColors.textTertiary)
          Text('注册账号')
            .fontSize(11)
            .fontColor(AppColors.primary)
            .onClick(() => {
              router.pushUrl({ url: 'pages/RegisterPage' });
            })
        }
      }
      .width('100%')
      .constraintSize({ minHeight: '100%' })
      .justifyContent(FlexAlign.Center)
      .padding({ left: 20, right: 20, top: 12, bottom: 12 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}
