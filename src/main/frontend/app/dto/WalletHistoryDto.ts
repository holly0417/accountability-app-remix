import type {LocalDateTime} from 'ts-extended-types';

export interface WalletHistoryDto {
  id: number,
  userId: number,
  walletId: number,
  balance: number,
  dateTime: LocalDateTime,
  dateAsString: string,
}
