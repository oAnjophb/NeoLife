import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import CadastroPaciente from '@/pages/CadastroPaciente.vue'
import FilaPrioridade from '@/pages/FilaPrioridade.vue'
import CadastroTriagem from '@/pages/CadastroTriagem.vue'
import Atendimento from '@/pages/Atendimento.vue' // <-- ADICIONADO!

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'cadastro-paciente',
        name: 'Cadastro de Paciente',
        icon: 'person_add',
        component: CadastroPaciente,
      },
      {
        path: 'table',
        name: 'Fila',
        component: FilaPrioridade,
      },
      {
        path: 'atendimento/:id', // <-- NOVA ROTA!
        name: 'Atendimento',
        component: Atendimento,
        props: true,
      },
      {
        path: 'cadastro-triagem',
        name: 'Cadastro de Triagem',
        component: CadastroTriagem,
      },
    ],
  },
]

export default routes
