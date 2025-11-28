<script setup lang="ts">
import { QMarkupTable } from 'quasar';
import { RelationshipDto } from 'components/dto/relationship/RelationshipDto.ts';
import {Page} from 'components/paging/Page.ts';
import {relationshipData} from 'src/composables/RelationshipData.ts';

const { deleteRelationship } = relationshipData();

defineOptions({
  name: 'PartnershipsRejected'
});

const props = defineProps<{
  rejectionsSent: Page<RelationshipDto>,
  rejectionsReceived: Page<RelationshipDto>,
  showList: boolean
}>()

const emit = defineEmits(['deleteRelationship']);

async function deleteRequest(relationshipId: number) {
  await deleteRelationship(relationshipId);
  emit('deleteRelationship');
}

</script>

<template>
  <q-card class="outer-card-style" bordered>
    <div class="col column">

        <q-card-section class="inner-card-section">
          <q-card-section>
            <div class="card-title-style">Rejected Partnerships</div>
          </q-card-section>
          <template v-if="props.showList">
            <q-markup-table title="REJECTED PARTNERSHIPS">
              <thead>
              <tr>
                <th>NAME</th>
                <th>STATUS</th>
                <th>REMOVE</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="relationship in props.rejectionsSent.content" :key="relationship.id" class="text-center">
                    <td v-text="relationship.partner.username" />
                    <td v-text="relationship.status" />
                    <td><q-btn @click="deleteRequest(relationship.id)" label="UNDO" type="submit" color="primary" class="glossy"/></td>
              </tr>
              <tr v-for="relationship in props.rejectionsReceived.content" :key="relationship.id" class="text-center">
                <td v-text="relationship.user.username" />
                <td v-text="relationship.status" />
              </tr>
              </tbody>
            </q-markup-table>
          </template>
          <template v-else>
            <div class="text-center" style="color: white;">None yet!</div>
          </template>

        </q-card-section>

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

.card-title-style {
  @include card-title-style;
}

</style>
