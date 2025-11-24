import {type ActionFunctionArgs} from "react-router";
import type {Route} from "./+types/wallet-purchases"; //this is OK!
import React from "react";
import PurchaseDataGrid from "~/components/Tables/purchase-grid";
import PurchaseForm from "~/components/Forms/PurchaseForm";
import Wallet from "~/components/Wallet";
import {walletData} from "~/composables/WalletData";
import {useLoaderData} from "react-router-dom";
import {WishlistAction} from "~/components/dto/WishlistAction";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getCurrentUserWallet, getCurrentUserPurchaseHistory} = walletData();
    const wallet = await getCurrentUserWallet();
    const thisUserPurchaseHistory = await getCurrentUserPurchaseHistory();

    return {wallet, thisUserPurchaseHistory};
}

export async function clientAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent');
    if (intent == WishlistAction.ADD) {

    }
}

export default function WalletPurchases(){
    const {wallet, thisUserPurchaseHistory} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <Wallet wallet={wallet}/>
            <PurchaseForm />
            <PurchaseDataGrid />
        </div>
    );
}