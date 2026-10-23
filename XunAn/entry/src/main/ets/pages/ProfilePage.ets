import { router, promptAction } from '@kit.ArkUI';
import { common } from '@kit.AbilityKit';
import picker from '@ohos.file.picker';
import { Role } from '../model/Role';
import { getLoggedInPhone, getUserByPhone, clearLoggedIn, uploadImage, updateUserProfile } from '../utils/ApiService';
import { BottomNavBar } from '../components/BottomNavBar';
import { AppColors, getRoleLabel } from '../common/Theme';

function maskPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.substring(0, 3) + '******' + phone.substring(9);
  }
  return phone;
}

@Entry
@Component
struct ProfilePage {
  @State phone: string = '';
  @State name: string = '';
  @State unit: string = '';
  @State avatarUrl: string = '';
  @State roles: Role[] = [];

  aboutToAppear(): void {
    this.loadUser();
  }

  onPageShow(): void {
    this.loadUser();
  }

  async loadUser(): Promise<void> {
    let phone = getLoggedInPhone();
    console.log('ProfilePage loadUser 手机号:', phone);
    if (phone) {
      try {
        let user = await getUserByPhone(phone);
        console.log('ProfilePage loadUser 获取用户:', JSON.stringify(user));
        if (user) {
          this.phone = user.phone;
          this.name = user.name;
          this.unit = user.unit || '';
          this.avatarUrl = user.avatarUrl || '';
          this.roles = user.roles;
          console.log('ProfilePage loadUser 赋值后 name:', this.name, 'unit:', this.unit, 'avatar:', this.avatarUrl);
        } else {
          console.log('ProfilePage loadUser getUserByPhone 返回 null');
        }
      } catch (err) {
        console.error('ProfilePage loadUser 异常:', JSON.stringify(err));
      }
    } else {
      console.log('ProfilePage loadUser 手机号为空');
    }
  }

  goToEdit(field: string, value: string): void {
    if (field === '') return;
    router.pushUrl({
      url: 'pages/EditProfilePage',
      params: { field: field, value: value }
    });
  }

  async handleUploadAvatar(): Promise<void> {
    try {
      let photoSelectOptions = new picker.PhotoSelectOptions();
      photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 1;

      let photoPicker = new picker.PhotoViewPicker();
      let result = await photoPicker.select(photoSelectOptions);
      if (result.photoUris && result.photoUris.length > 0) {
        let uri = result.photoUris[0];
        promptAction.showToast({ message: '正在上传头像...', duration: 2000 });
        let ctx = getContext(this) as common.UIAbilityContext;
        let url = await uploadImage(ctx, uri);
        if (url) {
          // 上传成功，更新用户头像到服务器
          let ok = await updateUserProfile(this.phone, this.name, '', this.unit, '', url);
          if (ok) {
            this.avatarUrl = url;
            promptAction.showToast({ message: '头像更新成功', duration: 2000 });
          } else {
            promptAction.showToast({ message: '头像保存失败', duration: 2000 });
          }
        } else {
          promptAction.showToast({ message: '头像上传失败', duration: 2000 });
        }
      }
    } catch (err) {
      console.error('选择或上传头像失败:', JSON.stringify(err as Error));
      promptAction.showToast({ message: '操作失败', duration: 2000 });
    }
  }

  handleLogout(): void {
    promptAction.showDialog({
      title: '确认退出',
      message: '确定要退出登录吗？',
      buttons: [
        { text: '取消', color: '#999' },
        { text: '退出', color: AppColors.danger }
      ]
    }).then((data) => {
      if (data.index === 1) {
        clearLoggedIn();
        promptAction.showToast({ message: '已退出登录', duration: 2000 });
        router.replaceUrl({ url: 'pages/LoginPage' });
      }
    }).catch(() => {
      // 取消
    });
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
        Text('个人中心')
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
        Column({ space: 0 }) {

          // ── 头像区域 ──
          Column({ space: 8 }) {
            Stack({ alignContent: Alignment.BottomEnd }) {
              if (this.avatarUrl) {
                Image(this.avatarUrl)
                  .width(72)
                  .height(72)
                  .borderRadius(36)
                  .objectFit(ImageFit.Cover)
                  .border({ width: 2, color: AppColors.primary })
              } else {
                Text('👤')
                  .fontSize(52)
                  .width(72)
                  .height(72)
                  .textAlign(TextAlign.Center)
              }
              Text('📷')
                .fontSize(14)
                .width(24)
                .height(24)
                .textAlign(TextAlign.Center)
                .backgroundColor(Color.White)
                .borderRadius(12)
                .shadow({ radius: 2, color: '#20000000' })
                .margin({ bottom: 2, right: 2 })
            }
            .width(72)
            .height(72)
            .onClick(() => this.handleUploadAvatar())

            Text(this.name || '用户')
              .fontSize(20)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.textPrimary)
            Text(this.roles.map(r => getRoleLabel(r)).join(' / '))
              .fontSize(13)
              .fontColor(AppColors.textTertiary)
          }
          .width('100%')
          .padding({ top: 20, bottom: 24 })
          .alignItems(HorizontalAlign.Center)

          // ── 信息列表 ──
          Column({ space: 8 }) {
            // 手机号
            Row({ space: 12 }) {
              Text('📱').fontSize(18)
              Column({ space: 2 }) {
                Text('手机号').fontSize(12).fontColor(AppColors.textTertiary)
                Text(maskPhone(this.phone)).fontSize(15).fontColor(AppColors.textPrimary)
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)
              Text('>').fontSize(16).fontColor(AppColors.textTertiary)
            }
            .width('100%')
            .padding(16)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .onClick(() => this.goToEdit('phone', this.phone))

            // 姓名
            Row({ space: 12 }) {
              Text('✏️').fontSize(18)
              Column({ space: 2 }) {
                Text('姓名').fontSize(12).fontColor(AppColors.textTertiary)
                Text(this.name || '未设置').fontSize(15).fontColor(AppColors.textPrimary)
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)
              Text('>').fontSize(16).fontColor(AppColors.textTertiary)
            }
            .width('100%')
            .padding(16)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .onClick(() => this.goToEdit('name', this.name))

            // 所属单位
            Row({ space: 12 }) {
              Text('🏢').fontSize(18)
              Column({ space: 2 }) {
                Text('所属单位').fontSize(12).fontColor(AppColors.textTertiary)
                Text(this.unit || '未设置').fontSize(15).fontColor(AppColors.textPrimary)
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)
              Text('>').fontSize(16).fontColor(AppColors.textTertiary)
            }
            .width('100%')
            .padding(16)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .onClick(() => this.goToEdit('unit', this.unit))

            // 密码
            Row({ space: 12 }) {
              Text('🔒').fontSize(18)
              Column({ space: 2 }) {
                Text('登录密码').fontSize(12).fontColor(AppColors.textTertiary)
                Text('••••••').fontSize(15).fontColor(AppColors.textPrimary)
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)
              Text('>').fontSize(16).fontColor(AppColors.textTertiary)
            }
            .width('100%')
            .padding(16)
            .backgroundColor(AppColors.card)
            .borderRadius(12)
            .onClick(() => this.goToEdit('password', ''))
          }
          .width('90%')

          // ── 退出登录 ──
          Button('退出登录')
            .width('90%')
            .height(48)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor(AppColors.danger)
            .backgroundColor(AppColors.dangerLight)
            .borderRadius(24)
            .margin({ top: 28, bottom: 30 })
            .onClick(() => this.handleLogout())

          Blank().height(16)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Center)
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)

      BottomNavBar({ activeTab: 1 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}
