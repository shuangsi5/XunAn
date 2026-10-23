import { common } from '@kit.AbilityKit';
import { router, promptAction } from '@kit.ArkUI';
import { SOSInfo, EmergencyLevel, SOSStatus, EmergencyCategory, getCategoryEmoji } from '../model/SOSInfo';
import { Role } from '../model/Role';
import { addSOS, getSOSList, getLoggedInPhone, getUserByPhone, setCurrentRole, uploadImage } from '../utils/ApiService';
import { SOSCard } from '../components/SOSCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { getCurrentPosition } from '../utils/LocationUtils';
import { AppColors, FilterOption, STATUS_FILTER_OPTIONS, filterStatusByIndex, getRoleColor, getRoleBgColor, getRoleLabel, getRoleEmoji, getRolePage } from '../common/Theme';
import picker from '@ohos.file.picker';

const PAGE_ROLE = Role.CITIZEN;

@Entry
@Component
struct CitizenPage {
  @State sosList: SOSInfo[] = [];
  @State sosProgress: number = 0;
  @State isPressing: boolean = false;
  @State showSOSForm: boolean = false;
  @State selectedCategory: EmergencyCategory = EmergencyCategory.TRAPPED;
  @State formName: string = '';
  @State formPhone: string = '';
  @State formBloodType: string = '未知';
  @State formAddress: string = '';
  @State formNotes: string = '';
  @State formLat: number = 39.9100;
  @State formLng: number = 116.4000;
  @State formLevel: EmergencyLevel = EmergencyLevel.MEDIUM;
  @State formImageUrl: string = '';
  @State isUploading: boolean = false;

  private bloodTypeValues: string[] = ['A型', 'B型', 'AB型', 'O型', '未知'];
  private bloodTypeOptions: SelectOption[] = [
    { value: 'A型' },
    { value: 'B型' },
    { value: 'AB型' },
    { value: 'O型' },
    { value: '未知' }
  ];

  @State showHistorySheet: boolean = false;
  @State filterIndex: number = 0;
  statusOptions: FilterOption[] = STATUS_FILTER_OPTIONS;

  @State showRoleSwitchDialog: boolean = false;
  @State userRoles: Role[] = [];

  pressTimer: number = -1;
  TOTAL_TICKS: number = 30;

  // 紧急类型：6 种（去掉“通讯中断”）
  categories: EmergencyCategory[] = [
    EmergencyCategory.TRAPPED,
    EmergencyCategory.NO_MEDICINE,
    EmergencyCategory.NO_WATER,
    EmergencyCategory.NO_FOOD,
    EmergencyCategory.INJURED,
    EmergencyCategory.NEED_WARMTH
  ];

  aboutToAppear() {
    this.refresh();
    this.loadUserInfo();
    this.loadUserRoles();
  }

  onPageShow() {
    this.refresh();
    let pickedLat = AppStorage.get('pickedLat') as number;
    let pickedLng = AppStorage.get('pickedLng') as number;
    let pickedAddr = AppStorage.get('pickedAddress') as string;
    if (pickedLat !== undefined && pickedLng !== undefined) {
      this.formLat = pickedLat;
      this.formLng = pickedLng;
      this.formAddress = pickedAddr || `纬度 ${this.formLat.toFixed(4)}, 经度 ${this.formLng.toFixed(4)}`;
      AppStorage.set('pickedLat', undefined);
      AppStorage.set('pickedLng', undefined);
      AppStorage.set('pickedAddress', undefined);
      this.showSOSForm = true;
    }
  }

  async refresh() {
    this.sosList = await getSOSList();
  }

  getFilteredList(): SOSInfo[] {
    let f = filterStatusByIndex(this.filterIndex);
    if (f === null) {
      return this.sosList;
    }
    return this.sosList.filter((s: SOSInfo) => s.status === f);
  }

  loadUserInfo() {
    let phone = getLoggedInPhone();
    if (phone) {
      getUserByPhone(phone).then((user) => {
        if (user) {
          this.formName = user.name || '';
          this.formPhone = user.phone || '';
        }
      });
    }
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
    if (role === PAGE_ROLE) return;
    setCurrentRole(role);
    AppStorage.setOrCreate('autoEnteredPage', true);
    router.replaceUrl({ url: getRolePage(role) });
  }

  handleTouchDown() {
    this.isPressing = true;
    this.sosProgress = 0;
    clearInterval(this.pressTimer);
    this.pressTimer = setInterval(() => {
      this.sosProgress += (100 / this.TOTAL_TICKS);
      if (this.sosProgress >= 100) {
        this.sosProgress = 100;
        clearInterval(this.pressTimer);
        this.isPressing = false;
        this.loadUserInfo();
        this.selectedCategory = EmergencyCategory.TRAPPED;
        this.formBloodType = '未知';
        this.formAddress = '';
        this.formNotes = '';
        this.formLevel = EmergencyLevel.MEDIUM;
        this.formImageUrl = '';
        this.formLat = 39.9100;
        this.formLng = 116.4000;
        this.showSOSForm = true;
        this.fetchAndFillLocation();
      }
    }, 100);
  }

  async fetchAndFillLocation() {
    let ctx = getContext(this) as common.UIAbilityContext;
    let pos = await getCurrentPosition(ctx);
    this.formLat = pos.latitude;
    this.formLng = pos.longitude;
    if (pos.address) {
      this.formAddress = pos.address;
    }
  }

  handleTouchUp() {
    clearInterval(this.pressTimer);
    if (this.sosProgress < 100) {
      this.sosProgress = 0;
    }
    this.isPressing = false;
  }

  openMapPicker() {
    this.showSOSForm = false;
    AppStorage.setOrCreate('mapPickerMode', true);
    router.pushUrl({ url: 'pages/MapPage' });
  }

  async submitSOS() {
    let id = Date.now().toString();
    let now = new Date().toLocaleString();
    let description = `${this.selectedCategory}：${this.formNotes || '紧急求救'}`;
    let sos = new SOSInfo(
      id, this.formName || '匿名', this.formPhone || '无',
      this.formBloodType || '未知',
      this.formLat, this.formLng, this.formAddress || '当前定位位置',
      description, this.formLevel, SOSStatus.PENDING, now, '', '',
      this.selectedCategory, this.formNotes, this.formImageUrl
    );
    await addSOS(sos);
    this.showSOSForm = false;
    this.refresh();
  }

  async selectAndUploadImage() {
    try {
      let photoSelectOptions = new picker.PhotoSelectOptions();
      photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 1;

      let photoPicker = new picker.PhotoViewPicker();
      let result = await photoPicker.select(photoSelectOptions);
      if (result.photoUris && result.photoUris.length > 0) {
        let uri = result.photoUris[0];
        this.isUploading = true;
        let ctx = getContext(this) as common.UIAbilityContext;
        let url = await uploadImage(ctx, uri);
        this.isUploading = false;
        if (url) {
          this.formImageUrl = url;
          promptAction.showToast({ message: '上传成功', duration: 2000 });
        } else {
          promptAction.showToast({ message: '上传失败', duration: 2000 });
        }
      }
    } catch (err) {
      this.isUploading = false;
      console.error('选择或上传图片失败:', JSON.stringify(err));
      promptAction.showToast({ message: '操作失败', duration: 2000 });
    }
  }

  // 6 种紧急类型的描述文案
  getCategoryDesc(category: EmergencyCategory): string {
    switch (category) {
      case EmergencyCategory.TRAPPED: return '人员被困/无法移动';
      case EmergencyCategory.NO_MEDICINE: return '急需药品/医疗物资';
      case EmergencyCategory.NO_WATER: return '饮用水短缺';
      case EmergencyCategory.NO_FOOD: return '食品短缺';
      case EmergencyCategory.INJURED: return '有人受伤/需医疗急救';
      case EmergencyCategory.NEED_WARMTH: return '失温/缺少保暖物资';
      default: return '';
    }
  }

  @Builder
  HistorySheetBuilder() {
    Column() {
      Text('我的求救记录')
        .fontSize(17)
        .fontWeight(FontWeight.Bold)
        .fontColor(AppColors.textPrimary)
        .width('100%')
        .padding({ top: 8, bottom: 12 })

      Row() {
        Text(`共 ${this.getFilteredList().length} 条`)
          .fontSize(12)
          .fontColor(AppColors.textTertiary)
        Blank()
        Select(this.statusOptions)
          .selected(this.filterIndex)
          .onSelect((index: number) => { this.filterIndex = index; })
          .width(110).height(30)
          .font({ size: 12 })
          .backgroundColor(AppColors.card)
          .borderRadius(15)
      }
      .width('100%')
      .margin({ bottom: 12 })

      if (this.getFilteredList().length === 0) {
        Column({ space: 8 }) {
          Text('📭').fontSize(40)
          Text('暂无求救记录').fontSize(14).fontColor(AppColors.textTertiary)
        }
        .width('100%').layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List({ space: 12 }) {
          ForEach(this.getFilteredList(), (item: SOSInfo) => {
            ListItem() {
              SOSCard({ sos: item })
            }
          }, (item: SOSInfo) => item.id)
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
    }
    .width('100%')
    .height('100%')
    .padding({ left: 16, right: 16, top: 8 })
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
        // ── 顶部栏 ──
        Row() {
          Button('切换身份')
            .fontSize(11).height(28)
            .padding({ left: 10, right: 10 })
            .backgroundColor(AppColors.primaryLight)
            .fontColor(AppColors.primary)
            .borderRadius(14)
            .onClick(() => this.openRoleSwitchDialog())

          Blank()
          Text('群众求救端')
            .fontSize(18).fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Blank()

          Row()
            .width(40)
            .height(40)
        }
        .width('100%')
        .height(56)
        .alignItems(VerticalAlign.Center)
        .padding({ left: 16, right: 16 })

        // ── 中间 SOS 按钮区 ──
        Column() {
          Blank().layoutWeight(1)

          Text('紧急情况请长按下方按钮')
            .fontSize(13)
            .fontColor(AppColors.textTertiary)
            .margin({ bottom: 24 })

          Stack() {
            if (this.isPressing || this.sosProgress > 0) {
              Circle().width(200).height(200).fill('rgba(232,64,38,0.08)')
              Circle().width(200).height(200)
                .fill('none')
                .stroke('rgba(232,64,38,0.2)')
                .strokeWidth(6)
            }

            Column({ space: 6 }) {
              Text('SOS')
                .fontSize(48)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.White)
              Text(this.isPressing ? '请按住...' : '长按求救')
                .fontSize(16)
                .fontColor(Color.White)
              if (this.isPressing && this.sosProgress > 0 && this.sosProgress < 100) {
                Progress({ value: this.sosProgress, total: 100, type: ProgressType.Linear })
                  .width('70%').height(4)
                  .color(Color.White)
                  .backgroundColor('rgba(255,255,255,0.3)')
              }
            }
            .width(180).height(180)
            .borderRadius(90)
            .backgroundColor(this.isPressing ? '#C9341E' : AppColors.danger)
            .justifyContent(FlexAlign.Center)
            .alignItems(HorizontalAlign.Center)
            .shadow({ radius: this.isPressing ? 8 : 20, color: 'rgba(232,64,38,0.35)' })
            .onTouch((event: TouchEvent) => {
              if (event.type === TouchType.Down) {
                this.handleTouchDown();
              } else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                this.handleTouchUp();
              }
            })
            .scale({ x: this.isPressing ? 0.96 : 1.0, y: this.isPressing ? 0.96 : 1.0 })
            .animation({ duration: 200 })
          }
          .width(220).height(220)
          .alignContent(Alignment.Center)

          if (this.isPressing && this.sosProgress < 100) {
            Text('⚠️ 请持续按住3秒，松手将取消')
              .fontSize(12)
              .fontColor(AppColors.danger)
              .margin({ top: 12 })
          }

          Blank().layoutWeight(1)

          Button('📋 我的求救记录')
            .width(180)
            .height(40)
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor(AppColors.primary)
            .backgroundColor(AppColors.primaryLight)
            .borderRadius(20)
            .margin({ bottom: 20 })
            .onClick(() => { this.showHistorySheet = true; })
        }
        .width('100%')
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)

        BottomNavBar({ activeTab: 0 })
      }
      .width('100%').height('100%')
      .backgroundColor(AppColors.bg)
      .bindSheet($$this.showHistorySheet, this.HistorySheetBuilder(), {
        height: SheetSize.MEDIUM,
        dragBar: true,
        backgroundColor: AppColors.bg,
        onDisappear: () => { this.showHistorySheet = false; }
      })

      // ========== 求救表单 ==========
      if (this.showSOSForm) {
        Column() {
          Row() {
            Button('取消')
              .fontSize(15).fontColor(AppColors.textSecondary)
              .backgroundColor(Color.Transparent)
              .onClick(() => { this.showSOSForm = false; })
            Blank()
            Text('紧急求救')
              .fontSize(18).fontWeight(FontWeight.Bold)
              .fontColor(AppColors.textPrimary)
            Blank()
            Button('取消')
              .fontSize(15).fontColor(Color.Transparent)
              .backgroundColor(Color.Transparent)
          }
          .width('100%')
          .padding({ left: 8, right: 8, top: 8, bottom: 4 })

          Scroll() {
            Column({ space: 0 }) {
              // ── 紧急类型（6 种，三列两行）──
              Column({ space: 12 }) {
                Text('选择紧急类型').fontSize(15).fontWeight(FontWeight.Medium)
                  .fontColor(AppColors.textPrimary).width('100%')

                Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceBetween }) {
                  ForEach(this.categories, (cat: EmergencyCategory) => {
                    Column({ space: 4 }) {
                      Text(getCategoryEmoji(cat)).fontSize(22)
                      Text(cat).fontSize(12).fontWeight(FontWeight.Medium)
                        .fontColor(this.selectedCategory === cat ? AppColors.danger : AppColors.textSecondary)
                    }
                    .width('31%')
                    .padding({ top: 12, bottom: 10 })
                    .margin({ bottom: 8 })
                    .backgroundColor(this.selectedCategory === cat ? AppColors.dangerLight : AppColors.bgSecondary)
                    .borderRadius(12)
                    .border({
                      width: this.selectedCategory === cat ? 1.5 : 0,
                      color: this.selectedCategory === cat ? AppColors.danger : Color.Transparent
                    })
                    .alignItems(HorizontalAlign.Center)
                    .onClick(() => { this.selectedCategory = cat; })
                  }, (cat: EmergencyCategory) => cat)
                }
                .width('100%')

                Text(this.getCategoryDesc(this.selectedCategory))
                  .fontSize(12).fontColor(AppColors.danger).width('100%')
              }
              .width('100%').padding(16)
              .margin({ top: 4, left: 12, right: 12 })
              .backgroundColor(AppColors.card).borderRadius(16)

              // ── 个人信息（含血型）──
              Column({ space: 10 }) {
                Text('个人信息').fontSize(13).fontColor(AppColors.textTertiary)
                  .fontWeight(FontWeight.Medium).width('100%')
                Row({ space: 10 }) {
                  Column({ space: 4 }) { Text('姓名').fontSize(12).fontColor(AppColors.textTertiary) }
                  TextInput({ placeholder: '请输入姓名', text: this.formName })
                    .layoutWeight(1).height(40).fontSize(14)
                    .backgroundColor(AppColors.bgSecondary).borderRadius(10)
                    .onChange((value: string) => { this.formName = value; })
                }.width('100%')
                Row({ space: 10 }) {
                  Column({ space: 4 }) { Text('电话').fontSize(12).fontColor(AppColors.textTertiary) }
                  TextInput({ placeholder: '请输入联系电话', text: this.formPhone })
                    .layoutWeight(1).height(40).fontSize(14)
                    .type(InputType.Number).maxLength(11)
                    .backgroundColor(AppColors.bgSecondary).borderRadius(10)
                    .onChange((value: string) => { this.formPhone = value; })
                }.width('100%')

                // 血型下拉行
                Row({ space: 10 }) {
                  Column({ space: 4 }) { Text('血型').fontSize(12).fontColor(AppColors.textTertiary) }
                  Select(this.bloodTypeOptions)
                    .selected(this.bloodTypeValues.indexOf(this.formBloodType))
                    .value(this.formBloodType)
                    .font({ size: 14 })
                    .fontColor(AppColors.textPrimary)
                    .selectedOptionFont({ size: 14 })
                    .optionFont({ size: 14 })
                    .layoutWeight(1)
                    .height(40)
                    .backgroundColor(AppColors.bgSecondary)
                    .borderRadius(10)
                    .onSelect((index: number, value?: string) => {
                      this.formBloodType = this.bloodTypeValues[index] || this.formBloodType;
                    })
                }.width('100%')
              }
              .width('100%').padding(16)
              .margin({ top: 12, left: 12, right: 12 })
              .backgroundColor(AppColors.card).borderRadius(16)

              // ── 位置 ──
              Column({ space: 10 }) {
                Text('具体位置').fontSize(13).fontColor(AppColors.textTertiary)
                  .fontWeight(FontWeight.Medium).width('100%')
                TextInput({ placeholder: '手动输入地址', text: this.formAddress })
                  .width('100%').height(40).fontSize(14)
                  .backgroundColor(AppColors.bgSecondary).borderRadius(10)
                  .onChange((value: string) => { this.formAddress = value; })
                Button('📍 从地图选取当前位置')
                  .width('100%').height(40).fontSize(14)
                  .fontColor(AppColors.primary)
                  .backgroundColor(AppColors.primaryLight)
                  .borderRadius(20)
                  .onClick(() => this.openMapPicker())
              }
              .width('100%').padding(16)
              .margin({ top: 12, left: 12, right: 12 })
              .backgroundColor(AppColors.card).borderRadius(16)

              // ── 紧急程度 ──
              Column({ space: 10 }) {
                Text('紧急程度').fontSize(13).fontColor(AppColors.textTertiary)
                  .fontWeight(FontWeight.Medium).width('100%')
                Row({ space: 10 }) {
                  Button('一般')
                    .layoutWeight(1).height(36).fontSize(13).fontWeight(FontWeight.Medium)
                    .backgroundColor(this.formLevel === EmergencyLevel.LOW ? AppColors.success : AppColors.bgSecondary)
                    .fontColor(this.formLevel === EmergencyLevel.LOW ? Color.White : AppColors.textSecondary)
                    .borderRadius(18)
                    .onClick(() => { this.formLevel = EmergencyLevel.LOW; })
                  Button('紧急')
                    .layoutWeight(1).height(36).fontSize(13).fontWeight(FontWeight.Medium)
                    .backgroundColor(this.formLevel === EmergencyLevel.MEDIUM ? AppColors.warning : AppColors.bgSecondary)
                    .fontColor(this.formLevel === EmergencyLevel.MEDIUM ? Color.White : AppColors.textSecondary)
                    .borderRadius(18)
                    .onClick(() => { this.formLevel = EmergencyLevel.MEDIUM; })
                  Button('特急')
                    .layoutWeight(1).height(36).fontSize(13).fontWeight(FontWeight.Medium)
                    .backgroundColor(this.formLevel === EmergencyLevel.HIGH ? AppColors.danger : AppColors.bgSecondary)
                    .fontColor(this.formLevel === EmergencyLevel.HIGH ? Color.White : AppColors.textSecondary)
                    .borderRadius(18)
                    .onClick(() => { this.formLevel = EmergencyLevel.HIGH; })
                }.width('100%')
              }
              .width('100%').padding(16)
              .margin({ top: 12, left: 12, right: 12 })
              .backgroundColor(AppColors.card).borderRadius(16)

              // ── 补充说明 ──
              Column({ space: 10 }) {
                Row() {
                  Text('补充说明').fontSize(13).fontColor(AppColors.textTertiary).fontWeight(FontWeight.Medium)
                  Text('（选填）').fontSize(11).fontColor(AppColors.textTertiary)
                }
                TextArea({ placeholder: '请描述详细情况，如人数、伤情、具体需求等…', text: this.formNotes })
                  .width('100%').height(80).fontSize(14)
                  .backgroundColor(AppColors.bgSecondary).borderRadius(10).padding(10)
                  .onChange((value: string) => { this.formNotes = value; })
              }
              .width('100%').padding(16)
              .margin({ top: 12, left: 12, right: 12 })
              .backgroundColor(AppColors.card).borderRadius(16)

              // ── 现场照片 ──
              Column({ space: 10 }) {
                Text('现场照片').fontSize(13).fontColor(AppColors.textTertiary)
                  .fontWeight(FontWeight.Medium).width('100%')
                if (this.formImageUrl) {
                  Column({ space: 8 }) {
                    Image(this.formImageUrl)
                      .width('100%')
                      .height(180)
                      .objectFit(ImageFit.Cover)
                      .borderRadius(12)
                    Button('重新上传')
                      .width('100%')
                      .height(36)
                      .fontSize(13)
                      .fontColor(AppColors.primary)
                      .backgroundColor(AppColors.primaryLight)
                      .borderRadius(18)
                      .enabled(!this.isUploading)
                      .onClick(() => this.selectAndUploadImage())
                  }
                  .width('100%')
                } else {
                  Button(this.isUploading ? '上传中...' : '📷 上传现场照片')
                    .width('100%')
                    .height(48)
                    .fontSize(14)
                    .fontColor(AppColors.primary)
                    .backgroundColor(AppColors.primaryLight)
                    .borderRadius(24)
                    .enabled(!this.isUploading)
                    .onClick(() => this.selectAndUploadImage())
                }
              }
              .width('100%').padding(16)
              .margin({ top: 12, left: 12, right: 12 })
              .backgroundColor(AppColors.card).borderRadius(16)

              Button('确认求救')
                .width('92%').height(48).fontSize(17).fontWeight(FontWeight.Bold)
                .fontColor(Color.White).backgroundColor(AppColors.danger).borderRadius(24)
                .margin({ top: 20, bottom: 30 })
                .shadow({ radius: 8, color: 'rgba(232,64,38,0.3)' })
                .onClick(() => this.submitSOS())

              Blank().height(16)
            }
            .width('100%').alignItems(HorizontalAlign.Center)
          }
          .layoutWeight(1).scrollBar(BarState.Off).edgeEffect(EdgeEffect.Spring)
        }
        .width('100%').height('100%').backgroundColor(AppColors.bg)
      }

      // ========== 身份切换弹窗 ==========
      if (this.showRoleSwitchDialog) {
        Column() {
          Column().width('100%').layoutWeight(1)
            .backgroundColor('rgba(0,0,0,0.5)')
            .onClick(() => { this.showRoleSwitchDialog = false; })
          Column({ space: 16 }) {
            Text('切换身份').fontSize(18).fontWeight(FontWeight.Bold)
              .fontColor(AppColors.textPrimary).width('100%').textAlign(TextAlign.Center)
            Column({ space: 10 }) {
              ForEach(this.userRoles, (role: Role) => {
                Row({ space: 10 }) {
                  Text(getRoleEmoji(role)).fontSize(22)
                  Text(getRoleLabel(role)).fontSize(15).fontWeight(FontWeight.Medium)
                    .fontColor(getRoleColor(role))
                  Blank()
                  if (role === PAGE_ROLE) {
                    Text('当前').fontSize(12).fontColor(AppColors.textTertiary)
                  }
                }
                .width('100%').padding(14)
                .backgroundColor(role === PAGE_ROLE ? getRoleBgColor(role) : AppColors.bgSecondary)
                .borderRadius(12)
                .border({
                  width: role === PAGE_ROLE ? 1.5 : 0,
                  color: role === PAGE_ROLE ? getRoleColor(role) : Color.Transparent
                })
                .onClick(() => this.switchToRole(role))
              }, (role: Role) => role)
            }.width('100%')
            Button('取消').width('100%').height(44).fontSize(15)
              .backgroundColor(AppColors.bgSecondary).fontColor(AppColors.textSecondary)
              .borderRadius(22)
              .onClick(() => { this.showRoleSwitchDialog = false; })
          }
          .width('100%').padding(20)
          .backgroundColor(AppColors.card)
          .borderRadius({ topLeft: 20, topRight: 20 })
        }
        .width('100%').height('100%').justifyContent(FlexAlign.End)
      }
    }
    .width('100%').height('100%')
  }
}