import {DataGrid, type GridCellParams, type GridColDef, type GridRowsProp} from '@mui/x-data-grid';
import {useLoaderData} from "react-router-dom";
import type {clientLoader} from "~/routes/_index";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {SparkLineChart} from "@mui/x-charts/SparkLineChart";
import Chip from "@mui/material/Chip";

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

    const theme = useTheme();
    // Check if screen is small (mobile)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    type SparkLineData = number[];

    function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
        const { uniqueDates } = useLoaderData<typeof clientLoader>();
        const data = uniqueDates;
        const { value, colDef } = params;

        if (!value || value.length === 0) {
            return null;
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <SparkLineChart
                    data={value}
                    width={colDef.computedWidth || 100}
                    height={32}
                    plotType="bar"
                    showHighlight
                    showTooltip
                    color="hsl(210, 98%, 42%)"
                    xAxis={{
                        scaleType: 'band',
                        data,
                    }}
                />
            </div>
        );
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'id', flex: 1, minWidth: 50 },
        { field: 'pageTitle', headerName: 'User', flex: 1, minWidth: 80 },
        {
            field: 'balance',
            headerName: 'Balance',
            flex: 1,
            minWidth: 80,
            renderCell: (params) => {
                const {balance} = params.row
                return (<Chip label={balance} size="small" />);
            },
        },
        {
            field: 'pendingCount',
            headerName: 'Pending tasks',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'inProgressCount',
            headerName: isMobile ? 'TIP' : 'Tasks in progress',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'completedCount',
            headerName: 'Completed tasks',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'walletBalance',
            headerName: 'Daily wallet balance',
            flex: 1,
            minWidth: 150,
            renderCell: renderSparklineCell,
        },
    ];

    return (<DataGrid
            rows={rowProp}
            columns={columns}
            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            initialState={{
                pagination: {paginationModel: {pageSize: 20}},
            }}
            pageSizeOptions={[10, 20, 50]}
            density="compact"
            columnVisibilityModel={{
                // Hide columns based on the isMobile boolean
                id: false,             // Always hidden (example)
                pageTitle: true,   // Always show
                balance: true,
                pendingCount: !isMobile,
                inProgressCount: true, // Hidden if mobile is true
                completedCount: !isMobile,
                walletBalance: !isMobile,
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
