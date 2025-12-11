import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {type ActionFunctionArgs, data, Link} from "react-router";
import type {Route} from "./+types/partner-task"; //this is OK!
import {TaskRouteStatus} from "~/dto/task/TaskRouteStatus";
import React from "react";
import {relationshipData} from "~/composables/RelationshipData";
import PartnerTaskDataGrid from "~/components/grids/partner-task-grid";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import {PartnerTaskAction} from "~/dto/task/PartnerTaskAction";
import type {TaskStatusDto} from "~/dto/task/TaskStatusDto";
import AppTheme from "~/dashboard/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "~/dashboard/ui/Dashboard/SideMenu";
import AppNavbar from "~/dashboard/ui/Dashboard/AppNavbar";
import {alpha} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "~/dashboard/ui/Dashboard/Header";
import Typography from "@mui/material/Typography";

import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations
} from "~/dashboard/ui/Dashboard/theme/customizations";
import {userData} from "~/composables/UserData";

export const handle = {
    breadcrumb: () => (<Link to="/partner-task">Partner tasks</Link>),
};

export async function clientLoader({params,}: Route.ClientLoaderArgs) {
    const {status} = params;
    const {getAllTasksByUserList, getTasksByUserListAndStatus} = taskData();
    const {getPartners} = relationshipData();
    const {getCurrentUserInfo} = userData();

    const user = await getCurrentUserInfo();

    if (!user) {
        throw data("User not found", {status: 404});
    }

    // REMEMBER: const CANNOT be reassigned but let can!
    const partners = await getPartners();
    let finalList: TaskDataDto[] = [];

    if (!partners) {
        console.log("partner ID List empty");
    } else {
        const partnerIdList: number[] = partners.map(partner => {
            return partner.id;
        });

        let totalPage = await getAllTasksByUserList(partnerIdList);

        switch (status) {
            case TaskRouteStatus.IN_PROGRESS:
                totalPage = await getTasksByUserListAndStatus(partnerIdList, TaskStatus.IN_PROGRESS, 0, 50);
                break;
            case TaskRouteStatus.APPROVED:
                totalPage = await getTasksByUserListAndStatus(partnerIdList, TaskStatus.APPROVED, 0, 50);
                break;
            case TaskRouteStatus.REJECTED:
                totalPage = await getTasksByUserListAndStatus(partnerIdList, TaskStatus.REJECTED, 0, 50);
                break;
            case TaskRouteStatus.COMPLETED:
                totalPage = await getTasksByUserListAndStatus(partnerIdList, TaskStatus.COMPLETED, 0, 50);
                break;
            case TaskRouteStatus.PENDING:
                totalPage = await getTasksByUserListAndStatus(partnerIdList, TaskStatus.PENDING, 0, 50);
                break;
        }
        finalList = totalPage.content;
    }

    return {
        list: finalList, user: user,
    };
}

export async function clientAction({request}: ActionFunctionArgs) {
    const {processTaskForPartner} = taskData();
    const formData = await request.formData();
    const intent = formData.get('intent');

    const taskId = formData.get('taskId');
    const taskIdNumber = Number(taskId);

    let newStatus: TaskStatusDto = {
        status: TaskStatus.COMPLETED
    }

    switch (intent) {
        case PartnerTaskAction.APPROVE:
            newStatus.status = TaskStatus.APPROVED;
            await processTaskForPartner(taskIdNumber, newStatus);
            return {ok: true};
        case PartnerTaskAction.REJECT:
            newStatus.status = TaskStatus.REJECTED;
            await processTaskForPartner(taskIdNumber, newStatus);
            return {ok: true};
    }
}

export default function PartnerTask({loaderData}: Route.ComponentProps) {
    const xThemeComponents = {
        ...chartsCustomizations, ...dataGridCustomizations, ...datePickersCustomizations, ...treeViewCustomizations,
    };

    return (<AppTheme themeComponents={xThemeComponents}>
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
                            Tasks by your partners
                        </Typography>
                    </Stack>

                    <Stack
                        direction="column"
                        sx={{
                            alignItems: "stretch", mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <PartnerTaskDataGrid data={loaderData.list}/>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>);
}