import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/task";
import {useLoaderData} from "react-router-dom";
import Button from "@mui/material/Button";
import React from "react";
import {useSubmit} from "react-router";
import type {TaskDataDto} from "~/components/dto/task/TaskDataDto";
import {PartnerTaskAction} from "~/components/dto/task/PartnerTaskAction";

interface PartnerTaskDataGridProps{
    actionAllowed: boolean;
    data: TaskDataDto[];
}

export default function PartnerTaskDataGrid({data, actionAllowed}:PartnerTaskDataGridProps) {
    const row = data;
    const partnerTaskAction = actionAllowed;

    const submit = useSubmit(); // 2. Get the submit function

    const checkButtonOptions = () => {
        if(partnerTaskAction){
            return "APPROVE";
        }
        return "";
    }

    const checkSecondButtonOptions = () => {
        if(partnerTaskAction){
            return "REJECT";
        }
        return "";
    }

    const partnerTaskHandler = (taskId: number, intent: string) => {
        const handlePartnerTask = new FormData();
        handlePartnerTask.append('taskId', taskId.toString());

        if (intent == "APPROVE"){
            handlePartnerTask.append('intent', PartnerTaskAction.APPROVE);
        } else if (intent == "REJECT"){
            handlePartnerTask.append('intent', PartnerTaskAction.REJECT);
        }
        // 4. Programmatically submit the data to the action
        submit(handlePartnerTask, { method: 'post' });
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
            field: 'durationString',
            headerName: 'duration',
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
            headerName: 'Approve',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {id} = params.row
                const option = checkButtonOptions();
                if(option=="APPROVE"){
                    return (<Button value={option}
                                    onClick={() => partnerTaskHandler(id, option)} //gets confused about intent from having 2 buttons at once
                                    name="intent">{option}</Button>);
                }
                return (<Button disabled={true}>{option}</Button>);
            }
        },
        {
            field: 'second-action',
            headerName: 'Reject',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {id} = params.row
                const option = checkSecondButtonOptions();
                if(option=="REJECT"){
                    return (<Button value={option}
                                    onClick={() => partnerTaskHandler(id, option)} //gets confused about intent from having 2 buttons at once
                                    name="intent">{option}</Button>);
                }
                return (<Button disabled={true}>{option}</Button>);
            }
        },
    ];


    return (
        <DataGrid
            checkboxSelection
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
