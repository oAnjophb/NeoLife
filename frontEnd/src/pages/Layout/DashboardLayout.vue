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
        <router-link
          v-for="item in filteredMenuItems"
          :key="item.key"
          :to="item.to"
          class="sidebar-link"
          active-class="active-link"
          exact
        >
          <span class="icon sidebar-link-icon">
            <md-icon>{{ item.icon }}</md-icon>
          </span>
          <span class="sidebar-text">{{ item.text }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="main-panel">
      <top-navbar class="top-navbar"></top-navbar>
      <notifications />
      <router-view />
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'

// Defina os menus disponíveis
const menuItems = [
  {
    key: 'dashboard',
    to: '/dashboard',
    icon: 'insights',
    text: 'Visão Geral',
  },
  {
    key: 'cadastro-paciente',
    to: '/cadastro-paciente',
    icon: 'person_add',
    text: 'Cadastro de Paciente',
  },
  {
    key: 'pesquisa-paciente',
    to: '/pesquisa-paciente',
    icon: 'search',
    text: 'Pesquisar Paciente',
  },
  {
    key: 'cadastro-triagem',
    to: '/cadastro-triagem',
    icon: 'assignment',
    text: 'Cadastro de Triagem',
  },
  {
    key: 'fila-prioridade',
    to: '/FilaPrioridade', // <- Caminho certo!
    icon: 'format_list_numbered',
    text: 'Fila de Prioridade',
  },
  {
    key: 'fila-triagem',
    to: '/triagem/fila',
    icon: 'format_list_numbered',
    text: 'Fila de Triagem',
  },
]

// Permissões por tipo de usuário
const permissoes = {
  admin: [
    'dashboard',
    'cadastro-paciente',
    'pesquisa-paciente',
    'cadastro-triagem',
    'fila-triagem',
    'fila-prioridade',
  ],
  medico: ['dashboard', 'fila-prioridade'], // Médico só vê Fila de Prioridade!
  recepcionista: ['dashboard', 'cadastro-paciente', 'pesquisa-paciente'],
  enfermeiro: ['dashboard', 'cadastro-triagem', 'fila-triagem'],
}

export default {
  components: {
    TopNavbar,
    ContentFooter,
  },
  computed: {
    userType() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        // Para teste rápido, descomente a linha abaixo:
        // return "admin";
        return usuario?.tipo || 'recepcionista'
      } catch {
        return 'recepcionista'
      }
    },
    filteredMenuItems() {
      const tipo = this.userType
      const permissoesTipo = permissoes[tipo] || ['dashboard']
      return menuItems.filter((item) => permissoesTipo.includes(item.key))
    },
  },
}
</script>

<style scoped>
/* ... seu CSS igual ao anterior ... */
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
  justify-content: center;
  background: #fff;
  padding: 22px 20px 18px 20px;
  margin-bottom: 8px;
  min-height: 70px;
  border-bottom: 1px solid #f0f0f0;
}
.sidebar-header-inner {
  display: flex;
  align-items: center;
  gap: 4px;
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
  gap: 8px;
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
.icon md-icon,
.sidebar-link-icon md-icon {
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
