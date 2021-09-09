<template>
  <div class="comment-container">
    <el-card>
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="articles" style="width: 100%" stripe class="table-list">
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数" width="180">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="comment_status" label="评论状态">
          <template slot-scope="scope">
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.comment_status" active-color="#13ce66" inactive-color="#ff4949"
              @change="onStatusChange(scope.row)" :disabled="scope.row.statusDisabled">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
        :page-sizes="[10, 20, 30, 40]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import {
    getArticles,
    updateCommenttatus
  } from '@/api/article';
  export default {
    // 组件名称
    name: 'CommentIndex',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        articles: [],
        totalCount: 0, //总数据
        pageSize: 10, //每页大小
        page: 1 //当前激活的页码
      }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() {
      this.loadArticle()
    },
    mounted() {},
    // 组件方法
    methods: {
      handleSizeChange(val) {
        this.loadArticle(1)
      },
      handleCurrentChange(page) {
        //页码改变，加载指定页码数据
        this.loadArticle(page)
      },
      loadArticle(page = 1) {
        this.page = page
        getArticles({
          response_type: 'comment',
          page,
          per_page: this.pageSize
        }).then((res) => {
          /* 把res.data.data中的results解构出来 */
          const {
            results
          } = res.data.data
          results.forEach(article => {
            article.statusDisabled = false
          });
          this.articles = results
          this.totalCount = res.data.data.total_count
        }).catch((err) => {

        });
      },
      onStatusChange(article) {
        //禁用开关
        article.statusDisabled = true
        updateCommenttatus(article.id.toString(), article.comment_status).then((res) => {
          //启用开关
          article.statusDisabled = false
          this.$message({
            type: 'success',
            message: article.comment_status ? '开启文章品论状态' : '关闭文章评论状态'
          })
        }).catch((err) => {

        });
      }
    },
  }

</script>

<style scoped lang='less'>
  .table-list {
    margin-bottom: 30px;
  }

</style>
