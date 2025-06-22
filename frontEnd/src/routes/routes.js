import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import CadastroPaciente from '@/pages/CadastroPaciente.vue'
import FilaPrioridade from '@/pages/FilaPrioridade.vue'
import CadastroTriagem from '@/pages/CadastroTriagem.vue'
import Atendimento from '@/pages/Atendimento.vue'
import PerfilUsuario from '@/pages/PerfilUsuario.vue'
import Login from '@/pages/Login'
import RegisterFeedback from '@/pages/RegisterFeedback'
import FeedBackCadastro from '@/pages/FeedbackCadastro'

import AdminLogin from '@/pages/AdminLogin.vue'
import CadastroFuncionario from '@/pages/CadastroFuncionario.vue'

const routes = [
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
  // ROTA DE LOGIN DO ADMIN
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLogin,
  },

  {
    path: '/cadastro-funcionario',
    name: 'CadastroFuncionario',
    component: CadastroFuncionario,
    meta: { requiresAdmin: true },
  },

  {
    path: '/login',
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
