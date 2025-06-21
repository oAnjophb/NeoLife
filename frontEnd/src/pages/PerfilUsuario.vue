<template>
  <div class="perfil-usuario">
    <div class="perfil-card">
      <div class="perfil-avatar">
        <img
          :src="avatarUrl"
          alt="Avatar"
          class="avatar-img"
        />
      </div>
      <h2 class="perfil-nome">{{ usuario.nome || "Nome do Usuário" }}</h2>
      <p class="perfil-tipo">{{ usuario.tipo ? usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1) : "Tipo" }}</p>
      <div class="info">
        <p v-if="usuario.id"><strong>ID:</strong> {{ usuario.id }}</p>
        <p v-if="usuario.cpf"><strong>CPF:</strong> {{ usuario.cpf }}</p>
        <p v-if="usuario.tipo === 'medico' && usuario.crm">
          <strong>CRM:</strong> {{ usuario.crm }}
        </p>
        <p v-if="usuario.tipo === 'enfermeiro' && usuario.coren">
          <strong>COREN:</strong> {{ usuario.coren }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PerfilUsuario',
  data() {
    return {
      usuario: {
        id: '',       // ID do usuário
        nome: '',     // Nome completo
        tipo: '',     // 'medico', 'enfermeiro' ou 'recepcionista'
        cpf: '',
        crm: '',      // Só se tipo === 'medico'
        coren: ''     // Só se tipo === 'enfermeiro'
      },
      avatarUrl: "https://ui-avatars.com/api/?name=Usuário&background=random"
    };
  },
  mounted() {
    // Exemplo de preenchimento fake (troque por backend ou Vuex)
    // Simule que está logado como médico:
    this.usuario = {
      id: 1234,
      nome: "Dra. Ana Paula",
      tipo: "medico",
      cpf: "12345678901",
      crm: "123456"
    };
    // Para enfermeiro:
    // this.usuario = { id: 4321, nome: "João Silva", tipo: "enfermeiro", cpf: "98765432100", coren: "654321" };
    // Para recepcionista:
    // this.usuario = { id: 5555, nome: "Maria Souza", tipo: "recepcionista", cpf: "11122233344" };

    // Gera avatar bonitinho pelo nome
    this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.usuario.nome)}&background=random`;
  }
});
</script>

<style scoped>
.perfil-usuario {
  max-width: 420px;
  margin: 40px auto;
}
.perfil-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.09);
  padding: 30px 30px 20px 30px;
  text-align: center;
}
.perfil-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.avatar-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f1f1;
  border: 2px solid #ececec;
}
.perfil-nome {
  margin: 0 0 6px 0;
  font-size: 1.3em;
  font-weight: bold;
  color: #2c3e50;
}
.perfil-tipo {
  margin: 0 0 18px 0;
  color: #888;
  text-transform: capitalize;
}
.info p {
  margin: 8px 0;
  text-align: left;
}
</style>