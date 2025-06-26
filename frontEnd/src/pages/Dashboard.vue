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
          <md-list-item
            v-for="consulta in proximasConsultas"
            :key="consulta.id"
          >
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
        <div class="card-title card-title-list">
          Pacientes em Situação Crítica
        </div>
        <md-list>
          <md-list-item v-for="pac in pacientesCriticos" :key="pac.id">
            <md-avatar
              class="list-avatar"
              md-theme="default"
              :style="{ background: getCorRisco(pac.classificacao) }"
            >
              <md-icon>priority_high</md-icon>
            </md-avatar>
            <div class="list-content">
              <span class="list-title">{{ pac.nome }}</span>
              <span
                class="list-date"
                :style="{ color: getCorRisco(pac.classificacao) }"
                >{{ pac.classificacao }}</span
              >
            </div>
            <md-chip
              class="chip-status"
              :style="{
                background: getCorRisco(pac.classificacao),
                color: '#fff',
              }"
              >Crítico</md-chip
            >
          </md-list-item>
          <md-list-item v-if="pacientesCriticos.length === 0">
            <span>Nenhum paciente crítico no momento.</span>
          </md-list-item>
        </md-list>
      </md-card>
    </div>

    <!-- Atalhos -->
    <div class="dashboard-actions">
      <md-button class="md-primary" @click="goTo('/cadastro-paciente')"
        >Cadastrar Paciente</md-button
      >
      <md-button class="md-primary" @click="goTo('/cadastro-triagem')"
        >Nova Triagem</md-button
      >
      <md-button class="md-primary" @click="goTo('/FilaPrioridade')"
        >Novo Atendimento</md-button
      >
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import axios from 'axios'

export default {
  name: 'DashboardHome',
  data() {
    return {
      proximasConsultas: [],
      pacientesCriticos: [],
      triagensPorRisco: {},
      triagensPorDia: [],
      graficosIniciados: false,
    }
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
    },
    async carregarTriagensPorRisco() {
      const { data } = await axios.get('/api/dashboard/triagens-por-risco')
      this.triagensPorRisco = data
      this.$nextTick(() => this.desenharGraficoRiscos())
    },
    async carregarTriagensPorDia() {
      const { data } = await axios.get('/api/dashboard/triagens-por-dia')
      this.triagensPorDia = data
      this.$nextTick(() => this.desenharGraficoTriagens())
    },
    async carregarProximasConsultas() {
      const { data } = await axios.get('/api/dashboard/proximas-consultas')
      this.proximasConsultas = data
    },
    async carregarPacientesCriticos() {
      const { data } = await axios.get('/api/dashboard/pacientes-criticos')
      this.pacientesCriticos = data
    },
    desenharGraficoRiscos() {
      const ctx = document.getElementById('graficoRiscos').getContext('2d')
      if (this._graficoRiscos) this._graficoRiscos.destroy()
      const cores = {
        'emergencia': '#e53935', // vermelho
        'muito urgente': '#ffa726', // laranja
        'urgente': '#fbc02d', // amarelo
        'pouco urgente': '#43a047', // verde
        'nao urgente': '#1e88e5', // azul
      }
      const normaliza = (s) =>
        s
          ? s
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // remove acentos
              .replace('ê', 'e') // caso especial
              .trim()
              .toLowerCase()
          : ''

      const labels = Object.keys(this.triagensPorRisco)
      const data = Object.values(this.triagensPorRisco)

      this._graficoRiscos = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: labels.map((l) => {
                const key = normaliza(l)
                return cores[key] || '#888'
              }),
            },
          ],
        },
        options: {
          plugins: { legend: { position: 'bottom' } },
        },
      })
    },
    desenharGraficoTriagens() {
      const ctx = document.getElementById('graficoTriagens').getContext('2d')
      if (this._graficoTriagens) this._graficoTriagens.destroy()
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

      // 1. Descobrir o domingo da semana atual (pode ser hoje)
      const hoje = new Date()
      // UTC para não errar fuso
      const hojeUTC = new Date(
        Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate())
      )
      const diaDaSemana = hojeUTC.getUTCDay() // 0 = domingo, 6 = sabado
      // Domingo da semana corrente (sempre no UTC!)
      const domingo = new Date(hojeUTC)
      domingo.setUTCDate(domingo.getUTCDate() - diaDaSemana)

      // 2. Montar array de datas de domingo a sábado desta semana
      const semanaDatas = []
      for (let i = 0; i < 7; i++) {
        const data = new Date(domingo)
        data.setUTCDate(domingo.getUTCDate() + i)
        semanaDatas.push(data)
      }

      // 3. Criar dicionário para lookup rápido das datas disponíveis
      // Assume que d.data é 'YYYY-MM-DD' ou ISO (pega só a data)
      const triagensPorData = {}
      this.triagensPorDia.forEach((d) => {
        const diaStr = d.data.slice(0, 10)
        triagensPorData[diaStr] = Math.trunc(d.total)
      })

      // 4. Montar os labels e os dados do gráfico
      const labels = semanaDatas.map((data) => {
        const diaSemana = diasSemana[data.getUTCDay()]
        const dia = String(data.getUTCDate()).padStart(2, '0')
        return `${diaSemana} (${dia})`
      })
      const data = semanaDatas.map((data) => {
        const str = data.toISOString().slice(0, 10)
        return triagensPorData[str] || 0
      })

      // 5. Gerar gráfico
      this._graficoTriagens = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Triagens',
              data,
              backgroundColor: '#2196f3',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 70,
              ticks: {
                stepSize: 10,
                callback: function (value) {
                  return Number.isInteger(value) ? value : null
                },
              },
            },
          },
          plugins: { legend: { display: false } },
        },
      })
    },
    getCorRisco(nome) {
      const cores = {
        'emergencia': '#e53935',
        'muito urgente': '#ffa726',
        'urgente': '#fbc02d',
        'pouco urgente': '#43a047',
        'nao urgente': '#1e88e5',
      }
      const normaliza = (s) =>
        s
          ? s
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace('ê', 'e')
              .trim()
              .toLowerCase()
          : ''
      return cores[normaliza(nome)] || '#888'
    },
  },
  async mounted() {
    await Promise.all([
      this.carregarProximasConsultas(),
      this.carregarPacientesCriticos(),
      this.carregarTriagensPorRisco(),
      this.carregarTriagensPorDia(),
    ])
    this.graficosIniciados = true
  },
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
  .dashboard-graph,
  .dashboard-list {
    min-width: 320px;
    max-width: 100vw;
  }
}
@media (max-width: 600px) {
  .dashboard-row {
    flex-direction: column;
    gap: 10px;
  }
  .dashboard-graph,
  .dashboard-list {
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
