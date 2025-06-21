<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-autocomplete">
            <md-autocomplete
              class="search"
              v-model="selectedEmployee"
              :md-options="employees"
            >
              <label>Search...</label>
            </md-autocomplete>
          </div>
          <md-list>
            <md-list-item href="#/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>
            <!-- Avatar do usuário -->
            <li class="md-list-item">
              <div
                class="user-avatar"
                @click="goToPerfil"
                title="Meu Perfil"
                style="cursor: pointer; display: flex; align-items: center"
              >
                <img
                  :src="userAvatarUrl"
                  alt="Avatar"
                  class="avatar-img"
                  width="32"
                  height="32"
                />
                <span class="hidden-lg hidden-md">Perfil</span>
              </div>
            </li>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
export default {
  data() {
    return {
      selectedEmployee: null,
      employees: [
        'Jim Halpert',
        'Dwight Schrute',
        'Michael Scott',
        'Pam Beesly',
        'Angela Martin',
        'Kelly Kapoor',
        'Ryan Howard',
        'Kevin Malone',
      ],
      // Avatar padrão online
      userAvatarUrl: 'https://ui-avatars.com/api/?name=User&background=random',
    }
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
    },
    goToPerfil() {
      // Evita navegação duplicada para /perfil
      if (this.$route.path !== '/perfil') {
        this.$router.push('/perfil')
      }
    },
  },
}
</script>

<style scoped>
.avatar-img {
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
  margin-right: 8px;
}
.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
