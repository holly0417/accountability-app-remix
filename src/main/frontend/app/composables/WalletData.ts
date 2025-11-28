import {api} from "~/axios";
import type {WalletDto} from '~/components/dto/WalletDto.ts';
import type {Page} from '~/components/pagination/Page';

export function walletData() {

  const getCurrentUserWallet = async (): Promise<WalletDto> => {
    return (await api.get<WalletDto>('/wallet')).data;
  }

  const getWalletsByUserIds
      = async( userIds: number[] ): Promise<Page<WalletDto>> => {
    return (await api.get<Page<WalletDto>>('/wallet/get-wallet', {
      params: {
        userIds: userIds
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  return { getWalletsByUserIds, getCurrentUserWallet };
}
