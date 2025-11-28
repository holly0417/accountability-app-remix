import {api} from '~/axios';
import type {UserDto} from '~/dto/user/UserDto';
import type {Page} from '~/dto/pagination/Page';

export function userData() {

  const getCurrentUserInfo = async (): Promise<UserDto> => {
    return (await api.get<UserDto>('/user')).data;
  }

  const getAllUsers = async (): Promise<Page<UserDto>> => {
    return (await api.get<Page<UserDto>>('/user/all-platform-users')).data;
  }


  return { getCurrentUserInfo, getAllUsers };
}
