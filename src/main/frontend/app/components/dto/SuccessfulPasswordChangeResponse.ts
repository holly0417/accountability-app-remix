import type {ResetPasswordDto} from '../dto/ResetPasswordDto';

export interface SuccessfulPasswordChangeResponse {
  message: string;
  changedPassword: ResetPasswordDto;
}
