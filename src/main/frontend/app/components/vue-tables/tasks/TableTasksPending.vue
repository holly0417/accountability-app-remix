<script setup lang="ts">
import {QMarkupTable} from 'quasar';
import {taskData} from 'src/composables/TaskData.ts';
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import { Page} from 'components/paging/Page.ts';
import {onMounted, ref} from 'vue';
import {TaskEditRequestDto} from 'components/dto/task/TaskEditRequestDto.ts';

const { deleteTask, startTask, editTaskDescription } = taskData();

defineOptions({
  name: 'TableTasksPending'
});

onMounted(async () => {
  await changePage();
});

const props = defineProps<{
  taskList: Page<TaskDataDto>
}>()

const emit = defineEmits(['startTask', 'deleteTask', 'updateList', 'editTask'])

async function deleteTaskButton(taskId: number) {
  await deleteTask(taskId);
  emit('deleteTask');
}

async function startTaskButton(taskId: number) {
  await startTask(taskId);
  emit('startTask');
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
    <div class="col column">
      <q-expansion-item
        expand-separator
        icon="checklist"
        label="To-do list"
        header-class="text-h5"
      >

        <q-card-section class="inner-card-section expanded-items-size">
          <q-markup-table title="PLANNED TASKS">
          <thead>
          <tr>
            <th>Task</th>
            <th>Start</th>
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
              <td><q-btn @click="startTaskButton(task.id)" class="glossy">Start</q-btn></td>
              <td><q-btn @click="deleteTaskButton(task.id)" class="glossy">Delete</q-btn></td>
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

.card-title-style {
  @include card-title-style;
}

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

</style>
