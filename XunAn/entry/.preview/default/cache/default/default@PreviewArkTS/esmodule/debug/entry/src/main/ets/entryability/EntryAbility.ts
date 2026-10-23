import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type window from "@ohos:window";
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        // 已切换为 MySQL 后端 API，无需本地初始化
    }
    onDestroy(): void {
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                console.error('Failed to load content');
                return;
            }
            console.info('Succeeded in loading content');
        });
    }
    onWindowStageDestroy(): void {
    }
    onForeground(): void {
    }
    onBackground(): void {
    }
}
