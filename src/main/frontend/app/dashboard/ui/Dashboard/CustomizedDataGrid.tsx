import {DataGrid, type GridRowsProp} from '@mui/x-data-grid';
import {columns} from '~/dashboard/data/gridData';
import {useLoaderData} from "react-router-dom";
import type {clientLoader} from "~/routes/_index";

export default function CustomizedDataGrid() {

    const {allDataCorrectDates} = useLoaderData<typeof clientLoader>();
    let count = 0;

    const rowProp: GridRowsProp = allDataCorrectDates.map(item => {
        count = count + 1;

        let balance = item.data.map(point => {
            return point.yAxisValue;
        })

        let countBalance = balance.length - 1;

        return {
            id: count,
            pageTitle: item.username,
            balance: balance.at(countBalance)!.toFixed(2),
            pendingCount: item.taskPendingCount,
            inProgressCount: item.taskInProgressCount,
            completedCount: item.taskCompletedCount,
            walletBalance: item.data.map(point => point.yAxisValue.toFixed(2)),
        }
    })


    return (<DataGrid
            checkboxSelection
            rows={rowProp}
            columns={columns}
            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            initialState={{
                pagination: {paginationModel: {pageSize: 20}},
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
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
