import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import type { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import {useLoaderData} from "react-router-dom";
import type {clientLoader} from "~/routes/_index";

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

function renderStatus(balance: number) {

  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default',
  };

  if(balance > 0){
      return <Chip label={balance} color={colors['success']} size="small" />;
  }
    return <Chip label={balance} color={colors['default']} size="small" />;
}

export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, any, any>,
) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  { field: 'pageTitle', headerName: 'User', flex: 1.5, minWidth: 200 },
  {
    field: 'balance',
    headerName: 'balance',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: 'pendingCount',
    headerName: 'Tasks pending',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'inProgressCount',
    headerName: 'Tasks in progress',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'completedCount',
    headerName: 'Tasks completed',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'walletBalance',
    headerName: 'Daily wallet balance',
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];
