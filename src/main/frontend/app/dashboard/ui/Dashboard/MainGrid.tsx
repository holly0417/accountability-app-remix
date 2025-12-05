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
import SessionsChart, {type SessionsChartProps} from './SessionsChart';
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
import {data} from "react-router";


export default function MainGrid() {
  const { thisUserData,
      limitedPartnerData } = useLoaderData<typeof clientLoader>();

    const partnerWalletData: StatCardProps[] = limitedPartnerData.map(partner => {
        return {
            interval: 'Daily progress',
            dates: partner.data.map(item => item.xAxisValue),
            data: partner.data.map(item => item.yAxisValue),
            value: partner.username,
            name: `${partner.username}'s`,
            trend: "down",
        }
    })

    const userWalletData: StatCardProps = {
        interval: 'Daily progress',
        dates: thisUserData.data.map(item => item.xAxisValue),
        data: thisUserData.data.map(item => item.yAxisValue),
        value: thisUserData.username,
        name: `${thisUserData.username}r`,
        trend: "up",
    };

    const walletData: StatCardProps[] = [userWalletData, ...partnerWalletData];

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
