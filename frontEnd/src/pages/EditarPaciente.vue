<template>
  <div class="editar-paciente">
    <h2>Editar Paciente</h2>
    <form @submit.prevent="salvar">
      <div>
        <label>Nome</label>
        <input v-model="paciente.nome" required />
      </div>
      <div>
        <label>CPF</label>
        <input v-model="paciente.cpf" disabled />
      </div>
      <div>
        <label>Nascimento</label>
        <input v-model="paciente.data_nascimento" type="date" required />
      </div>
      <div>
        <label>Gênero</label>
        <select v-model="paciente.genero" required>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
      <div>
        <label>Telefone</label>
        <input v-model="paciente.telefone" />
      </div>
      <div>
        <label>Email</label>
        <input v-model="paciente.email" />
      </div>
      <div>
        <label>Endereço</label>
        <input v-model="paciente.endereco" />
      </div>
      <button type="submit">Salvar</button>
      <div v-if="erro" style="color:red">{{ erro }}</div>
      <div v-if="sucesso" style="color:green">{{ sucesso }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'EditarPaciente',
  data() {
    return {
      paciente: {},
      erro: '',
      sucesso: ''
    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      const { data } = await axios.get(`/api/pacientes/${id}`)
      this.paciente = data
    } catch {
      this.erro = 'Erro ao carregar paciente.'
    }
  },
  methods: {
    async salvar() {
      this.erro = ''
      this.sucesso = ''
      try {
        await axios.put(`/api/pacientes/${this.paciente.id_paciente}`, this.paciente)
        this.sucesso = 'Paciente atualizado!'
      } catch (e) {
        this.erro = 'Erro ao atualizar paciente.'
      }
    }
  }
}
</script>