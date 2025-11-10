<script setup lang="ts">
import {QMarkupTable} from 'quasar';
import {RelationshipDto} from 'components/dto/relationship/RelationshipDto.ts';
import {Page} from 'components/paging/Page.ts';
import {relationshipData} from 'src/composables/RelationshipData.ts';
import {RelationshipStatus} from 'components/dto/relationship/RelationshipStatus.ts';
import {RelationshipStatusDto} from 'components/dto/relationship/RelationshipStatusDto.ts';
import {ref} from 'vue';

const { updateRelationship } = relationshipData();

defineOptions({
  name: 'PartnershipsRequestsToAnswer'
});

const props = defineProps<{
  partnerList: Page<RelationshipDto>
}>()

const emit = defineEmits(['updateRelationship'])

async function updateRelationshipButton(relationshipId: number, statusEnum: RelationshipStatus) {
  let status = ref<RelationshipStatusDto>({
    status: statusEnum
  })
  await updateRelationship(relationshipId, status.value);
  emit('updateRelationship');
}

</script>

<template>
  <q-card class="outer-card-style" bordered>
    <div class="col column">

        <q-card-section>
          <div class="card-title-style">Pending requests</div>
          <div class="card-subtitle-style">Answer partnership requests here</div>
        </q-card-section>

        <q-card-section class="inner-card-section">
          <template v-if="props.partnerList.content.length">
            <q-markup-table title="PARTNERSHIPS TO RESPOND TO">
              <thead>
              <tr>
                <th>NAME</th>
                <th>STATUS</th>
                <th>ACCEPT</th>
                <th>REJECT</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="relationship in props.partnerList.content" :key="relationship.id" class="text-center">
                <td v-text="relationship.partner.username" />
                <td v-text="relationship.status" />
                <td><q-btn @click="updateRelationshipButton(relationship.id, RelationshipStatus.APPROVED)"
                           label="APPROVE" type="submit" color="primary" class="glossy" /></td>
                <td><q-btn @click="updateRelationshipButton(relationship.id, RelationshipStatus.REJECTED)"
                           label="REJECT" type="submit" color="primary" class="glossy"/></td>
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
