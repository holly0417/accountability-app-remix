import type { TaskDataDto } from '~/dto/task/TaskDataDto';
import type {TaskEditRequestDto} from '~/dto/task/TaskEditRequestDto';

import type {TaskCalculatorDto} from '~/dto/task/TaskCalculatorDto';
import type {TaskStatusDto} from '~/dto/task/TaskStatusDto';
import type {TaskStatus} from '~/dto/task/TaskStatus';
import type {Page} from '~/dto/pagination/Page';
import {api} from "~/axios";


export function taskData() {

  const addTask
    = async (description: TaskEditRequestDto): Promise<TaskDataDto> => {

    return (await api.post<TaskDataDto>('/tasks/add',
      description)).data;
  }

  const editTaskDescription
    = async (taskId: number,
             description: TaskEditRequestDto): Promise<void | TaskDataDto> => {

    return (await api.put<TaskDataDto>(`/tasks/${taskId}`,
      description)).data;
  }

  const startTask
    = async (taskId: number): Promise<TaskDataDto> => {

    return (await api.post<TaskDataDto>(`/tasks/${taskId}/start`)).data;
  }

  const endTask
    = async (taskId: number): Promise<TaskDataDto> => {

    return (await api.post<TaskDataDto>(`/tasks/${taskId}/end`)).data;
  }

  const deleteTask
    = async (taskId: number): Promise<void> => {

    await api.delete(`/tasks/${taskId}`);
  }

  const processTaskForPartner
    = async (taskId: number,
             newStatus: TaskStatusDto): Promise<TaskDataDto> => {

    return (await api.post<TaskDataDto>(`/tasks/${taskId}/process`,
      newStatus)).data;
  }
  const getAllTasksByUserList
    = async (usersById: number[],
             page: number = 0,
             size: number = 50): Promise<Page<TaskDataDto>> => {

    return (await api.get<Page<TaskDataDto>>('/tasks', {
      params: {
        userIds: usersById,
        page: page,
        size: size
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const getTasksByCurrentUserAndStatus
    = async (status: TaskStatus,
             page: number = 0,
             size: number = 50): Promise<Page<TaskDataDto>> => {

    return (await api.get<Page<TaskDataDto>>('/tasks', {
      params: {
        statuses: status,
        page: page,
        size: size
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  //REMEMBER: cannot send JSON objects through a GET request!
  const getTasksByUserListAndStatus
    = async (usersById: number[],
             status: TaskStatus,
             page: number = 0,
             size: number = 50): Promise<Page<TaskDataDto>> => {

      return (await api.get<Page<TaskDataDto>>('/tasks', {
        params: {
          userIds: usersById,
          statuses: status,
          page: page,
          size: size
        },
        paramsSerializer: {
          indexes: null
        }
      })).data;

  }

  const getTasksByUserListAndStatusOrderByDuration
    = async (usersById: number[],
             status: TaskStatus,
             page: number = 0,
             size: number = 50): Promise<Page<TaskDataDto>> => {

    return (await api.get<Page<TaskDataDto>>('/tasks/order-by-duration', {
      params: {
        userIds: usersById,
        status: status,
        page: page,
        size: size,
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const calculatePaymentCompleted
    = async (): Promise<TaskCalculatorDto> => {

    return (await api.get('/tasks/calculatePaymentCompleted')).data;
  }

  const calculatePaymentInProgress
    = async (): Promise<TaskCalculatorDto> => {

    return (await api.get('/tasks/calculatePaymentInProgress')).data;
  }

  return { getTasksByUserListAndStatusOrderByDuration, getAllTasksByUserList, startTask,
    endTask, getTasksByCurrentUserAndStatus,
    getTasksByUserListAndStatus, processTaskForPartner, addTask,
    editTaskDescription, deleteTask,
    calculatePaymentCompleted, calculatePaymentInProgress };
}
