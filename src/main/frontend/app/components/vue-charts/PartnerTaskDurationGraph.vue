<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import {ECharts} from 'echarts';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import { taskData } from 'src/composables/TaskData.ts';
import { relationshipData } from 'src/composables/RelationshipData.ts';
import { TaskDataDto } from 'components/dto/task/TaskDataDto.ts';
import {TaskStatus} from 'components/dto/task/TaskStatus.ts';
import {userData} from 'src/composables/UserData.ts';
import {UserDto} from 'components/dto/UserDto.ts';

const {getCurrentUserInfo} = userData();
const {getTasksByUserListAndStatusOrderByDuration} = taskData();
const { getPartnerIdList } = relationshipData();

interface TooltipParams {
  name: string;
  data: ChartDataItem;
  value: number | number[];
}

interface ChartDataItem {
  value: number;
  user: string;
  description: string;
  durationString: string;
}

defineOptions({
  name: 'PartnerTaskDurationGraph'
});

// ECharts instance (typed as ECharts or null)
let chartInstance: ECharts | null = null;

//in template, we have <div> with ref="barchart"
// DOM reference (strictly typed as HTMLDivElement or null)
const partnerTaskBarChart = ref<HTMLDivElement | null>(null);

const userIdList = ref<number[]>([]);

const currentUserId = ref<UserDto>({
  id: 0,
  username: '',
  email: ''
});

const tasks = ref<Page<TaskDataDto>>(DefaultPage as Page<TaskDataDto>);

// Fetch data and initialize chart
onMounted(async () => {

  if (partnerTaskBarChart.value) {
    // 1. Fetch data from API
    currentUserId.value = await getCurrentUserInfo();
    userIdList.value = await getPartnerIdList();
    userIdList.value.push(currentUserId.value.id);

    tasks.value = await getTasksByUserListAndStatusOrderByDuration(userIdList.value, TaskStatus.APPROVED);

    const byUserCategory = Array.from(new Set(tasks.value.content.map(item => item.userName)))

    // 2. Initialize ECharts and attach to DOM element <div ref="barchart">
    // barchart.value = points to DOM element
    chartInstance = echarts.init(partnerTaskBarChart.value);

    const chartData: ChartDataItem[] = tasks.value.content.map(item => ({
      value: item.durationNumber,
      user: item.userName,
      description: item.description,
      durationString: item.durationString
    }));

    // 3. Update chart with API data
    chartInstance.setOption({
      grid: {
        top: 80,
        bottom: 5
      },
      dataset: { source: chartData },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        inverse: true,
        axisLabel: {
          formatter: ''
        }
      },
      series: [{
        type: 'bar',
        dimensions: ['value', 'user', 'description', 'durationString'],
        encode: {
          x: 'value',
          y: 'description'
        },
        barGap: 0,
        barCategoryGap: '15%',
        barWidth: '30%',
      }],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: TooltipParams[] | TooltipParams) => {
          // Type assertion for the params
          const tooltipParams = params;
          const param = Array.isArray(tooltipParams) ? tooltipParams[0] : tooltipParams;

          if (param && param.data) {
            const data = param.data as ChartDataItem;
            return `
                <strong>${param.name}</strong><br/>
                User: ${data.user}<br/>
                Task: ${data.description}<br/>
                Duration: <b>${data.durationString}</b>
              `;
          }
          return 'No data available';
        }
      },
      position: ['50%', '50%'],
      visualMap: {
        type: 'piecewise', // or 'continuous' if it was a number
        categories: byUserCategory, // our list of categories
        dimension: 1, // Maps the 3rd item in the value array (index 2) to the color
        inRange: {
          color: ['#5470c6', '#91cc75', '#fac858'] // assign colors to categories
        },
        top: '10', // position it
      }
    });

    // Use ResizeObserver for container resizing
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    });

    resizeObserver.observe(partnerTaskBarChart.value);
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

          <q-expansion-item
            expand-separator
            icon="leaderboard"
            label="Approved tasks by duration"
            header-class="text-h5"
          >
            <q-card-section>
              <div class="card-subtitle-style">Among yours and your partners' tasks</div>
            </q-card-section>

            <div class="inner-card-section expanded-items-size">
              <q-card-section class="white-background">
                <div ref="partnerTaskBarChart" class="chart-container" @resize="onResize"/>
              </q-card-section>
            </div>
        </q-expansion-item>

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

.card-subtitle-style {
  @include card-subtitle-style;
}

.card-title-style {
  @include card-title-style;
}


</style>
