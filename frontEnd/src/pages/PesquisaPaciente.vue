<template>
  <div class="pesquisa-paciente">
    <div class="card">
      <h2><span class="icon">🔎</span> Buscar Paciente</h2>
      <div class="form-flex">
        <div class="input-group">
          <label for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            placeholder="Digite o CPF"
            maxlength="11"
            autocomplete="off"
            @input="onCpfInput"
          />
        </div>
      </div>

      <transition name="fade">
        <div v-if="erro" class="erro">
          <span class="icon">⚠️</span> {{ erro }}
        </div>
      </transition>

      <!-- Lista filtrada em tempo real -->
      <div v-if="!mostrarCardPaciente" class="lista-pacientes">
        <h3 style="margin-bottom: 1rem">
          <span class="icon">📋</span> Pacientes do Hospital
        </h3>
        <div class="tabela-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Gênero</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pacientesFiltrados" :key="p.id_paciente">
                <td>{{ p.nome }}</td>
                <td>{{ p.cpf }}</td>
                <td>{{ p.data_nascimento }}</td>
                <td>{{ p.genero }}</td>
                <td>
                  <button @click="verDetalhes(p)">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="pacientesFiltrados.length === 0"
          style="margin-top: 1rem; color: #888"
        >
          Nenhum paciente encontrado.
        </div>
      </div>

      <!-- Card de detalhes -->
      <transition name="slide-fade">
        <div v-if="mostrarCardPaciente" class="resultado">
          <div class="header-dados-paciente">
            <h3><span class="icon">👤</span> Dados do Paciente</h3>
            <button
              class="quadrado-cinza"
              @click="onHistoricoClick"
              type="button"
            >
              <img
                src="https://icones.pro/wp-content/uploads/2022/03/historique-icone-de-l-historique-noir.png"
                alt="Histórico"
                class="icone-historico"
              />
            </button>
          </div>
          <ul>
            <li v-if="paciente.nome">
              <strong>Nome:</strong> {{ paciente.nome }}
            </li>
            <li v-if="paciente.cpf">
              <strong>CPF:</strong> {{ paciente.cpf }}
            </li>
            <li v-if="paciente.data_nascimento">
              <strong>Nascimento:</strong> {{ paciente.data_nascimento }}
            </li>
            <li v-if="paciente.genero">
              <strong>Gênero:</strong> {{ paciente.genero }}
            </li>
          </ul>
          <div class="buttons">
            <button class="edit" @click="editarPaciente">
              ✏️ Editar Cadastro
            </button>
            <button
              class="atendimento"
              @click="iniciarAtendimento"
              :disabled="iniciandoAtendimento"
            >
              <span v-if="iniciandoAtendimento" class="spinner small"></span>
              <span v-else>💼 Iniciar Atendimento</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
    <EditarCadastro
      v-if="mostrarEditar"
      :idPaciente="paciente.id_paciente"
      :mostrarModal="mostrarEditar"
      @fechar="mostrarEditar = false"
    />
  </div>
</template>

<script>
import axios from 'axios'
import EditarCadastro from './EditarCadastro.vue' // Importe o modal de edição

export default {
  name: 'PesquisaPaciente',
  components: {
    EditarCadastro, // registre o componente modal
  },
  data() {
    return {
      cpf: '',
      paciente: {},
      todosPacientes: [],
      erro: '',
      loading: false,
      iniciandoAtendimento: false,
      mostrarEditar: false, // controla exibição do modal de edição
    }
  },
  computed: {
    pacientesFiltrados() {
      if (!this.cpf) return this.todosPacientes
      return this.todosPacientes.filter(
        (p) => p.cpf && p.cpf.startsWith(this.cpf)
      )
    },
    mostrarCardPaciente() {
      return this.paciente && this.paciente.id_paciente
    },
  },
  watch: {
    cpf() {
      // Limpa o card e erro ao modificar o campo e mantém só números
      if (this.cpf !== this.cpf.replace(/\D/g, '')) {
        this.cpf = this.cpf.replace(/\D/g, '')
      }
      this.paciente = {}
      this.erro = ''
    },
  },
  methods: {
    onCpfInput() {
      // Aceita só números
      if (this.cpf !== this.cpf.replace(/\D/g, '')) {
        this.cpf = this.cpf.replace(/\D/g, '')
      }
    },
    async getTodosPacientes() {
      try {
        const { data } = await axios.get('/api/pacientes')
        this.todosPacientes = Array.isArray(data) ? data : []
      } catch (e) {
        this.todosPacientes = []
        this.erro = 'Erro ao buscar lista de pacientes.'
      }
    },
    verDetalhes(p) {
      this.paciente = p
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    editarPaciente() {
      if (!this.paciente.id_paciente) {
        this.erro = 'Paciente não carregado para edição.'
        return
      }
      this.mostrarEditar = true // Exibe o modal de edição
    },
    fecharEditar() {
      this.mostrarEditar = false
    },
    async iniciarAtendimento() {
      if (!this.paciente.id_paciente) {
        this.erro = 'Paciente não carregado para atendimento.'
        return
      }
      this.iniciandoAtendimento = true
      try {
        const { data } = await axios.post('/api/pacientes/atendimento', {
          id_paciente: this.paciente.id_paciente,
        })
        alert(`Atendimento iniciado! ID: ${data.id_attendance}`)
      } catch (e) {
        this.erro =
          e.response && e.response.data && e.response.data.erro
            ? e.response.data.erro
            : 'Erro ao iniciar atendimento.'
      } finally {
        this.iniciandoAtendimento = false
      }
    },
    onHistoricoClick() {
      alert('Histórico do paciente (implemente conforme seu app)')
    },
  },
  mounted() {
    this.getTodosPacientes()
  },
}
</script>

<style scoped>
.pesquisa-paciente {
  padding: 40px 0 0 0;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
}

.card {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(60, 60, 100, 0.12), 0 1.5px 3px #eee;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 2rem auto;
  border: none;
  transition: box-shadow 0.2s;
}

.card h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #3a3d4d;
  margin-bottom: 1.8rem;
}
.icon {
  margin-right: 6px;
  font-size: 1.2em;
  vertical-align: middle;
}
.form-flex {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin-bottom: 1.2rem;
}
.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.input-group label {
  font-size: 0.95rem;
  margin-bottom: 0.1rem;
  color: #3a3d4d;
  font-weight: 500;
}
input {
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1.5px solid #b3bde6;
  background: #fafdff;
  font-size: 1rem;
  transition: border 0.15s;
  outline: none;
}
input:focus {
  border-color: #5486f7;
  background: #fff;
}
input.error {
  border-color: #cc2222;
  background: #fff7f7;
}
button {
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
}
button:disabled {
  background: #b9c7e6;
  cursor: not-allowed;
}
.spinner,
.spinner.small {
  display: inline-block;
  border: 2.5px solid #eee;
  border-top: 2.5px solid #5486f7;
  border-radius: 50%;
  width: 21px;
  height: 21px;
  animation: spin 1s linear infinite;
  margin-right: 6px;
}
.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
.resultado {
  background: #f7fafd;
  border-radius: 14px;
  box-shadow: 0 1.5px 10px #e5ecf8;
  padding: 1.2rem 1rem 1rem 1rem;
  margin-top: 1.5rem;
  animation: fadein 0.35s;
}
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.resultado ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.1rem 0;
}
.resultado li {
  margin-bottom: 0.35rem;
  font-size: 1.05rem;
  color: #23243a;
}
.resultado strong {
  color: #5486f7;
  font-weight: 600;
  margin-right: 3px;
}
.buttons {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}
button.edit {
  background: #ffd978;
  color: #664e05;
}
button.edit:hover {
  background: #ffe9ad;
}
button.atendimento {
  background: #90d7b8;
  color: #125d45;
}
button.atendimento:hover {
  background: #a6edd0;
}

/* Lista de pacientes */
.lista-pacientes {
  margin-top: 2rem;
}
.tabela-scroll {
  max-height: 350px;
  overflow-x: auto;
  overflow-y: auto;
  border-radius: 10px;
  background: #fafdff;
  box-shadow: 0 0.5px 4px #dbe2ea;
}
.lista-pacientes table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.98rem;
}
.lista-pacientes th,
.lista-pacientes td {
  padding: 0.62rem 0.6rem;
  text-align: left;
}
.lista-pacientes th {
  background: #e9f1ff;
  color: #3855a8;
  font-weight: 700;
  border-bottom: 2px solid #c3d6ef;
  position: sticky;
  top: 0;
  z-index: 1;
}
.lista-pacientes tr:nth-child(even) {
  background: #f3f7fa;
}
.lista-pacientes tr:hover {
  background: #e1ecff;
}
.lista-pacientes button {
  background: #eee;
  color: #2b3f7c;
  padding: 3px 15px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s;
}
.lista-pacientes button:hover {
  background: #badaff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 2, 0.6, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
@media (max-width: 900px) {
  .card {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    max-width: 100%;
  }
  .pesquisa-paciente {
    padding: 0 0.4rem;
  }
  .tabela-scroll {
    max-width: 100vw;
    padding-bottom: 10px;
  }
}

.header-dados-paciente {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

CSS .quadrado-cinza {
  width: 40px;
  height: 40px;
  background: #e0e0e0;
  border-radius: 8px;
  margin-left: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: box-shadow 0.15s, background 0.15s;
  box-shadow: 0 1.5px 8px #d3d3d344;
}

.quadrado-cinza:active {
  background: #cccccc;
}

.quadrado-cinza:focus {
  outline: 2px solid #3855a8;
}

.icone-historico {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
}
</style>
