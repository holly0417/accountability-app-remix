import type {ResetPasswordDto} from './ResetPasswordDto';

export interface SuccessfulPasswordChangeResponse {
  message: string;
  changedPassword: ResetPasswordDto;
}
