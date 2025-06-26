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
        <md-list>
          <li class="md-list-item">
            <div
              class="user-avatar"
              @click="goToProfile"
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
  </md-toolbar>
</template>

<script>
export default {
  data() {
    return {
      userAvatarUrl: 'https://ui-avatars.com/api/?name=User&background=random',
    }
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
    },
    goToProfile() {
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