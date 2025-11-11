
import { Form } from "react-router";

export default function TaskForm() {

    return (
        <div>
            <Form method="post">
                <input type="text" name="newTaskDescription" required />
                <button type="submit">Submit task</button>
            </Form>
        </div>
    );
}