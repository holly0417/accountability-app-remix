import {type ActionFunctionArgs} from "react-router";
import type {Route} from "./+types/partner-purchases"; //this is OK!
import React from "react";
import PurchaseDataGrid from "~/components/grids/purchase-grid";
import PurchaseForm from "~/components/forms/PurchaseForm";
import Wallet from "~/components/Wallet";
import {walletData} from "~/composables/WalletData";
import {useLoaderData} from "react-router-dom";
import {WishlistAction} from "~/dto/purchase/WishlistAction";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import {PurchaseRouteStatus} from "~/dto/purchase/PurchaseRouteStatus";
import type {Page} from "~/dto/pagination/Page";
import {relationshipData} from "~/composables/RelationshipData";
import PartnerWishlistGrid from "~/components/grids/partner-wishlist-grid";
import {purchaseData} from "~/composables/PurchaseData";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getWalletsByUserIds } = walletData();
    const { getPurchaseListByStatusAndUserId, getPurchaseListByUserIds } = purchaseData();
    const {getPartnerIdList} = relationshipData();
    const partnerIdList = await getPartnerIdList();
    const partnerWallets = await getWalletsByUserIds(partnerIdList);
    const { status } = params;
    let partnersPurchaseHistory: Page<PurchaseDto>;
    let title: string;

    switch(status) {
        case PurchaseRouteStatus.LISTED:
            partnersPurchaseHistory = await getPurchaseListByStatusAndUserId(partnerIdList, PurchaseStatus.LISTED);
            title = "PARTNERS' WISHLIST ITEMS"
            break;
        case PurchaseRouteStatus.PURCHASED:
            partnersPurchaseHistory = await getPurchaseListByStatusAndUserId(partnerIdList, PurchaseStatus.PURCHASED);
            title = "PARTNERS' PAST PURCHASES"
            break;
        default:
            title = "PARTNERS' WISHLIST ITEMS AND PURCHASES"
            partnersPurchaseHistory = await getPurchaseListByUserIds(partnerIdList);
    }

    return {partnerWallets, partnersPurchaseHistory, title};
}


export default function Purchases(){
    const {partnerWallets, partnersPurchaseHistory, title} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <PartnerWishlistGrid data={partnersPurchaseHistory} title={title}/>
        </div>
    );
}