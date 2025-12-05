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
import MainGrid from '~/dashboard/ui/Dashboard/MainGrid';
import SideMenu from '~/dashboard/ui/Dashboard/SideMenu';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import type {Route} from "./+types/_index"; //this is OK!
import type {LocalDateTime} from "ts-extended-types";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '~/dashboard/ui/Dashboard/theme/customizations';
import type {StatCardProps} from "~/dashboard/ui/Dashboard/StatCard";
import {walletData} from "~/composables/WalletData";
import {relationshipData} from "~/composables/RelationshipData";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const { getCurrentUserWalletHistoryTimeline, getWalletHistoryByUserIds } = walletData();
const {getPartners} = relationshipData();

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const thisUserBalanceDailyHistory = await getCurrentUserWalletHistoryTimeline();
    const partnerIdList = await getPartners();
    let onePartner: number = 0;

    if(partnerIdList.length > 0){
        onePartner = partnerIdList.at(0)?.id as number;
    }

    const partnerBalanceDailyHistory = await getWalletHistoryByUserIds(onePartner);

    return {thisUserBalanceDailyHistory, partnerBalanceDailyHistory};
}

export default function _index(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
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
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
