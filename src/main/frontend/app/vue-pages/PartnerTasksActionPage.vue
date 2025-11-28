<script setup lang="ts">
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import {QMarkupTable} from 'quasar';
import {TaskStatus} from 'components/dto/task/TaskStatus.ts';
import {TaskStatusDto} from 'components/dto/task/TaskStatusDto.ts';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {taskData} from 'src/composables/TaskData.ts';
import {onMounted, ref} from 'vue';
import {relationshipData} from 'src/composables/RelationshipData.ts';

const { processTaskForPartner, getTasksByUserListAndStatus } = taskData();
const { getPartnerIdList } = relationshipData();

defineOptions({
  name: 'PartnerTasksPage'
});

const currentPage = ref<number>(0);
const maxPages = ref<number>(0);
const pageSize = 5;

const partnerTasks = ref<Page<TaskDataDto>>(DefaultPage as Page<TaskDataDto>);
const partners = ref<number[]>([]);

const newStatus = ref<TaskStatusDto>({
  status: TaskStatus.COMPLETED
});

onMounted(async () => {
  partners.value = await getPartnerIdList();
  await reloadPartnerTasks();
})

const reloadPartnerTasks = async () => {
  partnerTasks.value = await getTasksByUserListAndStatus(
    partners.value, TaskStatus.COMPLETED, currentPage.value-1, pageSize);

  currentPage.value = partnerTasks.value.pageNumber+1;
  maxPages.value = partnerTasks.value.totalPages;
};

async function updateTask(taskId: number, status: TaskStatus) {
  newStatus.value.status = status;
  await processTaskForPartner(taskId, newStatus.value);
  await reloadPartnerTasks();
}

async function changePage() {
  await reloadPartnerTasks();
}

</script>

<template>
  <div class="row q-pa-md q-col-gutter-md q-gutter-md">

    <div class="col-12 col-md-6">

      <q-card class="outer-card-style">

        <q-card-section>
          <div class="text-h6">Partner tasks</div>
          <div class="text-subtitle2">Approve or reject your partners' tasks</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-markup-table class="text-center" title="PARTNER TASKS">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Task Description</th>
                <th>Time Spent</th>
                <th>APPROVE</th>
                <th>REJECT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in partnerTasks.content" :key="task.id">
                  <td v-text="task.userName" />
                  <td v-text="task.description" />
                  <td v-text="task.durationString" />
                  <td><q-btn @click="updateTask(task.id, TaskStatus.APPROVED)"
                             label="ACCEPT" type="submit" color="primary"/></td>
                  <td><q-btn @click="updateTask(task.id, TaskStatus.REJECTED)"
                             label="REJECT" type="submit" color="primary"/></td>
              </tr>
            </tbody>
            <q-pagination
              v-model="currentPage"
              :max="maxPages"
              @click="changePage()"
            />
          </q-markup-table>
        </q-card-section>

      </q-card>

    </div>

  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.outer-card-style {
  @include outer-card-style;
  @include main-card-size;
}

.inner-card-section {
  @include inner-card-section;
}

.expanded-items-size {
  @include expanded-items-size;
}

.card-subtitle-style {
  @include card-subtitle-style;
}

</style>
