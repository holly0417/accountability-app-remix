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
import AppTheme from "~/dashboard/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "~/dashboard/ui/Dashboard/SideMenu";
import AppNavbar from "~/dashboard/ui/Dashboard/AppNavbar";
import {alpha} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "~/dashboard/ui/Dashboard/Header";
import Typography from "@mui/material/Typography";
import Wallet from "~/components/Wallet";
import PurchaseForm from "~/components/forms/PurchaseForm";
import PurchaseDataGrid from "~/components/grids/purchase-grid";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations, treeViewCustomizations
} from "~/dashboard/ui/Dashboard/theme/customizations";
import {userData} from "~/composables/UserData";

export const handle = {
    breadcrumb: () => (
        <Link to="/partner-purchases">Partner purchases</Link>
    ),
};

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const {getWalletsByUserIds } = walletData();
    const { getPurchaseListByStatusAndUserId, getPurchaseListByUserIds } = purchaseData();
    const {getPartners} = relationshipData();
    const {getCurrentUserInfo} = userData();
    const user = await getCurrentUserInfo();

    if (!user) {
        throw data("User not found", { status: 404 });
    }

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

    return {
        wallets: partnerWallets,
        history: partnersPurchaseHistory,
        title: title,
        user: user
    };
}


export default function PartnerPurchases({loaderData}: Route.ComponentProps){
    const xThemeComponents = {
        ...chartsCustomizations,
        ...dataGridCustomizations,
        ...datePickersCustomizations,
        ...treeViewCustomizations,
    };

    return(
    <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
            <SideMenu user={loaderData.user}/>
            <AppNavbar />
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >

                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <Header />
                </Stack>

                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'flex-start',
                        justifyContent: "flex-start",
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <Typography variant="h1" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        Past purchases of your partners
                    </Typography>
                </Stack>

                <Stack
                    direction="column"
                    sx={{
                        alignItems: "stretch",
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <PartnerWishlistGrid data={loaderData.history} title={loaderData.title}/>
                </Stack>
            </Box>
        </Box>
    </AppTheme>
    );
}