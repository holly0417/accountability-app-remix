import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {type ActionFunctionArgs} from "react-router";
import type {Route} from "./+types/PartnerTask"; //this is OK!
import {TaskRouteStatus} from "~/dto/task/TaskRouteStatus";
import React from "react";
import {relationshipData} from "~/composables/RelationshipData";
import {useLoaderData} from "react-router-dom";
import PartnerTaskDataGrid from "~/components/grids/partner-task-grid";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import {PartnerTaskAction} from "~/dto/task/PartnerTaskAction";
import type {TaskStatusDto} from "~/dto/task/TaskStatusDto";

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const { status } = params;
    const { getAllTasksByUserList, getTasksByUserListAndStatus } = taskData();
    const { getPartnerIdList } = relationshipData();

    // REMEMBER: const CANNOT be reassigned but let can!
    const partnerIdList = await getPartnerIdList();
    let totalPage = await getAllTasksByUserList(partnerIdList);
    let finalList: TaskDataDto[] = [];
    let actionAllowed: boolean = false;

    if (partnerIdList.length == 0) {
        console.log("partner ID List empty");
    } else {
        switch(status) {
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
                actionAllowed = true;
                break;
            case TaskRouteStatus.PENDING:
                totalPage = await getTasksByUserListAndStatus(partnerIdList, TaskStatus.PENDING, 0, 50);
                break;
        }
        finalList = totalPage.content;
    }

    return { finalList, actionAllowed };
}

export async function clientAction({ request }: ActionFunctionArgs) {
    const { processTaskForPartner } = taskData();
    const formData = await request.formData();
    const intent = formData.get('intent');

    const taskId = formData.get('taskId');
    const taskIdNumber = Number(taskId);

    let newStatus: TaskStatusDto = {
        status: TaskStatus.COMPLETED
    }

    switch(intent) {
        case PartnerTaskAction.APPROVE:
            newStatus.status = TaskStatus.APPROVED;
            await processTaskForPartner(taskIdNumber, newStatus);
            return { ok: true };
        case PartnerTaskAction.REJECT:
            newStatus.status = TaskStatus.REJECTED;
            await processTaskForPartner(taskIdNumber, newStatus);
            return { ok: true };
    }
}

export default function PartnerTask(){
    const { finalList, actionAllowed } = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <PartnerTaskDataGrid data={finalList} actionAllowed={actionAllowed}/>
        </div>
    );
}