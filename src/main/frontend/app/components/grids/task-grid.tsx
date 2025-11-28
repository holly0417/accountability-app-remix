import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/task";
import {useLoaderData} from "react-router-dom";
import Button from "@mui/material/Button";
import React from "react";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {TaskAction} from "~/dto/task/TaskAction";
import {useSubmit} from "react-router";


export default function TaskDataGrid() {
    const row = useLoaderData<typeof clientLoader>();

    const buttonLabel = (value: TaskStatus) => {
        switch(value) {
            case TaskStatus.PENDING:
                return TaskAction.START;
            case TaskStatus.IN_PROGRESS:
                return TaskAction.END;
            default:
                return TaskAction.DELETE;
        }
    }
    const submit = useSubmit(); // 2. Get the submit function

    const handleTask = (id: string, status: TaskStatus) => {

        const formData = new FormData();
        formData.append('taskId', id);

        if (status === TaskStatus.PENDING) {
            formData.append('intent', TaskAction.START);
        } else if (status === TaskStatus.IN_PROGRESS) {
            formData.append('intent', TaskAction.END);
        } else {
            formData.append('intent', TaskAction.DELETE);
        }

        // 4. Programmatically submit the data to the action
        submit(formData, { method: 'post' });
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'task id',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'userId',
            headerName: 'user',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'userName',
            headerName: 'userName',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'description',
            headerName: 'description',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'durationNumber',
            headerName: 'durationNumber',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'status',
            headerName: 'status',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {id, status} = params.row

                const action = buttonLabel(status);

                return (
                        <Button
                            value={action}
                            onClick={() => handleTask(id, status)}
                            name="intent"
                        >
                            {action}
                        </Button>
                );
            }
        },
    ];


    return (
        <DataGrid
            checkboxSelection
            rows={row.content}
            columns={columns}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
            }}
        />
    );
}
