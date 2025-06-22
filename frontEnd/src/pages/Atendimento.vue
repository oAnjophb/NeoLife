<template>
  <div class="pagina-centralizada">
    <md-card>
      <md-card-header>
        <md-icon style="font-size: 32px; color: #2196f3">person</md-icon>
        <h4 class="title">Atendimento</h4>
      </md-card-header>
      <md-card-content v-if="paciente">
        <div class="info-paciente">
          <p><strong>Nome:</strong> {{ paciente.nome }}</p>
          <p><strong>Prioridade:</strong>
            <span :class="`badge badge-${paciente.prioridade}`">{{ prioridadeLabel(paciente.prioridade) }}</span>
          </p>
          <p><strong>Hora da Triagem:</strong> {{ paciente.horaTriagem }}</p>
          <p v-if="paciente.sintomas"><strong>Sintomas:</strong> {{ paciente.sintomas }}</p>
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
    // Exemplo de fetch real (ajuste a URL para seu backend)
    fetch(`/api/triagem/${id}`)
      .then(res => res.json())
      .then(data => {
        // Supondo que a API retorna algo como:
        // { nome, prioridade, horaTriagem, sintomas }
        this.paciente = {
          nome: data.nome,
          prioridade: data.prioridade,
          horaTriagem: data.horaTriagem,
          sintomas: data.sintomas,
        }
      })
      .catch(() => {
        this.paciente = null;
      });
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
/* Seu CSS permanece igual */
.pagina-centralizada { /* ... */ }
/* ... resto do CSS ... */
</style>