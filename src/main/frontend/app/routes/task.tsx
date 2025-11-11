import TaskForm from '../components/Forms/TaskForm';
import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/components/dto/task/TaskStatus";
import {type ActionFunctionArgs} from "react-router";
import TaskDataGrid from "~/components/Tables/task-grid";
import type {Route} from "./+types/task"; //this is OK!

export async function clientLoader({ params, }: Route.ClientLoaderArgs) {
    const { getTasksByCurrentUserAndStatus } = taskData();

    const { status } = params;

    // Now you can use the status variable
    if (status) {
        console.log("The status is:", status);
    } else {
        console.log("The status is not defined in the URL.");
    }

    if(status === "pending"){
        return await getTasksByCurrentUserAndStatus(TaskStatus.PENDING);
    }

    return await getTasksByCurrentUserAndStatus(TaskStatus.APPROVED);

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