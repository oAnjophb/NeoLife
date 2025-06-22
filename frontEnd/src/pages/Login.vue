<template>
  <div class="login-container">
    <form class="login-card" @submit.prevent="doLogin">
      <h2>Login</h2>

      <md-field>
        <label>Tipo de usuário</label>
        <md-select v-model="tipo" required>
          <md-option value="medico">Médico</md-option>
          <md-option value="enfermeiro">Enfermeiro</md-option>
          <md-option value="recepcionista">Recepcionista</md-option>
        </md-select>
      </md-field>

      <md-field>
        <label>ID</label>
        <md-input
          v-model="id"
          required
          type="number"
          min="1"
          autocomplete="username"
          placeholder="Somente números"
        ></md-input>
      </md-field>

      <md-field>
        <label>Senha</label>
        <md-input
          v-model="senha"
          required
          type="password"
          minlength="6"
          maxlength="20"
          autocomplete="current-password"
        ></md-input>
      </md-field>

      <md-button class="md-raised md-primary" type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </md-button>

      <p v-if="erro" class="erro-msg">{{ erro }}</p>
    </form>

    <!-- Botão super minimalista e discreto -->
    <button
      class="admin-link"
      @click.prevent="irParaLoginAdmin"
      type="button"
      aria-label="Entrar como admin"
    >
      Entrar como admin
    </button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      tipo: "",
      id: "",
      senha: "",
      loading: false,
      erro: ""
    };
  },
  methods: {
    async doLogin() {
      this.erro = "";
      this.loading = true;

      // Validação de campos
      if (!this.tipo) {
        this.erro = "Selecione o tipo de usuário.";
        this.loading = false;
        return;
      }
      if (!this.id || isNaN(this.id) || Number(this.id) < 1) {
        this.erro = "Informe um ID válido (apenas números).";
        this.loading = false;
        return;
      }
      if (!this.senha || this.senha.length < 6 || this.senha.length > 20) {
        this.erro = "A senha deve ter entre 6 e 20 caracteres.";
        this.loading = false;
        return;
      }

      // Integração real com o backend
      try {
        const resp = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: this.tipo,
            id: this.id,
            senha: this.senha
          })
        });
        if (!resp.ok) {
          const errData = await resp.json();
          this.erro = errData.erro || "ID ou senha inválidos.";
          this.loading = false;
          return;
        }
        const user = await resp.json();

        // Salva no localStorage para uso global no app (todos os dados do usuário)
        localStorage.setItem("usuario", JSON.stringify(user));

        // Salva o token separadamente para uso em requisições autenticadas
        if (user.token) {
          localStorage.setItem("token", user.token);
        } else {
          this.erro = "Falha ao obter token de autenticação.";
          this.loading = false;
          return;
        }

        this.$router.push("/dashboard");
      } catch (e) {
        this.erro = "Erro de conexão com o servidor.";
      }
      this.loading = false;
    },
    irParaLoginAdmin() {
      // Redireciona para a página de login do admin
      this.$router.push("/admin-login");
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f5f8;
  position: relative;
}
.login-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  padding: 36px 32px 28px 32px;
  width: 100%;
  max-width: 350px;
  text-align: center;
}
.md-field {
  width: 100%;
  margin-bottom: 16px;
}
.erro-msg {
  color: #e74c3c;
  margin-top: 14px;
  font-size: 1em;
}
.admin-link {
  position: fixed;
  bottom: 18px;
  right: 18px;
  background: none;
  border: none;
  color: #888;
  font-size: 0.97em;
  text-decoration: underline;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.18s;
  z-index: 20;
}
.admin-link:hover {
  opacity: 1;
  color: #1e88e5;
}
</style>