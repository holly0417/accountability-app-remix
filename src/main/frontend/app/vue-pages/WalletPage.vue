<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {WalletDto} from 'components/dto/WalletDto.ts';
import TablePaymentHistory from 'components/tables/TablePaymentHistory.vue';
import { walletData } from 'src/composables/WalletData.ts';
import PurchaseForm from 'components/forms/PurchaseForm.vue';
import {DefaultPage, Page} from 'components/paging/Page.ts';
import {PurchaseDto} from 'components/dto/PurchaseDto.ts';

const { getCurrentUserWallet, getCurrentUserPurchaseHistory } = walletData();

const purchasingHistory = ref<Page<PurchaseDto>>(DefaultPage as Page<PurchaseDto>);

const parentCurrentPage = ref<number>(0);
const maxPages = ref<number>(0);
const pageSize = 5;

async function changePage(currentPage: number) {
  purchasingHistory.value = await getCurrentUserPurchaseHistory(currentPage-1, pageSize);
  parentCurrentPage.value = purchasingHistory.value.pageNumber+1;
  maxPages.value = purchasingHistory.value.totalPages;
}

const wallet = ref<WalletDto>( {
  userId: 0,
  userName: '',
  balance: 0.00
});

defineOptions({
  name: 'WalletPage'
});

onMounted(async () => {
  await updateWalletPage();
});

const updateWalletPage = async () => {
  purchasingHistory.value = await getCurrentUserPurchaseHistory(parentCurrentPage.value, pageSize);
  wallet.value = await getCurrentUserWallet();
};

</script>

<template>
    <div class="row q-pa-md q-col-gutter-md" style="height: 550px; max-height: 100%">

      <div class="col-12 col-md-6">
        <TablePaymentHistory
          @update-list="changePage"
          :purchaseHistory="purchasingHistory"
          :maxPages="maxPages"/>
      </div>
      <div class="col-12 col-md-6 q-gutter-md">
        <q-card class="outer-card-style">
          <div class="card-title-style text-center">Your balance: {{ wallet.balance.toFixed(2) }}</div>
        </q-card>
        <PurchaseForm class="col-12" @new-purchase="updateWalletPage" />
      </div>

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
}

.card-title-style {
  @include card-title-style;
}

</style>
