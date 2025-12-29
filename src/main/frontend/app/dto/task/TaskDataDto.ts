import type {TaskStatus} from "~/dto/task/TaskStatus";

export interface TaskDataDto {
  id: number,
  userId: number,
  userName: string,
  description: string,
  durationNumber: number,
  durationString: string,
  status: TaskStatus,
}
