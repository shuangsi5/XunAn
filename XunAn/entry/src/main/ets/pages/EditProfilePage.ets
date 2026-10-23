import { router, promptAction } from '@kit.ArkUI';
import { getLoggedInPhone, getUserByPhone, updateUserProfile, setLoggedInPhone } from '../utils/ApiService';
import { AppColors } from '../common/Theme';

class UnitOption {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

@Entry
@Component
struct EditProfilePage {
  @State field: string = '';
  @State label: string = '';
  @State icon: string = '';
  @State value: string = '';
  @State newPassword: string = '';
  @State confirmPassword: string = '';
  @State errorMsg: string = '';
  @State phone: string = '';
  @State isLoading: boolean = false;
  // 当前用户的完整信息（保存时只修改目标字段，其他保持原值）
  @State currentName: string = '';
  @State currentPassword: string = '';
  @State currentUnit: string = '';
  // 单位下拉菜单
  @State unitIndex: number = 0;
  private unitOptions: UnitOption[] = [
    new UnitOption('消防'),
    new UnitOption('武警'),
    new UnitOption('社区'),
    new UnitOption('其他')
  ];

  async aboutToAppear(): Promise<void> {
    let params = router.getParams() as Record<string, string>;
    this.field = params['field'] || '';
    this.value = params['value'] || '';
    this.phone = getLoggedInPhone();

    switch (this.field) {
      case 'name':
        this.label = '修改姓名';
        this.icon = '✏️';
        break;
      case 'unit':
        this.label = '修改单位';
        this.icon = '🏢';
        break;
      case 'password':
        this.label = '修改密码';
        this.icon = '🔒';
        break;
      case 'phone':
        this.label = '修改手机号';
        this.icon = '📱';
        break;
      default:
        this.label = '编辑';
        this.icon = '✏️';
    }

    // 获取当前用户完整信息
    if (this.phone) {
      let user = await getUserByPhone(this.phone);
      if (user) {
        let u = user; // 消除 null 推断问题
        this.currentName = u.name;
        this.currentPassword = u.password;
        this.currentUnit = u.unit;
        // 如果是修改单位，根据当前值设置下拉菜单选中项
        if (this.field === 'unit') {
          let idx = this.unitOptions.findIndex(o => o.value === u.unit);
          if (idx >= 0) {
            this.unitIndex = idx;
          }
        }
      }
    }
  }

  async handleSave(): Promise<void> {
    this.errorMsg = '';

    if (this.field === 'password') {
      // 修改密码校验
      if (!this.newPassword.trim()) {
        this.errorMsg = '请输入新密码';
        return;
      }
      if (this.newPassword.length < 4) {
        this.errorMsg = '密码至少4位';
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMsg = '两次输入的密码不一致';
        return;
      }
    } else if (this.field === 'phone') {
      // 修改手机号校验
      let newPhone = this.value.trim();
      if (!newPhone) {
        this.errorMsg = '请输入手机号';
        return;
      }
      if (newPhone.length !== 11) {
        this.errorMsg = '手机号必须为11位';
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(newPhone)) {
        this.errorMsg = '请输入正确的手机号';
        return;
      }
    } else {
      // 姓名/单位校验
      if (this.field === 'name' && !this.value.trim()) {
        this.errorMsg = '姓名不能为空';
        return;
      }
    }

    this.isLoading = true;

    let name = this.currentName;
    let password = this.currentPassword;
    let unit = this.currentUnit;
    let newPhone = '';

    if (this.field === 'name') {
      name = this.value.trim();
    } else if (this.field === 'unit') {
      unit = this.unitOptions[this.unitIndex].value;
    } else if (this.field === 'password') {
      password = this.newPassword.trim();
    } else if (this.field === 'phone') {
      newPhone = this.value.trim();
    }

    let success = await updateUserProfile(this.phone, name, password, unit, newPhone);
    this.isLoading = false;

    if (success) {
      promptAction.showToast({ message: '修改成功', duration: 2000 });
      // 如果修改了手机号，更新本地存储的登录手机号
      if (this.field === 'phone' && newPhone) {
        setLoggedInPhone(newPhone);
      }
      router.back();
    } else {
      this.errorMsg = '修改失败，请重试';
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
        Button('<')
          .fontSize(20)
          .backgroundColor(Color.Transparent)
          .fontColor(AppColors.textPrimary)
          .width(40)
          .height(40)
          .onClick(() => router.back())
        Blank()
        Text(this.label)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(AppColors.textPrimary)
        Blank()
        Button(this.isLoading ? '保存中...' : '保存')
          .fontSize(14)
          .height(32)
          .padding({ left: 14, right: 14 })
          .fontColor(Color.White)
          .backgroundColor(this.isLoading ? '#7BA9FF' : AppColors.primary)
          .borderRadius(16)
          .enabled(!this.isLoading)
          .onClick(() => this.handleSave())
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .alignItems(VerticalAlign.Center)
      .padding({ left: 8, right: 16, top: 12, bottom: 12 })

      Column({ space: 16 }) {
        // 编辑区域
        if (this.field === 'password') {
          // 密码修改表单
          Column({ space: 12 }) {
            Row({ space: 8 }) {
              Text('🔐').fontSize(16)
              Text('新密码').fontSize(14).fontColor(AppColors.textSecondary)
            }
            .width('100%')
            TextInput({ placeholder: '请输入新密码（至少4位）', text: $$this.newPassword })
              .width('100%')
              .height(48)
              .fontSize(15)
              .type(InputType.Password)
              .maxLength(20)
              .backgroundColor(AppColors.bgSecondary)
              .borderRadius(12)
              .padding({ left: 12, right: 12 })

            Row({ space: 8 }) {
              Text('🔐').fontSize(16)
              Text('确认密码').fontSize(14).fontColor(AppColors.textSecondary)
            }
            .width('100%')
            TextInput({ placeholder: '请再次输入新密码', text: $$this.confirmPassword })
              .width('100%')
              .height(48)
              .fontSize(15)
              .type(InputType.Password)
              .maxLength(20)
              .backgroundColor(AppColors.bgSecondary)
              .borderRadius(12)
              .padding({ left: 12, right: 12 })
          }
          .width('90%')
          .padding(16)
          .backgroundColor(AppColors.card)
          .borderRadius(16)
          .margin({ top: 20 })
        } else if (this.field === 'unit') {
          // 单位修改：下拉菜单
          Column({ space: 12 }) {
            Row({ space: 8 }) {
              Text(this.icon).fontSize(16)
              Text(this.label).fontSize(14).fontColor(AppColors.textSecondary)
            }
            .width('100%')
            Select(this.unitOptions)
              .selected(this.unitIndex)
              .value(this.currentUnit || this.unitOptions[this.unitIndex]?.value || '')
              .onSelect((index: number) => {
                this.unitIndex = index;
              })
              .width('100%')
              .height(48)
              .font({ size: 15 })
              .backgroundColor(AppColors.bgSecondary)
              .borderRadius(12)
          }
          .width('90%')
          .padding(16)
          .backgroundColor(AppColors.card)
          .borderRadius(16)
          .margin({ top: 20 })
        } else {
          // 姓名/手机号编辑
          Column({ space: 12 }) {
            Row({ space: 8 }) {
              Text(this.icon).fontSize(16)
              Text(this.label).fontSize(14).fontColor(AppColors.textSecondary)
            }
            .width('100%')
            TextInput({
              placeholder: `请输入${this.label.replace('修改', '')}`,
              text: $$this.value
            })
              .width('100%')
              .height(48)
              .fontSize(15)
              .type(this.field === 'phone' ? InputType.Number : InputType.Normal)
              .maxLength(this.field === 'phone' ? 11 : 50)
              .backgroundColor(AppColors.bgSecondary)
              .borderRadius(12)
              .padding({ left: 12, right: 12 })
          }
          .width('90%')
          .padding(16)
          .backgroundColor(AppColors.card)
          .borderRadius(16)
          .margin({ top: 20 })
        }

        // 错误信息
        if (this.errorMsg) {
          Text(this.errorMsg)
            .fontSize(13)
            .fontColor(AppColors.danger)
            .width('85%')
            .margin({ top: 8 })
        }
      }
      .width('100%')
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}
