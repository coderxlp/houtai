<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="head-left">
        <img src="../../assets/logo.png" alt />
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主题 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse?'64px':'240px'">
        <div class="toggle" @click="toggleClick">
            <span :class="{active:isCollapse}">||||</span>
          </div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          router
          :default-active='activepath'
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
            <!-- 一级模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 内容 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级 -->
            <el-menu-item :index="'/'+subItem.path" 
              v-for="subItem in item.children" 
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
              >
              <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 内容 -->
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      menulist:[],
      iconObj:{
        '125':'el-icon-s-custom',
        '103':'el-icon-s-tools',
        '101':'el-icon-s-shop',
        '102':'el-icon-s-claim',
        '145':'el-icon-s-marketing'
      },
      isCollapse:false,
      activepath:''
    }
  },
  created() {
    this.getMenuList()
    this.activepath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("./login");
    },
    async getMenuList(){
      const {data:res}=await this.$http.get('menus')
      if(res.meta.status!=200)return this.$message({type:'error',message:`${res.meta.msg}`})
      this.menulist=res.data
    },
    /* 是否展开 */
    toggleClick(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){    
      window.sessionStorage.setItem('activePath',activePath)
      this.activepath=activePath
    } 
  }
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;

  align-items: center;
  color: #fff;
  font-size: 20px;
}
.head-left {
  display: flex;
  justify-content: center;
  align-items: center;
}
.head-left img {
  height: 35px;
  width: 35px;
  margin-right: 20px;
}

.el-aside {
  background-color: #333744;
}
.el-aside>.el-menu{
  border: none;
}
.el-main {
  background-color: #eaedf1;
}
.toggle{
  background-color: #4a5064;
  display: flex;
  justify-content: center;
  line-height: 24px;
  color:#fff;
  cursor: pointer;
  
}
.active{
  transition: .3s;
  transform:rotate(90deg);
}

</style>