import TaskForm from '../components/Forms/TaskForm';

import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/components/dto/task/TaskStatus";
import {type ActionFunctionArgs, useParams} from "react-router";
import TaskDataGrid from "~/components/Tables/task-grid";
import {type Page} from "~/components/pagination/Page";
import {type TaskDataDto} from "~/components/dto/task/TaskDataDto";
import type {Route} from "../../.react-router/types/app/+types/root";

export async function clientLoader() {
    const { getTasksByCurrentUserAndStatus } = taskData();

    return await getTasksByCurrentUserAndStatus(TaskStatus.PENDING);

}

export async function clientAction({request}: ActionFunctionArgs) {
    const { addTask } = taskData();
    const formData = await request.formData();
    const description = formData.get("newTaskDescription") as string;
    if(!description){
        return {error: "missing description"};
    }
    return await addTask({description: description});
}

export default function Task(){
    return(
        <div>
            <TaskForm />
            <TaskDataGrid />
        </div>
    );
}