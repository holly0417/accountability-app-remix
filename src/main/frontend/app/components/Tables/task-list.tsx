import type { TaskDataDto } from "~/components/dto/task/TaskDataDto";
import { useLoaderData } from 'react-router-dom';
import type {clientLoader} from "~/routes/Task";

export default function TaskList() {
    const tasksPage = useLoaderData<typeof clientLoader>();
    const taskContent = tasksPage.content;

    return (
        <div>
            <h1>Tasks</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>userId</th>
                    <th>userName</th>
                    <th>description</th>
                    <th>durationNumber</th>
                    <th>durationString</th>
                    <th>status</th>
                </tr>
                </thead>
                <tbody>
                {taskContent.map((task: TaskDataDto, index) => (
                    <tr key={index}>
                        <td>{task.id}</td>
                        <td>{task.userId}</td>
                        <td>{task.userName}</td>
                        <td>{task.description}</td>
                        <td>{task.durationNumber}</td>
                        <td>{task.durationString}</td>
                        <td>{task.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <p>
                    Page {tasksPage.pageNumber + 1} of {tasksPage.totalPages}
                </p>
                {/* Add pagination controls here */}
            </div>
        </div>
    );
}