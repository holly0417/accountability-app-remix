import { Form } from "react-router";
import {TaskAction} from "~/components/dto/task/TaskAction";

export default function TaskForm() {
    return (
        <div>
            <Form method="post">
                <input type="text" name="newTaskDescription" required />
                <button type="submit" name="intent" value={TaskAction.ADD}>Submit task</button>
            </Form>
        </div>
    );
}