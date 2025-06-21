import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import CadastroPaciente from '@/pages/CadastroPaciente.vue'
import FilaPrioridade from '@/pages/FilaPrioridade.vue'
import CadastroTriagem from '@/pages/CadastroTriagem.vue'
import Atendimento from '@/pages/Atendimento.vue'
import PerfilUsuario from '@/pages/PerfilUsuario.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login'
import RegisterFeedback from '@/pages/RegisterFeedback'
import FeedBackCadastro from '@/pages/FeedbackCadastro'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/register-feedback/:id',
    name: 'RegisterFeedback',
    component: RegisterFeedback,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },

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
        path: 'feedback-cadastro/:nome?',
        name: 'FeedBackCadastro',
        component: FeedBackCadastro,
      },
      {
        path: 'FilaPrioridade',
        name: 'FilaPrioridade',
        component: FilaPrioridade,
      },
      {
        path: 'atendimento/:id',
        name: 'Atendimento',
        component: Atendimento,
        props: true,
      },
      {
        path: 'cadastro-triagem',
        name: 'Cadastro de Triagem',
        component: CadastroTriagem,
      },
      {
        path: 'perfil',
        name: 'PerfilUsuario',
        component: PerfilUsuario,
        meta: { requiresAuth: true },
      },
    ],
  },
]

export default routes
