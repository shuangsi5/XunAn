import http from "@ohos:net.http";
import type { Context } from "@ohos:abilityAccessCtrl";
import fileIo from "@ohos:file.fs";
import util from "@ohos:util";
import { User } from "@bundle:com.xunan.floodrescue/entry/ets/model/User";
import type { Role } from '../model/Role';
import { SOSInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import type { EmergencyLevel, SOSStatus, EmergencyCategory } from "@bundle:com.xunan.floodrescue/entry/ets/model/SOSInfo";
import { RescuerInfo } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
import type { RescuerStatus } from "@bundle:com.xunan.floodrescue/entry/ets/model/RescuerInfo";
// ===================== 原始后端返回实体接口 =====================
interface RawSOSItem {
    id: number;
    name: string;
    phone: string;
    bloodType: string; // 【新增】后端返回的血型字段
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    level: string;
    status: string;
    time: string;
    assignedRescuerId: string;
    assignedRescuerName: string;
    category: string;
    notes: string;
    imageUrl: string; // 【新增】现场照片URL
}
interface RawRescuerItem {
    id: number;
    name: string;
    phone: string;
    status: string;
    latitude: number;
    longitude: number;
}
interface RawUserItem {
    phone: string;
    name: string;
    password: string;
    roles: string[];
    unit: string;
    avatarUrl?: string;
}
// ===================== 请求Body接口 =====================
interface AddSOSBody {
    name: string;
    phone: string;
    bloodType: string; // 【新增】提交时带上血型
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    level: string;
    category: string;
    notes: string;
    imageUrl: string; // 【新增】现场照片URL
}
interface UpdateSOSBody {
    status: string;
    assignedRescuerId: string | null;
    notes: string;
}
interface AssignTaskBody {
    sosId: number;
    rescuerId: number;
}
interface CompleteTaskBody {
    sosId: number;
}
interface RegisterBody {
    phone: string;
    name: string;
    password: string;
    roles: Role[];
    unit: string;
}
interface LoginBody {
    phone: string;
    password: string;
}
interface UpdateUserBody {
    name: string;
    password: string;
    unit: string;
    newPhone: string;
    avatarUrl?: string;
}
// ===================== 后端 API 地址 =====================
const BASE_URL = 'http://42.121.114.11:3000/api';
// 本地测试
//const BASE_URL = 'http://10.0.2.2:3000/api';
// ===================== 会话 Key =====================
const LOGGED_IN_PHONE_KEY = 'loggedInPhone';
const CURRENT_ROLE_KEY = 'currentRole';
// ===================== 响应类型定义 =====================
interface SuccessResponse {
    success: true;
    data?: object | Array<object>;
    message?: string;
    user?: object;
}
interface ErrorResponse {
    success: false;
    message: string;
    data?: object | Array<object>;
}
type ApiResponse = SuccessResponse | ErrorResponse;
// ===================== HTTP 请求辅助 =====================
async function request(method: http.RequestMethod, path: string, body?: object): Promise<ApiResponse> {
    const httpRequest = http.createHttp();
    try {
        const opts: http.HttpRequestOptions = {
            method: method,
            header: { 'Content-Type': 'application/json' },
            expectDataType: http.HttpDataType.STRING,
            connectTimeout: 10000,
            readTimeout: 10000
        };
        if (body) {
            opts.extraData = JSON.stringify(body);
        }
        const resp = await httpRequest.request(BASE_URL + path, opts);
        const data = JSON.parse(resp.result as string) as ApiResponse;
        httpRequest.destroy();
        return data;
    }
    catch (err) {
        httpRequest.destroy();
        return {
            success: false,
            message: (err as Error).message || '网络请求失败'
        };
    }
}
async function get(path: string): Promise<ApiResponse> {
    return request(http.RequestMethod.GET, path);
}
async function post(path: string, body?: object): Promise<ApiResponse> {
    return request(http.RequestMethod.POST, path, body);
}
async function put(path: string, body?: object): Promise<ApiResponse> {
    return request(http.RequestMethod.PUT, path, body);
}
// ===================== SOS 求救信息 =====================
export async function getSOSList(): Promise<SOSInfo[]> {
    const result: ApiResponse = await get('/sos');
    if (!result.success) {
        return [];
    }
    const data = result.data as Array<RawSOSItem>;
    if (!data || !Array.isArray(data)) {
        return [];
    }
    return data.map((item: RawSOSItem) => {
        return new SOSInfo(item.id.toString(), item.name, item.phone, item.bloodType || '未知', Number(item.latitude) || 0, Number(item.longitude) || 0, item.address || '', item.description || '', item.level as EmergencyLevel, item.status as SOSStatus, item.time || '', String(item.assignedRescuerId || ''), item.assignedRescuerName || '', item.category as EmergencyCategory, item.notes || '', item.imageUrl || '');
    });
}
export async function addSOS(sos: SOSInfo): Promise<boolean> {
    const body: AddSOSBody = {
        name: sos.name,
        phone: sos.phone,
        bloodType: sos.bloodType,
        latitude: sos.latitude,
        longitude: sos.longitude,
        address: sos.address,
        description: sos.description,
        level: sos.level,
        category: sos.category,
        notes: sos.notes,
        imageUrl: sos.imageUrl
    };
    const result: ApiResponse = await post('/sos', body);
    return result.success === true;
}
// ===================== 图片上传 =====================
interface UploadResponse {
    success: boolean;
    url?: string;
    message?: string;
}
export async function uploadImage(context: Context, fileUri: string): Promise<string> {
    try {
        console.log('原始 fileUri:', fileUri);
        let uploadFileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
        if (!uploadFileName || uploadFileName.length === 0) {
            uploadFileName = 'image.jpg';
        }
        // 1. 读取文件为 ArrayBuffer
        let file = fileIo.openSync(fileUri, fileIo.OpenMode.READ_ONLY);
        let stat = fileIo.statSync(file.fd);
        let buf = new ArrayBuffer(stat.size);
        fileIo.readSync(file.fd, buf);
        fileIo.closeSync(file);
        // 2. ArrayBuffer -> Base64
        let uint8Array = new Uint8Array(buf);
        let base64Helper = new util.Base64Helper();
        let base64 = base64Helper.encodeToStringSync(uint8Array);
        console.log('文件读取成功，大小:', stat.size, 'Base64长度:', base64.length);
        // 3. 用普通 HTTP POST 发送 Base64
        let httpRequest = http.createHttp();
        let resp = await httpRequest.request(BASE_URL + '/upload/base64', {
            method: http.RequestMethod.POST,
            header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            extraData: JSON.stringify({
                image: base64,
                filename: uploadFileName
            })
        });
        console.log('上传响应码:', resp.responseCode);
        console.log('上传响应体:', resp.result);
        if (resp.responseCode === 200 && resp.result) {
            let result = JSON.parse(resp.result.toString()) as UploadResponse;
            if (result.success && result.url) {
                return result.url;
            }
            else {
                throw new Error(result.message || '上传失败');
            }
        }
        else {
            throw new Error('服务器响应异常: ' + resp.responseCode);
        }
    }
    catch (err) {
        console.error('上传图片异常:', JSON.stringify(err));
        return '';
    }
}
export async function updateSOS(sos: SOSInfo): Promise<boolean> {
    const body: UpdateSOSBody = {
        status: sos.status,
        assignedRescuerId: sos.assignedRescuerId || null,
        notes: sos.notes
    };
    const result: ApiResponse = await put(`/sos/${sos.id}`, body);
    return result.success === true;
}
// ===================== 救援人员 =====================
export async function getRescuerList(): Promise<RescuerInfo[]> {
    const result: ApiResponse = await get('/rescuers');
    if (!result.success) {
        return [];
    }
    const data = result.data as Array<RawRescuerItem>;
    if (!data || !Array.isArray(data)) {
        return [];
    }
    return data.map((item: RawRescuerItem) => {
        return new RescuerInfo(item.id.toString(), item.name, String(item.phone), item.status as RescuerStatus, Number(item.latitude) || 0, Number(item.longitude) || 0);
    });
}
export async function assignTask(sosId: string, rescuerId: string): Promise<boolean> {
    const body: AssignTaskBody = {
        sosId: parseInt(sosId, 10),
        rescuerId: parseInt(rescuerId, 10)
    };
    const result: ApiResponse = await post('/rescuers/assign', body);
    return result.success === true;
}
export async function completeTask(sosId: string): Promise<boolean> {
    const body: CompleteTaskBody = {
        sosId: parseInt(sosId, 10)
    };
    const result: ApiResponse = await post('/rescuers/complete', body);
    return result.success === true;
}
// ===================== 用户管理 =====================
export async function getUsers(): Promise<User[]> {
    return [];
}
export async function registerUser(phone: string, name: string, password: string, roles: Role[], unit: string = ''): Promise<boolean> {
    const body: RegisterBody = {
        phone: phone,
        name: name,
        password: password,
        roles: roles,
        unit: unit
    };
    const result: ApiResponse = await post('/auth/register', body);
    return result.success === true;
}
export class LoginResult {
    user: User | null;
    error: string;
    constructor(user: User | null, error: string = '') {
        this.user = user;
        this.error = error;
    }
}
export async function loginUser(phone: string, password: string): Promise<LoginResult> {
    const body: LoginBody = {
        phone: phone,
        password: password
    };
    const result: ApiResponse = await post('/auth/login', body);
    if (result.success === true && result.user) {
        const userData = result.user as RawUserItem;
        return new LoginResult(new User(userData.phone, userData.name, userData.password, userData.roles as Role[], userData.unit || ''));
    }
    return new LoginResult(null, (result as ErrorResponse).message || '手机号或密码错误');
}
export async function getUserByPhone(phone: string): Promise<User | null> {
    const result: ApiResponse = await get(`/user/${phone}`);
    if (result.success === true && result.user) {
        const userData = result.user as RawUserItem;
        return new User(userData.phone, userData.name, userData.password, userData.roles as Role[], userData.unit || '', userData.avatarUrl || '');
    }
    return null;
}
export async function updateUserProfile(phone: string, name: string, password: string, unit: string, newPhone: string = '', avatarUrl: string = ''): Promise<boolean> {
    const body: UpdateUserBody = {
        name: name,
        password: password,
        unit: unit,
        newPhone: newPhone,
        avatarUrl: avatarUrl
    };
    const result: ApiResponse = await put(`/user/${phone}`, body);
    return result.success === true;
}
// ===================== 登录会话持久化 =====================
export function setLoggedInPhone(phone: string): void {
    AppStorage.setOrCreate(LOGGED_IN_PHONE_KEY, phone);
}
export function getLoggedInPhone(): string {
    return (AppStorage.get(LOGGED_IN_PHONE_KEY) as string) || '';
}
export function clearLoggedIn(): void {
    AppStorage.setOrCreate(LOGGED_IN_PHONE_KEY, '');
    AppStorage.setOrCreate(CURRENT_ROLE_KEY, '');
}
// ===================== 当前角色持久化 =====================
export function setCurrentRole(role: string): void {
    AppStorage.setOrCreate(CURRENT_ROLE_KEY, role);
}
export function getCurrentRole(): string {
    return (AppStorage.get(CURRENT_ROLE_KEY) as string) || '';
}
