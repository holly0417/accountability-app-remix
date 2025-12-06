import TaskForm from '~/components/forms/TaskForm';
import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {type ActionFunctionArgs, data} from "react-router";
import {TaskDataGrid} from "~/components/grids/task-grid";
import type {Route} from "./+types/task"; //this is OK!
import {userData} from "~/composables/UserData";
import {TaskRouteStatus} from "~/dto/task/TaskRouteStatus";
import {TaskAction} from "~/dto/task/TaskAction";
import React from "react";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import type {Page} from "~/dto/pagination/Page.ts";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const { getTasksByCurrentUserAndStatus, getAllTasksByUserList } = taskData();
    const {getCurrentUserInfo} = userData();
    const { status } = params;

    // Now you can use the status variable
    if (status) {
        console.log("The status is:", status);
    } else {
        console.log("The status is not defined in the URL.");
    }

    const userId = await getCurrentUserInfo();

    if (!userId) {
        throw data("User not found", { status: 404 });
    }

    let dataPage: Page<TaskDataDto> = await getAllTasksByUserList([userId.id]);

    switch(status) {
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
        rowData: dataPage.content
    };
}

export async function clientAction({ request }: ActionFunctionArgs) {
    const { startTask, endTask, deleteTask } = taskData();
    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent === TaskAction.ADD) {
        const { addTask } = taskData();
        const description = formData.get("newTaskDescription") as string;

        if(!description){
            return {error: "missing description"};
        }

        await addTask({description: description});
        return { ok: true };
    }

    const taskId = formData.get('taskId');
    const taskIdNumber = Number(taskId);

    switch(intent) {
        case TaskAction.START:
            await startTask(taskIdNumber);
            return { ok: true };
        case TaskAction.END:
            await endTask(taskIdNumber);
            return { ok: true };
        case TaskAction.DELETE:
            await deleteTask(taskIdNumber);
            return { ok: true };
    }

}

export default function Task({loaderData}: Route.ComponentProps){

    return(
        <div>
            <TaskForm />
            <TaskDataGrid row={loaderData.rowData}/>
        </div>
    );
}