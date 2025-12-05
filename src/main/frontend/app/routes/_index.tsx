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
import {data, redirect} from "react-router";
import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/dto/task/TaskStatus";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const { getCurrentUserWalletHistoryTimeline, getWalletHistoryByUserIds } = walletData();
const {getPartners} = relationshipData();
const { getTasksByCurrentUserAndStatus, getTasksByUserListAndStatus } = taskData();

export type DataGridAxisValues = {
    xAxisValue: string
    yAxisValue: number
}

export type DataGridProps = {
    username: string;
    data: DataGridAxisValues[];
    taskPendingCount: number;
    taskInProgressCount: number;
    taskCompletedCount: number;
};

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    try {
        const partners = await getPartners();

        if (!partners) {
            throw data("User not found", { status: 404 });
        }

        let partnerData: DataGridProps[] = [];

        for (const value of partners) {
            let name = value.username;
            let walletHistory = await getWalletHistoryByUserIds(value.id);
            let taskPendingCount = await getTasksByUserListAndStatus([value.id], TaskStatus.PENDING);
            let taskInProgressCount = await getTasksByUserListAndStatus([value.id], TaskStatus.IN_PROGRESS);
            let taskCompletedCount = await getTasksByUserListAndStatus([value.id], TaskStatus.COMPLETED);

            let dataValues: DataGridAxisValues[] = walletHistory.content.map((item) => {
                return {
                    xAxisValue: item.dateAsString,
                    yAxisValue: item.balance
                };
            });

            const thisGridProp: DataGridProps = {
                username: name,
                data: dataValues,
                taskPendingCount: taskPendingCount.totalElements,
                taskInProgressCount: taskInProgressCount.totalElements,
                taskCompletedCount: taskCompletedCount.totalElements,
            }

            partnerData.push(thisGridProp);
        }

        const thisUserBalanceDailyHistory = await getCurrentUserWalletHistoryTimeline();
        const currentUserPendingTasks = await getTasksByCurrentUserAndStatus(TaskStatus.PENDING);
        const currentUserInProgressTasks = await getTasksByCurrentUserAndStatus(TaskStatus.IN_PROGRESS);
        const currentUserCompletedTasks = await getTasksByCurrentUserAndStatus(TaskStatus.COMPLETED);

        let userDataValues: DataGridAxisValues[] = thisUserBalanceDailyHistory.content.map((item) => {
            return {
                xAxisValue: item.dateAsString,
                yAxisValue: item.balance
            };
        });

        const thisUserData: DataGridProps = {
            username: 'You',
            data: userDataValues,
            taskPendingCount: currentUserPendingTasks.totalElements,
            taskInProgressCount: currentUserInProgressTasks.totalElements,
            taskCompletedCount: currentUserCompletedTasks.totalElements,
        }

        const allUsersWalletTaskData: DataGridProps[] = [thisUserData, ...partnerData];

        return {thisUserData,
            partnerData, allUsersWalletTaskData
        };

    } catch (e: any) {

        if (e.response?.status === 401) {
            throw redirect("/login");
        }

        throw e;
    }
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
