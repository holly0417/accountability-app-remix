import type {GenericResponseDto} from '~/dto/GenericResponseDto';
import axios from 'axios';
import type {ResetPasswordDto} from '~/dto/user/ResetPasswordDto';
import type {SuccessfulPasswordChangeResponse} from '~/dto/user/SuccessfulPasswordChangeResponse.ts';
import type {ErrorResponse} from '~/dto/ErrorResponse.ts';
import {useState} from "react";

export function email() {

  const api = axios.create({
    baseURL: '/', // Base URL for all requests
    headers: { 'Content-Type': 'application/json', }, // Send data as JSON
    maxRedirects: 0 // Don't follow redirects automatically
  });

  const sendEmailResetPassword = async (email: string): Promise<GenericResponseDto> => {
    return (await api.get<GenericResponseDto>('/email/send-token', {
      params: {
        email: email
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const [ error, setError ] = useState<ErrorResponse>();

  const setNewPassword = async (resetPasswordDto: ResetPasswordDto) => {

    try {
        const response = await api.post<SuccessfulPasswordChangeResponse>('/email/set-new-password', resetPasswordDto);
        return response.data.message; // Return the success message

    } catch (err) {

      if(axios.isAxiosError(err) && err.response){
        const errorData = err.response.data as ErrorResponse;

        // Create enhanced error with backend information
        const enhancedError: ErrorResponse = {
          message: errorData.message,
          errors: errorData.errors,
          errorCode: errorData.errorCode
        };

        setError(enhancedError);
        throw enhancedError;

      } else {
        // Network or other errors
        const networkError: ErrorResponse = {
          message: 'Network error. Please check your connection.'
        };

        setError(networkError);
        throw networkError;
      }
    }

  }

  return { sendEmailResetPassword, setNewPassword, error };
}
