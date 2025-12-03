import {api} from "~/axios";
import type {WalletDto} from '~/dto/WalletDto.ts';
import type {Page} from '~/dto/pagination/Page';
import type {WalletHistoryDto} from "~/dto/WalletHistoryDto";

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

    const getCurrentUserWalletHistory
        = async(): Promise<Page<WalletHistoryDto>> => {
        return (await api.get<Page<WalletHistoryDto>>('/wallet/history')).data;
    }

    const getWalletHistoryByUserIds
        = async( userIds: number[] ): Promise<Page<WalletHistoryDto>> => {
        return (await api.get<Page<WalletHistoryDto>>('/wallet/history', {
            params: {
                userIds: userIds
            },
            paramsSerializer: {
                indexes: null
            }
        })).data;
    }

  return { getWalletsByUserIds, getCurrentUserWallet, getWalletHistoryByUserIds, getCurrentUserWalletHistory };
}
