<script setup lang="ts">
import { PurchaseDto } from 'components/dto/PurchaseDto.ts';
import {QMarkupTable} from 'quasar';
import { Page} from 'components/paging/Page.ts';
import { onMounted, ref} from 'vue';

defineOptions({
  name: 'TablePaymentHistory',
});

onMounted(async () => {
  await changePage();
});

const props = defineProps<{
  maxPages: number,
  purchaseHistory: Page<PurchaseDto>
}>()

const emit = defineEmits(['updateList'])

const currentPage = ref<number>(0);

async function changePage() {
  emit('updateList', currentPage.value);
}

</script>

<template>
  <q-card class="outer-card-style">

    <q-card-section>
      <div class="card-title-style">Purchase history</div>
    </q-card-section>

    <q-card-section class="inner-card-section expanded-items-size">
      <q-markup-table dense class="text-center" title="PURCHASED ITEMS">
        <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Time</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in props.purchaseHistory.content" :key="item.id">
            <td v-text="item.description" />
            <td v-text="item.price" />
            <td v-text="item.purchaseTimeString" />
        </tr>
        </tbody>
        <q-pagination
          v-model="currentPage"
          :max="props.maxPages"
          @click="changePage()"
        />
      </q-markup-table>
    </q-card-section>

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
