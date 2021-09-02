<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 
        配置Form表单验证：
        1.必须给el-form组件绑定model为表单数据对象
        2.给需要验证的表单项el-form-item绑定prop属性
          注意：prop属性需要指定表单对象中的数据名称
        3.通过el-form组件的rules属性配置验证规则

        手动触发表单验证：
        1.给el-form设置ref起个名字
        2.通过ref获取el-form组件，调用组件的validate进行验证
       -->
      <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码">
          </el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    login
  } from '@/api/user';
  export default {
    name: 'LoginIndex',
    components: {},
    props: {},
    data() {
      return {
        user: {
          mobile: '13911111111', //手机号
          code: '246810', //验证码
          agree: false //是否同意协议
        },
        loginLoading: false, //登录的loading状态
        //表单验证规则配置
        formRules: {
          //要验证的数据名称 : 规则列表[{}]
          mobile: [{
              required: true,
              message: '手机号不能为空',
              trigger: 'change'
            },
            {
              pattern: /^1[3|5|7|8|9]\d{9}$/,
              message: '请输入正确的号码格式',
              trigger: 'change'
            }
          ],
          code: [{
              required: true,
              message: '验证码不能为空',
              trigger: 'change'
            },
            {
              pattern: /^\d{6}$/,
              message: '请输入正确的验证码格式',
              trigger: 'change'
            }
          ],
          agree: [{
            /* 
              自定义校验规则 
              验证通过：callback()
              验证失败：callback(new Error('错误消息'))
            */
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选同意协议'))
              }
            },
            // message: '请勾选同意协议',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {},
    watch: {},
    created() {

    },
    mounted() {

    },
    methods: {
      onLogin() {
        //获取表单数据（根据接口要求绑定数据）
        // const user = this.user

        //表单验证 validate方法是异步的
        this.$refs['login-form'].validate(valid => {
          //表单验证失败，停止请求提交
          if (!valid) {
            return
          }
          //验证通过，请求登录
          this.login()
        })

      },
      login() {
        //开启登录中 loading...按钮转圈圈
        this.loginLoading = true
        /*
          对于代码中的请求操作
          1.接口请求可能需要重复使用
          2.实际工作中，接口非常容易变动，改起来麻烦
          建议：把所有的请求都封装成函数然后统一组织到模块中进行管理
          好处：管理，维护，重用方便， 
         */
        login(this.user).then((res) => {
          console.log(res);
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          //关闭 loading
          this.loginLoading = false
          //将接口返回的用户数据放到本地存储，方便应用数据共享
          //本地存储只能存储字符串，需要转为JSON字符串进行存储
          window.localStorage.setItem('user', JSON.stringify(res.data.data))
          //跳转到首页
          this.$router.push({
            name: 'home'
          })
        }).catch((err) => {
          console.log('登陆失败', err);
          this.$message.error('登陆失败，手机号或验证码错误')
          this.loginLoading = false
        });
      }
    },
  }

</script>

<style lang="less" scoped>
  .login-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    //排列方向上下
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    //背景填充模式
    background-size: cover;

    .login-form-wrap {
      min-width: 300px;
      padding: 30px 50px 10px;
      background-color: #fff;

      .login-head {
        display: flex;
        justify-content: center;

        .logo {
          height: 57px;
          width: 200px;
          background: url('./logo_index.png') no-repeat;
          background-size: contain;
        }
      }

      .login-form {
        .login-btn {
          width: 100%;
        }
      }
    }


  }

</style>>
