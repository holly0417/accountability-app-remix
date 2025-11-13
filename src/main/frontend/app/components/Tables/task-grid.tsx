import {
    DataGrid,
    GridActionsCellItem, type GridActionsCellItemProps,
    type GridCellParams,
    type GridColDef, type GridRenderCellParams, type GridRowId,
    type GridRowParams, type GridRowsProp
} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/task";
import {useLoaderData} from "react-router-dom";
import {SparkLineChart} from "@mui/x-charts/SparkLineChart";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import type {TaskDataDto} from "~/components/dto/task/TaskDataDto";
import React, {useState} from "react";
import {taskData} from "~/composables/TaskData";
import {grid} from "@mui/system";
import {TaskStatus} from "~/components/dto/task/TaskStatus";
import { PlayArrow } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';

export default function TaskDataGrid() {
    const [actionOption, setActionOption] = useState('');

    const row = useLoaderData<typeof clientLoader>();

    const { startTask, endTask, deleteTask } = taskData();

    function TaskActionButton({
                                      rowId,
                                  taskStatus,
                                      ...props
                                  }: GridActionsCellItemProps & {
        rowId: GridRowId;
        taskStatus: (string);
        showInMenu: true;

    }) {

        let taskId = Number(rowId);

        if (taskStatus === TaskStatus.PENDING){
            setActionOption("START");
            return (
                <GridActionsCellItem
                    {...(props as any)}
                    icon={<PlayArrow />}
                    onClick={() => startTask(taskId)}
                />
            );
        } else if (taskStatus === TaskStatus.IN_PROGRESS){
            setActionOption("END");
            return (
                <GridActionsCellItem
                    {...(props as any)}
                    icon={<AlarmIcon />}
                    onClick={() => endTask(taskId)}
                />
            );
        } else {
            setActionOption("DELETE");
            return (
                <GridActionsCellItem
                    {...(props as any)}
                    icon={<DeleteIcon />}
                    onClick={() => deleteTask(taskId)}
                />
            );
        }
    }

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
            type: 'actions',
            flex: 0.5,
            minWidth: 150,
            getActions: (params:GridRowParams<TaskDataDto>) => [
                <TaskActionButton
                    label={actionOption}
                    rowId={params.id}
                    taskStatus={params.row.status}
                    showInMenu={true}
                                   />,
            ],
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
