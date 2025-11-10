import {api} from 'boot/axios.ts';
import {WalletDto} from 'components/dto/WalletDto.ts';
import {Page} from 'components/paging/Page.ts';
import {PurchaseDto} from 'components/dto/PurchaseDto.ts';

export function walletData() {

  const makePurchase = async (purchase: PurchaseDto): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>('/wallet/makePurchase', purchase)).data;
  }

  const getCurrentUserWallet = async (): Promise<WalletDto> => {
    return (await api.get<WalletDto>('/wallet')).data;
  }

  const getCurrentUserPurchaseHistory
        = async (page: number = 0,
                 size: number = 20): Promise<Page<PurchaseDto>> => {

    return (await api.get<Page<PurchaseDto>>('/wallet/getPurchases', {
      params: {
        page: page,
        size: size
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const getWalletsByUserIds = async(userIds: number[]): Promise<Page<WalletDto>> => {
    return (await api.get<Page<WalletDto>>('/wallet/get-wallets', {
      params: {
        userIds: userIds
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  return { getWalletsByUserIds, getCurrentUserWallet, getCurrentUserPurchaseHistory, makePurchase };
}
