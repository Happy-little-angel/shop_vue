<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑导航 -->


        <!-- 卡片视图-->
        <el-card class="box-card">
                <!-- 搜索与添加区域 -->
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-input placeholder="请输入内容" v-model="queryInfor.query" clearable @clear="getUsersList">
                                <el-button slot="append" icon="el-icon-search" @click="getUsersList" ></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click=" addDialogVisible = true">添加用户</el-button>
                        </el-col>
                    </el-row>
                <!-- 搜索与添加区域 -->
            <!-- table表单区域 -->
            <el-table :data="usersList" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column  prop="username" label="姓名" ></el-table-column>
                <el-table-column  prop="email"   label="邮箱" ></el-table-column>
                <el-table-column  prop="mobile"   label="电话"></el-table-column>
                <el-table-column  prop="role_name"   label="角色" ></el-table-column>
                <el-table-column  label="状态" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch> 
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <!-- {{scope.row}}    获取这一行的数据-->  
                            <!-- 修改按钮 -->
                            <el-button 
                            type="primary" 
                            icon="el-icon-edit" 
                            size="mini" 
                            @click="showEditDialog(scope.row.id)"
                            ></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete"  size="mini" @click="removeUserById(scope.row.id)"></el-button>
                            <!-- 设置 -->
                            <el-tooltip :enterable="false" effect="dark" content="权限分配" placement="top">
                                <el-button type="warning" icon="el-icon-setting"  size="mini"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- table表单区域 -->

            <!-- 分页区域 -->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfor.pagenum"
                :page-sizes="[1, 2, 3, 5]"
                :page-size=" queryInfor.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            <!-- 分页区域 -->
        </el-card>
        <!-- 卡片视图-->


        <!-- 添加用户的对话框 -->
            <el-dialog
            title="添加用户"
            :visible.sync=" addDialogVisible"
            width="50%" 
            @close="dialogClose"
           >
            <!-- 主体 -->
           <el-form 
           :model="addForm" 
           :rules="addFormRules" 
           ref="addFormRef" 
           label-width="70px" 
           >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
           </el-form>
            <!-- 主体 -->
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click=" addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
             <!-- 底部区域 -->
            </el-dialog>
        <!-- 添加用户的对话框 -->

        <!-- 修改用户对话框 -->
        <el-dialog
        title="修改用户信息"
        :visible.sync="EditdialogVisible"
        width="50%"
        @close="editDialogClose"
        
        >
        <!-- 主体部分 -->
        <el-form 
           :model="editForm" 
           :rules="editFormRules" 
           ref="editFormRef" 
           label-width="70px" 
           >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
           </el-form>
        <!-- 主体部分 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="EditdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
    </div>
</template>

<script>
    export default {
        name:"Users",
        data() {
            //验证邮箱
            var checkEmail = (rule,value,cb) => {
                const regEmail =/^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if(regEmail.test(value)) {
                    //合法的邮箱
                    return cb()
                }
                cb( new Error("请输入合法的邮箱"))
            }

            //验证手机 
            var checkMobile = (rule,value,cb) => {
                const regMobile = /^1[3456789]\d{9}$/;
                if (regMobile.test(value)){
                    //合法的手机号
                    return cb()
                }
                cb(new Error("请输入手机号"))

            }
            return {
                addDialogVisible:false,//控制添加对话框的显示与隐藏
                EditdialogVisible:false,//控制编辑对话框的显示与隐藏
                usersList:[],
                addForm:{
                    username:"",
                    password:"",
                    email:"",
                    mobile:""
                },//添加用户的表单数据

                //修改用户信息的表单数据;
                editForm: {

                },
                addFormRules:{
                    username:[
                                { required: true, message: '请输入用户名', trigger: 'blur' },
                                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                            ],
                    password:[
                                { required: true, message: '请输入用户名', trigger: 'blur' },
                                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                            ],
                      email:[
                                { required: true, message: '请输入邮箱', trigger: 'blur' },
                                {validator:checkEmail,trigger: 'blur'}
                            ],
                    mobile:[
                                { required: true, message: '请输入手机号', trigger: 'blur' },
                                 {validator:checkMobile,trigger: 'blur'}
                            ],
                    

                },//添加表单的验证规则
                editFormRules:{
                    username:[
                                { required: true, message: '请输入用户名', trigger: 'blur' },
                                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                            ],
                      email:[
                                { required: true, message: '请输入邮箱', trigger: 'blur' },
                                {validator:checkEmail,trigger: 'blur'}
                            ],
                    mobile:[
                                { required: true, message: '请输入手机号', trigger: 'blur' },
                                 {validator:checkMobile,trigger: 'blur'}
                            ],

                },//编辑表单的验证规则
                total:0,
                //获取用户列表的参数对象,
                queryInfor: {
                    //关键字
                    query:"",
                    //当前的页数
                    pagenum:1,
                    //每页显示的条数
                    pagesize:1
                },
            }
        },
        created(){
            this.getUsersList();
        },
        methods:{
            //获取用户列表信息
            async getUsersList () {
                const {data:res} = await this.$http.get('users',{
                    params:this.queryInfor
                })
                // console.log("res",res.data)
                this.usersList = res.data.users
                this.total = res.data.total
                console.log("userlist",this.usersList)
            },
            //监听 pagesize 改变的事件
            handleSizeChange (newSize) {
                //console.log("newsize",newSize)
                this.queryInfor.pagesize = newSize;
                //重新调用
                this.getUsersList()

            },
            //监听页码值改变
            handleCurrentChange (newPage) {
                // console.log("newPage",newPage)
                this.queryInfor.pagenum = newPage;
                this.getUsersList()

            },
            //监听switch的变化
            async userStateChanged(userinfo) {
                console.log("userinfo",userinfo)
                //拿到这个最新的状态值;
                 //修改用户状态
                const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                console.log("users.vue中的res:",res)
                if(res.meta.status!==200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新状态失败')
                }
                this.$message.success("更新用户状态成功")
            },           
            //关闭添加用户对话框实现重置:
            dialogClose () {
                this.$refs.addFormRef.resetFields();
            },
            //点击添加实现添加用户功能:
            addUser () {
                this.$refs.addFormRef.validate(async valid => {
                   if(!valid) return;
                   //校验通过 发送网络请求;
                   const {data:res} = await this.$http.post('users',this.addForm)
                   if(res.meta.status !== 201) {
                       this.$message.error(res.meta.msg)
                   }

                   this.$message.success(res.meta.msg)
                   //对话框隐藏:
                   this.addDialogVisible = false;
                   //重新获取用户信息列表;
                   this.getUsersList()
                })
            },
            //店家编辑用户对话框
            async showEditDialog (id) {
                this.EditdialogVisible = true
                console.log('id:',id)
                //根据id获取用户信息;
               const {data:res} = await this.$http.get(`users/${id}`)
               console.log("Res:",res)
               
               if (res.meta.status !== 200){
                   return this.$message.error(res.meta.msg)
               }

               this.editForm = res.data
               this.EditdialogVisible = true
           },
           //关闭编辑 实现重置:
           editDialogClose () {
               this.$refs.editFormRef.resetFields()
           },
           //编辑之后的校验
           editUserInfo () {
                this.$refs.editFormRef.validate(async valid => {
                   if(!valid) return;
                   //校验通过 发送网络请求;
                   const {data:res} = await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,mobile:this.editForm.mobile})
                   if(res.meta.status !== 200) {
                       this.$message.error(res.meta.msg)
                   }
                   //对话框隐藏:
                   this.EditdialogVisible = false;
                   //重新获取用户信息列表;
                   this.getUsersList();
                 //提示更新成功:
                 this.$message.success(res.meta.msg)
                })
           },
           //删除
          async removeUserById (id) {
               console.log('id',id)
               const result =   await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .catch(err => err)
                //如果确认删除就是返回的是confirm
                //如果取消删除就是返回的是cancel
                console.log("result",result)
                if(result !== "confirm") {
                    return this.$message.info("已经取消删除")
                } 

                //确认删除
               const {data:res} = await this.$http.delete(`users/${id}`)

                if(res.meta !== 200){
                    return this.$message.error("删除用户失败")
                }

                this.$message.success("删除用户成功")
                this.getUsersList()

            }
            
        }
    }
</script>

<style lang="less" scoped>


</style>