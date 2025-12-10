import type {GenericResponseDto} from '~/dto/GenericResponseDto';
import axios from 'axios';
import type {ResetPasswordDto} from '~/dto/user/ResetPasswordDto';
import type {SuccessfulPasswordChangeResponse} from '~/dto/user/SuccessfulPasswordChangeResponse.ts';

export function useEmail() {

    const api = axios.create({
    baseURL: '/', // Base URL for all requests
    headers: { 'Content-Type': 'application/json', }, // Send data as JSON
    maxRedirects: 0 // Don't follow redirects automatically
    });

    const sendEmailResetPassword = async (email: string): Promise<GenericResponseDto> => {

      try {
          const response = await api.get<GenericResponseDto>('/email/send-token', {
          params: { email: email },
          paramsSerializer: { indexes: null }
            })
          return response.data;
      } catch (e) {
          return {
              message: 'Email does not exist',
              error: true
          }
      }
    }

    const setNewPassword = async (resetPasswordDto: ResetPasswordDto) => {
            const response = await api.post<GenericResponseDto>('/email/set-new-password', resetPasswordDto);
            return response.data;
    }

  return { sendEmailResetPassword, setNewPassword};
}
