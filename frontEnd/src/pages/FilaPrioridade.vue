<template>
  <div class="pagina-centralizada">
    <md-card>
      <md-card-header>
        <h4 class="title">Fila de Prioridade</h4>
      </md-card-header>
      <md-card-content>
        <md-table>
          <md-table-row>
            <md-table-head>Prioridade</md-table-head>
            <md-table-head>Paciente</md-table-head>
            <md-table-head>Hora Triagem</md-table-head>
          </md-table-row>
          <md-table-row
            v-for="item in fila"
            :key="item.id"
            :class="`risk-${item.prioridade}`"
          >
            <md-table-cell>
              <span :class="`badge badge-${item.prioridade}`">{{
                prioridadeLabel(item.prioridade)
              }}</span>
            </md-table-cell>
            <md-table-cell>{{ item.paciente }}</md-table-cell>
            <md-table-cell>{{ item.horaTriagem }}</md-table-cell>
          </md-table-row>
        </md-table>
        <div class="actions-row">
          <md-button
            class="md-primary"
            :disabled="!fila.length"
            @click="chamarProximo"
          >
            <md-icon>arrow_forward</md-icon>
            Chamar Próximo
          </md-button>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'FilaPrioridade',
  data() {
    return {
      fila: [],
    }
  },
  mounted() {
    this.carregarFila()
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
    async carregarFila() {
      try {
        const res = await fetch('/api/fila-prioridade')
        if (res.ok) {
          this.fila = await res.json()
        }
      } catch (e) {
        this.fila = []
      }
    },
    async chamarProximo() {
      if (!this.fila.length) return
      try {
        const res = await fetch('/api/fila-prioridade/chamar', {
          method: 'POST',
        })
        if (res.ok) {
          const ticket = await res.json()
          console.log('Ticket retornado:', ticket)
          if (ticket && ticket.id_atendimento) {
            this.$router.push(`/atendimento/${ticket.id_atendimento}`)
          } else {
            alert(
              'Não foi possível chamar o próximo paciente: id_atendimento não encontrado.'
            )
          }
        }
      } catch (e) {
        alert('Erro ao chamar próximo paciente.')
      }
    },
  },
}
</script>

<style>
.pagina-centralizada {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #fafbfd;
  padding: 32px 0 32px 0;
  width: 100%;
  box-sizing: border-box;
}

.md-card {
  width: 100%;
  max-width: 1200px;
  min-height: 80vh;
  margin: 0 24px;
  padding: 40px 28px 32px 28px;
  box-sizing: border-box;
  border-radius: 18px;
  box-shadow: 0 6px 24px 2px #00000012;
  background: #fff;
}

.title {
  margin: 0 0 4px 0;
  font-size: 1.6em;
  font-weight: 600;
  color: #333;
  display: inline-block;
  margin-left: 10px;
}

.risk-vermelho {
  background: #fdeaea;
}
.risk-laranja {
  background: #fff3e0;
}
.risk-amarelo {
  background: #fffde7;
}
.risk-verde {
  background: #e8f5e9;
}
.risk-azul {
  background: #e3f2fd;
}
.badge {
  padding: 4px 10px;
  border-radius: 9px;
  font-weight: 600;
}
.badge-vermelho {
  background: #e53935;
  color: #fff;
}
.badge-laranja {
  background: #ffa726;
  color: #fff;
}
.badge-amarelo {
  background: #fbc02d;
  color: #fff;
}
.badge-verde {
  background: #43a047;
  color: #fff;
}
.badge-azul {
  background: #1e88e5;
  color: #fff;
}

.actions-row {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

@media (max-width: 1300px) {
  .md-card {
    max-width: 98vw;
    margin: 0 8px;
    padding: 20px 2vw 16px 2vw;
  }
}
@media (max-width: 600px) {
  .pagina-centralizada {
    padding: 0;
  }
  .md-card {
    max-width: 100vw;
    min-height: 90vh;
    border-radius: 0;
    padding: 6vw 2vw 2vw 2vw;
    box-shadow: none;
  }
}
</style>
