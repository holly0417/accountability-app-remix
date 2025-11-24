import {api} from "~/axios";
import type {WalletDto} from '~/components/dto/WalletDto.ts';
import type {Page} from '~/components/pagination/Page';
import type {PurchaseDto} from '~/components/dto/PurchaseDto.ts';
import {PurchaseStatus} from "~/components/dto/PurchaseStatus";

export function walletData() {

  const makePurchase = async (purchaseId: number): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>(`/wallet/makePurchase/${purchaseId}`)).data;
  }

  const addToWishList = async (purchase: PurchaseDto): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>('/wallet/add-to-wishlist', purchase)).data;
  }

  const getCurrentUserWallet = async (): Promise<WalletDto> => {
    return (await api.get<WalletDto>('/wallet')).data;
  }

  const getCurrentUserPurchaseHistory
        = async (
                 page: number = 0,
                 size: number = 50): Promise<Page<PurchaseDto>> => {

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
    const getCurrentUserWishList
        = async (status: PurchaseStatus.LISTED,
                 page: number = 0,
                 size: number = 50): Promise<Page<PurchaseDto>> => {

        return (await api.get<Page<PurchaseDto>>('/wallet/getPurchases', {
            params: {
                status: status,
                page: page,
                size: size
            },
            paramsSerializer: {
                indexes: null
            }
        })).data;
    }

    const getCurrentUserPurchases
        = async (status: PurchaseStatus.PURCHASED,
                 page: number = 0,
                 size: number = 50): Promise<Page<PurchaseDto>> => {

        return (await api.get<Page<PurchaseDto>>('/wallet/getPurchases', {
            params: {
                status: status,
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

  return { getCurrentUserPurchases, getCurrentUserWishList, addToWishList, getWalletsByUserIds, getCurrentUserWallet, getCurrentUserPurchaseHistory, makePurchase };
}
