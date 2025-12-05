import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from './Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, {type StatCardProps} from './StatCard';
import {walletData} from "~/composables/WalletData";
import type {LocalDateTime} from "ts-extended-types";
import {purchaseData} from "~/composables/PurchaseData";
import type {Page} from "~/dto/pagination/Page";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import {PurchaseRouteStatus} from "~/dto/purchase/PurchaseRouteStatus";
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import {useLoaderData} from "react-router-dom";

import React from "react";
import type {clientLoader} from "~/routes/_index";


export default function MainGrid() {
  const { thisUserBalanceDailyHistory, partnerBalanceDailyHistory, partnerName } = useLoaderData<typeof clientLoader>();

    let balanceList:number[] = [0];
    let dateList: string[] = [" "];
    let partnerBalanceList:number[] = [0];
    let partnerDateList: string[] = [" "];

    balanceList = thisUserBalanceDailyHistory.content.map(history => {
        return history.balance;
    });

    dateList = thisUserBalanceDailyHistory.content.map(history => {
        return history.dateAsString;
    });

    partnerBalanceList = partnerBalanceDailyHistory.content.map(history => {
        return history.balance;
    });

    partnerDateList = partnerBalanceDailyHistory.content.map(history => {
        return history.dateAsString;
    });

    const walletData: StatCardProps[] = [
        {
            interval: 'Your daily progress',
            dates: dateList,
            data: balanceList,
            value: 'currentUser',
            name: 'Your',
            trend: 'up'
        },
        {
            interval: 'Partner daily progress',
            dates: partnerDateList,
            data: partnerBalanceList,
            value: 'partner',
            name: `${partnerName}'s`,
            trend: 'down'
        },
    ];


  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >

        {walletData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}


        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
    </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
