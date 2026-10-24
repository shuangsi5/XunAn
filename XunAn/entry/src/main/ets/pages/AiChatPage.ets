import { router, KeyboardAvoidMode } from '@kit.ArkUI';
import { chatWithAi, ChatMessageItem } from '../utils/ApiService';
import { AppColors } from '../common/Theme';

interface ChatMessage {
  id: number;
  role: string; // 'user' | 'assistant'
  content: string;
}

@Entry
@Component
struct AiChatPage {
  @State messages: ChatMessage[] = [];
  @State inputText: string = '';
  @State isLoading: boolean = false;
  private nextId: number = 1;
  private scroller: Scroller = new Scroller();

  scrollToBottom(): void {
    this.scroller.scrollEdge(Edge.Bottom);
  }

  aboutToAppear(): void {
    // 键盘弹出时压缩页面高度而非整体上移，避免标题栏被顶出屏幕、输入框被键盘遮挡
    this.getUIContext().setKeyboardAvoidMode(KeyboardAvoidMode.RESIZE);
  }

  async send(): Promise<void> {
    const text = this.inputText.trim();
    if (text.length === 0 || this.isLoading) {
      return;
    }

    // 追加用户消息
    this.messages.push({ id: this.nextId++, role: 'user', content: text });
    this.inputText = '';
    this.isLoading = true;
    this.scrollToBottom();

    try {
      // 携带完整上下文，交给服务端拼接 system 提示词
      const apiMessages: ChatMessageItem[] = this.messages.map((m: ChatMessage): ChatMessageItem => {
        return { role: m.role, content: m.content };
      });
      const reply = await chatWithAi(apiMessages);
      if (reply) {
        this.messages.push({ id: this.nextId++, role: 'assistant', content: reply });
      } else {
        this.messages.push({ id: this.nextId++, role: 'assistant', content: '抱歉，AI 服务暂时不可用，请稍后重试。' });
      }
    } catch (err) {
      console.error('AI 对话失败', JSON.stringify(err));
      this.messages.push({ id: this.nextId++, role: 'assistant', content: '网络异常，请稍后重试。' });
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  @Builder
  MessageBubble(item: ChatMessage) {
    if (item.role === 'user') {
      Row() {
        Blank()
        Text(item.content)
          .fontSize(15)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius({ topLeft: 16, topRight: 4, bottomLeft: 16, bottomRight: 16 })
          .padding(12)
          .constraintSize({ maxWidth: '78%' })
      }
      .width('100%')
    } else {
      Row({ space: 8 }) {
        Text('🤖')
          .fontSize(20)
        Text(item.content)
          .fontSize(15)
          .fontColor(AppColors.textPrimary)
          .backgroundColor(AppColors.card)
          .borderRadius({ topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 })
          .padding(12)
          .constraintSize({ maxWidth: '78%' })
        Blank()
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)
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
        Column({ space: 2 }) {
          Text('AI 助手')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Text('汛安智能问答')
            .fontSize(11)
            .fontColor(AppColors.textTertiary)
        }
        Blank()
        Row()
          .width(40)
          .height(40)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .alignItems(VerticalAlign.Center)
      .padding({ left: 8, right: 8, top: 12, bottom: 12 })

      if (this.messages.length === 0 && !this.isLoading) {
        // 空状态引导
        Column({ space: 12 }) {
          Text('🤖')
            .fontSize(56)
          Text('汛安 AI 助手')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(AppColors.textPrimary)
          Text('关于防汛避险、应急救援、自救互救等问题\n都可以问我')
            .fontSize(13)
            .fontColor(AppColors.textTertiary)
            .textAlign(TextAlign.Center)
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 消息列表
        List({ space: 12, scroller: this.scroller }) {
          ForEach(this.messages, (item: ChatMessage) => {
            ListItem() {
              this.MessageBubble(item)
            }
          }, (item: ChatMessage) => item.id.toString())

          if (this.isLoading) {
            ListItem() {
              Row({ space: 8 }) {
                Text('🤖')
                  .fontSize(20)
                Column({ space: 4 }) {
                  Text('正在思考...')
                    .fontSize(13)
                    .fontColor(AppColors.textTertiary)
                }
                .padding(12)
                .backgroundColor(AppColors.card)
                .borderRadius({ topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 })
              }
              .width('100%')
              .alignItems(VerticalAlign.Top)
            }
          }
        }
        .width('100%')
        .layoutWeight(1)
        .padding({ left: 16, right: 16 })
        .scrollBar(BarState.Off)
      }

      // 输入栏
      Row({ space: 8 }) {
        TextInput({ placeholder: '请输入您的问题...', text: $$this.inputText })
          .layoutWeight(1)
          .height(44)
          .fontSize(14)
          .backgroundColor(AppColors.bgSecondary)
          .borderRadius(22)
          .padding({ left: 16, right: 16 })
          .onSubmit(() => { this.send(); })

        Button(this.isLoading ? '…' : '发送')
          .height(44)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .backgroundColor(AppColors.primary)
          .borderRadius(22)
          .padding({ left: 18, right: 18 })
          .enabled(!this.isLoading)
          .onClick(() => this.send())
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 16 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.bg)
  }
}
