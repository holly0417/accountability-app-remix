import {type ActionFunctionArgs, data} from "react-router";
import type {Route} from "./+types/wallet-purchases"; //this is OK!
import React from "react";
import PurchaseDataGrid from "~/components/grids/purchase-grid";
import PurchaseForm from "~/components/forms/PurchaseForm";
import Wallet from "~/components/Wallet";
import {walletData} from "~/composables/WalletData";
import {useLoaderData} from "react-router-dom";
import {WishlistAction} from "~/dto/purchase/WishlistAction";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import {userData} from "~/composables/UserData";
import {purchaseData} from "~/composables/PurchaseData";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getCurrentUserWallet} = walletData();
    const { getCurrentUserPurchaseHistory } = purchaseData();
    const wallet = await getCurrentUserWallet();
    const thisUserPurchaseHistory = await getCurrentUserPurchaseHistory();
    const title = "ALL ITEMS";

    return {wallet, thisUserPurchaseHistory, title};
}

export async function clientAction({ request }: ActionFunctionArgs) {

    const { addToWishList, makePurchase } = purchaseData();
    const {getCurrentUserInfo} = userData();

    try {
        const thisUser = await getCurrentUserInfo();

        if (!thisUser) {
            throw data("User not found", { status: 404 });
        }

        const formData = await request.formData();
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
    } catch (e) {
        throw e;
    }
}

export default function WalletPurchases(){
    const {wallet, thisUserPurchaseHistory, title} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <Wallet wallet={wallet}/>
            <PurchaseForm />
            <PurchaseDataGrid data={thisUserPurchaseHistory} wallet={wallet} title={title}/>
        </div>
    );
}