<template>
  <div class="container">
    <md-card v-if="paciente">
      <md-card-header>
        <div class="md-title">Detalhes do Paciente</div>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>
            <span class="label">Nome:</span>
            <span>{{ paciente.nome }}</span>
          </md-list-item>
          <md-list-item>
            <span class="label">Data de nascimento:</span>
            <span>{{ paciente.data_nascimento | formatDate }}</span>
          </md-list-item>
          <md-list-item v-if="paciente.cpf">
            <span class="label">CPF:</span>
            <span>{{ paciente.cpf }}</span>
          </md-list-item>
          <md-list-item
            v-if="
              paciente.ultima_triagem &&
              paciente.ultima_triagem.id_classificacao_risco
            "
          >
            <span class="label">Classificação Manchester:</span>
            <span
              :class="[
                'classificacao',
                classificacaoCor(
                  paciente.ultima_triagem.id_classificacao_risco
                ),
              ]"
            >
              {{
                classificacaoTexto(
                  paciente.ultima_triagem.id_classificacao_risco
                )
              }}
            </span>
          </md-list-item>
          <!-- Adicione outros campos relevantes aqui -->
        </md-list>
      </md-card-content>
      <md-card-actions>
        <md-button class="md-primary" @click="$router.push('/dashboard')"
          >Voltar</md-button
        >
      </md-card-actions>
    </md-card>
    <md-card v-else>
      <md-card-content>
        <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        <div>Carregando informações do paciente...</div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DetalhePaciente',
  data() {
    return {
      paciente: null,
    }
  },
  created() {
    this.buscarPaciente()
  },
  watch: {
    '$route.params.id': 'buscarPaciente',
  },
  methods: {
    buscarPaciente() {
      const id = this.$route.params.id
      if (!id) return
      axios
        .get(`/api/pacientes/${id}`)
        .then((res) => {
          this.paciente = res.data
        })
        .catch(() => {
          this.paciente = null
          this.$notify({
            message: 'Não foi possível carregar os dados do paciente.',
            icon: 'error',
            color: 'danger',
          })
        })
    },
    classificacaoTexto(id) {
      // Alinhado com Enum heap máximo: 5=Vermelho, 4=Laranja, 3=Amarelo, 2=Verde, 1=Azul
      switch (id) {
        case 5:
        case '5':
          return 'Vermelho'
        case 4:
        case '4':
          return 'Laranja'
        case 3:
        case '3':
          return 'Amarelo'
        case 2:
        case '2':
          return 'Verde'
        case 1:
        case '1':
          return 'Azul'
        default:
          return 'Não classificado'
      }
    },
    classificacaoCor(id) {
      switch (id) {
        case 5:
        case '5':
          return 'risk-red'
        case 4:
        case '4':
          return 'risk-orange'
        case 3:
        case '3':
          return 'risk-yellow'
        case 2:
        case '2':
          return 'risk-green'
        case 1:
        case '1':
          return 'risk-blue'
        default:
          return ''
      }
    },
  },
  filters: {
    formatDate(value) {
      if (!value) return ''
      // Exemplo: 1990-05-10 → 10/05/1990
      return value.split('-').reverse().join('/')
    },
  },
}
</script>

<style scoped>
.label {
  min-width: 170px;
  font-weight: bold;
  color: #666;
  display: inline-block;
}
.classificacao {
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 12px;
  color: #fff;
  margin-left: 8px;
}
.risk-red {
  background: #e53935;
}
.risk-orange {
  background: #ffa726;
  color: #222;
}
.risk-yellow {
  background: #fbc02d;
  color: #222;
}
.risk-green {
  background: #43a047;
}
.risk-blue {
  background: #1e88e5;
}
.container {
  max-width: 550px;
  margin: 40px auto;
}
</style>
