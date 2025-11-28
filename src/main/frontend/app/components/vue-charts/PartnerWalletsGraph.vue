<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import {WalletDto} from 'components/dto/WalletDto.js';
import {ECharts} from 'echarts';
import {walletData} from 'src/composables/WalletData.ts';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {relationshipData} from 'src/composables/RelationshipData.ts';

const {getCurrentUserWallet, getWalletsByUserIds} = walletData();
const { getPartnerIdList } = relationshipData();

defineOptions({
  name: 'TestGraph'
});

// ECharts instance (typed as ECharts or null)
let chartInstance: ECharts | null = null;

//in template, we have <div> with ref="barchart"
// DOM reference (strictly typed as HTMLDivElement or null)
const walletBarChart = ref<HTMLDivElement | null>(null);

// Define interface for API response
interface TooltipParams {
  name: string,
  balance: number,
  data: walletData;
}

interface walletData {
  name: string;
  value: number;
}

const currentUserWallet = ref<WalletDto>({
  userId: 0,
  userName: '',
  balance: 0
});

const partners = ref<number[]>([]);
const partnerWallets = ref<Page<WalletDto>>(DefaultPage as Page<WalletDto>);

// Fetch data and initialize chart
onMounted(async () => {
  if (walletBarChart.value) {
    // 1. Fetch data from API
    currentUserWallet.value = await getCurrentUserWallet();
    partners.value = await getPartnerIdList();
    partnerWallets.value = await getWalletsByUserIds(partners.value);

    const walletDataset: walletData[] = partnerWallets.value.content.map(walletDto => ({
      name: walletDto.userName,
      value: walletDto.balance
    }));

    walletDataset.push({
      name: 'You',
      value: currentUserWallet.value.balance
    });

    // 2. Initialize ECharts and attach to DOM element <div ref="barchart">
    // barchart.value = points to DOM element
    chartInstance = echarts.init(walletBarChart.value);

    // 3. Update chart with API data
    chartInstance.setOption({
      dataset: {source: walletDataset},
      xAxis: {type: 'category'},
      yAxis: {type: 'value'},
      series: [{
        type: 'bar',
        dimensions: ['name', 'value'],
        encode: {
          x: 'name',
          y: 'value'
        },
        barGap: 0,
        barCategoryGap: '15%',
        barWidth: '30%',
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: unknown) => {
          const tooltipParams = params as TooltipParams[] | TooltipParams;
          const param = Array.isArray(tooltipParams) ? tooltipParams[0] : tooltipParams;

          if (param && param.data) {
            const data = param.data as walletData;
            let thisBalance = data.value.toFixed(2);
            return `
                <strong>${param.name}</strong><br/>
                Balance: ${thisBalance}<br/>
              `;
          }
          return 'No data available';
        }
      }
    });

    // Use ResizeObserver for container resizing
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    });

    resizeObserver.observe(walletBarChart.value);
  }
});

async function onResize(){
  if(chartInstance != null){
    chartInstance.resize();
  }
}
//to avoid memory leaks, dispose chart on unmount
onUnmounted(() => {
  chartInstance?.dispose();
});

</script>

<template>
    <q-card class="outer-card main-card-size" bordered>
      <div class="col column">

        <q-expansion-item
          expand-separator
          icon="account_balance_wallet"
          label="Wallet overview"
          header-class="text-h5"
        >
          <q-card-section>
            <div class="text-subtitle2">Yours and your partners' wallet balances</div>
          </q-card-section>

          <div class="inner-card-section expanded-items-size">
            <q-card-section class="white-background">
              <div ref="walletBarChart" class="chart-container" @resize="onResize"/>
            </q-card-section>
          </div>
        </q-expansion-item>

      </div>
    </q-card>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.outer-card {
  @include outer-card-style;
}

.inner-card-section {
  @include inner-card-section;
}

.chart-container {
  @include chart-container;
}

.main-card-size {
  @include main-card-size;
}

.white-background {
  @include white-background;
}

.expanded-items-size {
  @include expanded-items-size;
}

</style>
