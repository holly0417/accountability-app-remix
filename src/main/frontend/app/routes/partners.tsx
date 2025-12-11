import SearchPartner from "~/components/forms/SearchPartner"
import {type ActionFunctionArgs, data, Link, redirect} from "react-router";
import {RelationshipStatus} from "~/dto/relationship/RelationshipStatus";
import {relationshipData} from "~/composables/RelationshipData";
import {userData} from "~/composables/UserData";
import {RelationshipDirection} from "~/dto/relationship/RelationshipDirection";
import PartnerDataGrid from "~/components/grids/partner-grid";
import type {Route} from "./+types/partners";
import {RelationshipAction} from "~/dto/relationship/RelationshipAction";
import AppTheme from "~/dashboard/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "~/dashboard/ui/Dashboard/SideMenu";
import AppNavbar from "~/dashboard/ui/Dashboard/AppNavbar";
import {alpha} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "~/dashboard/ui/Dashboard/Header";
import Typography from "@mui/material/Typography";
import React from "react";

import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations
} from "~/dashboard/ui/Dashboard/theme/customizations";

export const handle = {
    breadcrumb: () => (<Link to="/partners">Partners</Link>),
};


export async function clientLoader({params}: Route.ClientLoaderArgs) {
    try {

        const {getRequests, getRelationshipsByStatus} = relationshipData();
        const {getCurrentUserInfo} = userData();
        const currentUser = await getCurrentUserInfo();
// HANDLE 404: Logic -> If null, stop everything and throw a 404
        if (!currentUser) {
            throw data("User not found", {status: 404});
        }

        const waitList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.REQUESTER);
        const answerList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.RECIPIENT);
        const rejectedList = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.RECIPIENT);
        const approvedList = await getRelationshipsByStatus(RelationshipStatus.APPROVED);

        return {
            answer: answerList, wait: waitList, rejected: rejectedList, approved: approvedList, user: currentUser
        };

    } catch (e: any) {
// HANDLE 401: Logic -> If unauthorized, send them to login
        if (e.response?.status === 401) {
            throw redirect("/login");
        }

        throw e; // Throw generic errors to the ErrorBoundary
    }
}

export async function clientAction({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent');
    const {sendRequest, updateRelationship, deleteRelationship} = relationshipData();

    const thisId = formData.get("id") as string; //can be partnerID or relationshipID
    const idNumber = Number(thisId);

    if (intent === RelationshipAction.REQUEST) {
        return await sendRequest(idNumber);
    }

    if (intent === RelationshipAction.DELETE) {
        return await deleteRelationship(idNumber);
    }

    if (intent === RelationshipAction.APPROVE) {
        return await updateRelationship(idNumber, RelationshipStatus.APPROVED);
    }

    if (intent === RelationshipAction.REJECT) {
        return await updateRelationship(idNumber, RelationshipStatus.REJECTED);
    }
}


export default function Partners({loaderData}: Route.ComponentProps) {
    const xThemeComponents = {
        ...chartsCustomizations, ...dataGridCustomizations, ...datePickersCustomizations, ...treeViewCustomizations,
    };

    return (<AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex'}}>
                <SideMenu user={loaderData.user}/>
                <AppNavbar/>
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
                            Partners
                        </Typography>
                    </Stack>

                    <Stack
                        spacing={2}
                        direction="column"
                        sx={{
                            alignItems: 'stretch', justifyContent: "flex-start", mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <SearchPartner/>
                        <PartnerDataGrid listType="wait" friends={loaderData.wait} currentUser={loaderData.user}/>
                        <PartnerDataGrid listType="answer" friends={loaderData.answer} currentUser={loaderData.user}/>
                        <PartnerDataGrid listType="rejected" friends={loaderData.rejected}
                                         currentUser={loaderData.user}/>
                        <PartnerDataGrid listType="approved" friends={loaderData.approved}
                                         currentUser={loaderData.user}/>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>);
}