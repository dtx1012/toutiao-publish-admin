<template>
  <div>
    <!-- 1.为Echarts准备一个具备大小（宽高）的DOM -->
    <div ref="main" style="width: 600px;height:400px;"></div>
    <h2>地图图表示例</h2>
    <Map-Demo></Map-Demo>
    <h2>存粹的百度地图示例</h2>
    <Bmap-Demo></Bmap-Demo>
  </div>
</template>
<script>
  //2.加载echarts
  import * as echarts from 'echarts'
  import MapDemo from './components/map-demo.vue';
  import BmapDemo from './components/bmap-demo.vue';
  export default {
    // 组件名称
    name: 'FansIndex',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {
      MapDemo,
      BmapDemo
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
    mounted() {
      //注意：初始化 DOM 一定要写道 mounted 钩子函数中


      //3.初始化生成图表
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 组件方法
    methods: {},
  }

</script>

<style scoped lang='less'>

</style>
