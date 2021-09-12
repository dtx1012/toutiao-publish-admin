<template>
  <div class="image-list">
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button v-if="isShowAdd" size="mini" type="success" @click="dialogUploadVisible=true">上传素材</el-button>
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="10">
      <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img,index) in images" :key="index" class="image-item"
        @click.native="selected=index">
        <el-image style="height: 100px" :src="img.url" fit="cover"></el-image>
        <div class="selected" v-if="isShowSelected&&selected===index"></div>
        <div class="image-action" v-if="isShowAction">
          <el-button type="warnig" :icon="img.is_collected?'el-icon-star-on':'el-icon-star-off'" circle size="mini"
            @click="onCollect(img)" :loading="img.loading"></el-button>
          <el-button type="dange" icon="el-icon-delete-solid" circle size="small" @click="onDelete(img)"
            :loading="img.loading"></el-button>
          <!-- <i :class="{'el-icon-star-on':img.is_collected,'el-icon-star-off':!img.is_collected}"
              @click="onCollect(img)"></i>
            <i class="el-icon-delete-solid"></i> -->
        </div>
      </el-col>
    </el-row>
    <el-pagination style="padding-top:20px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="currentPage" :page-sizes="[12,18,24,30]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="totalImage">
    </el-pagination>
    <el-dialog title="上传素材" :visible.sync="dialogUploadVisible" :append-to-body="true">
      <!--
        upload 组件本身就支持请求提交上传操作，说白了你使用它不用自己去发请求，它会自己发。
        请求方法：默认就是 POST
        请求路径：action，必须写完整路径
        请求头：headers
       -->
      <el-upload class="upload-demo" drag action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders" name="image" multiple :show-file-list="false" :on-success="onUploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getImages,
    collectImage,
    deleteImage
  } from '@/api/image';
  export default {
    // 组件名称
    name: 'ImageList',
    // 组件参数 接收来自父组件的数据
    props: {
      //是否显示添加素材
      isShowAdd: {
        type: Boolean, //布尔值
        default: true //默认值
      },
      //是否显示图片下方的操作（收藏和删除）
      isShowAction: {
        type: Boolean,
        default: true
      },
      isShowSelected: {
        type: Boolean,
        default: false
      }
    },
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
      const user = JSON.parse(window.localStorage.getItem('user'))
      return {
        collect: false, //默认查询全部素材列表
        images: [], //图片素材列表
        dialogUploadVisible: false, //上传素材显示框的打开和隐藏
        uploadHeaders: {
          Authorization: `Bearer ${user.token}`
        },
        currentPage: 1, //前往第几页
        totalImage: 0, //总条数
        pageSize: 12, //每页数量
        selected: null //选中的索引
      }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() {
      this.loadImages()
    },
    mounted() {},
    // 组件方法
    methods: {
      loadImages() {
        getImages({
          collect: this.collect,
          per_page: this.pageSize,
          page: this.currentPage
        }).then(res => {
          const results = res.data.data.results
          results.forEach(img => {
            //img对象本来没有loading数据
            //我们这里往收到的数据里面添加loading控制每个收藏按钮的loading状态
            img.loading = false
          });
          this.images = results
          this.totalImage = res.data.data.total_count
        })
      },
      ////点击切换 全部or收藏 并且返回第一页
      onCollectChange(value) {
        this.loadImages(value, this.currentPage = 1)
      },
      //上传素材后更新数据
      onUploadSuccess() {
        //关闭对话框
        this.dialogUploadVisible = false
        //更新素材列表
        this.loadImages(this.currentPage)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      },
      //每页数量改变触发
      handleSizeChange(val) {
        this.pageSize = val
        this.loadImages()
      },
      //页码数改变触发
      handleCurrentChange(val) {
        this.currentPage = val
        this.loadImages()
      },
      //收藏和取消收藏
      onCollect(img) {
        //展示loading
        img.loading = true
        collectImage(img.id, !img.is_collected).then((res) => {
          img.is_collected = !img.is_collected
          //关闭loading
          img.loading = false
        }).catch((err) => {

        });
      },
      //删除图片
      onDelete(img) {
        //展示loading
        img.loading = true
        deleteImage(img.id).then((res) => {
          img.loading = false
          //重新加载数据列表
          this.loadImages(this.page)
        }).catch((err) => {

        });
      }
    },
  }

</script>

<style scoped lang='less'>
  .action-head {
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
  }

  .selected {
    background: url(./selected.png) no-repeat;
    background-size: cover;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
