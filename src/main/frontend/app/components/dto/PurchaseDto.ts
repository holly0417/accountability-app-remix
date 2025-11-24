import type {PurchaseStatus} from "~/components/dto/PurchaseStatus";

export interface PurchaseDto {
  id: number,
  price: number,
  description: string,
  purchaseTimeString: string,
  status: PurchaseStatus
}
