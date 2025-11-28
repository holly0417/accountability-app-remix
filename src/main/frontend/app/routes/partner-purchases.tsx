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

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getCurrentUserWallet, getPurchaseListByStatusAndUserId} = walletData();
    const {getPartnerIdList} = relationshipData();
    const partnerIdList = await getPartnerIdList();
    const yourWallet = await getCurrentUserWallet();
    const { status } = params;
    let partnersPurchaseHistory: Page<PurchaseDto>;
    let title: string;

    switch(status) {
        case PurchaseRouteStatus.PARTNER_LISTED:
            partnersPurchaseHistory = await getPurchaseListByStatusAndUserId(partnerIdList, PurchaseStatus.LISTED);
            title = "PARTNERS' WISHLIST ITEMS"
            break;
        case PurchaseRouteStatus.PARTNER_PURCHASED:
            partnersPurchaseHistory = await getPurchaseListByStatusAndUserId(partnerIdList, PurchaseStatus.PURCHASED);
            title = "PARTNERS' PAST PURCHASES"
            break;
    }

    return {yourWallet, partnersPurchaseHistory, title};
}

export async function clientAction({ request }: ActionFunctionArgs) {
    const { addToWishList, makePurchase } = walletData();
    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent == WishlistAction.ADD) {
        const description = formData.get('newPurchaseDescription');
        const price = formData.get('newPurchasePrice');

        if(description && price){
            let newWishListItem: PurchaseDto = {
                id: 0,
                description: description.toString(),
                price: Number(price),
                purchaseTimeString: '',
                status: PurchaseStatus.LISTED,
            }

            try {
                await addToWishList(newWishListItem);
                return { ok: true };
            } catch(e) {
                return { ok: false };
            }

        }
    }

    if (intent == WishlistAction.PURCHASE) {
        const item = formData.get('itemId');

        try {
            await makePurchase(Number(item));
            return { ok: true };
        } catch(e) {
            return { ok: false };
        }
    }
}

export default function Purchases(){
    const {yourWallet, thisUserPurchaseHistory, title} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <Wallet wallet={yourWallet}/>
            <PurchaseDataGrid data={thisUserPurchaseHistory} wallet={yourWallet} title={title}/>
        </div>
    );
}