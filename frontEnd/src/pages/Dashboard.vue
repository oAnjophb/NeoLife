<template>
  <div class="dashboard-home">
    <!-- Gráficos -->
    <div class="dashboard-row">
      <md-card class="dashboard-graph">
        <div class="card-title">Triagens por Classificação de Risco (Hoje)</div>
        <canvas id="graficoRiscos"></canvas>
      </md-card>
      <md-card class="dashboard-graph">
        <div class="card-title">Triagens por Dia (Últimos 7 dias)</div>
        <canvas id="graficoTriagens"></canvas>
      </md-card>
    </div>

    <!-- Listas -->
    <div class="dashboard-row">
      <md-card class="dashboard-list">
        <div class="card-title card-title-list">Próximas Consultas</div>
        <md-list>
          <md-list-item v-for="consulta in proximasConsultas" :key="consulta.id">
            <md-avatar class="list-avatar" md-theme="default">
              <md-icon>person</md-icon>
            </md-avatar>
            <div class="list-content">
              <span class="list-title">{{ consulta.nome_paciente }}</span>
              <span class="list-date">{{ consulta.data_hora }}</span>
            </div>
            <md-chip class="chip-status" md-color="primary">Marcada</md-chip>
          </md-list-item>
          <md-list-item v-if="proximasConsultas.length === 0">
            <span>Nenhuma consulta agendada.</span>
          </md-list-item>
        </md-list>
      </md-card>
      <md-card class="dashboard-list">
        <div class="card-title card-title-list">Pacientes em Situação Crítica</div>
        <md-list>
          <md-list-item v-for="pac in pacientesCriticos" :key="pac.id">
            <md-avatar class="list-avatar" md-theme="default" :style="{background: getCorRisco(pac.classificacao)}">
              <md-icon>priority_high</md-icon>
            </md-avatar>
            <div class="list-content">
              <span class="list-title">{{ pac.nome }}</span>
              <span class="list-date" :style="{color: getCorRisco(pac.classificacao)}">{{ pac.classificacao }}</span>
            </div>
            <md-chip class="chip-status" :style="{background: getCorRisco(pac.classificacao), color: '#fff'}">Crítico</md-chip>
          </md-list-item>
          <md-list-item v-if="pacientesCriticos.length === 0">
            <span>Nenhum paciente crítico no momento.</span>
          </md-list-item>
        </md-list>
      </md-card>
    </div>

    <!-- Atalhos -->
    <div class="dashboard-actions">
      <md-button class="md-primary" @click="goTo('/cadastro-paciente')">Cadastrar Paciente</md-button>
      <md-button class="md-primary" @click="goTo('/cadastro-triagem')">Nova Triagem</md-button>
      <md-button class="md-primary" @click="goTo('/FilaPrioridade')">Novo Atendimento</md-button>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'DashboardHome',
  data() {
    return {
      proximasConsultas: [
        { id: 1, nome_paciente: "João Silva", data_hora: "2025-06-20 08:00" },
        { id: 2, nome_paciente: "Maria Souza", data_hora: "2025-06-20 09:20" }
      ],
      pacientesCriticos: [
        { id: 1, nome: "Carlos Oliveira", classificacao: "Vermelho" }
      ],
      graficosIniciados: false
    }
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
    },
    desenharGraficoRiscos() {
      const ctx = document.getElementById('graficoRiscos').getContext('2d')
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Vermelho', 'Laranja', 'Amarelo', 'Verde', 'Azul'],
          datasets: [{
            data: [2, 3, 7, 12, 4],
            backgroundColor: ['#e53935', '#ffa726', '#fbc02d', '#43a047', '#1e88e5']
          }]
        },
        options: {
          plugins: { legend: { position: 'bottom' } }
        }
      })
    },
    desenharGraficoTriagens() {
      const ctx = document.getElementById('graficoTriagens').getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['13/06', '14/06', '15/06', '16/06', '17/06', '18/06', '19/06'],
          datasets: [{
            label: 'Triagens',
            data: [10, 12, 8, 15, 11, 14, 28],
            backgroundColor: '#2196f3'
          }]
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      })
    },
    getCorRisco(nome) {
      const cores = {
        'Vermelho': '#e53935',
        'Laranja': '#ffa726',
        'Amarelo': '#fbc02d',
        'Verde': '#43a047',
        'Azul': '#1e88e5'
      }
      return cores[nome] || '#888'
    }
  },
  mounted() {
    if (!this.graficosIniciados) {
      this.$nextTick(() => {
        this.desenharGraficoRiscos()
        this.desenharGraficoTriagens()
        this.graficosIniciados = true
      })
    }
  }
}
</script>

<style scoped>
.dashboard-home {
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
  padding: 32px 24px 48px 24px;
  min-height: 100vh;
  background: #f4f7fa;
  box-sizing: border-box;
}
.dashboard-row {
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
}
.dashboard-graph {
  flex: 1 1 0;
  min-width: 240px;
  min-height: 220px;
  padding: 18px 14px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #0000000a;
}
.card-title {
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 20px;
  color: #1976d2;
  padding: 0 14px 0 14px;
  word-break: break-word;
  box-sizing: border-box;
}
.card-title-list {
  /* Garante que o título das listas nunca fique pra fora */
  padding-top: 14px;
  padding-bottom: 10px;
  padding-left: 18px;
  padding-right: 18px;
  margin-bottom: 0px;
  font-size: 1.08em;
}
.dashboard-list {
  flex: 1 1 0;
  min-width: 200px;
  min-height: 120px;
  padding: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #00000010;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.md-list {
  padding: 0 10px 10px 10px;
}
.md-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f2f4f7;
  min-height: 44px;
}
.md-list-item:last-child {
  border-bottom: none;
}
.list-avatar {
  margin-right: 8px;
  min-width: 30px;
  min-height: 30px;
  width: 30px;
  height: 30px;
  font-size: 1.15em;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-content {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.list-title {
  font-weight: 500;
  font-size: 0.95em;
}
.list-date {
  font-size: 0.86em;
  color: #888;
}
.chip-status {
  font-size: 0.76em;
  font-weight: 500;
  border-radius: 10px;
  padding: 2px 8px;
  background: #e3f2fd;
  margin-left: 8px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dashboard-actions {
  margin-top: 22px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
@media (max-width: 1200px) {
  .dashboard-home {
    max-width: 99vw;
    padding: 20px 8px 32px 8px;
  }
}
@media (max-width: 900px) {
  .dashboard-row {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-start;
  }
  .dashboard-graph, .dashboard-list {
    min-width: 320px;
    max-width: 100vw;
  }
}
@media (max-width: 600px) {
  .dashboard-row {
    flex-direction: column;
    gap: 10px;
  }
  .dashboard-graph, .dashboard-list {
    min-width: 90vw;
    max-width: 98vw;
    height: auto;
    padding: 8px 8px;
  }
  .dashboard-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}
</style>