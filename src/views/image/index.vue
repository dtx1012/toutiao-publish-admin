<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 图片列表 -->
      <image-list></image-list>
    </el-card>
  </div>
</template>

<script>
  import ImageList from './components/image-list.vue';
  export default {
    // 组件名称
    name: 'ImageIndex',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {
      ImageList
    },
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
    methods: {},
  }

</script>

<style scoped lang='less'>
  /* .action-head {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }

  .image-item {
    position: relative;
  }

  .image-action {
    font-size: 15px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
    height: 30px;
    background-color: rgba(204, 204, 204, .5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
  } */

</style>
