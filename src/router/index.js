import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login=()=> import('@/components/Login')
const Home=()=>import('@/views/home/Home')

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=>import ('@/views/home/Welcome')
      },{
        path:'/users',
        component:()=>import ('@/views/users/User')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();

  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr){
    return next('/login')
  }
  next()
  
})


export default router
