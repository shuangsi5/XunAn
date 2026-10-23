import { router, promptAction } from '@kit.ArkUI';
import { Role } from '../model/Role';
import { registerUser } from '../utils/ApiService';
import { AppColors } from '../common/Theme';

class SelectOption {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

interface RoleOption {
  role: Role;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

@Entry
@Component
struct RegisterPage {
  @State phone: string = '';
  @State name: string = '';
  @State password: string = '';
  @State errorMsg: string = '';
  @State selectedRoles: Role[] = [Role.CITIZEN];
  private roleOptions: RoleOption[] = [
    { role: Role.CITIZEN, label: '群众', emoji: '👤', color: AppColors.primary, bgColor: AppColors.primaryLight },
    { role: Role.RESCUER, label: '救援人员', emoji: '🚑', color: AppColors.warning, bgColor: AppColors.warningLight },
    { role: Role.COMMAND, label: '指挥部', emoji: '🏢', color: AppColors.success, bgColor: AppColors.successLight }
  ];
  private unitOptions: SelectOption[] = [
    new SelectOption('消防'),
    new SelectOption('武警'),
    new SelectOption('社区'),
    new SelectOption('其他')
  ];
  @State unitIndex: number = 0;
  @State isLoading: boolean = false;

  toggleRole(role: Role): void {
    let newRoles = [...this.selectedRoles];
    const index = newRoles.indexOf(role);
    if (index > -1) {
      // 至少保留一个角色
      if (newRoles.length > 1) {
        newRoles.splice(index, 1);
      }
    } else {
      newRoles.push(role);
    }
    this.selectedRoles = newRoles;
  }

  hasNonCitizenRole(): boolean {
    return this.selectedRoles.some((r: Role) => r !== Role.CITIZEN);
  }

  async handleRegister(): Promise<void> {
    this.errorMsg = '';
    let phone = this.phone.trim();
    if (!phone) {
      this.errorMsg = '请输入手机号';
      return;
    }
    if (phone.length !== 11) {
      this.errorMsg = '手机号必须为11位';
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      this.errorMsg = '请输入正确的手机号';
      return;
    }
    if (!this.name.trim()) {
      this.errorMsg = '请输入姓名';
      return;
    }
    if (!this.password.trim()) {
      this.errorMsg = '请输入密码';
      return;
    }
    if (this.password.length < 4) {
      this.errorMsg = '密码至少4位';
      return;
    }
    if (this.selectedRoles.length === 0) {
      this.errorMsg = '请至少选择一个身份';
      return;
    }
    this.isLoading = true;
    let unit = this.hasNonCitizenRole() ? this.unitOptions[this.unitIndex].value : '';
    let success = await registerUser(phone, this.name.trim(), this.password.trim(), this.selectedRoles, unit);
    this.isLoading = false;
    if (success) {
      promptAction.showToast({ message: '注册成功', duration: 2000 });
      router.back();
    } else {
      this.errorMsg = '注册失败，请检查网络后重试';
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
    Column() {
      // 标题栏
      Row() {
        Button('←')
          .fontSize(20)
          .backgroundColor(Color.Transparent)
          .fontColor(AppColors.textPrimary)
          .width(40)
          .height(40)
          .onClick(() => router.back())
        Blank()
        Text('注册账号')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(AppColors.textPrimary)
        Blank()
        Row()
          .width(40)
          .height(40)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .alignItems(VerticalAlign.Center)
      .padding({ left: 8, right: 8, top: 12, bottom: 12 })

      Scroll() {
        Column({ space: 12 }) {
          // 角色选择（多选）
          Text('选择身份（可多选）')
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor(AppColors.textSecondary)
            .width('90%')

          Row({ space: 10 }) {
            ForEach(
              this.roleOptions,
              (option: RoleOption) => {
                Column({ space: 4 }) {
                  Text(option.emoji)
                    .fontSize(24)
                  Text(option.label)
                    .fontSize(13)
                    .fontWeight(FontWeight.Medium)
                    .fontColor(this.selectedRoles.includes(option.role) ? option.color : AppColors.textSecondary)
                  if (this.selectedRoles.includes(option.role)) {
                    Text('✓')
                      .fontSize(10)
                      .fontColor(option.color)
                  } else {
                    Text(' ')
                      .fontSize(10)
                  }
                }
                .width('28%')
                .padding({ top: 12, bottom: 10 })
                .backgroundColor(this.selectedRoles.includes(option.role) ? option.bgColor : AppColors.bgSecondary)
                .borderRadius(12)
                .border({
                  width: this.selectedRoles.includes(option.role) ? 1.5 : 0,
                  color: this.selectedRoles.includes(option.role) ? option.color : Color.Transparent
                })
                .alignItems(HorizontalAlign.Center)
                .onClick(() => this.toggleRole(option.role))
              },
              (option: RoleOption) => option.role
            )
          }
          .width('90%')
          .justifyContent(FlexAlign.SpaceBetween)

          // 手机号
          TextInput({ placeholder: '手机号', text: $$this.phone })
            .width('90%')
            .height(48)
            .fontSize(15)
            .type(InputType.Number)
            .maxLength(11)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .padding({ left: 14, right: 14 })

          // 姓名
          TextInput({ placeholder: '姓名', text: $$this.name })
            .width('90%')
            .height(48)
            .fontSize(15)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .padding({ left: 14, right: 14 })

          // 密码
          TextInput({ placeholder: '密码', text: $$this.password })
            .width('90%')
            .height(48)
            .fontSize(15)
            .type(InputType.Password)
            .maxLength(20)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .padding({ left: 14, right: 14 })

          // 条件：包含救援或指挥角色时需选择单位
          if (this.hasNonCitizenRole()) {
            Text('所属单位')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor(AppColors.textSecondary)
              .width('90%')
              .margin({ top: 4 })

            Select(this.unitOptions)
              .selected(this.unitIndex)
              .onSelect((index: number) => {
                this.unitIndex = index;
              })
              .width('90%')
              .height(48)
              .font({ size: 15 })
              .backgroundColor(AppColors.card)
              .borderRadius(12)
          }

          // 错误信息
          if (this.errorMsg) {
            Text(this.errorMsg)
              .fontSize(13)
              .fontColor(AppColors.danger)
              .width('90%')
              .margin({ top: 4 })
          }

          // 注册按钮
          Button(this.isLoading ? '注册中...' : '注册')
            .width('90%')
            .height(48)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor(Color.White)
            .backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary)
            .borderRadius(24)
            .margin({ top: 16, bottom: 24 })
            .enabled(!this.isLoading)
            .onClick(() => this.handleRegister())
        }
        .width('100%')
        .alignItems(HorizontalAlign.Center)
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}
