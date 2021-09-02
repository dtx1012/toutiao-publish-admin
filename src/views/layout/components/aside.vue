<template>
  <el-menu default-active="/" background-color="#002033" text-color="#fff" active-text-color="#ffd04b" router
    :collapse="isCollapse" class="nav-menu">
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont iconicon_image"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconfeijifenxiang"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconpinglun"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-setting"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    // 组件名称
    name: 'AppAside',
    // 组件参数 接收来自父组件的数据
    props: [
      'is-collapse'
    ],
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
      return {}
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() {},
    mounted() {},
    // 组件方法
    methods: {

    },
  }

</script>

<style scoped lang='less'>
  .nav-menu {
    .iconfont {
      margin-right: 10px;
      padding-left: 5px;
    }
  }

</style>
