import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import {useLoaderData} from "react-router-dom";
import type {clientLoader} from "~/routes/_index";

export default function PageViewsBarChart() {
    const { currentUserPendingTasks,
        currentUserInProgressTasks,
        currentUserCompletedTasks } = useLoaderData<typeof clientLoader>();

    let pendingTaskCount= currentUserPendingTasks.totalElements;
    let inProgressTaskCount = currentUserInProgressTasks.totalElements;
    let completedTaskCount = currentUserCompletedTasks.totalElements;

  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];


  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Number of tasks
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              Tasks
            </Typography>
            <Chip size="small" color="error" label="-8%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Count by status
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: ['You'],
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'pending',
              label: 'Pending',
              data: [pendingTaskCount],
              stack: 'A',
            },
            {
              id: 'in-progress',
              label: 'In Progress',
              data: [inProgressTaskCount],
              stack: 'A',
            },
            {
              id: 'completed',
              label: 'Completed',
              data: [completedTaskCount],
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
