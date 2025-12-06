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
import {userData} from "~/composables/UserData";
import {useLoaderData} from "react-router-dom";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const { getCurrentUserWalletHistoryTimeline, getWalletHistoryByUserIds } = walletData();
const {getPartnersLimit} = relationshipData();
const { getTasksByCurrentUserAndStatus, getTasksByUserListAndStatus } = taskData();
const {getCurrentUserInfo} = userData();

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

function getEarlierDate(date1: string, date2: string): number {
    //MM-DD-YYYY => return -1 if date1 is earlier than date2
    //return 1 if date1 later than date2
    //return 0 if same date
    const firstDate = date1.split("-");
    const secondDate = date2.split("-");

    const firstYear = Number(firstDate.at(2));
    const secondYear = Number(secondDate.at(2));

    if(firstYear > secondYear){
        return 1;
    } else if (firstYear < secondYear) {
        return -1;
    }

    //U.S. date format!
    const firstMonth = Number(firstDate.at(0));
    const secondMonth = Number(secondDate.at(0));

    if(firstMonth > secondMonth){
        return 1;
    } else if (firstMonth < secondMonth) {
        return -1;
    }

    const firstDay = Number(firstDate.at(1));
    const secondDay = Number(secondDate.at(1));

    if(firstDay > secondDay){
        return 1;
    } else if (firstDay < secondDay) {
        return -1;
    }

    return 0;
}

function sortDateLists(dateList:string[]): string[] {
    return [...new Set([...dateList])].sort((a, b) => getEarlierDate(a, b));
}

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    try {
        const partners = await getPartnersLimit(10);

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

        //data not yet ordered correctly for multi-user graph visuals
        const allUsersWalletTaskData: DataGridProps[] = [thisUserData, ...partnerData];

        //get unique dates recorded for WalletBalanceHistory across multiple users
        const allDates: string[][] = allUsersWalletTaskData.map((item) => {
            return item.data.map((point) => {
                return point.xAxisValue;
            });
        });

        let finalDates: string[] = []
        let placeholder: string[] = []

        for(const date of allDates) {
            finalDates = [...placeholder, ...date];
            placeholder = finalDates;
        }

        const uniqueDates = sortDateLists(finalDates)

        //Map of existing dates to wallet balances and user ID to refer to when ordering data
        const datesToBalance = new Map<string, Map<string, number>>();

        for(const date of uniqueDates) {
            let userNameToBalance = new Map<string, number>();
            for (const item of allUsersWalletTaskData){
                let itemDateList = item.data.map(point => point.xAxisValue);
                let itemBalanceList = item.data.map(point => point.yAxisValue);
                let itemUserId = item.username;
                let index = 0;
                for (const indDate of itemDateList){
                    if (indDate == date){
                        userNameToBalance.set(itemUserId.toString(), itemBalanceList.at(index) as number);
                        datesToBalance.set(date.toString(), userNameToBalance);
                    }
                    index++;
                }
            }
        }

        //make the List of the correct data type DataGridAxisValues with the right ordered data
        const allDataCorrectDates: DataGridProps[] = allUsersWalletTaskData.map((item) => {
            let thisDates = item.data.map(point => point.xAxisValue);
            let previousBalance: number = 0;
            let addNewValue = true;
            let itemUserId = item.username;

            for (const date of uniqueDates){
                for (const eachDay of thisDates){
                    if(eachDay == date){
                        addNewValue = false;
                        let userNameToBalance = datesToBalance.get(date.toString())!;
                        previousBalance = userNameToBalance.get(itemUserId.toString())!;
                    }
                }

                if(addNewValue) {
                    let newDataGridAxisValue: DataGridAxisValues = {
                        xAxisValue: date,
                        yAxisValue: previousBalance
                    }
                    item.data.push(newDataGridAxisValue);
                }
                addNewValue = true;
            }

            const orderedSet = [...new Set([...item.data])].sort((a, b) => getEarlierDate(a.xAxisValue, b.xAxisValue));
            console.log(orderedSet);

            return {
                username: item.username,
                data: orderedSet,
                taskPendingCount: item.taskPendingCount,
                taskInProgressCount: item.taskInProgressCount,
                taskCompletedCount: item.taskCompletedCount,
            }
        })

        console.log(allDataCorrectDates);
        const limitedDataList = allDataCorrectDates.slice(0,2);
        const limitedPartnerData = partnerData.slice(0,2)
        const currentUserInfo = await getCurrentUserInfo();

        return {currentUserInfo, thisUserData, limitedPartnerData,
            partnerData, allUsersWalletTaskData, uniqueDates, limitedDataList, allDataCorrectDates
        };

    } catch (e: any) {

        if (e.response?.status === 401) {
            throw redirect("/login");
        }

        throw e;
    }
}

export default function _index(props: { disableCustomTheme?: boolean }) {

    const { currentUserInfo } = useLoaderData<typeof clientLoader>();
    const user = currentUserInfo!;

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu user={user} />
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
