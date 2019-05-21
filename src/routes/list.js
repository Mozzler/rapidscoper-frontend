import Home from '../components/pages/Home'

export default [
  {
    path: '/',
    redirect: 'home'
  },
  /* {
    path: '/sign-in',
    name: 'Sign In',
    component: AuthPage,
    meta: {
      guest: true
    }
  },
  {
    path: '/sign-up',
    name: 'Sign Up',
    component: AuthPage,
    meta: {
      guest: true
    }
  }, */
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]
