import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import CadastroPaciente from '@/pages/CadastroPaciente.vue'
import FilaPrioridade from '@/pages/FilaPrioridade.vue'
import Typography from '@/pages/Typography.vue'
import Icons from '@/pages/Icons.vue'
import Maps from '@/pages/Maps.vue'
import Notifications from '@/pages/Notifications.vue'
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
        path: 'typography',
        name: 'Typography',
        component: Typography,
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons,
      },
      {
        path: 'maps',
        name: 'Maps',
        meta: {
          hideFooter: true,
        },
        component: Maps,
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications,
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
