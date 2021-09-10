<template>
  <el-container class="layout-container">
    <el-aside class="asid" width="auto">
      <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i :class="{'el-icon-s-fold':isCollapse,'el-icon-s-unfold':!isCollapse}" @click="isCollapse=!isCollapse"></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-warp">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认不识别原生事件，除非内部做了处理el-button做了处理，el-dropdown-item 没有做处理，.native绑定原生事件 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 默认子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import AppAside from './components/aside.vue';
  import {
    getUserProfile
  } from '@/api/user';
  import globalBus from '@/utils/global-bus';
  export default {
    // 组件名称
    name: 'LayoutIndex',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {
      AppAside
    },
    // 组件状态值
    data() {
      return {
        //当前登录用户信息
        user: {},
        //侧边菜单栏的展开状态
        isCollapse: false
      }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() {
      //组件初始化结束，请求获取用户资料
      this.loadUserProfile()

      //注册自定义事件
      //当这个事件发布以后，这个注册函数就会被调用
      globalBus.$on('update-user', (data) => {
        //this.user=data//注意：不要这么做，对象之间赋值的是引用，会导致相互影响的问题
        this.user.name = data.name
        this.user.photo = data.photo
      })
    },
    mounted() {},
    // 组件方法
    methods: {
      //除了登录接口，其他所有接口都需要授权（token）才能请求使用
      loadUserProfile() {
        getUserProfile().then((res) => {
          this.user = res.data.data
        }).catch((err) => {

        });
      },
      onLogout() {
        this.$confirm('确认退出吗？', '退出提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //清除登陆状态
          window.localStorage.removeItem('user')

          //跳转到登陆页面
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      }
    },
  }

</script>

<style scoped lang='less'>
  .layout-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .asid {
    .aside-menu {
      height: 100%;
    }
  }

  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

  .main {
    background-color: #e9eef3;
  }

  .avatar-warp {
    display: flex;
    align-items: center;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }

</style>
