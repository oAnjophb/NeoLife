import DashboardLayout from '@/pages/Layout/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import CadastroPaciente from '@/pages/CadastroPaciente'
import FilaPrioridade from '@/pages/FilaPrioridade'
import CadastroTriagem from '@/pages/CadastroTriagem'
import Atendimento from '@/pages/Atendimento'
import PerfilUsuario from '@/pages/PerfilUsuario'
import Login from '@/pages/Login'
import RegisterFeedback from '@/pages/RegisterFeedback'
import FeedBackCadastro from '@/pages/FeedbackCadastro'
import AdminLogin from '@/pages/AdminLogin.vue'
import CadastroFuncionario from '@/pages/CadastroFuncionario'
import PesquisaPaciente from '@/pages/PesquisaPaciente.vue'
import DetalhePaciente from '@/pages/DetalhePaciente'
import EditarPaciente from '@/pages/EditarPaciente'
import FilaTriagem from '@/pages/FilaTriagem'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/register-feedback/:id',
    name: 'RegisterFeedback',
    component: RegisterFeedback,
  },
  {
    path: '/cadastro-funcionario',
    name: 'CadastroFuncionario',
    component: CadastroFuncionario,
    meta: { requiresAdmin: true },
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
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
        path: 'pesquisa-paciente',
        name: 'PesquisaPaciente',
        icon: 'search',
        component: PesquisaPaciente,
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
      },
      {
        path: 'paciente/:id',
        name: 'DetalhePaciente',
        component: DetalhePaciente,
        props: true,
      },
      {
        path: '/pacientes/:id/editar',
        name: 'EditarPaciente',
        component: EditarPaciente,
      },
      {
        path: '/triagem/fila',
        name: 'FilaTriagem',
        component: FilaTriagem,
      },
    ],
  },
]

export default routes
