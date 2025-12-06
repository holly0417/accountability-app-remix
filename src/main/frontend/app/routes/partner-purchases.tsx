import {data, Link} from "react-router";
import type {Route} from "./+types/partner-purchases"; //this is OK!
import React from "react";
import {walletData} from "~/composables/WalletData";
import {useLoaderData} from "react-router-dom";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import {PurchaseRouteStatus} from "~/dto/purchase/PurchaseRouteStatus";
import type {Page} from "~/dto/pagination/Page";
import {relationshipData} from "~/composables/RelationshipData";
import PartnerWishlistGrid from "~/components/grids/partner-wishlist-grid";
import {purchaseData} from "~/composables/PurchaseData";

export const handle = {
    breadcrumb: () => (
        <Link to="/partner-purchases">Partner purchases</Link>
    ),
};

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getWalletsByUserIds } = walletData();
    const { getPurchaseListByStatusAndUserId, getPurchaseListByUserIds } = purchaseData();
    const {getPartners} = relationshipData();

    const partnerList = await getPartners();
    if(!partnerList){
        throw data("Partner data not found", { status: 404 });
    }
    const partnerWallets = await getWalletsByUserIds(partnerList.map(item => item.id));
    const { status } = params;
    let partnersPurchaseHistory: Page<PurchaseDto>;
    let title: string;

    switch(status) {
        case PurchaseRouteStatus.LISTED:
            partnersPurchaseHistory = await getPurchaseListByStatusAndUserId(partnerList.map(item => item.id), PurchaseStatus.LISTED);
            title = "PARTNERS' WISHLIST ITEMS"
            break;
        case PurchaseRouteStatus.PURCHASED:
            partnersPurchaseHistory = await getPurchaseListByStatusAndUserId(partnerList.map(item => item.id), PurchaseStatus.PURCHASED);
            title = "PARTNERS' PAST PURCHASES"
            break;
        default:
            title = "PARTNERS' WISHLIST ITEMS AND PURCHASES"
            partnersPurchaseHistory = await getPurchaseListByUserIds(partnerList.map(item => item.id));
    }

    return {partnerWallets, partnersPurchaseHistory, title};
}


export default function Purchases(){
    const {partnersPurchaseHistory, title} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <PartnerWishlistGrid data={partnersPurchaseHistory} title={title}/>
        </div>
    );
}