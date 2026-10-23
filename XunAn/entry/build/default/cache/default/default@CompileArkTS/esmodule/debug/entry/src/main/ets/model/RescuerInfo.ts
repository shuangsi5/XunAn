export enum RescuerStatus {
    IDLE = "\u7A7A\u95F2",
    BUSY = "\u4EFB\u52A1\u4E2D"
}
export class RescuerInfo {
    id: string;
    name: string;
    phone: string;
    status: RescuerStatus;
    latitude: number;
    longitude: number;
    constructor(id: string, name: string, phone: string, status: RescuerStatus, latitude: number, longitude: number) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
