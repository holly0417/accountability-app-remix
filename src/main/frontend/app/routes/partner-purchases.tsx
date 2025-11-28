import {type ActionFunctionArgs} from "react-router";
import type {Route} from "./+types/partner-purchases"; //this is OK!
import React from "react";
import PurchaseDataGrid from "~/components/Tables/purchase-grid";
import PurchaseForm from "~/components/Forms/PurchaseForm";
import Wallet from "~/components/Wallet";
import {walletData} from "~/composables/WalletData";
import {useLoaderData} from "react-router-dom";
import {WishlistAction} from "~/components/dto/WishlistAction";
import type {PurchaseDto} from "~/components/dto/PurchaseDto";
import {PurchaseStatus} from "~/components/dto/PurchaseStatus";
import {PurchaseRouteStatus} from "~/components/dto/PurchaseRouteStatus";
import type {Page} from "~/components/pagination/Page";
import {relationshipData} from "~/composables/RelationshipData";
import PartnerWishlistGrid from "~/components/Tables/partner-wishlist-grid";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getWalletsByUserIds, getPurchaseListByStatusAndUserId, getPurchaseListByUserIds} = walletData();
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