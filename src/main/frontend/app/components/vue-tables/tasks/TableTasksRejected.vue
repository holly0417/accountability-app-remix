<script setup lang="ts">
import {QMarkupTable} from 'quasar';
import {taskData} from 'src/composables/TaskData.ts';
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {onMounted, ref} from 'vue';
import {TaskStatus} from 'components/dto/task/TaskStatus.ts';

const { deleteTask, getTasksByCurrentUserAndStatus } = taskData();

defineOptions({
  name: 'TableTasksRejected',
});

const currentPage = ref<number>(0);
const maxPages = ref<number>(0);
const pageSize = 5;
const rejectedTasks = ref<Page<TaskDataDto>>(DefaultPage as Page<TaskDataDto>);

onMounted(async () => {
  await reloadRejected();
});

const reloadRejected = async () => {
  rejectedTasks.value = await getTasksByCurrentUserAndStatus(TaskStatus.REJECTED, currentPage.value-1, pageSize);
  currentPage.value = rejectedTasks.value.pageNumber+1;
  maxPages.value = rejectedTasks.value.totalPages;
};


async function deleteTaskButton(taskId: number) {
  await deleteTask(taskId);
  await reloadRejected();
}

async function changePage() {
  await reloadRejected();
}

</script>

<template>
  <q-card class="outer-card-style">
    <div class="col column">

      <q-expansion-item
        expand-separator
        icon="thumb_down"
        label="Tasks rejected"
        header-class="text-h5"
      >

        <q-card-section>
          <div class="card-subtitle-style">Tasks rejected by partners</div>
        </q-card-section>

        <q-card-section class="inner-card-section expanded-items-size">
          <q-markup-table title="REJECTED TASKS">
            <thead>
              <tr>
                <th>Task Description</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in rejectedTasks.content" :key="task.id" class="text-center">
                <q-tooltip>
                  Duration: {{ task.durationString }}
                </q-tooltip>
                <td v-text="task.description" />
                <td><q-btn @click="deleteTaskButton(task.id)" class="glossy">Delete</q-btn></td>
              </tr>
            </tbody>

            <q-pagination
              v-model="currentPage"
              :max="maxPages"
              @click="changePage()"
            />

          </q-markup-table>
        </q-card-section>

      </q-expansion-item>
    </div>
  </q-card>
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
