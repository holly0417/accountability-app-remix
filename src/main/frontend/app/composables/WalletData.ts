import {api} from "~/axios";
import type {WalletDto} from '~/components/dto/WalletDto.ts';
import type {Page} from '~/components/pagination/Page';
import type {PurchaseDto} from '~/components/dto/PurchaseDto.ts';
import {PurchaseStatus} from "~/components/dto/PurchaseStatus";
import type {PurchaseRouteStatus} from "~/components/dto/PurchaseRouteStatus";

export function walletData() {

  const makePurchase = async (purchaseId: number): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>(`/wallet/purchase/${purchaseId}`)).data;
  }

  const addToWishList = async (purchase: PurchaseDto): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>('/wallet/add-to-wishlist', purchase)).data;
  }

  const getCurrentUserWallet = async (): Promise<WalletDto> => {
    return (await api.get<WalletDto>('/wallet')).data;
  }

  const getCurrentUserPurchaseHistory
        = async (page: number = 0,
                 size: number = 50): Promise<Page<PurchaseDto>> => {

    return (await api.get<Page<PurchaseDto>>('/wallet/purchase', {
      params: {
        page: page,
        size: size
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const getCurrentUserPurchaseListByStatus
        = async (status: PurchaseStatus,
                 page: number = 0,
                 size: number = 50): Promise<Page<PurchaseDto>> => {

        return (await api.get<Page<PurchaseDto>>('/wallet/purchase', {
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

  const getPurchaseListByStatusAndUserId
        = async (usersById: number[],
                 status: PurchaseStatus): Promise<Page<PurchaseDto>> => {

        return (await api.get<Page<PurchaseDto>>('/wallet/purchase', {
            params: {
                userIds: usersById,
                status: status
            },
            paramsSerializer: {
                indexes: null
            }
        })).data;
  }

    const getPurchaseListByUserIds
        = async (usersById: number[]): Promise<Page<PurchaseDto>> => {

        return (await api.get<Page<PurchaseDto>>('/wallet/purchase', {
            params: {
                userId: usersById
            },
            paramsSerializer: {
                indexes: null
            }
        })).data;
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

  return { getPurchaseListByUserIds, getCurrentUserPurchaseListByStatus, getPurchaseListByStatusAndUserId, addToWishList, getWalletsByUserIds, getCurrentUserWallet, getCurrentUserPurchaseHistory, makePurchase };
}
