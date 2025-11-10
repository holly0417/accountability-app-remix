<script setup lang="ts">
import {QMarkupTable} from 'quasar';
import {taskData} from 'src/composables/TaskData.ts';
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import {Page} from 'components/paging/Page.ts';
import {TaskCalculatorDto} from 'components/dto/task/TaskCalculatorDto.ts';
import {onMounted, ref} from 'vue';
import {TaskEditRequestDto} from 'components/dto/task/TaskEditRequestDto.ts';

const { deleteTask, editTaskDescription } = taskData();

defineOptions({
  name: 'TableTasksCompleted',
});

onMounted(async () => {
  await changePage();
});

const props = defineProps<{
  taskList: Page<TaskDataDto>
  payment: TaskCalculatorDto
}>()

const emit = defineEmits(['deleteTask', 'updateList', 'editTask'])

async function deleteTaskButton(taskId: number) {
  await deleteTask(taskId);
  emit('deleteTask');
}

const currentPage = ref<number>(0);

async function changePage() {
  emit('updateList', currentPage.value);
}

async function editTaskButton(taskId: number, description: string) {
  let newDescription = ref<TaskEditRequestDto>({
    description: ''
  });

  newDescription.value.description = description;
  await editTaskDescription(taskId, newDescription.value);
  emit('editTask');
}


</script>

<template>
  <q-card class="outer-card-style">
    <div class="col column">
      <q-expansion-item
        expand-separator
        icon="military_tech"
        label="Tasks completed"
        header-class="text-h5"
      >

        <q-card-section class="inner-card-section expanded-items-size">
          <q-markup-table title="COMPLETED TASKS">
            <thead>
              <tr>
                <th>Task</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in props.taskList.content" :key="task.id" class="text-center">
                  <td>{{ task.description }}
                    <q-popup-edit v-model="task.description" title="Edit Description" auto-save v-slot="scope">
                      <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"
                               @keydown.enter="editTaskButton(task.id, scope.value)" name=""/>
                    </q-popup-edit>
                  </td>
                  <q-tooltip>
                    Duration: {{ task.durationString }}
                  </q-tooltip>
                  <td><q-btn @click="deleteTaskButton(task.id)" class="glossy" color="deep-orange">Delete</q-btn></td>
              </tr>
              <tr>
                <td>COMPLETED BALANCE: </td>
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

.card-title-style {
  @include card-title-style;
}

</style>
