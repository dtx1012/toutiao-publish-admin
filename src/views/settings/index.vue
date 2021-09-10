<template>
  <div class="settings-container">
    <el-card>
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser" :loading="updateProfileLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input id="file" type="file" hidden ref="file" @change="onFileChange">
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="修改头像" :visible.sync="dialogVisible" append-to-body @opened="onDialogOpened"
      @closed="onDialogClosed">
      <div class="preview-image-wrap">
        <img class="preview-image" width="150px" :src="previewImage" alt="" ref="preview-image">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto" :loading="updatePhotoLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getUserProfile,
    updateUserPhoto,
    updateUserProfile
  } from '@/api/user';
  import 'cropperjs/dist/cropper.css'
  import Cropper from 'cropperjs';
  import globalBus from '@/utils/global-bus';
  export default {
    // 组件名称
    name: 'SettingsIndex',
    // 组件参数 接收来自父组件的数据
    props: {},
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
      return {
        user: {
          email: '',
          id: null,
          intro: '',
          mobile: '',
          name: '',
          photo: ''
        }, //用户资料
        dialogVisible: false, //控制弹出层
        previewImage: '', //预览图片
        cropper: null, //裁切器示例
        updatePhotoLoading: false, //更新用户头像 loading 状态
        updateProfileLoading: false
      }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() {
      this.loadUser()
    },
    mounted() {},
    // 组件方法
    methods: {
      onUpdateUser() {
        //表单验证
        //验证通过，提交表单
        this.updateProfileLoading = true
        const {
          name,
          intro,
          email
        } = this.user
        updateUserProfile({
          name,
          intro,
          email
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '更新用户数据成功'
          })
          this.updateProfileLoading = false

          //发布通知，用户信息已修改
          globalBus.$emit('update-user', this.user)
        }).catch((err) => {

        });
      },
      loadUser() {
        getUserProfile().then((res) => {
          this.user = res.data.data
        }).catch((err) => {

        });
      },
      onFileChange() {
        //处理图片预览
        const file = this.$refs.file

        const bloData = window.URL.createObjectURL(file.files[0]);

        this.previewImage = bloData

        //展示弹出层，预览用户选择的图片
        this.dialogVisible = true

        //解决选择相同的文件不触发 change 事件问题
        this.$refs.file.value = ''
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      onDialogOpened() {
        //获取图片DOM节点
        //图片裁切器必须基于img进行初始化，img必须处于可视化
        //     因为我们这里要在对话框里面初始化裁切器
        //     所以务必要在对话框完全打开的状态去进行初始化
        //初始化裁切器
        const image = this.$refs['preview-image']

        //第1次初始化好以后，如果预览裁切的图片发生了变化，裁切器默认不会更新
        //方式一：裁切器.replace方法
        //方式二：销毁裁切器，重新初始化
        //初始化裁切器
        if (this.cropper) {
          this.cropper.replace(this.previewImage)
          return
        }
        this.cropper = new Cropper(image, {
          //裁切器比例
          aspectRatio: 1,
          //裁切框在图片内移动
          viewMode: 1,
          //禁止画布移动
          dragMode: 'none',
          cropBoxResizable: false,
          //移动裁切器的时候会触发调用crop方法
          // crop(event) {}
        })
      },
      onDialogClosed() {
        //对话框关闭，销毁裁切器
        // this.cropper.destroy()

      },
      onUpdatePhoto() {
        //点击确定开启loading
        this.updatePhotoLoading = true
        //获取裁切的图片对象
        this.cropper.getCroppedCanvas().toBlob(file => {
          const fd = new FormData()
          fd.append('photo', file)
          ////请求更新用户头像 提交 fd
          updateUserPhoto(fd).then((res) => {
            //关闭对话框
            this.dialogVisible = false

            //更新视图展示
            //直接把裁切结果的文件对象转为blob数据本地预览
            this.user.photo = window.URL.createObjectURL(file)

            //关闭loading
            this.updatePhotoLoading = false

            //把服务端返回的图片进行展示有点慢因为要发送请求
            /* this.user.photo = res.data.data.photo */
            this.$message({
              type: 'success',
              message: '更新头像成功'
            })
            globalBus.$emit('update-user', this.user)
          }).catch((err) => {

          });
        })
      }
    },
  }

</script>

<style scoped lang='less'>
  .preview-image-wrap {
    .preview-image {
      display: block;
      min-width: 100%;
      height: 200px;
    }
  }

</style>
