<template>
    <div class="login_container">
        
       <div class="login_box">
           <!-- 头像区域开始 -->
          <div class="avatar_box">
              <img src="../assets/logo.png" alt="">
          </div>
         
          <!-- 头像区域结束 -->
          <!-- 登录表单区域开始 -->
           <el-form  
           label-width="0px" 
           :model="form" 
           class="login_form" 
           :rules="loginFormRules"
           ref="loginFormRef"
           >
               <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input  v-model="form.username"   prefix-icon="iconfont icon-yonghuming"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
          </el-form>
          <!-- 登录表单区域结束 -->
       </div>
    </div>
</template>

<script>
import './../api/login'
    export default {
        name:"login",
        data(){
            return  {
                //这是登录表单的数据绑定对象
                form:{
                    username:"admin",
                    password:"123456",
                },
                //这是表单的验证规则对象;
               loginFormRules:{
                    //验证用户名是否合法:
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    //验证密码是否合法;
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            resetLoginForm () {
                this.$refs.loginFormRef.resetFields();
            },
            //登录前的验证
            login () {
                this.$refs.loginFormRef.validate(async valid => {
                    //valid 验证通过为true,否则是false
                    console.log("valid",valid);
                    if(!valid) return;
                    //ture的时候发起请求;
                   //const result = await this.$http.post('login.php',this.form)
                   //解构出来:
                   const {data:res}  = await this.$http.post('login.php',this.form)
                   console.log("result",res)
                   if(res.status !==200) return this.$message.error("登录失败")
                   this.$message.success("登录成功")
                   //1将登录成功之后生成的token,存在sessionStorge中;
                        //1.1项目中除了登录之外的api接口,必须在登录之后才能访问
                        //1.2token值应在当前网址中生效 所以存在sessionStorge中
                    window.sessionStorage.setItem("token",res.token)
                    //2.通过编程式导航跳转到后台主页,路由地址是 /home
                    console.log("this.$router",this.$router)
                    this.$router.push('/home')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
       width: 100%;
       height: 100%;
       background-color: #2b4b6b;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
       
        .avatar_box{
            height:130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding:10px;
            box-shadow: 0 0 10px #dddddd;
            position: absolute;
            left: 50%;
            background: #fff;
            transform: translate(-50%,-50%);
            z-index: -99;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #eee;
            }
        }
        .login_form{
            position: absolute;
            box-sizing: border-box;
            width: 100%;
            bottom: 0;
            padding: 0 20px;
        }
        .btns {
            display: flex;
            justify-content:center;
        }
    }

</style>