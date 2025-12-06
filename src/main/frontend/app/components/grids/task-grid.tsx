import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/task";
import {useLoaderData} from "react-router-dom";
import Button from "@mui/material/Button";
import React from "react";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {TaskAction} from "~/dto/task/TaskAction";
import {Form, useSubmit} from "react-router";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import type {Page} from "~/dto/pagination/Page.ts";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

function buttonLabel (value: TaskStatus) {
    switch(value) {
        case TaskStatus.PENDING:
            return TaskAction.START;
        case TaskStatus.IN_PROGRESS:
            return TaskAction.END;
        default:
            return TaskAction.DELETE;
    }
}

interface TaskDataGridProps {
    row: TaskDataDto[]
}

export function TaskDataGrid({row}:TaskDataGridProps) {

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
                        <Form method="post">
                            <Button
                                value={action}
                                name="intent"
                                type="submit"
                                variant="outlined"
                                size="small"
                            >
                                {action}
                            </Button>
                            <input type="hidden" id="taskId" name="taskId" value={id} />
                        </Form>
                );
            }
        },
    ];


    return (
        <DataGrid
            rows={row}
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
            getRowHeight={() => 'auto'}
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
