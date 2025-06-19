<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-header-inner">
          <md-icon class="sidebar-logo">local_hospital</md-icon>
          <span class="sidebar-title">NeoLife</span>
        </span>
      </div>
      <nav class="sidebar-menu">
        <router-link to="/dashboard" class="sidebar-link" active-class="active-link" exact>
          <span class="icon sidebar-link-icon">
            <md-icon>insights</md-icon>
          </span>
          <span class="sidebar-text">Visão Geral</span>
        </router-link>
        <router-link to="/cadastro-paciente" class="sidebar-link" active-class="active-link">
          <span class="icon sidebar-link-icon">
            <md-icon>person_add</md-icon>
          </span>
          <span class="sidebar-text">Cadastro de Paciente</span>
        </router-link>
        <router-link to="/cadastro-triagem" class="sidebar-link" active-class="active-link">
          <span class="icon sidebar-link-icon">
            <md-icon>assignment</md-icon>
          </span>
          <span class="sidebar-text">Cadastro de Triagem</span>
        </router-link>
        <router-link to="/FilaPrioridade" class="sidebar-link" active-class="active-link">
          <span class="icon sidebar-link-icon">
            <md-icon>format_list_numbered</md-icon>
          </span>
          <span class="sidebar-text">Fila de Atendimento</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="main-panel">
      <top-navbar class="top-navbar"></top-navbar>
      <notifications/>
      <router-view/>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'

export default {
  components: {
    TopNavbar,
    ContentFooter,
  },
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f7fa;
}

.sidebar {
  width: 220px;
  background: #fff;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-shadow: 2px 0 12px #0001;
  border-right: 1px solid #f0f0f0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center; /* Centraliza o conteúdo na sidebar */
  background: #fff;
  padding: 22px 20px 18px 20px;
  margin-bottom: 8px;
  min-height: 70px;
  border-bottom: 1px solid #f0f0f0;
}
.sidebar-header-inner {
  display: flex;
  align-items: center;
  gap: 4px; /* Colados, mas com leve respiro */
}
.sidebar-logo {
  font-size: 34px !important;
  color: #1976d2 !important;
}
.sidebar-title {
  font-weight: 700;
  font-size: 1.1em;
  color: #1976d2;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px; /* Menor espaço entre ícone e texto */
  padding: 11px 30px;
  border-radius: 6px;
  color: #222;
  font-size: 1em;
  font-weight: 500;
  margin: 0 8px 2px 8px;
  text-decoration: none;
  transition: background 0.14s, color 0.14s;
  cursor: pointer;
  min-height: 44px;
}
.sidebar-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}
.icon md-icon, .sidebar-link-icon md-icon {
  font-size: 22px !important;
  color: #1976d2 !important;
  vertical-align: middle;
}
.sidebar-text {
  display: flex;
  align-items: center;
  height: 22px;
  vertical-align: middle;
}

.sidebar-link:hover,
.sidebar-link.active-link {
  background: #f1f5fa;
  color: #1976d2;
}
.sidebar-link:hover .icon md-icon,
.sidebar-link.active-link .icon md-icon {
  color: #1976d2 !important;
}

.main-panel {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f7fa;
}

/* Responsivo: sidebar recolhe em telas pequenas */
@media (max-width: 900px) {
  .sidebar {
    width: 58px;
    min-width: 58px;
    padding: 0;
  }
  .sidebar-header {
    justify-content: center;
    padding: 18px 0;
  }
  .sidebar-title {
    display: none;
  }
  .sidebar-link {
    justify-content: center;
    padding: 11px 0;
  }
  .sidebar-link .sidebar-text {
    display: none;
  }
}
</style>