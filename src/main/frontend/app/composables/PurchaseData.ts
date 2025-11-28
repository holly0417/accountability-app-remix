import {api} from "~/axios";
import type {WalletDto} from '~/dto/WalletDto.ts';
import type {Page} from '~/dto/pagination/Page';
import type {PurchaseDto} from '~/dto/purchase/PurchaseDto.ts';
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import type {PurchaseRouteStatus} from "~/dto/purchase/PurchaseRouteStatus";

export function purchaseData() {

  const makePurchase = async (purchaseId: number): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>(`/purchase/${purchaseId}`)).data;
  }

  const addToWishList = async (purchase: PurchaseDto): Promise<PurchaseDto> => {
    return (await api.post<PurchaseDto>('/purchase/add-to-wishlist', purchase)).data;
  }

  const getCurrentUserPurchaseHistory
        = async (page: number = 0,
                 size: number = 50): Promise<Page<PurchaseDto>> => {

    return (await api.get<Page<PurchaseDto>>('/purchase', {
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

        return (await api.get<Page<PurchaseDto>>('/purchase', {
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

        return (await api.get<Page<PurchaseDto>>('/purchase', {
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

        return (await api.get<Page<PurchaseDto>>('/purchase', {
            params: {
                userId: usersById
            },
            paramsSerializer: {
                indexes: null
            }
        })).data;
    }


  return { getPurchaseListByUserIds,
      getCurrentUserPurchaseListByStatus,
      getPurchaseListByStatusAndUserId,
      addToWishList,
      getCurrentUserPurchaseHistory,
      makePurchase };
}
