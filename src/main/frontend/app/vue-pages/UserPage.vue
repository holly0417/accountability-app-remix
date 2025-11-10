<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios'
import {AxiosError} from 'axios';
import {useRouter} from 'vue-router';
import {useQuasar} from 'quasar';
import {UserDto} from 'components/dto/UserDto.ts';

const user = ref<UserDto>( {
  username: '',
  id: 0,
  email: ''
});

defineOptions({
  name: 'UserPage'
});

const router = useRouter();
const $q = useQuasar();

onMounted(async () => {
  user.value = await api.get<UserDto>('/user').then(res => res.data)
});

const attemptLogOut = async () => {
  await api.post('/logout')
    .then(() => router.push('/login'))
    .catch((err: AxiosError)  => {
      if(err.response?.status === 401) {
        $q.notify( {
          message: 'Log out failed.',
          position: 'top-right',
          color: 'red',
          badgeColor: 'red'
        })
      }
    })
}

const popupMessage = ref<boolean>(false);

const resetPassword = async() => {
  await router.push('/send-password-reset-link');
}

</script>

<template>
  <div class="row">
    <div class="col-12 col-md-3">
      <q-markup-table>
        <tr>
          <td>Username:</td>
          <td>{{ user.username }}</td>
        </tr>
        <tr>
          <td>User ID:</td>
          <td>{{ user.id }}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>{{ user.email }}</td>
        </tr>
        <tr class="row">
          <td class="col-12">Password:</td>
          <td class="col-12">******</td>
          <td class="col-12">
            <q-btn
            label="Reset password?"
            type="button"
            color="primary"
            @click="popupMessage = true"
            />
          </td>
        </tr>
        <tr>
          <td>

          </td>
        </tr>
      </q-markup-table>

      <q-dialog v-model="popupMessage">
        <q-card>

          <q-card-section class="q-pt-none">
            This will send a verification link to your email to reset your password.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Send link" color="primary" @click="resetPassword"/>
            <q-btn flat label="Cancel" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-card dark bordered class="bg-grey-9 my-card">
        <q-card-section>
          <div class="text-h6">Log Out</div>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="LogOut"
            type="button"
            color="primary"
            @click="attemptLogOut"
          />
        </q-card-section>
      </q-card>

    </div>
  </div>

</template>
