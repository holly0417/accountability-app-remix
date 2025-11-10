<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { QForm } from 'quasar';
import { email } from 'src/composables/EmailComposable.ts';
import {GenericResponseDto} from 'components/dto/GenericResponseDto.ts';

defineOptions({
  name: 'SendEmailPasswordTokenPage'
});

const { sendEmailResetPassword } = email();

const confirm = ref<boolean>(false);
const formData = ({email: ''});

const confirmation = ref<GenericResponseDto>({
  message: '',
  error: ''
});

onMounted(async () => {
  confirmation.value.message = 'no attempt at sending email yet';
});

const sendToken = async () => {
  confirmation.value = await sendEmailResetPassword(formData.email);
  formData.email = '';
};

</script>

<template>
  <q-layout>
      <q-page-container>

        <q-card class="outer-card-style">

          <q-card-section>
            <div class="text-h6">Send password link</div>
            <div class="text-subtitle2">Enter your email to receive a link to reset your password</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="sendToken">

              <q-input
                v-model="formData.email"
                label="Enter your email"
                filled
                style="width: 50%;"
                type="textarea"
                bg-color="white"
                name="itemDescription"
              />

              <div class="row justify-center" style="padding-top: 10px;">
                <q-btn label="Submit"
                       type="submit"
                       color="primary"
                       class="glossy"
                       @click="confirm = true"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <q-dialog v-model="confirm">
          <q-card>

            <q-card-section class="q-pt-none">
                <div>{{ confirmation.message }}</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>


      </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.outer-card-style {
  @include outer-card-style;
}

</style>
