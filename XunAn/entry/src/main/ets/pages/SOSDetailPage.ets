import { router } from '@kit.ArkUI';
import { SOSInfo, getCategoryEmoji } from '../model/SOSInfo';
import { getSOSList } from '../utils/ApiService';
import { AppColors, getStatusColor, getStatusBg } from '../common/Theme';

@Entry
@Component
struct SOSDetailPage {
  @State sos: SOSInfo | null = null;

  aboutToAppear() {
    let params = router.getParams() as Record<string, string>;
    if (params && params['sosId']) {
      getSOSList().then((list) => {
        this.sos = list.find(item => item.id === params['sosId']) || null;
      });
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
        Text('求救详情')
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

      if (this.sos) {
        Scroll() {
          Column({ space: 0 }) {
            // 状态摘要卡
            Column({ space: 8 }) {
              Text(`${getCategoryEmoji(this.sos.category)} ${this.sos.name}`)
                .fontSize(20)
                .fontWeight(FontWeight.Bold)
                .fontColor(AppColors.textPrimary)
              Text(this.sos.status)
                .fontSize(13)
                .fontColor(getStatusColor(this.sos.status))
                .backgroundColor(getStatusBg(this.sos.status))
                .padding({ left: 10, right: 10, top: 3, bottom: 3 })
                .borderRadius(6)
            }
            .width('90%')
            .padding(20)
            .backgroundColor(AppColors.card)
            .borderRadius(16)
            .margin({ top: 8 })
            .alignItems(HorizontalAlign.Center)

            // 详情列表
            Column({ space: 0 }) {
              DetailRow({ label: '编号', value: this.sos.id })
              DetailRow({ label: '紧急类型', value: `${getCategoryEmoji(this.sos.category)} ${this.sos.category}` })
              DetailRow({ label: '姓名', value: this.sos.name })
              DetailRow({ label: '电话', value: this.sos.phone })
              DetailRow({ label: '血型', value: this.sos.bloodType || '未知' })  // 【新增】
              DetailRow({ label: '地址', value: this.sos.address })
              DetailRow({ label: '描述', value: this.sos.description })
              if (this.sos.notes) {
                DetailRow({ label: '补充说明', value: this.sos.notes })
              }
              if (this.sos.imageUrl) {
                Column({ space: 8 }) {
                  Text('现场照片').fontSize(14).fontColor(AppColors.textSecondary).width('100%')
                  Image(this.sos.imageUrl)
                    .width('100%')
                    .height(200)
                    .objectFit(ImageFit.Cover)
                    .borderRadius(12)
                }
                .width('100%')
                .padding({ top: 12, bottom: 12 })
                .border({ width: { bottom: 0.5 }, color: AppColors.divider })
              }
              DetailRow({ label: '紧急程度', value: this.sos.level })
              DetailRow({ label: '状态', value: this.sos.status })
              DetailRow({ label: '时间', value: this.sos.time })
              DetailRow({ label: '指派救援人员', value: this.sos.assignedRescuerName || this.sos.assignedRescuerId || '未指派' })
              DetailRow({ label: '纬度', value: (Number(this.sos.latitude) || 0).toFixed(4) })
              DetailRow({ label: '经度', value: (Number(this.sos.longitude) || 0).toFixed(4) })
            }
            .width('90%')
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .backgroundColor(AppColors.card)
            .borderRadius(16)
            .margin({ top: 12, bottom: 24 })
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      } else {
        Text('未找到信息')
          .fontSize(16)
          .fontColor(AppColors.textTertiary)
          .margin({ top: 40 })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}

@Component
struct DetailRow {
  label: string = '';
  value: string = '';

  build() {
    Row() {
      Text(this.label)
        .fontSize(14)
        .fontColor(AppColors.textSecondary)
        .width(96)
      Text(this.value)
        .fontSize(14)
        .fontColor(AppColors.textPrimary)
        .layoutWeight(1)
        .textAlign(TextAlign.End)
    }
    .width('100%')
    .padding({ top: 12, bottom: 12 })
    .border({ width: { bottom: 0.5 }, color: AppColors.divider })
  }
}