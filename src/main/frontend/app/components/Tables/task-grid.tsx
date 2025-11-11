import {DataGrid, type GridCellParams, type GridColDef} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/task";
import {useLoaderData} from "react-router-dom";
import {SparkLineChart} from "@mui/x-charts/SparkLineChart";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import type {TaskDataDto} from "~/components/dto/task/TaskDataDto";
import {useState} from "react";

export default function TaskDataGrid() {


    function renderButton(status: 'pending' | 'approved' | 'completed' | 'rejected' | 'in-progress') {
        const [actionLabel, setActionLabel] = useState('');

        if(status === "pending"){
            setActionLabel("START");
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button variant="outlined">{actionLabel}</Button>
            </div>
        );
    }

    function renderStatus(status: 'Online' | 'Offline') {
        const colors: { [index: string]: 'success' | 'default' } = {
            Online: 'success',
            Offline: 'default',
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }

    const rows = useLoaderData<typeof clientLoader>();

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
            field: 'durationString',
            headerName: 'durationString',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'status',
            headerName: 'status',
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => renderButton(params.value as any),
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.5,
            minWidth: 80,
        },
    ];

    return (
        <DataGrid
            checkboxSelection
            rows={rows.content}
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
