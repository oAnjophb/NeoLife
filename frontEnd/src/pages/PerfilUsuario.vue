<template>
  <div class="perfil-usuario">
    <div class="perfil-card">
      <div class="perfil-avatar">
        <img :src="avatarUrl" alt="Avatar" class="avatar-img" />
      </div>
      <h2 class="perfil-nome">{{ usuario.nome || 'Nome do Usuário' }}</h2>
      <p class="perfil-tipo">
        {{ usuario.tipo ? capitalize(usuario.tipo) : 'Tipo' }}
      </p>
      <div class="info">
        <p v-if="usuario.id"><strong>ID:</strong> {{ usuario.id }}</p>
        <p v-if="usuario.cpf">
          <strong>CPF:</strong> {{ formatCpf(usuario.cpf) }}
        </p>
        <p v-if="usuario.tipo === 'medico' && usuario.crm">
          {{ formatCrm(usuario.crm) }}
        </p>
        <p v-if="usuario.tipo === 'enfermeiro' && usuario.coren">
          {{ formatCoren(usuario.coren) }}
        </p>
      </div>
      <button class="botao-sair" @click="logout">Sair</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PerfilUsuario',
  data() {
    return {
      usuario: {
        id: '',
        nome: '',
        tipo: '',
        cpf: '',
        crm: '',
        coren: '',
      },
      avatarUrl: 'https://ui-avatars.com/api/?name=Usuário&background=random',
    }
  },
  mounted() {

    try {
      const salvo = localStorage.getItem('usuario')
      if (salvo) {
        this.usuario = JSON.parse(salvo)
        this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.usuario.nome || 'Usuário'
        )}&background=random`
      }
    } catch {

      this.usuario = {
        id: '',
        nome: '',
        tipo: '',
        cpf: '',
        crm: '',
        coren: '',
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('usuario')

      this.$router.push('/login')
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    formatCpf(cpf) {
      cpf = String(cpf).replace(/\D/g, '')
      if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      }
      return cpf
    },
    formatCrm(crm) {
      
      crm = String(crm).replace(/\s+/g, '')
      if (/^\d{2,7}-[A-Z]{2}$/.test(crm)) return `CRM: ${crm}`
      if (/^\d+$/.test(crm)) return `CRM: ${crm}`
      return `CRM: ${crm}`
    },
    formatCoren(coren) {
     
      coren = String(coren).replace(/\s+/g, '')
      if (/^\d{2,7}-[A-Z]{2}$/.test(coren)) return `COREN: ${coren}`
      if (/^\d+$/.test(coren)) return `COREN: ${coren}`
      return `COREN: ${coren}`
    },
  },
})
</script>

<style scoped>
.perfil-usuario {
  max-width: 420px;
  margin: 40px auto;
}
.perfil-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.09);
  padding: 30px 30px 20px 30px;
  text-align: center;
  position: relative;
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
.botao-sair {
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  padding: 9px 26px;
  margin-top: 18px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.16s;
}
.botao-sair:hover {
  background: #b71c1c;
}
</style>