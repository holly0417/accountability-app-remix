import {api} from 'boot/axios.ts';
import {UserDto} from 'components/dto/UserDto.ts';
import {Page} from 'components/paging/Page.ts';

export function userData() {

  const getCurrentUserInfo = async (): Promise<UserDto> => {
    return (await api.get<UserDto>('/user')).data;
  }

  const getAllUsers = async (): Promise<Page<UserDto>> => {
    return (await api.get<Page<UserDto>>('/user/all-platform-users')).data;
  }


  return { getCurrentUserInfo, getAllUsers };
}
