import deviceInfo from "@ohos:deviceInfo";
// ===================== 设备自适应工具 =====================
// 依据设备类型判断是否穿戴设备（手表/手环），在小圆屏上使用紧凑布局，
// 避免固定尺寸的内容在手表屏幕上溢出或被圆形屏幕裁切。
export type DeviceKind = 'wearable' | 'phone' | 'tablet' | 'other';
export function getDeviceKind(): DeviceKind {
    const t: string = deviceInfo.deviceType;
    if (t === 'wearable' || t === 'liteWearable') {
        return 'wearable';
    }
    if (t === 'tablet' || t === '2in1') {
        return 'tablet';
    }
    if (t === 'phone') {
        return 'phone';
    }
    return 'other';
}
export function isWearable(): boolean {
    return getDeviceKind() === 'wearable';
}
// 字号/间距缩放系数：手表上整体缩小，降低内容高度避免溢出
export function adaptiveScale(): number {
    return getDeviceKind() === 'wearable' ? 0.72 : 1;
}
