<template>
  <div class="register-feedback">
    <div class="feedback-card">
      <h2>Cadastro realizado com sucesso!</h2>
      <p>O id do usuário criado é:</p>
      <div class="id-destaque">{{ id }}</div>
      <router-link to="/login">
        <md-button class="md-raised md-primary">Ir para o Login</md-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterFeedback",
  computed: {
    id() {
      return this.$route.params.id;
    }
  }
}
</script>

<style scoped>
.register-feedback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feedback-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  padding: 36px 32px 28px 32px;
  max-width: 350px;
  text-align: center;
}
.id-destaque {
  font-size: 2em;
  color: #1976d2;
  margin: 18px 0;
  font-weight: bold;
  letter-spacing: 2px;
}
</style>