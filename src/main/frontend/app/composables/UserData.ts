import {api} from '~/axios';
import type {UserDto} from '~/dto/user/UserDto';
import type {Page} from '~/dto/pagination/Page';
import {useNavigate} from "react-router";


export function userData() {

  const getCurrentUserInfo = async (): Promise<UserDto | null> => {
      try {
          const response = await api.get<UserDto>('/user');

          return response.data;

      } catch (error: any) {

          if (error.response && error.response.status === 404) {
              console.warn("User not found");
              return null;
          }

          throw error;
      }
  }

  const getAllUsers = async (): Promise<Page<UserDto>> => {
    return (await api.get<Page<UserDto>>('/user/all-platform-users')).data;
  }

  return { getCurrentUserInfo, getAllUsers };
}
