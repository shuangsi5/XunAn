export enum EmergencyLevel {
    LOW = "\u4E00\u822C",
    MEDIUM = "\u7D27\u6025",
    HIGH = "\u7279\u6025"
}
export enum SOSStatus {
    PENDING = "\u5F85\u6551\u63F4",
    RESCUING = "\u6551\u63F4\u4E2D",
    COMPLETED = "\u5DF2\u5B8C\u6210"
}
export enum EmergencyCategory {
    TRAPPED = "\u53D7\u56F0",
    NO_MEDICINE = "\u7F3A\u836F\u54C1",
    NO_WATER = "\u7F3A\u6C34",
    NO_FOOD = "\u7F3A\u98DF\u7269"
}
export function getCategoryEmoji(category: EmergencyCategory): string {
    switch (category) {
        case EmergencyCategory.TRAPPED:
            return '🆘';
        case EmergencyCategory.NO_MEDICINE:
            return '💊';
        case EmergencyCategory.NO_WATER:
            return '💧';
        case EmergencyCategory.NO_FOOD:
            return '🍞';
        default:
            return '📢';
    }
}
export class SOSInfo {
    id: string;
    name: string;
    phone: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    level: EmergencyLevel;
    status: SOSStatus;
    time: string;
    assignedRescuerId: string;
    assignedRescuerName: string;
    category: EmergencyCategory;
    notes: string;
    constructor(id: string, name: string, phone: string, latitude: number, longitude: number, address: string, description: string, level: EmergencyLevel, status: SOSStatus, time: string, assignedRescuerId: string = '', assignedRescuerName: string = '', category: EmergencyCategory = EmergencyCategory.TRAPPED, notes: string = '') {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.description = description;
        this.level = level;
        this.status = status;
        this.time = time;
        this.assignedRescuerId = assignedRescuerId;
        this.assignedRescuerName = assignedRescuerName;
        this.category = category;
        this.notes = notes;
    }
}
