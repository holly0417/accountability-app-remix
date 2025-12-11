import TaskForm from '~/components/forms/TaskForm';
import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {type ActionFunctionArgs, data, Link} from "react-router";
import {TaskDataGrid} from "~/components/grids/task-grid";
import type {Route} from "./+types/task"; //this is OK!
import {userData} from "~/composables/UserData";
import {TaskRouteStatus} from "~/dto/task/TaskRouteStatus";
import {TaskAction} from "~/dto/task/TaskAction";
import React from "react";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import type {Page} from "~/dto/pagination/Page.ts";
import AppTheme from "~/dashboard/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "~/dashboard/ui/Dashboard/SideMenu";
import AppNavbar from "~/dashboard/ui/Dashboard/AppNavbar";
import {alpha} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "~/dashboard/ui/Dashboard/Header";

import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations
} from "~/dashboard/ui/Dashboard/theme/customizations";
import Typography from "@mui/material/Typography";

export const handle = {
    breadcrumb: () => (<Link to="/task">Task</Link>),
};

export async function clientLoader({params,}: Route.ClientLoaderArgs) {
    const {getTasksByCurrentUserAndStatus, getAllTasksByUserList} = taskData();
    const {getCurrentUserInfo} = userData();
    const {status} = params;

    // Now you can use the status variable
    if (status) {
        console.log("The status is:", status);
    } else {
        console.log("The status is not defined in the URL.");
    }

    const user = await getCurrentUserInfo();

    if (!user) {
        throw data("User not found", {status: 404});
    }

    let dataPage: Page<TaskDataDto> = await getAllTasksByUserList([user.id]);

    switch (status) {
        case TaskRouteStatus.IN_PROGRESS:
            dataPage = await getTasksByCurrentUserAndStatus(TaskStatus.IN_PROGRESS);
            break;
        case TaskRouteStatus.APPROVED:
            dataPage = await getTasksByCurrentUserAndStatus(TaskStatus.APPROVED);
            break;
        case TaskRouteStatus.REJECTED:
            dataPage = await getTasksByCurrentUserAndStatus(TaskStatus.REJECTED);
            break;
        case TaskRouteStatus.COMPLETED:
            dataPage = await getTasksByCurrentUserAndStatus(TaskStatus.COMPLETED);
            break;
        case TaskRouteStatus.PENDING:
            dataPage = await getTasksByCurrentUserAndStatus(TaskStatus.PENDING);
            break;
    }

    return {
        rowData: dataPage.content, user: user
    };
}

export async function clientAction({request}: ActionFunctionArgs) {
    const {startTask, endTask, deleteTask} = taskData();
    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent === TaskAction.ADD) {
        const {addTask} = taskData();
        const description = formData.get("newTaskDescription") as string;

        if (!description) {
            return {error: "missing description"};
        }

        await addTask({description: description});
        return {ok: true};
    }

    const taskId = formData.get('taskId');
    const taskIdNumber = Number(taskId);

    switch (intent) {
        case TaskAction.START:
            await startTask(taskIdNumber);
            return {ok: true};
        case TaskAction.END:
            await endTask(taskIdNumber);
            return {ok: true};
        case TaskAction.DELETE:
            await deleteTask(taskIdNumber);
            return {ok: true};
    }
}

export default function Task({loaderData}: Route.ComponentProps) {

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
                            Tasks
                        </Typography>
                    </Stack>

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center', mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <TaskForm/>
                    </Stack>
                    <Stack
                        direction="column"
                        sx={{
                            alignItems: "stretch", mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <TaskDataGrid row={loaderData.rowData}/>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>


    );
}