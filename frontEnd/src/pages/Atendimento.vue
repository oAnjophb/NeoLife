<template>
  <div class="pagina-centralizada">
    <md-card>
      <md-card-header>
        <md-icon style="font-size: 32px; color: #2196f3">person</md-icon>
        <h4 class="title">Atendimento</h4>
      </md-card-header>
      <md-card-content v-if="paciente">
        <div class="info-paciente">
          <p><strong>Nome:</strong> {{ paciente.paciente }}</p>
          <p><strong>Prioridade:</strong>
            <span :class="`badge badge-${paciente.prioridade}`">{{ prioridadeLabel(paciente.prioridade) }}</span>
          </p>
          <p><strong>Hora da Triagem:</strong> {{ paciente.horaTriagem }}</p>
          <p><strong>Sintomas:</strong> {{ paciente.sintomas }}</p>
        </div>
        <div class="actions-row">
          <md-button class="md-accent" @click="encerrarAtendimento">
            <md-icon>done</md-icon>
            Encerrar Atendimento
          </md-button>
        </div>
      </md-card-content>
      <md-card-content v-else>
        <p>Carregando informações do paciente...</p>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "Atendimento",
  data() {
    return {
      paciente: null,
    };
  },
  mounted() {
    const id = this.$route.params.id;
    console.log('ID recebido na rota:', id);
    // Aqui você faz o fetch da API pra pegar a ficha do paciente
    // MOCK:
    this.paciente = {
      paciente: "João da Silva",
      prioridade: "vermelho",
      horaTriagem: "09:12",
      sintomas: "Dor no peito, dispneia",
    };
  },
  methods: {
    prioridadeLabel(prio) {
      return {vermelho: 'Vermelho', laranja: 'Laranja', amarelo: 'Amarelo', verde: 'Verde', azul: 'Azul'}[prio] || prio
    },
    encerrarAtendimento() {
      this.$router.push('/FilaPrioridade')
    },
  },
};
</script>

<style>
.pagina-centralizada {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #fafbfd;
  padding: 32px 0 32px 0;
  width: 100%;
  box-sizing: border-box;
}

.md-card {
  width: 100%;
  max-width: 1200px;
  min-height: 80vh;
  margin: 0 24px;
  padding: 40px 28px 32px 28px;
  box-sizing: border-box;
  border-radius: 18px;
  box-shadow: 0 6px 24px 2px #00000012;
  background: #fff;
}

.title {
  margin: 0 0 4px 0;
  font-size: 1.6em;
  font-weight: 600;
  color: #333;
  display: inline-block;
  margin-left: 10px;
}

.badge { padding: 4px 10px; border-radius: 9px; font-weight: 600; }
.badge-vermelho { background: #e53935; color: #fff; }
.badge-laranja { background: #ffa726; color: #fff; }
.badge-amarelo { background: #fbc02d; color: #fff; }
.badge-verde { background: #43a047; color: #fff; }
.badge-azul { background: #1e88e5; color: #fff; }

.actions-row {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}
.info-paciente p {
  margin: 0 0 12px 0;
  font-size: 1.1em;
}

@media (max-width: 1300px) {
  .md-card {
    max-width: 98vw;
    margin: 0 8px;
    padding: 20px 2vw 16px 2vw;
  }
}
@media (max-width: 600px) {
  .pagina-centralizada {
    padding: 0;
  }
  .md-card {
    max-width: 100vw;
    min-height: 90vh;
    border-radius: 0;
    padding: 6vw 2vw 2vw 2vw;
    box-shadow: none;
  }
}
</style>