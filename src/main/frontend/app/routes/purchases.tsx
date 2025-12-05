import {type ActionFunctionArgs, data} from "react-router";
import type {Route} from "./+types/purchases"; //this is OK!
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
import {userData} from "~/composables/UserData";
import {purchaseData} from "~/composables/PurchaseData";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getCurrentUserWallet} = walletData();
    const { getCurrentUserPurchaseHistory, getCurrentUserPurchaseListByStatus } = purchaseData();
    const yourWallet = await getCurrentUserWallet();
    const { status } = params;
    let thisUserPurchaseHistory: Page<PurchaseDto>;
    let title: string;

    switch(status) {
        case PurchaseRouteStatus.LISTED:
            thisUserPurchaseHistory = await getCurrentUserPurchaseListByStatus(PurchaseStatus.LISTED);
            title = "WISHLIST"
            break;
        case PurchaseRouteStatus.PURCHASED:
            thisUserPurchaseHistory = await getCurrentUserPurchaseListByStatus(PurchaseStatus.PURCHASED);
            title = "PAST PURCHASES"
            break;
        default:
            thisUserPurchaseHistory = await getCurrentUserPurchaseHistory();
            title = "ALL ITEMS"
    }

    return {yourWallet, thisUserPurchaseHistory, title};
}

export async function clientAction({ request }: ActionFunctionArgs) {
    const { addToWishList, makePurchase } = purchaseData();
    const formData = await request.formData();
    const {getCurrentUserInfo} = userData();
    const thisUser = await getCurrentUserInfo();

    if (!thisUser) {
        throw data("User not found", { status: 404 });
    }

    const intent = formData.get('intent');

    if (intent == WishlistAction.ADD) {
        const description = formData.get('newPurchaseDescription');
        const price = formData.get('newPurchasePrice');

        if(description && price){
            let newWishListItem: PurchaseDto = {
                id: 0,
                userId: thisUser.id,
                userName: thisUser.username,
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