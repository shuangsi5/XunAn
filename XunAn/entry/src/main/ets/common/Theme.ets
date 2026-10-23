import { SOSStatus } from '../model/SOSInfo';
import { Role } from '../model/Role';

// ===================== 鸿蒙原生风格主题 (HarmonyOS Design) =====================
// 统一管理全局配色、状态/角色辅助色、筛选选项，保证各页面视觉一致

export class AppColors {
  // 主色（鸿蒙蓝）
  static readonly primary: string = '#0A59F7';
  static readonly primaryLight: string = '#E8F1FF';

  // 语义色：待救援=红、救援中=橙、已完成=绿
  static readonly danger: string = '#E84026';
  static readonly dangerLight: string = '#FDECEA';
  static readonly warning: string = '#ED6F21';
  static readonly warningLight: string = '#FDF1E7';
  static readonly success: string = '#0AA679';
  static readonly successLight: string = '#E6F5F0';

  // 文字色
  static readonly textPrimary: string = '#182431';
  static readonly textSecondary: string = '#66182431';
  static readonly textTertiary: string = '#99182431';

  // 背景与分割
  static readonly bg: string = '#F1F3F5';
  static readonly bgSecondary: string = '#F7F8FA';
  static readonly card: string = '#FFFFFF';
  static readonly divider: string = '#E5E6EB';
}

// ===================== 状态辅助 =====================
export function getStatusColor(status: SOSStatus): string {
  if (status === SOSStatus.PENDING) {
    return AppColors.danger;
  }
  if (status === SOSStatus.RESCUING) {
    return AppColors.warning;
  }
  return AppColors.success;
}

export function getStatusBg(status: SOSStatus): string {
  if (status === SOSStatus.PENDING) {
    return AppColors.dangerLight;
  }
  if (status === SOSStatus.RESCUING) {
    return AppColors.warningLight;
  }
  return AppColors.successLight;
}

// ===================== 角色辅助 =====================
export function getRoleColor(role: Role): string {
  if (role === Role.CITIZEN) {
    return AppColors.primary;
  }
  if (role === Role.RESCUER) {
    return AppColors.warning;
  }
  return AppColors.success;
}

export function getRoleBgColor(role: Role): string {
  if (role === Role.CITIZEN) {
    return AppColors.primaryLight;
  }
  if (role === Role.RESCUER) {
    return AppColors.warningLight;
  }
  return AppColors.successLight;
}

export function getRoleLabel(role: Role): string {
  if (role === Role.CITIZEN) {
    return '群众';
  }
  if (role === Role.RESCUER) {
    return '救援人员';
  }
  return '指挥部';
}

export function getRoleEmoji(role: Role): string {
  if (role === Role.CITIZEN) {
    return '👤';
  }
  if (role === Role.RESCUER) {
    return '🚑';
  }
  return '🏢';
}

export function getRolePage(role: Role): string {
  if (role === Role.CITIZEN) {
    return 'pages/CitizenPage';
  }
  if (role === Role.RESCUER) {
    return 'pages/RescuerPage';
  }
  return 'pages/CommandPage';
}

// ===================== 状态筛选选项 =====================
export class FilterOption {
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}

// 下拉/分段筛选选项（下标 0 = 全部）
export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  new FilterOption('全部状态'),
  new FilterOption(SOSStatus.PENDING),
  new FilterOption(SOSStatus.RESCUING),
  new FilterOption(SOSStatus.COMPLETED)
];

// 根据筛选下标返回要匹配的状态；0 = 全部返回 null
export function filterStatusByIndex(index: number): SOSStatus | null {
  if (index === 1) {
    return SOSStatus.PENDING;
  }
  if (index === 2) {
    return SOSStatus.RESCUING;
  }
  if (index === 3) {
    return SOSStatus.COMPLETED;
  }
  return null;
}
