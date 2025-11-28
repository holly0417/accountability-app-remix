<script setup lang="ts">
//Table with current user's in-progress tasks only
//tasks include buttons for deleting and ending a task
//ending a task will set that task to COMPLETED and will be listed in the completed table

//Expects props:
// taskList = inProgressTasks (gets current user's in-progress tasks)
// payment = inProgressPayment (gets minimum-wage earnings of total time
// spent on in-progress tasks from start to current time)

//Expects composable:
// TaskDataDto() from TaskDataDto.ts composable with methods:
// deleteTask (deletes task from current user's list),
// endTask (sets task to status: COMPLETED)

//Quirks:
//Parent TaskPage.vue listens to emitted events endTask and deleteTask

import { QMarkupTable } from 'quasar';
import { taskData } from 'src/composables/TaskData.ts';
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import {Page} from 'components/paging/Page.ts';
import {TaskCalculatorDto} from 'components/dto/task/TaskCalculatorDto.ts';
import {onMounted, ref} from 'vue';
import {TaskEditRequestDto} from 'components/dto/task/TaskEditRequestDto.ts';

const { deleteTask, endTask, editTaskDescription } = taskData();

defineOptions({
  name: 'TableTasksInProgress',
});

onMounted(async () => {
  await changePage();
});

const props = defineProps<{
  taskList: Page<TaskDataDto>
  payment: TaskCalculatorDto
}>()

const emit = defineEmits(['endTask', 'deleteTask', 'updateList', 'editTask'])

async function deleteTaskButton(taskId: number) {
  await deleteTask(taskId);
  emit('deleteTask');
}

async function endTaskButton(taskId: number) {
  await endTask(taskId);
  emit('endTask');
}

async function editTaskButton(taskId: number, description: string) {
  let newDescription = ref<TaskEditRequestDto>({
    description: ''
  });

  newDescription.value.description = description;
  await editTaskDescription(taskId, newDescription.value);
  emit('editTask');
}

const currentPage = ref<number>(0);

async function changePage() {
  emit('updateList', currentPage.value);
}

</script>

<template>
  <q-card class="outer-card-style">

      <q-expansion-item
        expand-separator
        icon="directions_run"
        label="Tasks in progress"
        header-class="text-h5"
      >

        <q-card-section class="inner-card-section expanded-items-size">
        <q-markup-table title="TASKS IN PROGRESS">
          <thead>
          <tr>
            <th>Task</th>
            <th>End</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="task in props.taskList.content" :key="task.id" class="text-center">

              <q-tooltip>
                Duration: {{ task.durationString }}
              </q-tooltip>

              <td>{{ task.description }}
                <q-popup-edit v-model="task.description" title="Edit Description" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"
                           @keydown.enter="editTaskButton(task.id, scope.value)" name=""/>
                </q-popup-edit>
              </td>

              <td><q-btn @click="endTaskButton(task.id)" class="glossy">Finish</q-btn></td>
              <td><q-btn @click="deleteTaskButton(task.id)" class="glossy">Delete</q-btn></td>
          </tr>
          <tr>
            <td>IN-PROGRESS BALANCE: </td>
            <td>{{ props.payment.payment.toFixed(2) }}</td>
          </tr>
          </tbody>

          <q-pagination
            v-model="currentPage"
            :max="props.taskList.totalPages"
            @click="changePage()"
          />

        </q-markup-table>
        </q-card-section>
      </q-expansion-item>

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

.card-title-style {
  @include card-title-style;
}

</style>
