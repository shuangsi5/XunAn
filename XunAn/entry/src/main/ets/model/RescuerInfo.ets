export enum RescuerStatus {
  IDLE = '空闲',
  BUSY = '任务中'
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
