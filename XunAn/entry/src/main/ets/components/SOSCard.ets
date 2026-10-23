import { SOSInfo, EmergencyLevel, SOSStatus, getCategoryEmoji } from '../model/SOSInfo';
import { AppColors, getStatusColor, getStatusBg } from '../common/Theme';

@Component
export struct SOSCard {
  @Prop sos: SOSInfo;
  onAssign?: () => void;
  onDetail?: () => void;

  getLevelColor(): string {
    switch (this.sos.level) {
      case EmergencyLevel.HIGH:
        return AppColors.danger;
      case EmergencyLevel.MEDIUM:
        return AppColors.warning;
      default:
        return AppColors.success;
    }
  }

  build() {
    Column() {
      // 顶部：左侧姓名，右侧类型/级别/血型标签
      Row() {
        // 左侧：图标 + 姓名
        Row({ space: 8 }) {
          Text(getCategoryEmoji(this.sos.category))
            .fontSize(20)
          Text(this.sos.name)
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .layoutWeight(1)

        // 右侧：类型 + 级别 + 血型
        Row({ space: 6 }) {
          Text(this.sos.category)
            .fontSize(10)
            .fontColor(AppColors.textTertiary)
            .backgroundColor(AppColors.bgSecondary)
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .borderRadius(4)

          Text(this.sos.level)
            .fontSize(10)
            .fontColor(Color.White)
            .backgroundColor(this.getLevelColor())
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .borderRadius(4)

          // 【血型标签】放在“紧急”右侧
          if (this.sos.bloodType) {
            Text(this.sos.bloodType)
              .fontSize(10)
              .fontColor(this.sos.bloodType === '未知' ? AppColors.textTertiary : Color.White)
              .backgroundColor(this.sos.bloodType === '未知' ? AppColors.bgSecondary : '#E53935')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .borderRadius(4)
          }
        }
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)

      // 地址
      Row({ space: 4 }) {
        Text('📍')
          .fontSize(12)
        Text(this.sos.address)
          .fontSize(13)
          .fontColor(AppColors.textSecondary)
          .layoutWeight(1)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .width('100%')
      .margin({ top: 8 })

      // 描述
      Text(this.sos.description)
        .fontSize(14)
        .fontColor(AppColors.textPrimary)
        .margin({ top: 6 })
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      // 补充说明
      if (this.sos.notes) {
        Text(`📝 ${this.sos.notes}`)
          .fontSize(12)
          .fontColor(AppColors.textTertiary)
          .margin({ top: 6 })
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }

      // 底部：状态标签 + 时间
      Row() {
        Text(this.sos.status)
          .fontSize(11)
          .fontColor(getStatusColor(this.sos.status))
          .backgroundColor(getStatusBg(this.sos.status))
          .padding({ left: 8, right: 8, top: 2, bottom: 2 })
          .borderRadius(4)
        Blank()
        Text(this.sos.time)
          .fontSize(11)
          .fontColor(AppColors.textTertiary)
      }
      .width('100%')
      .margin({ top: 10 })

      // 操作按钮
      if (this.onAssign && this.sos.status === SOSStatus.PENDING) {
        Button('指派救援')
          .width('100%')
          .height(36)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius(18)
          .margin({ top: 12 })
          .onClick(() => {
            if (this.onAssign) {
              this.onAssign();
            }
          })
      }
      if (this.onDetail) {
        Button('查看详情')
          .width('100%')
          .height(36)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(AppColors.primary)
          .backgroundColor(AppColors.primaryLight)
          .borderRadius(18)
          .margin({ top: this.onAssign && this.sos.status === SOSStatus.PENDING ? 8 : 12 })
          .onClick(() => {
            if (this.onDetail) {
              this.onDetail();
            }
          })
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(AppColors.card)
    .borderRadius(16)
    .shadow({ radius: 8, color: 'rgba(0,0,0,0.04)' })
    .margin({ bottom: 12 })
  }
}