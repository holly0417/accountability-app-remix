import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import React from "react";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {TaskAction} from "~/dto/task/TaskAction";
import {Form} from "react-router";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function buttonLabel(value: TaskStatus) {
    switch (value) {
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

export function TaskDataGrid({row}: TaskDataGridProps) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const columns: GridColDef[] = [{
        field: 'id', headerName: 'TaskId', flex: 0.5, minWidth: 80,
    }, {
        field: 'userId', headerName: 'UserId', flex: 0.5, minWidth: 80,
    }, {
        field: 'userName', headerName: 'Username', flex: 0.5, minWidth: 80,
    }, {
        field: 'description', headerName: 'Task', flex: 0.5, minWidth: 80,
    }, {
        field: 'durationNumber', headerName: 'Duration in seconds', flex: 0.5, minWidth: 80,
    }, {
        field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80,
    }, {
        field: 'actions', headerName: 'Action', flex: 0.5, minWidth: 150, renderCell: (params) => {
            const {id, status} = params.row

            const action = buttonLabel(status);

            return (<Form method="post">
                    <Button
                        value={action}
                        name="intent"
                        type="submit"
                        variant="outlined"
                        size="small"
                    >
                        {action}
                    </Button>
                    <input type="hidden" id="taskId" name="taskId" value={id}/>
                </Form>);
        }
    },];

    return (<DataGrid
            rows={row}
            columns={columns}
            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            initialState={{
                pagination: {paginationModel: {pageSize: 20}},
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
            getRowHeight={() => 'auto'}
            columnVisibilityModel={{
                // Hide columns based on the isMobile boolean
                id: false,             // Always hidden (example)
                userId: false,   // Always show
                userName: false,
                description: true,
                durationNumber: !isMobile, // Hidden if mobile is true
                status: !isMobile,
                actions: true,
            }}
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined', size: 'small',
                        }, columnInputProps: {
                            variant: 'outlined', size: 'small', sx: {mt: 'auto'},
                        }, operatorInputProps: {
                            variant: 'outlined', size: 'small', sx: {mt: 'auto'},
                        }, valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined', size: 'small',
                            },
                        },
                    },
                },
            }}
        />);
}
