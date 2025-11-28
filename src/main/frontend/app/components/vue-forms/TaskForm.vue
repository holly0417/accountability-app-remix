<script setup lang="ts">

import { ref } from 'vue';
import {TaskEditRequestDto} from 'components/dto/task/TaskEditRequestDto.ts';
import {taskData} from 'src/composables/TaskData.ts';

const { addTask } = taskData();

defineOptions({
  name: 'TaskPage'
});

// this should be a ref<TaskDataDto> - you want to send TaskDataDto to the backend - or maybe a new class like TaskEditRequestDto.ts
const formData = ref<TaskEditRequestDto>({
  description: ''
});

const emit = defineEmits(['newTask']);
let loading = ref<boolean>(false);

const addTaskForm = async () => {
  loading.value = true;
  await addTask(formData.value);
  formData.value.description = '';
  emit('newTask');
  loading.value = false;
};

</script>

<template>

    <q-form class="outer-card-style">

        <div class="row">
          <q-input
            v-model="formData.description"
            label="What do you need to get done?"
            filled
            @keyup.enter="addTaskForm"
            type="textarea"
            name=""
            class="inner-card-section"
          />
        </div>

        <div class="row justify-center q-pa-md">
          <!-- Don't use SUBMIT, it will reload the page before this asynchronous request via Axios can finish -->
          <q-btn label="Submit"
                 @click="addTaskForm"
                 color="primary"
                 :loading="loading"
                 class="glossy"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>

        </div>

    </q-form>

</template>
<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.outer-card-style {
  @include outer-card-style;
  @include main-card-size;
}

.inner-card-section {
  @include inner-card-section;
  @include white-background;
}

</style>
