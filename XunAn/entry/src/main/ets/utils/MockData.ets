import { SOSInfo, EmergencyLevel, SOSStatus, EmergencyCategory } from '../model/SOSInfo';
import { RescuerInfo, RescuerStatus } from '../model/RescuerInfo';
import { User } from '../model/User';
import { Role } from '../model/Role';

const SOS_LIST_KEY = 'sosList';
const RESCUER_LIST_KEY = 'rescuerList';
const USER_LIST_KEY = 'userList';
const LOGGED_IN_PHONE_KEY = 'loggedInPhone';
const CURRENT_ROLE_KEY = 'currentRole';

// ========== 底层 JSON 持久化辅助 ==========
// 将对象数组序列化为 JSON 字符串存储，避免 PersistentStorage 对 class 实例序列化失败

function readList<T>(key: string): T[] {
  let json: string = (AppStorage.get(key) as string) || '[]';
  try {
    return JSON.parse(json) as T[];
  } catch (e) {
    return [];
  }
}

function writeList(key: string, list: object[]): void {
  AppStorage.set(key, JSON.stringify(list));
}

// ========== 初始化 ==========

export function initMockData(): void {
  // 注册持久化 key —— 全部用 JSON 字符串存储，保证序列化可靠
  PersistentStorage.persistProp(SOS_LIST_KEY, '[]');
  PersistentStorage.persistProp(RESCUER_LIST_KEY, '[]');
  PersistentStorage.persistProp(USER_LIST_KEY, '[]');
  PersistentStorage.persistProp(LOGGED_IN_PHONE_KEY, '');
  PersistentStorage.persistProp(CURRENT_ROLE_KEY, '');

  // 首次运行：填充救援人员种子数据
  let rescuerList = getRescuerList();
  if (rescuerList.length === 0) {
    let seedRescuers: RescuerInfo[] = [
      new RescuerInfo('r1', '救援队员A', '15000150000', RescuerStatus.BUSY, 39.9100, 116.4100),
      new RescuerInfo('r2', '救援队员B', '15000150001', RescuerStatus.IDLE, 39.9200, 116.4000),
      new RescuerInfo('r3', '救援队员C', '15000150002', RescuerStatus.IDLE, 39.9050, 116.4150)
    ];
    writeList(RESCUER_LIST_KEY, seedRescuers);
  }

  // 首次运行：填充管理员用户
  let userList = getUsers();
  if (userList.length === 0) {
    let seedUsers: User[] = [
      new User('123456', '管理员', '123456', [Role.CITIZEN, Role.RESCUER, Role.COMMAND], '')
    ];
    writeList(USER_LIST_KEY, seedUsers);
  }

  // SOS 求救信息不再填充种子数据 —— 用户数据从注册/发布开始积累
}

// ========== SOS 求救信息 ==========

export function getSOSList(): SOSInfo[] {
  return readList<SOSInfo>(SOS_LIST_KEY);
}

export function addSOS(sos: SOSInfo): void {
  let list = getSOSList();
  list.unshift(sos);
  writeList(SOS_LIST_KEY, list);
}

export function updateSOS(sos: SOSInfo): void {
  let list = getSOSList();
  let index = list.findIndex(item => item.id === sos.id);
  if (index !== -1) {
    list[index] = sos;
    writeList(SOS_LIST_KEY, list);
  }
}

// ========== 救援人员 ==========

export function getRescuerList(): RescuerInfo[] {
  return readList<RescuerInfo>(RESCUER_LIST_KEY);
}

export function assignTask(sosId: string, rescuerId: string): void {
  let sosList = getSOSList();
  let sos = sosList.find(item => item.id === sosId);
  if (sos) {
    sos.status = SOSStatus.RESCUING;
    sos.assignedRescuerId = rescuerId;
    writeList(SOS_LIST_KEY, sosList);
  }
  let rescuerList = getRescuerList();
  let rescuer = rescuerList.find(item => item.id === rescuerId);
  if (rescuer) {
    rescuer.status = RescuerStatus.BUSY;
    writeList(RESCUER_LIST_KEY, rescuerList);
  }
}

export function completeTask(sosId: string): void {
  let sosList = getSOSList();
  let sos = sosList.find(item => item.id === sosId);
  if (sos) {
    sos.status = SOSStatus.COMPLETED;
    let rescuerId = sos.assignedRescuerId;
    writeList(SOS_LIST_KEY, sosList);

    let rescuerList = getRescuerList();
    let rescuer = rescuerList.find(item => item.id === rescuerId);
    if (rescuer) {
      rescuer.status = RescuerStatus.IDLE;
      writeList(RESCUER_LIST_KEY, rescuerList);
    }
  }
}

// ========== 用户管理 ==========

export function getUsers(): User[] {
  return readList<User>(USER_LIST_KEY);
}

export function registerUser(phone: string, name: string, password: string,
  role: Role, unit: string = ''): boolean {
  let list = getUsers();
  let existingUser = list.find(u => u.phone === phone);
  if (existingUser) {
    // 同一手机号追加新角色
    if (existingUser.roles.indexOf(role) === -1) {
      existingUser.roles.push(role);
      writeList(USER_LIST_KEY, list);
    }
    return true;
  }
  list.push(new User(phone, name, password, [role], unit));
  writeList(USER_LIST_KEY, list);
  return true;
}

export function loginUser(phone: string, password: string): User | null {
  let list = getUsers();
  let user = list.find(u => u.phone === phone && u.password === password);
  return user || null;
}

export function getUserByPhone(phone: string): User | null {
  let list = getUsers();
  return list.find(u => u.phone === phone) || null;
}

export function updateUserProfile(phone: string, name: string, password: string, unit: string): boolean {
  let list = getUsers();
  let user = list.find(u => u.phone === phone);
  if (!user) {
    return false;
  }
  user.name = name;
  user.password = password;
  user.unit = unit;
  writeList(USER_LIST_KEY, list);
  return true;
}

// ========== 登录会话持久化 ==========

export function setLoggedInPhone(phone: string): void {
  AppStorage.set(LOGGED_IN_PHONE_KEY, phone);
}

export function getLoggedInPhone(): string {
  return (AppStorage.get(LOGGED_IN_PHONE_KEY) as string) || '';
}

export function clearLoggedIn(): void {
  AppStorage.set(LOGGED_IN_PHONE_KEY, '');
  AppStorage.set(CURRENT_ROLE_KEY, '');
}

// ========== 当前角色持久化 ==========

export function setCurrentRole(role: string): void {
  AppStorage.set(CURRENT_ROLE_KEY, role);
}

export function getCurrentRole(): string {
  return (AppStorage.get(CURRENT_ROLE_KEY) as string) || '';
}
