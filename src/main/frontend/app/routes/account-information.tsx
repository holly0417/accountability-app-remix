import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '~/dashboard/ui/Dashboard/AppNavbar';
import Header from '~/dashboard/ui/Dashboard/Header';
import SideMenu from '~/dashboard/ui/Dashboard/SideMenu';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import type {Route} from "./+types/account-information"; //this is OK!

import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '~/dashboard/ui/Dashboard/theme/customizations';
import {data, Link, redirect} from "react-router";
import {userData} from "~/composables/UserData";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import * as React from "react";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export const handle = {
    breadcrumb: () => (
        <Link to="/account-information">Account information</Link>
    ),
};

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    try {
        const {getCurrentUserInfo} = userData();

        const user = await getCurrentUserInfo();

        if (!user) {
            throw data("User not found", { status: 404 });
        }

        return {
            user: user
        }
    } catch (e: any) {

        if (e.response?.status === 401) {
            throw redirect("/login");
        }

        throw e;
    }
}

export default function AccountInformation({loaderData}: Route.ComponentProps) {

    return (
        <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu user={loaderData.user} />
                <AppNavbar />
                {/* Main content */}
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

                        <Card variant="outlined" sx={{ maxWidth: 360 }}>
                            <Box sx={{ p: 2 }}>
                                <Stack
                                    direction="column"
                                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Typography gutterBottom variant="h5" component="div">
                                        Your user ID: { loaderData.user.id }
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Your username: { loaderData.user.username }
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Your email: { loaderData.user.email }
                                    </Typography>
                                </Stack>
                            </Box>
                        </Card>

                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
