<template>
  <div>
    <div class="modal-overlay" v-if="mostrarModal">
      <div class="modal-content">
        <button class="fechar" @click="fecharModal">×</button>
        <h2><span class="icon"></span> Editar Cadastro</h2>
        <form @submit.prevent="salvarAlteracoes" class="form-flex">
          <div class="input-group">
            <label for="nome">Nome</label>
            <input
              id="nome"
              v-model="form.nome"
              required
              maxlength="100"
              placeholder="Nome completo"
              autocomplete="off"
            />
          </div>
          <div class="input-group">
            <label for="cpf">CPF</label>
            <input
              id="cpf"
              v-model="form.cpf"
              required
              maxlength="11"
              disabled
            />
          </div>
          <div class="input-group">
            <label for="data_nascimento">Data de Nascimento</label>
            <input
              id="data_nascimento"
              v-model="form.data_nascimento"
              required
              type="date"
            />
          </div>
          <div class="input-group">
            <label for="genero">Gênero</label>
            <select id="genero" v-model="form.genero" required>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <button type="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Salvar</span>
          </button>
        </form>
        <transition name="fade">
          <div v-if="erro" class="erro">
            <span class="icon">⚠️</span> {{ erro }}
          </div>
          <div v-if="sucesso" class="sucesso">
            <span class="icon">✅</span> Cadastro atualizado com sucesso!
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EditarPacienteModal',
  props: {
    idPaciente: { type: [String, Number], required: true },
    mostrarModal: { type: Boolean, required: true },
  },
  data() {
    return {
      form: {
        nome: '',
        cpf: '',
        data_nascimento: '',
        genero: '',
      },
      loading: false,
      erro: '',
      sucesso: false,
    }
  },
  watch: {
    mostrarModal(val) {
      if (val) this.carregarPaciente()
    }
  },
  methods: {
    async carregarPaciente() {
      this.loading = true
      this.erro = ''
      try {
        const { data } = await axios.get(`/api/pacientes/${this.idPaciente}`)
        this.form = {
          nome: data.nome,
          cpf: data.cpf,
          data_nascimento: data.data_nascimento,
          genero: data.genero,
        }
      } catch (e) {
        this.erro = 'Erro ao carregar dados do paciente.'
      } finally {
        this.loading = false
      }
    },
    async salvarAlteracoes() {
      this.loading = true
      this.erro = ''
      this.sucesso = false
      try {
        await axios.put(`/api/pacientes/${this.idPaciente}`, this.form)
        this.sucesso = true
        setTimeout(() => {
          this.sucesso = false
          this.fecharModal()
        }, 1000)
      } catch (error) {
        this.erro = 'Erro ao salvar alterações. Verifique os dados.'
      } finally {
        this.loading = false
      }
    },
    fecharModal() {
      this.$emit('fechar')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(34, 34, 34, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(60, 60, 100, 0.12), 0 1.5px 3px #eee;
  max-width: 600px;
  width: 95vw;
  margin: 0 auto;
  border: none;
  transition: box-shadow 0.2s;
  position: relative;
  animation: popup-fadein 0.25s;
  min-width: 320px;
}

@keyframes popup-fadein {
  from {
    opacity: 0;
    transform: scale(0.97) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fechar {
  position: absolute;
  top: 10px; right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
}
.fechar:hover {
  color: #3855a8;
}
.sucesso {
  background: #e0ffe6;
  color: #228b22;
  border: 1px solid #9df1b6;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}
.erro {
  background: #ffeaea;
  color: #c00;
  border: 1px solid #ffb4b4;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}
.form-flex {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.2rem;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.input-group label {
  font-size: 0.95rem;
  margin-bottom: 0.1rem;
  color: #3a3d4d;
  font-weight: 500;
}
input,
select {
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1.5px solid #b3bde6;
  background: #fafdff;
  font-size: 1rem;
  transition: border 0.15s;
  outline: none;
}
input:focus, select:focus {
  border-color: #5486f7;
  background: #fff;
}
button[type="submit"] {
  padding: 0.62rem 1.2rem;
  background: #5486f7;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  min-width: 115px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.2rem;
}
button[type="submit"]:disabled {
  background: #b9c7e6;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  border: 2.5px solid #eee;
  border-top: 2.5px solid #5486f7;
  border-radius: 50%;
  width: 21px;
  height: 21px;
  animation: spin 1s linear infinite;
  margin-right: 6px;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.icon {
  margin-right: 6px;
  font-size: 1.2em;
  vertical-align: middle;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
@media (max-width: 700px) {
  .modal-content {
    padding: 1.2rem 0.4rem 1rem 0.4rem;
    max-width: 98vw;
    min-width: 0;
  }
}
</style>