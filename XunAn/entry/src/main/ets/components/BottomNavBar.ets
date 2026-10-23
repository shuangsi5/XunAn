import { router } from '@kit.ArkUI';
import { AppColors } from '../common/Theme';

@Component
export struct BottomNavBar {
  // 当前激活的标签：0 = 汛安(主页)，1 = AI助手，2 = 个人中心
  @Prop activeTab: number = 0;

  goHome() {
    if (this.activeTab === 0) {
      return;
    }
    // 从其它页返回身份主页
    router.back();
  }

  goAiChat() {
    if (this.activeTab === 1) {
      return;
    }
    router.pushUrl({ url: 'pages/AiChatPage' });
  }

  goProfile() {
    if (this.activeTab === 2) {
      return;
    }
    router.pushUrl({ url: 'pages/ProfilePage' });
  }

  build() {
    Row() {
      // 汛安（主页）
      Column({ space: 2 }) {
        Text('🌊')
          .fontSize(22)
        Text('汛安')
          .fontSize(11)
          .fontWeight(this.activeTab === 0 ? FontWeight.Medium : FontWeight.Normal)
          .fontColor(this.activeTab === 0 ? AppColors.primary : AppColors.textTertiary)
      }
      .layoutWeight(1)
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .onClick(() => this.goHome())

      // AI 助手
      Column({ space: 2 }) {
        Text('🤖')
          .fontSize(22)
        Text('AI助手')
          .fontSize(11)
          .fontWeight(this.activeTab === 1 ? FontWeight.Medium : FontWeight.Normal)
          .fontColor(this.activeTab === 1 ? AppColors.primary : AppColors.textTertiary)
      }
      .layoutWeight(1)
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .onClick(() => this.goAiChat())

      // 个人中心
      Column({ space: 2 }) {
        Text('👤')
          .fontSize(22)
        Text('个人中心')
          .fontSize(11)
          .fontWeight(this.activeTab === 2 ? FontWeight.Medium : FontWeight.Normal)
          .fontColor(this.activeTab === 2 ? AppColors.primary : AppColors.textTertiary)
      }
      .layoutWeight(1)
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .onClick(() => this.goProfile())
    }
    .width('100%')
    .height(56)
    .backgroundColor(AppColors.card)
    .border({ width: { top: 0.5 }, color: AppColors.divider })
  }
}
