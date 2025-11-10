<script setup lang="ts">

import { QMarkupTable } from 'quasar';
import { RelationshipDto } from 'components/dto/relationship/RelationshipDto.ts';
import { UserDto } from 'components/dto/UserDto.ts';
import {Page} from 'components/paging/Page.ts';
import { relationshipData } from 'src/composables/RelationshipData.ts';

const { deleteRelationship } = relationshipData();

defineOptions({
  name: 'PartnershipsApproved'
});

const props = defineProps<{
  partnerList: Page<RelationshipDto>
  currentUser: UserDto
}>()

const emit = defineEmits(['deleteRelationship'])

async function deleteRequest(relationshipId: number) {
  await deleteRelationship(relationshipId);
  emit('deleteRelationship');
}
</script>

<template>
  <q-card class="outer-card-style" bordered>
    <q-card-section>
      <div class="card-title-style">Partnership overview</div>
      <div class="card-subtitle-style">Your partners</div>
    </q-card-section>

    <q-card-section class="inner-card-section">
      <template v-if="props.partnerList.content.length">
      <q-markup-table class="text-center" title="APPROVED PARTNERSHIPS">
        <thead>
        <tr>
          <th>NAME</th>
          <th>STATUS</th>
          <th>REMOVE</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="relationship in props.partnerList.content" :key="relationship.id" class="text-center">
            <td v-text="relationship.partner.username" />
            <td v-text="relationship.status" />
            <td><q-btn @click="deleteRequest(relationship.id)" label="DELETE" type="submit" color="deep-orange" class="glossy"/></td>
        </tr>
        </tbody>
      </q-markup-table>
      </template>
      <template v-else>
        <div class="text-center" style="color: white;">None yet!</div>
      </template>
    </q-card-section>
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

