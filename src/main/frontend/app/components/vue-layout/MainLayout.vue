

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { userData } from 'src/composables/UserData.ts';
const { getCurrentUserInfo } = userData();

export default defineComponent({
  name: 'MainLayout',

  components: {
  },
  methods: {
    async attemptLogOut() {
      try {
        await api.post('/logout')
        this.$router.push('/login')
      } catch (err) {
        if (err.response?.status === 401) {
          this.$q.notify({
            message: 'Log out failed.',
            position: 'top-right',
            color: 'red',
            badgeColor: 'red'
          })
        }
      }
    }

  },

  setup() {
    const leftDrawerOpen = ref(false)
    const quasar = useQuasar()
    const router = useRouter()

    const currentUser = ref({
      id: 0,
      username: ''
    });

    async function getCurrentUserName(){
      currentUser.value = await getCurrentUserInfo();
    }

    getCurrentUserName();

    return {
      quasar,
      router,
      leftDrawerOpen,
      currentUser,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          {{ currentUser.username }}'s accountability app
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">

          <q-btn round dense flat color="white" icon="fab fa-github" type="a"
                 href="https://github.com/pratik227/quasar-admin" target="_blank">
          </q-btn>

          <q-btn round dense flat style="color:red !important;" type="a" href="https://github.com/sponsors/pratik227"
                 target="_blank">
            <i class="fa fa-heart fa-2x fa-beat"></i>
          </q-btn>


          <q-btn round flat @click="router.push('/user')">
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="boy avatar">
            </q-avatar>
          </q-btn>

          <q-btn round flat @click="attemptLogOut" type="button"
                 color="indigo-1" label="LogOut"/>

        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

      <q-expansion-item
          icon="punch_clock"
          label="Tasks"
        >
      <q-list class="q-pl-lg">
        <q-item to="/tasks" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="checklist"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Your tasks</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/partner-tasks" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="gavel"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Approve / reject tasks</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
      </q-expansion-item>

        <q-expansion-item
          icon="account_balance_wallet"
          label="Balance & purchases"
        >
          <q-list class="q-pl-lg">
            <q-item to="/wallet" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="shopping_cart"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Purchases</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>


        <q-expansion-item
          icon="account_box"
          label="Your info"
        >
          <q-list class="q-pl-lg">

            <q-item to="/user" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="person_outline"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>User info</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/relationships" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="person_search"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Find a friend</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-expansion-item>


      </q-list>
    </q-drawer>




    <q-page-container class="bg-grey-2">
      <router-view/>
    </q-page-container>

  </q-layout>
</template>



<style>

/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.25);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
  55% {
    transform: scale(1.25);
  }
  70% {
    transform: scale(1);
  }
}

</style>
