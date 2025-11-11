import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/Task";
import {useLoaderData} from "react-router-dom";

export default function TaskDataGrid() {
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
