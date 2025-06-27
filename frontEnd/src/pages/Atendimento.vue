<template>
  <div class="pagina-centralizada">
    <md-card>
      <md-card-header>
        <md-icon style="font-size: 32px; color: #2196f3">person</md-icon>
        <h4 class="title">Atendimento</h4>
      </md-card-header>
      <md-card-content v-if="paciente" class="card-content-posicionada">
        <div class="info-paciente">
          <p><strong>Nome:</strong> {{ paciente.nome }}</p>
          <p v-if="paciente.idade">
            <strong>Idade:</strong> {{ paciente.idade }}
          </p>
          <p v-if="paciente.genero">
            <strong>Gênero:</strong> {{ generoLabel(paciente.genero) }}
          </p>
          <p>
            <strong>Prioridade:</strong>
            <span :class="`badge badge-${paciente.prioridade}`">{{
              prioridadeLabel(paciente.prioridade)
            }}</span>
          </p>
          <p v-if="paciente.horaTriagem">
            <strong>Hora da Triagem:</strong> {{ paciente.horaTriagem }}
          </p>
          <p v-if="paciente.sintomas">
            <strong>Sintomas:</strong> {{ paciente.sintomas }}
          </p>
        </div>
        <!-- CAMPO DE DIAGNÓSTICO -->
        <div class="diagnostico-field">
          <label for="diagnostico"><strong>Diagnóstico:</strong></label>
          <md-field>
            <md-textarea
              id="diagnostico"
              v-model="diagnostico"
              placeholder="Descreva o diagnóstico aqui..."
              rows="3"
              :disabled="salvandoDiagnostico"
            ></md-textarea>
          </md-field>
        </div>
        <div class="actions-row fixo-inferior-esquerdo">
          <md-button
            class="md-accent"
            :disabled="salvandoDiagnostico"
            @click="encerrarAtendimento"
          >
            <md-icon>done</md-icon>
            Encerrar Atendimento
          </md-button>
          <md-button
            class="botao-nao-compareceu"
            :disabled="salvandoDiagnostico"
            @click="cancelarAtendimento"
          >
            <md-icon>cancel</md-icon>
            Não Compareceu
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
  name: 'Atendimento',
  data() {
    return {
      paciente: null,
      diagnostico: '',
      salvandoDiagnostico: false,
    }
  },
  mounted() {
    const id = this.$route.params.id
    fetch(`/api/triagem/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar triagem')
        return res.json()
      })
      .then((data) => {
        // Converte id_classificacao_risco para string de prioridade
        const prioridades = {
          5: 'vermelho',
          4: 'laranja',
          3: 'amarelo',
          2: 'verde',
          1: 'azul',
        }
        this.paciente = {
          nome: data.nome_paciente,
          prioridade:
            prioridades[data.id_classificacao_risco] || 'desconhecida',
          horaTriagem: data.data_triagem
            ? new Date(data.data_triagem).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          sintomas: data.sintomas,
          idade: this.calcularIdade(data.data_nascimento),
          genero: data.genero,
          data_nascimento: data.data_nascimento,
        }
        // Carrega diagnóstico existente, se houver
        return fetch(`/api/diagnostico/${id}`)
      })
      .then((res) => {
        if (res && res.ok) return res.json()
        throw new Error('Sem diagnóstico')
      })
      .then((data) => {
        if (data && data.descricao_diagnostico) {
          this.diagnostico = data.descricao_diagnostico
        }
      })
      .catch(() => {
        // Não faz nada se não houver diagnóstico ou triagem
      })
  },
  methods: {
    prioridadeLabel(prio) {
      return (
        {
          vermelho: 'Vermelho',
          laranja: 'Laranja',
          amarelo: 'Amarelo',
          verde: 'Verde',
          azul: 'Azul',
        }[prio] || prio
      )
    },
    generoLabel(genero) {
      if (!genero) return ''
      return (
        {
          M: 'Masculino',
          F: 'Feminino',
          'nao-informar': 'Prefiro não informar',
        }[genero] || genero
      )
    },
    calcularIdade(dataNasc) {
      if (!dataNasc) return ''
      const nascimento = new Date(dataNasc)
      const hoje = new Date()
      let idade = hoje.getFullYear() - nascimento.getFullYear()
      const m = hoje.getMonth() - nascimento.getMonth()
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
      return idade
    },
    async encerrarAtendimento() {
      const id = this.$route.params.id
      if (!this.diagnostico) {
        alert('Digite o diagnóstico para encerrar o atendimento!')
        return
      }
      this.salvandoDiagnostico = true
      try {
        // Salva diagnóstico
        const diagRes = await fetch('/api/diagnostico', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_atendimento: id,
            descricao_diagnostico: this.diagnostico,
          }),
        })
        if (!diagRes.ok) {
          throw new Error('Erro ao salvar diagnóstico')
        }
        // Encerra atendimento
        await fetch(`/api/atendimento/${id}/encerrar`, { method: 'POST' })
        this.$router.push('/FilaPrioridade')
      } catch (e) {
        alert('Erro ao encerrar atendimento/diagnóstico.')
      } finally {
        this.salvandoDiagnostico = false
      }
    },
    async cancelarAtendimento() {
      const id = this.$route.params.id
      if (!confirm('Deseja realmente cancelar este atendimento?')) return
      this.salvandoDiagnostico = true
      try {
        await fetch(`/api/fila/cancelar/${id}`, { method: 'POST' })
        this.$router.push('/FilaPrioridade')
      } catch (e) {
        alert('Erro ao cancelar atendimento')
      } finally {
        this.salvandoDiagnostico = false
      }
    },
  },
}
</script>

<style scoped>
.botao-nao-compareceu {
  background-color: #d32f2f !important;
  color: #fff !important;
  border-radius: 4px;
  border: none;
}
.botao-nao-compareceu:hover {
  background-color: #b71c1c !important;
}

.card-content-posicionada {
  position: relative;
  min-height: 350px;
  padding-bottom: 85px;
}

.fixo-inferior-esquerdo {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0;
  padding-left: 0;
  padding-bottom: 0;
  display: flex;
  gap: 16px;
}

.actions-row {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 24px;
  position: relative;
  min-height: 60px;
}

.pagina-centralizada {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-left: 260px;
  box-sizing: border-box;
  background: #f5f5f5;
}
.md-card {
  width: 100%;
  max-width: 600px;
  min-width: 350px;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.07),
    0 1.5px 6px rgba(33, 150, 243, 0.08);
  border-radius: 14px;
}
.title {
  margin: 0 0 0 10px;
  font-size: 26px;
  color: #222;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: inline-block;
  vertical-align: middle;
}
.info-paciente {
  margin-bottom: 24px;
}
.badge {
  font-weight: bold;
  border-radius: 4px;
  padding: 3px 12px;
  color: #fff;
  margin-left: 4px;
  display: inline-block;
}
.badge-vermelho {
  background: #d32f2f;
}
.badge-laranja {
  background: #ff9800;
}
.badge-amarelo {
  background: #ffeb3b;
  color: #333;
}
.badge-verde {
  background: #388e3c;
}
.badge-azul {
  background: #1976d2;
}
.actions-row {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}
</style>