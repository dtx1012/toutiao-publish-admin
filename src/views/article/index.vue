<template>
  <div class="article-container">

    <el-card class="filter-card">

      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 数据筛选表单 -->
      <el-form size="mini" ref="form" :model="form" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- 
              el-radio默认把label作为文本和选中之后的value值,点全部status为null,点草稿,status为0 
            -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option :label="channel.name" :value="channel.id" v-for="(channel,index) in channels" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="rangeDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
            :default-time="['12:00:00']" format="yyyy-MM-DD" value-format="yyyy-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- 
            button按钮的click事件有个默认参数，不指定参数，默认传递一个无用数据
           -->
          <el-button type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>

    </el-card>

    <el-card class="box-card">

      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{totalCount}}条结果：
      </div>

      <!-- 数据列表 -->
      <el-table :data="articles" style="width: 100%" stripe class="list-table" size="mini" v-loading="loading">
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image style="width:50px;height:50px" :src="scope.row.cover.images[0]" fit="cover" lazy>
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!-- <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">
            <img v-else class="article-cover" src="./no-cover.gif" alt=""> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">
              {{articleStatus[scope.row.status].text}}
            </el-tag>
            <!-- <el-tag v-if="scope.row.status===0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status===3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status===4" type="info">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              @click="$router.push('/publish?id='+scope.row.id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="onDeleteArticle(scope.row.id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <el-pagination layout="prev, pager, next" background :total="totalCount" @current-change="onCurrentChange"
        :page-size="pageSize" :disabled="loading" :current-page.sync="page" @current-page="onCurrentChange">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
  import {
    getArticles,
    getArticleChannels,
    deleteArticle
  } from '@/api/article';
  export default {
    // 组件名称
    name: 'ArticleIndex',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        //文章数据列表
        articles: [],
        //状态
        articleStatus: [{
            status: 0,
            text: '草稿',
            type: 'info'
          },
          {
            status: 1,
            text: '待审核',
            type: ''
          },
          {
            status: 2,
            text: '审核通过',
            type: 'success'
          },
          {
            status: 3,
            text: '审核失败',
            type: 'warning'
          },
          {
            status: 4,
            text: '已删除',
            type: 'danger'
          }
        ],
        //总数据条数
        totalCount: 0,
        //每页数据大小
        pageSize: 10,
        //查询文章的状态
        status: null,
        //文章频道列表
        channels: [],
        //查询文章的频道
        channelId: null,
        //筛选的日期范围
        rangeDate: null,
        //loading加载
        loading: true,
        page: 1
      }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() {
      this.loadChannels()
      this.loadArticles(1)
    },
    mounted() {},
    // 组件方法
    methods: {
      loadArticles(page = 1) {
        //请求开始展示加载中
        this.loading = true
        getArticles({
          page,
          per_page: this.pageSize,
          status: this.status,
          channel_id: this.channelId,
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null //截至日期
        }).then((res) => {
          /* 
            total_count: totalCount
            将total_count命名为totalCount,应为规范只支持驼峰
          */
          const {
            results,
            total_count: totalCount
          } = res.data.data
          console.log(res.data.data);
          this.articles = results
          this.totalCount = totalCount

          //关闭加载中 loading 
          this.loading = false
        }).catch((err) => {

        });
      },
      onSubmit() {
        console.log('submit!');
      },
      onCurrentChange(page) {
        this.loadArticles(page)
      },
      loadChannels() {
        getArticleChannels().then((res) => {
          this.channels = res.data.data.channels
        }).catch((err) => {

        });
      },
      onDeleteArticle(articleId) {
        this.$confirm('确认删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(articleId).then((res) => {
            //删除成功，更新当前页面数据
            this.loadArticles(this.page)
          }).catch((err) => {

          });
        }).catch(() => {
          this.$message({
            type: 'info',
            messzage: '已取消删除！'
          })
        });
        //找到数据接口
        //封装请求方法
        //删除请求调用
        //处理请求结果
      }
    },
  }

</script>

<style scoped lang='less'>
  .filter-card {
    margin-bottom: 30px;
  }

  .list-table {
    margin-bottom: 20px;
  }

  /* .article-cover {
    width: 60px;
    height: 60px;
    background-size: cover;
  } */

</style>
