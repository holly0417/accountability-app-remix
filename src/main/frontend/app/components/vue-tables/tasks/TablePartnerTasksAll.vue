<script setup lang="ts">
import {QMarkupTable} from 'quasar';
import {TaskDataDto} from 'components/dto/task/TaskDataDto.ts';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {onMounted, ref} from 'vue';
import {taskData} from 'src/composables/TaskData.ts';
import {relationshipData} from 'src/composables/RelationshipData.ts';
const { getAllTasksByUserList } = taskData();
const { getPartnerIdList } = relationshipData();

defineOptions({
  name: 'TablePartnerTasksAll',
});

const currentPage = ref<number>(0);
const maxPages = ref<number>(0);
const pageSize = 5;

const recentPartnerTasks = ref<Page<TaskDataDto>>(DefaultPage as Page<TaskDataDto>);
const partnerList = ref<number[]>([]);

onMounted(async () => {
  await reloadPartnerTaskList();
})

const reloadPartnerTaskList = async() => {
  partnerList.value = await getPartnerIdList();
  recentPartnerTasks.value = await getAllTasksByUserList(partnerList.value, currentPage.value-1, pageSize);
  currentPage.value = recentPartnerTasks.value.pageNumber+1;
  maxPages.value = recentPartnerTasks.value.totalPages;
}

async function changePage() {
  await reloadPartnerTaskList();
}

</script>

<template>
  <q-card class="outer-card-style" bordered>
    <div class="col column">

      <q-expansion-item
        expand-separator
        icon="star_rate"
        label="Recent tasks by partners"
        header-class="text-h5"
      >
        <q-card-section>
          <div class="card-subtitle-style">See most recent tasks from your partners</div>
        </q-card-section>

        <q-card-section class="inner-card-section expanded-items-size">
          <q-markup-table title="TASKS">
            <thead>
              <tr>
                <th>User</th>
                <th>Task Description</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="task in recentPartnerTasks.content"
                  :key="task.id" class="text-center">
                  <td v-text="task.userName" />
                    <q-tooltip>
                      Status: {{ task.status }} <br>
                      Duration: {{ task.durationString }}
                    </q-tooltip>
                  <td v-text="task.description"></td>
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

