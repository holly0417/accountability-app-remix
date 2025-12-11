import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {SparkLineChart} from '@mui/x-charts/SparkLineChart';
import {areaElementClasses} from '@mui/x-charts/LineChart';

export type StatCardProps = {
    interval: string; dates: string[]; data: number[]; value: string; name: string; trend: "up" | "down" | "neutral";
};

export default function StatCard({
                                     interval, dates, data, value, name, trend,
                                 }: StatCardProps) {
    const theme = useTheme();

    const trendColors = {
        up: theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark,
        down: theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark,
        neutral: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[700],
    };
    const chartColor = trendColors[trend];

    function AreaGradient({color, id}: { color: string; id: string }) {
        return (<defs>
                <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
            </defs>);
    }

    return (<Card variant="outlined" sx={{height: '100%', flexGrow: 1}}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    {`${name} wallet`}
                </Typography>
                <Stack
                    direction="column"
                    sx={{justifyContent: 'space-between', flexGrow: '1', gap: 1}}
                >
                    <Stack sx={{justifyContent: 'space-between'}}>
                        <Stack
                            direction="row"
                            sx={{justifyContent: 'space-between', alignItems: 'center'}}
                        >
                        </Stack>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            {interval}
                        </Typography>
                    </Stack>
                    <Box sx={{width: '100%', height: 50}}>
                        <SparkLineChart
                            color={chartColor}
                            data={data}
                            area
                            showHighlight
                            showTooltip
                            valueFormatter={(value) => (value === null ? '' : value.toFixed(2))}
                            xAxis={{
                                scaleType: 'band', data: dates, // Use the correct property 'data' for xAxis
                            }}
                            sx={{
                                [`& .${areaElementClasses.root}`]: {fill: `url(#area-gradient-${value})`,}
                            }}
                        >
                            <AreaGradient color={chartColor} id={`area-gradient-${value}`}/>
                        </SparkLineChart>
                    </Box>
                </Stack>
            </CardContent>
        </Card>);
}
