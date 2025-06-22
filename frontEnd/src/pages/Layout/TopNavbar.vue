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
              v-model="selectedCpf"
              :md-options="pacientes"
              :md-item-text="(patient) => patient.nome"
              :md-item-value="(patient) => patient.cpf"
              @md-changed="onSearch"
              @md-selected="onSelect"
              clearable
            >
              <label>Buscar paciente por nome ou CPF...</label>
              <template v-slot:md-item="{ item }">
                <div style="display: flex; flex-direction: column">
                  <span style="font-weight: bold">{{ item.nome }}</span>
                  <span style="font-size: 12px; color: #888"
                    >CPF: {{ item.cpf }}</span
                  >
                </div>
              </template>
            </md-autocomplete>
          </div>
          <md-list>
            <md-list-item :href="'#/dashboard'">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>
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
    </div>
  </md-toolbar>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      selectedCpf: '',
      pacientes: [],
      searchTimer: null,
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
    onSearch(term) {
      const value = typeof term === 'string' ? term : this.selectedCpf
      clearTimeout(this.searchTimer)
      if (!value || value.replace(/\D/g, '').length < 3) {
        this.pacientes = []
        return
      }
      this.searchTimer = setTimeout(() => {
        axios
          .get(`/api/pacientes?search=${encodeURIComponent(value)}`)
          .then((res) => {
            console.log('Pacientes retornados:', res.data)
            this.pacientes = res.data || []
          })
          .catch(() => {
            this.pacientes = []
          })
      }, 350)
    },
    onSelect(cpf) {
      const patient = this.pacientes.find((p) => String(p.cpf) === String(cpf))
      if (patient && (patient.id_paciente || patient.id)) {
        this.selectedCpf = ''
        this.pacientes = []
        // Garante que navega para /paciente/:id dentro do DashboardLayout
        this.$router.push({
          name: 'DetalhePaciente',
          params: {
            id: patient.id_paciente || patient.id,
          },
        })
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
