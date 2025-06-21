<template>
  <ul class="nav nav-mobile-menu">
    <li>
      <md-field>
        <label>Search</label>
        <md-input v-model="search" type="text"></md-input>
      </md-field>
    </li>
    <li>
      <a @click.prevent="goToDashboard" class="dropdown-toggle">
        <i class="material-icons">dashboard</i>
        <p>Dashboard</p>
      </a>
    </li>
    <li>
      <drop-down>
        <a slot="title" class="dropdown-toggle">
          <i class="material-icons">notifications</i>
          <span class="notification">5</span>
          <p>Notifications</p>
        </a>
        <ul class="dropdown-menu dropdown-menu-right">
          <li><a href="#">Mike John responded to your email</a></li>
          <li><a href="#">You have 5 new tasks</a></li>
          <li><a href="#">You're now friend with Andrew</a></li>
          <li><a href="#">Another Notification</a></li>
          <li><a href="#">Another One</a></li>
        </ul>
      </drop-down>
    </li>
    <li>
      <a @click.prevent="goToPerfil" class="dropdown-toggle">
        <i class="material-icons">person</i>
        <p>Perfil</p>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      search: null,
    };
  },
  methods: {
    goToDashboard() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
    goToPerfil() {
      if (this.$route.path !== "/perfil") {
        this.$router.push("/perfil");
      }
    },
  },
};
</script>

<style scoped>
.nav-mobile-menu {
  padding: 0;
  margin: 0;
  list-style: none;
}
.nav-mobile-menu li {
  margin: 8px 0;
}
.material-icons {
  vertical-align: middle;
  margin-right: 4px;
}
.notification {
  background: #e74c3c;
  color: #fff;
  border-radius: 10px;
  font-size: 11px;
  padding: 2px 7px;
  margin-left: 4px;
  vertical-align: middle;
}
</style>