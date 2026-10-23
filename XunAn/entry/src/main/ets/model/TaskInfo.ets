export class TaskInfo {
  sosId: string;
  rescuerId: string;
  assignTime: string;
  completeTime: string = '';

  constructor(sosId: string, rescuerId: string, assignTime: string, completeTime: string = '') {
    this.sosId = sosId;
    this.rescuerId = rescuerId;
    this.assignTime = assignTime;
    this.completeTime = completeTime;
  }
}
