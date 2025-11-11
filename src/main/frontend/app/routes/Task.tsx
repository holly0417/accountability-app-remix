import TaskList from '../components/Tables/task-list';
import TaskForm from '../components/Forms/TaskForm';
import type {Route} from "../../.react-router/types/app/+types/root";
import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/components/dto/task/TaskStatus";
import {type ActionFunctionArgs} from "react-router";

export async function clientLoader({params,}: Route.ClientLoaderArgs) {
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
            <TaskList />
            <TaskForm />
        </div>
    );
}