import {type ActionFunctionArgs, data, Link} from "react-router";
import type {Route} from "./+types/purchases"; //this is OK!
import React from "react";
import PurchaseDataGrid from "~/components/grids/purchase-grid";
import Wallet from "~/components/Wallet";
import {walletData} from "~/composables/WalletData";
import {WishlistAction} from "~/dto/purchase/WishlistAction";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import {PurchaseRouteStatus} from "~/dto/purchase/PurchaseRouteStatus";
import type {Page} from "~/dto/pagination/Page";
import {userData} from "~/composables/UserData";
import {purchaseData} from "~/composables/PurchaseData";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations
} from "~/dashboard/ui/Dashboard/theme/customizations";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "~/dashboard/ui/Dashboard/SideMenu";
import AppNavbar from "~/dashboard/ui/Dashboard/AppNavbar";
import {alpha} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "~/dashboard/ui/Dashboard/Header";
import Typography from "@mui/material/Typography";
import AppTheme from "~/dashboard/shared-theme/AppTheme";
import PurchaseForm from "~/components/forms/PurchaseForm";

export const handle = {
    breadcrumb: () => (<Link to="/purchases">Purchases</Link>),
};

export async function clientLoader({params,}: Route.ClientLoaderArgs) {
    const {getCurrentUserWallet} = walletData();
    const {getCurrentUserPurchaseHistory, getCurrentUserPurchaseListByStatus} = purchaseData();
    const {getCurrentUserInfo} = userData();
    const yourWallet = await getCurrentUserWallet();
    const {status} = params;
    let thisUserPurchaseHistory: Page<PurchaseDto>;
    let title: string;

    const user = await getCurrentUserInfo();

    if (!user) {
        throw data("User not found", {status: 404});
    }

    switch (status) {
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

    return {
        wallet: yourWallet, purchases: thisUserPurchaseHistory, title: title, user: user
    };
}

export async function clientAction({request}: ActionFunctionArgs) {
    const {addToWishList, makePurchase} = purchaseData();
    const formData = await request.formData();
    const {getCurrentUserInfo} = userData();
    const thisUser = await getCurrentUserInfo();

    if (!thisUser) {
        throw data("User not found", {status: 404});
    }

    const intent = formData.get('intent');

    if (intent == WishlistAction.ADD) {
        const description = formData.get('newPurchaseDescription');
        const price = formData.get('newPurchasePrice');

        if (description && price) {
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
                return {ok: true};
            } catch (e) {
                return {ok: false};
            }

        }
    }

    if (intent == WishlistAction.PURCHASE) {
        const item = formData.get('itemId');

        try {
            await makePurchase(Number(item));
            return {ok: true};
        } catch (e) {
            return {ok: false};
        }
    }
}

export default function Purchases({loaderData}: Route.ComponentProps) {

    const xThemeComponents = {
        ...chartsCustomizations, ...dataGridCustomizations, ...datePickersCustomizations, ...treeViewCustomizations,
    };

    return (

        <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex'}}>
                <SideMenu user={loaderData.user}/>
                <AppNavbar user={loaderData.user}/>
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)` : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center', mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <Header/>
                    </Stack>

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'flex-start', justifyContent: "flex-start", mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <Typography variant="h1" sx={{fontWeight: 500, lineHeight: '16px'}}>
                            Wallet
                        </Typography>
                    </Stack>

                    <Stack
                        spacing={2}
                        direction="row"
                        sx={{
                            alignItems: 'center', mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <Wallet wallet={loaderData.wallet}/>
                        <PurchaseForm/>
                    </Stack>
                    <Stack
                        direction="column"
                        sx={{
                            alignItems: "stretch", mx: 1, pb: 1, mt: {xs: 1, md: 0},
                        }}
                    >
                        <PurchaseDataGrid data={loaderData.purchases} wallet={loaderData.wallet}
                                          title={loaderData.title}/>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>);
}