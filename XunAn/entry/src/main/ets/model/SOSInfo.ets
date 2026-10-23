export enum EmergencyLevel {
  LOW = '一般',
  MEDIUM = '紧急',
  HIGH = '特急'
}

export enum SOSStatus {
  PENDING = '待救援',
  RESCUING = '救援中',
  COMPLETED = '已完成'
}

export enum EmergencyCategory {
  TRAPPED = '受困',
  NO_MEDICINE = '缺药品',
  NO_WATER = '缺水',
  NO_FOOD = '缺食物',
  INJURED = '受伤',
  NEED_WARMTH = '需保暖'
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
    case EmergencyCategory.INJURED:
      return '🩸';
    case EmergencyCategory.NEED_WARMTH:
      return '🧥';
    default:
      return '📢';
  }
}

export class SOSInfo {
  id: string;
  name: string;
  phone: string;
  bloodType: string;
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
  imageUrl: string;

  constructor(id: string, name: string, phone: string, bloodType: string, latitude: number, longitude: number,
    address: string, description: string, level: EmergencyLevel, status: SOSStatus, time: string,
    assignedRescuerId: string = '', assignedRescuerName: string = '', category: EmergencyCategory = EmergencyCategory.TRAPPED,
    notes: string = '', imageUrl: string = '') {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.bloodType = bloodType;
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
    this.imageUrl = imageUrl;
  }
}