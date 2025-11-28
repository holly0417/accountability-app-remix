import {api} from "~/axios";
import type {WalletDto} from '~/dto/WalletDto.ts';
import type {Page} from '~/dto/pagination/Page';

export function walletData() {

  const getCurrentUserWallet = async (): Promise<WalletDto> => {
    return (await api.get<Page<WalletDto>>('/wallet')).data.content[0];
  }

  const getWalletsByUserIds
      = async( userIds: number[] ): Promise<Page<WalletDto>> => {
    return (await api.get<Page<WalletDto>>('/wallet', {
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
