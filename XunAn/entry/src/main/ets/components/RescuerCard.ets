import { RescuerInfo, RescuerStatus } from '../model/RescuerInfo';
import { AppColors } from '../common/Theme';

@Component
export struct RescuerCard {
  @Prop rescuer: RescuerInfo;
  onSelect?: () => void;

  build() {
    Row() {
      Column() {
        Text(this.rescuer.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(AppColors.textPrimary)
        Text(this.rescuer.phone)
          .fontSize(12)
          .fontColor(AppColors.textSecondary)
          .margin({ top: 2 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Text(this.rescuer.status)
        .fontSize(11)
        .fontColor(this.rescuer.status === RescuerStatus.IDLE ? AppColors.success : AppColors.warning)
        .backgroundColor(this.rescuer.status === RescuerStatus.IDLE ? AppColors.successLight : AppColors.warningLight)
        .padding({ left: 8, right: 8, top: 2, bottom: 2 })
        .borderRadius(4)

      if (this.onSelect && this.rescuer.status === RescuerStatus.IDLE) {
        Button('选择')
          .margin({ left: 10 })
          .fontSize(12)
          .height(32)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius(16)
          .onClick(() => {
            if (this.onSelect) {
              this.onSelect();
            }
          })
      }
    }
    .width('100%')
    .padding(14)
    .backgroundColor(AppColors.card)
    .borderRadius(12)
    .margin({ bottom: 8 })
  }
}
