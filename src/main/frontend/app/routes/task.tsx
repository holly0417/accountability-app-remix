import type { TaskDataDto } from "~/components/dto/task/TaskDataDto";
import {taskData} from '../composables/TaskData'
import {DefaultPage, type Page} from '~/components/pagination/Page'
import {useState} from "react";
import {TaskStatus} from "~/components/dto/task/TaskStatus";
import type { Route } from '../+types/root';
import { useLoaderData } from 'react-router-dom';


export async function clientLoader({
                                       params,
                                   }: Route.ClientLoaderArgs) {
    const { getTasksByCurrentUserAndStatus } = taskData();

    return await getTasksByCurrentUserAndStatus(TaskStatus.PENDING);
}

export default function Users() {
    const usersPage = useLoaderData<typeof clientLoader>();

    return (
        <div>
            <h1>Users</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {usersPage.content.map((user: TaskDataDto) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <p>
                    Page {usersPage.pageNumber + 1} of {usersPage.totalPages}
                </p>
                {/* Add pagination controls here */}
            </div>
        </div>
    );
}