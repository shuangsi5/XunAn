if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AiChatPage_Params {
    messages?: ChatMessage[];
    inputText?: string;
    isLoading?: boolean;
    nextId?: number;
    scroller?: Scroller;
}
import router from "@ohos:router";
import { chatWithAi } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import type { ChatMessageItem } from "@bundle:com.xunan.floodrescue/entry/ets/utils/ApiService";
import { AppColors } from "@bundle:com.xunan.floodrescue/entry/ets/common/Theme";
interface ChatMessage {
    id: number;
    role: string; // 'user' | 'assistant'
    content: string;
}
class AiChatPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.nextId = 1;
        this.scroller = new Scroller();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AiChatPage_Params) {
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.nextId !== undefined) {
            this.nextId = params.nextId;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
    }
    updateStateVars(params: AiChatPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__messages.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __messages: ObservedPropertyObjectPU<ChatMessage[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: ChatMessage[]) {
        this.__messages.set(newValue);
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private nextId: number;
    private scroller: Scroller;
    scrollToBottom(): void {
        this.scroller.scrollEdge(Edge.Bottom);
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
            }
            else {
                this.messages.push({ id: this.nextId++, role: 'assistant', content: '抱歉，AI 服务暂时不可用，请稍后重试。' });
            }
        }
        catch (err) {
            console.error('AI 对话失败', JSON.stringify(err));
            this.messages.push({ id: this.nextId++, role: 'assistant', content: '网络异常，请稍后重试。' });
        }
        finally {
            this.isLoading = false;
            this.scrollToBottom();
        }
    }
    MessageBubble(item: ChatMessage, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.role === 'user') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.content);
                        Text.fontSize(15);
                        Text.fontColor(Color.White);
                        Text.backgroundColor(AppColors.primary);
                        Text.borderRadius({ topLeft: 16, topRight: 4, bottomLeft: 16, bottomRight: 16 });
                        Text.padding(12);
                        Text.constraintSize({ maxWidth: '78%' });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                        Row.alignItems(VerticalAlign.Top);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🤖');
                        Text.fontSize(20);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.content);
                        Text.fontSize(15);
                        Text.fontColor(AppColors.textPrimary);
                        Text.backgroundColor(AppColors.card);
                        Text.borderRadius({ topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 });
                        Text.padding(12);
                        Text.constraintSize({ maxWidth: '78%' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    Row.pop();
                });
            }
        }, If);
        If.pop();
    }
    // 鸿蒙原生式页面转场：push 从右滑入、pop 从左返回，旧页面淡出形成视差
    pageTransition() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransition.create();
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionEnter.create({ duration: 400, curve: Curve.Friction, type: RouteType.Push });
            PageTransitionEnter.slide(SlideEffect.Right);
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionExit.create({ duration: 400, curve: Curve.Friction, type: RouteType.Push });
            PageTransitionExit.slide(SlideEffect.Left);
            PageTransitionExit.opacity(0.6);
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionEnter.create({ duration: 400, curve: Curve.Friction, type: RouteType.Pop });
            PageTransitionEnter.slide(SlideEffect.Left);
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionExit.create({ duration: 400, curve: Curve.Friction, type: RouteType.Pop });
            PageTransitionExit.slide(SlideEffect.Right);
            PageTransitionExit.opacity(0.6);
        }, null);
        PageTransition.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.bg);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 标题栏
            Row.alignItems(VerticalAlign.Center);
            // 标题栏
            Row.padding({ left: 8, right: 8, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('<');
            Button.fontSize(20);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(AppColors.textPrimary);
            Button.width(40);
            Button.height(40);
            Button.onClick(() => router.back());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 助手');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.textPrimary);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('汛安智能问答');
            Text.fontSize(11);
            Text.fontColor(AppColors.textTertiary);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(40);
            Row.height(40);
        }, Row);
        Row.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.messages.length === 0 && !this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态引导
                        Column.create({ space: 12 });
                        // 空状态引导
                        Column.width('100%');
                        // 空状态引导
                        Column.layoutWeight(1);
                        // 空状态引导
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🤖');
                        Text.fontSize(56);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('汛安 AI 助手');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.textPrimary);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('关于防汛避险、应急救援、自救互救等问题\n都可以问我');
                        Text.fontSize(13);
                        Text.fontColor(AppColors.textTertiary);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    // 空状态引导
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 消息列表
                        List.create({ space: 12, scroller: this.scroller });
                        // 消息列表
                        List.width('100%');
                        // 消息列表
                        List.layoutWeight(1);
                        // 消息列表
                        List.padding({ left: 16, right: 16 });
                        // 消息列表
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.MessageBubble.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction, (item: ChatMessage) => item.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLoading) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    const itemCreation = (elmtId, isInitialRender) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                        ListItem.create(deepRenderFunction, true);
                                        if (!isInitialRender) {
                                            ListItem.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    };
                                    const itemCreation2 = (elmtId, isInitialRender) => {
                                        ListItem.create(deepRenderFunction, true);
                                    };
                                    const deepRenderFunction = (elmtId, isInitialRender) => {
                                        itemCreation(elmtId, isInitialRender);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create({ space: 8 });
                                            Row.width('100%');
                                            Row.alignItems(VerticalAlign.Top);
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('🤖');
                                            Text.fontSize(20);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create({ space: 4 });
                                            Column.padding(12);
                                            Column.backgroundColor(AppColors.card);
                                            Column.borderRadius({ topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('正在思考...');
                                            Text.fontSize(13);
                                            Text.fontColor(AppColors.textTertiary);
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        Row.pop();
                                        ListItem.pop();
                                    };
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    ListItem.pop();
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 消息列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入栏
            Row.create({ space: 8 });
            // 输入栏
            Row.width('100%');
            // 输入栏
            Row.padding({ left: 16, right: 16, top: 8, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入您的问题...', text: this.inputText });
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.fontSize(14);
            TextInput.backgroundColor(AppColors.bgSecondary);
            TextInput.borderRadius(22);
            TextInput.padding({ left: 16, right: 16 });
            TextInput.onChange((value: string) => { this.inputText = value; });
            TextInput.onSubmit(() => { this.send(); });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isLoading ? '…' : '发送');
            Button.height(44);
            Button.fontSize(14);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor(Color.White);
            Button.backgroundColor(AppColors.primary);
            Button.borderRadius(22);
            Button.padding({ left: 18, right: 18 });
            Button.enabled(!this.isLoading);
            Button.onClick(() => this.send());
        }, Button);
        Button.pop();
        // 输入栏
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AiChatPage";
    }
}
registerNamedRoute(() => new AiChatPage(undefined, {}), "", { bundleName: "com.xunan.floodrescue", moduleName: "entry", pagePath: "pages/AiChatPage", pageFullPath: "entry/src/main/ets/pages/AiChatPage", integratedHsp: "false", moduleType: "followWithHap" });
