<script setup lang="ts">
import { ref } from 'vue';
import { PurchaseDto } from 'components/dto/PurchaseDto.ts';
import { QForm } from 'quasar';
import { walletData } from 'src/composables/WalletData.ts';

const { makePurchase } = walletData();

defineOptions({
  name: 'PurchaseForm'
});

const formData = ref<PurchaseDto>({
  id: 0,
  price: 0.00,
  description: '',
  purchaseTimeString: ''
});

const formRef = ref<QForm>();

const makeNewPurchase = async () => {
  await makePurchase(formData.value);
  await resetForm();
  emit('newPurchase');
};

const resetForm = async () => {
  formData.value.price = 0;
  formData.value.description = '';
}

const emit = defineEmits(['newPurchase'])

</script>

<template>
    <q-card class="outer-card-style">

      <q-card-section>
        <div class="text-h6">Make a purchase</div>
        <div class="text-subtitle2">Describe what you want to buy <br> and add a price</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form ref="formRef" @submit="makeNewPurchase">

              <q-input
                v-model="formData.description"
                label="What do you want to buy?"
                filled
                style="width: 100%;"
                type="textarea"
                bg-color="white"
                name="itemDescription"
              />

              <q-input
                v-model="formData.price"
                label="How much is it?"
                filled
                type="number"
                bg-color="white"
                name="itemPrice"
                style="width:100%; padding-top: 10px;"
              />

            <div class="row justify-center" style="padding-top: 10px;">
              <q-btn label="Submit"
                     type="submit"
                     color="primary"
                     class="glossy"/>
            </div>

        </q-form>
      </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.outer-card-style {
  @include outer-card-style;
}

</style>
