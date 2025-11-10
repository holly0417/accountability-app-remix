<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {QMarkupTable} from 'quasar';
import {RelationshipDto} from 'components/dto/relationship/RelationshipDto.ts';
import {UserDto} from 'components/dto/UserDto.ts';
import PartnershipsRequestsToWait from 'components/tables/partnerships/PartnershipsRequestsToWait.vue';
import PartnershipsRejected from 'components/tables/partnerships/PartnershipsRejected.vue';
import PartnershipsRequestsToAnswer from 'components/tables/partnerships/PartnershipsRequestsToAnswer.vue';
import {relationshipData} from 'src/composables/RelationshipData.ts'
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {RelationshipStatus} from 'components/dto/relationship/RelationshipStatus.ts';
import PartnershipsApproved from 'components/tables/partnerships/PartnershipsApproved.vue';
import {userData} from 'src/composables/UserData.ts';
import {RelationshipDirection} from 'components/dto/relationship/RelationshipDirection.ts';

const { getCurrentUserInfo } = userData();

const { search, sendRequest, getRelationshipsByStatus, getRequests } = relationshipData();

defineOptions({
  name: 'RelationshipPage'
});

const currentUser = ref<UserDto>({
  id: 0,
  username: '',
  email: ''
});

const userSearch = ref<UserDto>({
  id: 0,
  username: '',
  email: ''
});

const searchResult = ref<RelationshipDto[]>([]);
const approvedRelationships = ref<Page<RelationshipDto>>(DefaultPage as Page<RelationshipDto>);

const requestsToAnswer = ref<Page<RelationshipDto>>(DefaultPage as Page<RelationshipDto>);
const requestsToWait = ref<Page<RelationshipDto>>(DefaultPage as Page<RelationshipDto>);

const rejectionsSent = ref<Page<RelationshipDto>>(DefaultPage as Page<RelationshipDto>);
const rejectionsReceived = ref<Page<RelationshipDto>>(DefaultPage as Page<RelationshipDto>);

const showRejectionList = ref<boolean>(true);
const rejectionListTotal=ref<number>(0);

onMounted( async () => {
  currentUser.value = await getCurrentUserInfo();
  approvedRelationships.value = await getRelationshipsByStatus(RelationshipStatus.APPROVED);

  requestsToAnswer.value = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.SENDER);
  requestsToWait.value = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.RECEIVER);

  rejectionsSent.value = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.SENDER);
  rejectionsReceived.value = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.RECEIVER);

  const list1 = (rejectionsSent.value.content.length);
  const list2 = (rejectionsReceived.value.content.length);
  rejectionListTotal.value = list1.valueOf() + list2.valueOf();

  showRejectionList.value = rejectionListTotal.value < 1 ? false : true;

})

const searchFriend = async () => {
  searchResult.value = await search(userSearch.value.username);
};

async function sendPartnershipRequest(partnerId: number) {
  await sendRequest(partnerId);
  await searchFriend();
  await reloadRequestsToWait();
}

async function reloadRequestsToAnswer() {
  requestsToAnswer.value = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.SENDER);
}

async function reloadRequestsToWait() {
  requestsToWait.value = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.RECEIVER);
}

async function reloadApprovedPartners() {
  approvedRelationships.value = await getRelationshipsByStatus(RelationshipStatus.APPROVED);
}

async function reloadRejectedPartners() {
  rejectionsSent.value = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.SENDER);
  rejectionsReceived.value = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.RECEIVER);

  const list1 = (rejectionsSent.value.content.length);
  const list2 = (rejectionsReceived.value.content.length);
  rejectionListTotal.value = list1.valueOf() + list2.valueOf();

  showRejectionList.value = rejectionListTotal.value < 1 ? false : true;
}

async function reloadListsAfterAnswering() {
  await Promise.all([reloadRequestsToAnswer(), reloadApprovedPartners(), reloadRejectedPartners()]);
}

</script>

<template>
  <div class="q-gutter-md q-col-gutter-md">

    <div class="row justify-center q-gutter-md q-col-gutter-md">

      <div class="col-12 col-md-6">
        <q-card class="outer-card-style">
          <q-card-section>
            <div class="card-title-style">Find a friend</div>
          </q-card-section>

          <q-card-section>
              <q-input
                v-on:keyup="searchFriend"
                v-model="userSearch.username"
                label="To search, type in a username"
                filled
                type="textarea"
                name="partner search bar"
                class="inner-card-section"
              />
          </q-card-section>

          <q-card-section>
            <q-markup-table title="EXISTING USERS">
              <template v-if="searchResult.length">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USERNAME</th>
                    <th>REQUEST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="relationship in searchResult" :key="relationship.partner.id" class = "text-center">
                    <td v-text="relationship.partner.id" />
                    <td v-text="relationship.partner.username" />
                    <!-- relationship.status is a RelationshipStatusDto that also has a status -->
                    <template v-if="relationship.status === null">
                      <td><q-btn @click="sendPartnershipRequest(relationship.partner.id)" label="Request" type="submit" color="primary"/></td>
                    </template>
                    <template v-else>
                      <td v-text="relationship.status" />
                    </template>
                  </tr>
                </tbody>
              </template>
              <template v-else>
              </template>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <PartnershipsRequestsToAnswer
          :partnerList="requestsToAnswer"
          @update-relationship="reloadListsAfterAnswering"
        />
      </div>

      <div class="col-12 col-md-6">
        <PartnershipsApproved
          :currentUser="currentUser"
          :partnerList="approvedRelationships"
          @delete-relationship="reloadApprovedPartners"
        />
      </div>

      <div class="col-12 col-md-6">
        <PartnershipsRequestsToWait
          :partnerList="requestsToWait"
          @delete-relationship="reloadRequestsToWait"
        />
      </div>

      <div class="col-12 col-md-6">
        <PartnershipsRejected
          :rejectionsSent="rejectionsSent"
          :rejectionsReceived="rejectionsReceived"
          :showList="showRejectionList"
          @delete-relationship="reloadRejectedPartners"
        />
      </div>

    </div>
      <!-- remember this is how comments in HTML work! -->
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
  @include white-background;
}

.card-title-style {
  @include card-title-style;
}

</style>

