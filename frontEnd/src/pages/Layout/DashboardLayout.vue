<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon class="icon-blue">dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/cadastro-paciente">
        <md-icon class="icon-green">person_add</md-icon>
        <p>Cadastro de Paciente</p>
      </sidebar-link>
      <sidebar-link to="/cadastro-triagem">
        <md-icon class="icon-accent">assignment</md-icon>
        <p>Cadastro de Triagem</p>
      </sidebar-link>
      <sidebar-link to="/table">
        <md-icon class="icon-blue">format_list_numbered</md-icon>
        <p>Fila para Atendimento</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import MobileMenu from '@/pages/Layout/MobileMenu.vue'
import FixedPlugin from './Extra/FixedPlugin.vue'

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
    FixedPlugin,
  },
  data() {
    return {
      sidebarBackground: 'green',
      sidebarBackgroundImage: require('@/assets/img/sidebar-2.jpg'),
    }
  },
}
</script>
