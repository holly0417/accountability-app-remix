<script setup lang="ts">
import PartnerWalletsGraph from 'components/charts/PartnerWalletsGraph.vue';
import PartnerTaskDurationGraph from 'components/charts/PartnerTaskDurationGraph.vue';
import TablePartnerTasksAll from 'components/tables/tasks/TablePartnerTasksAll.vue';
import TaskForm from 'components/forms/TaskForm.vue';
import {onMounted, ref} from 'vue';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import {DefaultTaskCalculatorDto, TaskCalculatorDto} from 'components/dto/task/TaskCalculatorDto.ts';
import {taskData} from 'src/composables/TaskData.ts';
import {TaskStatus} from 'components/dto/task/TaskStatus.ts';
import TableTasksPending from 'components/tables/tasks/TableTasksPending.vue';
import TableTasksInProgress from 'components/tables/tasks/TableTasksInProgress.vue';

defineOptions({
  name: 'IndexPage'
});
const loading = ref<boolean>(true);

const { getTasksByCurrentUserAndStatus,
  calculatePaymentInProgress } = taskData();

const pageSize = 5;

const pendingCurrentPage = ref<number>(0);
const inProgressCurrentPage = ref<number>(0);
const pendingTasks = ref<Page<TaskDataDto>>(DefaultPage as Page<TaskDataDto>);
const inProgressTasks = ref<Page<TaskDataDto>>(DefaultPage as Page<TaskDataDto>);
const inProgressPayment = ref<TaskCalculatorDto>(DefaultTaskCalculatorDto);

onMounted(async () => {
  loading.value = true;
  await Promise.all([reloadInProgress(), reloadPending()] );
  loading.value = false;
});

const reloadPending = async () => {
  pendingTasks.value = await getTasksByCurrentUserAndStatus(TaskStatus.PENDING, pendingCurrentPage.value, pageSize);
};

async function changePendingPage(currentPage: number) {
  pendingTasks.value = await getTasksByCurrentUserAndStatus(TaskStatus.PENDING, currentPage-1, pageSize);
  pendingCurrentPage.value = pendingTasks.value.pageNumber+1;
}

const reloadInProgress = async () => {
  inProgressTasks.value = await getTasksByCurrentUserAndStatus(TaskStatus.IN_PROGRESS, inProgressCurrentPage.value, pageSize);
  inProgressPayment.value = await calculatePaymentInProgress();
};

async function changeInProgressPage(currentPage: number) {
  inProgressTasks.value = await getTasksByCurrentUserAndStatus(TaskStatus.IN_PROGRESS, currentPage-1, pageSize);
  inProgressCurrentPage.value = inProgressTasks.value.pageNumber+1;
}

const refreshPendingAndInProgressLists = async () => {
  await Promise.all([reloadInProgress(), reloadPending()]);
}

</script>

<template>
  <q-layout>
    <q-page-container class="q-pa-md q-gutter-md">

      <div class="row q-gutter-md">

        <div class="col-12 col-md-4">
          <TaskForm @new-task="reloadPending"/>
        </div>

        <div class="col-12 col-md-4">
          <TableTasksPending :taskList="pendingTasks"
                              @delete-task="reloadPending"
                              @start-task="refreshPendingAndInProgressLists"
                              @update-list="changePendingPage"
                              @edit-task="reloadPending"/>
        </div>

        <div class="col-12 col-md-4">
          <TableTasksInProgress :taskList="inProgressTasks"
                                :payment="inProgressPayment"
                                @delete-task="reloadInProgress"
                                @update-list="changeInProgressPage"
                                @end-task="reloadInProgress"
                                @edit-task="reloadInProgress"/>
        </div>

        <div class="col-12 col-md-4">
          <PartnerTaskDurationGraph />
        </div>

        <div class="col-12 col-md-4">
          <PartnerWalletsGraph  />
        </div>

        <div class="col-12 col-md-4">
          <TablePartnerTasksAll  />
        </div>
      </div>

    </q-page-container>
  </q-layout>

</template>

<style lang="scss" scoped>

</style>

