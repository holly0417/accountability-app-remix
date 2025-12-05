import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

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

function sortDateLists(dateList1:string[], dateList2:string[]): string[] {
    return [...new Set([...dateList1, ...dateList2])].sort((a, b) => getEarlierDate(a, b));
}

export type SessionsChartProps = {
    currentUserDates: string[];
    currentUserData: number[];
    currentUserName: string;
    partner1Dates: string[];
    partner1Data: number[];
    partner1Name: string;
    partner2Dates: string[];
    partner2Data: number[];
    partner2Name: string;
};

export default function SessionsChart({ currentUserDates,
                                          currentUserData,
                                          currentUserName,
                                          partner1Dates,
                                          partner1Data,
                                          partner1Name,
                                          partner2Dates,
                                          partner2Data,
                                          partner2Name}: SessionsChartProps) {

  const theme = useTheme();
  let dates1 = sortDateLists(currentUserDates, partner1Dates);
  const data = sortDateLists(dates1, partner2Dates);

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
          series={[
            {
              id: currentUserName,
              label: currentUserName,
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: currentUserData,
                valueFormatter: (value) => (value == null ? '' : value.toFixed(2)),
            },
            {
              id: partner1Name,
              label: partner1Name,
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: partner1Data,
                valueFormatter: (value) => (value == null ? '' : value.toFixed(2)),
            },
            {
              id: partner2Name,
              label: partner2Name,
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: partner2Data,
              area: true,
                valueFormatter: (value) => (value == null ? '' : value.toFixed(2)),
            },
          ]}

          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            [`& .MuiAreaElement-series-${currentUserName}`]: {
              fill: `url('#${currentUserName}')`,
            },
            [`& .MuiAreaElement-series-${partner1Name}`]: {
              fill: `url('#${partner1Name}')`,
            },
            [`& .MuiAreaElement-series-${partner2Name}`]: {
              fill: `url('#${partner2Name}')`,
            },
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.primary.dark} id={currentUserName} />
          <AreaGradient color={theme.palette.primary.main} id={partner1Name} />
          <AreaGradient color={theme.palette.primary.light} id={partner2Name} />
        </LineChart>
      </CardContent>
    </Card>
  );
}
