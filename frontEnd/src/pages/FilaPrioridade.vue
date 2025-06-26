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
            <md-table-head>Tempo de Espera</md-table-head>
          </md-table-row>
          <md-table-row
            v-for="item in filaOrdenada"
            :key="item.id_ticket || item.id_atendimento || item.id_paciente"
            :class="`risk-${prioridadeClasse(item.prioridade)}`"
          >
            <md-table-cell>
              <span :class="`badge badge-${prioridadeClasse(item.prioridade)}`">
                {{ item.prioridadeNome || prioridadeLabel(item.prioridade) }}
              </span>
            </md-table-cell>
            <md-table-cell>{{ item.paciente }}</md-table-cell>
            <md-table-cell>{{ item.horaTriagem }}</md-table-cell>
            <md-table-cell
              :class="{ atrasado: tempoRestante(item) === '0 min restantes' }"
            >
              {{ tempoRestante(item) }}
            </md-table-cell>
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
      timer: null,
    }
  },
  computed: {
    filaOrdenada() {
      return [...this.fila].sort((a, b) => {
        if (b.prioridade !== a.prioridade) {
          return b.prioridade - a.prioridade
        }
        if (a.dataTriagem && b.dataTriagem) {
          return (
            new Date(a.dataTriagem).getTime() -
            new Date(b.dataTriagem).getTime()
          )
        }
        if (a.horaTriagem && b.horaTriagem) {
          return a.horaTriagem.localeCompare(b.horaTriagem)
        }
        return 0
      })
    },
  },
  mounted() {
    this.carregarFila()
    this.timer = setInterval(() => {
      this.$forceUpdate()
    }, 60000)
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    prioridadeLabel(prio) {
      switch (prio) {
        case 5:
        case 'vermelho':
          return 'Vermelho'
        case 4:
        case 'laranja':
          return 'Laranja'
        case 3:
        case 'amarelo':
          return 'Amarelo'
        case 2:
        case 'verde':
          return 'Verde'
        case 1:
        case 'azul':
          return 'Azul'
        default:
          return 'Não classificado'
      }
    },
    prioridadeClasse(prio) {
      switch (prio) {
        case 5:
        case 'vermelho':
          return 'vermelho'
        case 4:
        case 'laranja':
          return 'laranja'
        case 3:
        case 'amarelo':
          return 'amarelo'
        case 2:
        case 'verde':
          return 'verde'
        case 1:
        case 'azul':
          return 'azul'
        default:
          return ''
      }
    },
    tempoRestante(item) {
      const tempoLimitePorClassificacao = {
        azul: 240,
        verde: 120,
        amarelo: 60,
        laranja: 30,
        vermelho: 10, 
      }
      let dataStr = item.dataTriagem
      if (!dataStr) return ''
      if (dataStr.includes(' ') && !dataStr.includes('T'))
        dataStr = dataStr.replace(' ', 'T')

      const triagem = new Date(dataStr)
      if (isNaN(triagem.getTime())) return ''
      const agora = new Date()
      let diff = Math.floor((agora - triagem) / 1000)

      if (diff < 0) diff = 0

      const minutosAguardados = Math.floor(diff / 60)
      let classificacao = this.prioridadeClasse(item.prioridade)
      const limite = tempoLimitePorClassificacao[classificacao]

      if (limite === 0) {
        return 'Sem limite'
      }

      let restante = limite - minutosAguardados
      if (restante < 0) restante = 0

      if (restante >= 60) {
        const horas = Math.floor(restante / 60)
        const minutos = restante % 60
        return `${horas}h ${minutos}min restantes`
      }
      return `${restante} min restantes`
    },
    async carregarFila() {
      try {
        const res = await fetch('/api/fila-prioridade')
        if (res.ok) {
          const data = await res.json()
          this.fila = data.map((item) => {
            return {
              id_ticket: item.id_ticket ?? null,
              id_atendimento: item.id_atendimento ?? null,
              id_paciente: item.id_paciente ?? null,
              paciente: item.paciente ?? '',
              prioridade: item.prioridade,
              prioridadeNome:
                item.prioridadeNome ?? this.prioridadeLabel(item.prioridade),
              dataTriagem: item.dataTriagem ?? null,
              horaTriagem:
                item.horaTriagem ??
                (item.dataTriagem
                  ? new Date(item.dataTriagem).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''),
            }
          })
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

.atrasado {
  color: #d32f2f;
  font-weight: bold;
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