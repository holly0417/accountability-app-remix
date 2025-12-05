import {DataGrid, type GridRowsProp} from '@mui/x-data-grid';
import { columns } from '~/dashboard/data/gridData';
import {useLoaderData} from "react-router-dom";
import type {clientLoader} from "~/routes/_index";

export default function CustomizedDataGrid() {

const { allUsersWalletTaskData } = useLoaderData<typeof clientLoader>();
let count = 0;

const rowProp: GridRowsProp = allUsersWalletTaskData.map(item => {
    count = count + 1;

    return {
        id: count,
        pageTitle: item.username,
        status: 'Online',
        pendingCount: item.taskPendingCount,
        inProgressCount: item.taskInProgressCount,
        completedCount: item.taskCompletedCount,
        walletBalance: item.data.map(point => point.yAxisValue),
    }
})


  return (
    <DataGrid
      checkboxSelection
      rows={rowProp}
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
