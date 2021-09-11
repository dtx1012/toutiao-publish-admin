<template>
  <div id="container" class="bmap"></div>
</template>

<script>
  export default {
    // 组件名称
    name: 'BmapDemo',
    // 组件参数 接收来自父组件的数据
    props: {},
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
    mounted() {
      var map = new window.BMap.Map('container')
      var point = new window.BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
    },
    // 组件方法
    methods: {},
  }

</script>

<style scoped lang='less'>
  .bmap {
    width: 800px;
    height: 600px;
    border: 1px solid #000;
  }

</style>
