<template>
  <div class="feedback-center">
    <md-card class="feedback-card">
      <md-icon class="feedback-icon" md-size="30">check_circle</md-icon>
      <h2 class="feedback-title">Paciente cadastrado com sucesso!</h2>
      <div class="feedback-info">
        <span v-if="nome" class="feedback-label">
          <strong>Paciente:</strong>
          <span class="feedback-value">{{ nome }}</span>
        </span>
        <span v-if="id" class="feedback-label">
          <strong>ID:</strong>
          <span class="feedback-value">{{ id }}</span>
        </span>
      </div>
      <md-button class="md-primary feedback-btn" @click="voltarDashboard">
        Voltar para o Dashboard
      </md-button>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "FeedBackCadastro",
  computed: {
    nome() {
      return this.$route.params.nome || this.$route.query.nome || ''
    },
    id() {
      return this.$route.params.id || this.$route.query.id || ''
    }
  },
  methods: {
    voltarDashboard() {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.feedback-center {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #f4f7fa;
  padding-top: 48px;
  box-sizing: border-box;
}
.feedback-card {
  padding: 18px 30px 16px 30px;
  border-radius: 16px;
  background: #fff;
  min-width: 280px;
  max-width: 350px;
  width: 100%;
  box-shadow: 0 4px 18px rgba(33,150,243,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: unset !important;
  height: auto !important;
  flex: none !important;
  justify-content: flex-start;
  gap: 0px;
}
.feedback-icon {
  color: #43a047;
  font-size: 30px !important;
  margin-bottom: 2px;
}
.feedback-title {
  color: #1976d2;
  font-size: 1.1em;
  font-weight: 700;
  margin: 0 0 6px 0;
  text-align: center;
  line-height: 1.2;
}
.feedback-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  margin: 0 0 4px 0;
}
.feedback-label {
  color: #555;
  font-size: 1em;
  margin: 0;
  line-height: 1.25;
  display: flex;
  align-items: center;
}
.feedback-value {
  color: #222;
  font-weight: 600;
}
.feedback-btn {
  margin-top: 10px;
  min-width: 170px;
  font-size: 1em;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 0;
  background: #8e24aa;
  color: #fff;
  letter-spacing: 1px;
  transition: background 0.15s;
}
.feedback-btn:hover {
  background: #6d1b7b;
  color: #fff;
}
@media (max-width: 500px) {
  .feedback-card {
    padding: 10px 2vw;
    min-width: 0;
    width: 96vw;
  }
  .feedback-btn {
    min-width: 0;
    width: 100%;
  }
}
</style>