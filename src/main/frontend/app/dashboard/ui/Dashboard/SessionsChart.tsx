import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {LineChart, type LineChartProps, type LineSeries} from '@mui/x-charts/LineChart';
import type {StatCardProps} from "~/dashboard/ui/Dashboard/StatCard";
import {useLoaderData} from "react-router-dom";
import type {clientLoader, DataGridAxisValues} from "~/routes/_index";
import type {SxProps} from "@mui/material";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getEarlierDate(date1: string, date2: string): number {
    //MM-DD-YYYY => return -1 if date1 is earlier than date2
    //return 1 if date1 later than date2
    //return 0 if same date
    const firstDate = date1.split("-");
    const secondDate = date2.split("-");

    const firstYear = Number(firstDate.at(2));
    const secondYear = Number(secondDate.at(2));

    if(firstYear > secondYear){
        return 1;
    } else if (firstYear < secondYear) {
        return -1;
    }

    const firstMonth = Number(firstDate.at(1));
    const secondMonth = Number(secondDate.at(1));

    if(firstMonth > secondMonth){
        return 1;
    } else if (firstMonth < secondMonth) {
        return -1;
    }

    const firstDay = Number(firstDate.at(0));
    const secondDay = Number(secondDate.at(0));

    if(firstDay > secondDay){
        return 1;
    } else if (firstDay < secondDay) {
        return -1;
    }

    return 0;
}

function sortDateLists(dateList:string[]): string[] {
    return [...new Set([...dateList])].sort((a, b) => getEarlierDate(a, b));
}

export default function SessionsChart() {
  const { allUsersWalletTaskData } = useLoaderData<typeof clientLoader>();

  const theme = useTheme();

  const allDates: string[][] = allUsersWalletTaskData.map((item) => {
      return item.data.map((point) => {
          return point.xAxisValue;
      });
  });

  let finalDates: string[] = []
  let placeholder: string[] = []

  for(const date of allDates) {
      finalDates = [...placeholder, ...date];
      placeholder = finalDates;
  }

  const data = sortDateLists(finalDates)

  const graphSettings: LineSeries[] = allUsersWalletTaskData.map(user => {
      return {
          id: user.username,
          label: user.username,
          showMark: false,
          curve: 'linear',
          stack: 'total',
          area: true,
          stackOrder: 'ascending',
          data: user.data.map(item => item.yAxisValue),
          valueFormatter: (value) => (value == null ? '' : value.toFixed(2)),
      }
  });



  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          All wallets
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
              Wallets
            </Typography>
            <Chip size="small" color="success" label="Active" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Combined visual of your and your partners' wallets over time
          </Typography>
        </Stack>

        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={graphSettings}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            [`& .MuiAreaElement-series-user1`]: {
              fill: `url('#user1')`,
            },
            [`& .MuiAreaElement-series-user2`]: {
              fill: `url('#user2')`,
            },
            [`& .MuiAreaElement-series-user3`]: {
              fill: `url('#user3')`,
            },
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.primary.dark} id="user1" />
          <AreaGradient color={theme.palette.primary.main} id="user2" />
          <AreaGradient color={theme.palette.primary.light} id="user3" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
