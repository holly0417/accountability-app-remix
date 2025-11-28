import type {PurchaseStatus} from "~/components/dto/PurchaseStatus";

export interface PurchaseDto {
  id: number,
  userId: number,
  userName: string,
  price: number,
  description: string,
  purchaseTimeString: string,
  status: PurchaseStatus
}
