<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path:'/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑导航 -->
        <!-- 添加角色 -->
        <el-card class="box-card">
          <el-button type="primary" @click=" addDialogVisible = true">添加角色</el-button>
        </el-card>
        <!-- 添加角色 -->

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-table :data="rolesList" style="width: 100%" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <el-row  :class="['bdbottom',index === 0?'bdtop':'','vcenter']" v-for="(item1,index) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                 <i class="el-icon-caret-right"></i>
                              
                            </el-col>
                            <!-- 一级权限 -->

                             <!-- 二级权限 -->
                            <el-col  :span="19">
                                <!-- 通过for循环渲染2级权限 -->
                                <el-row  :class="[i2 === 0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key='item2.id' >
                                    <el-col :span="6">
                                        <el-tag type="success"  closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag   closable type="warning" v-for="(item3) in item2.children" :key="item3.id" @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <!-- 二级权限 -->
                        </el-row>                      
                    </template>
                    <!-- 作用域插槽 -->
                </el-table-column>
                <!-- 展开列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column  prop="roleName" label="角色名称" ></el-table-column>
                <el-table-column  prop="roleDesc" label="角色描述" ></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)" >权限分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 卡片视图 -->
        <!-- 添加用户的对话框 -->
            <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="50%" 
            @close="dialogClose"
           >
        <!-- 主体 -->
           <el-form 
           :model="addForm" 
           :rules="addFormRules" 
           ref="addFormRef" 
           label-width="100px" 
           >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName" ></el-input>
                </el-form-item>

                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
           </el-form>
        <!-- 主体 -->
        <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click=" addDialogVisible = false ">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        <!-- 底部区域 -->
            </el-dialog>
        <!-- 添加用户的对话框 -->
        <!-- 编辑用户的对话框 -->
            <el-dialog
            title="编辑角色"
            :visible.sync="EditdialogVisible"
            width="50%" 
            @close="editDialogClose"
           >
            <!-- 主体 -->
           <el-form 
           :model="editForm" 
           ref="aditFormRef" 
           label-width="100px" 
           >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName" > </el-input>
                </el-form-item>

                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"> </el-input>
                </el-form-item>
           </el-form>
            <!-- 主体 -->
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click= "EditdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
             <!-- 底部区域 -->
            </el-dialog>
        <!-- 编辑用户的对话框 -->

        <!-- 分配权限 -->
        <el-dialog
        title="分配权限"
        :visible.sync="SetRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
       >
        <!-- 树形控件 -->
        <el-tree 
        :data="rightsList" 
        :props="treeProps"
        node-key='id'
        show-checkbox
        default-expand-all
        :default-checked-keys='defkeys'
        ref="treeRef"
        ></el-tree>
        <!-- 树形控件 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 分配权限 -->
    </div>
</template>

<script>
    export default {
        name:"Roles",
        data(){
            return {
                //分配权限的对话框
                SetRightDialogVisible:false,
                addDialogVisible:false,//控制添加对话框的显示与隐藏
                 //添加用户的表单数据
                addForm:{
                    roleName:"",
                    roleDesc:""
                },
                //编辑列表
                editForm:{
                },
                //用来存放角色列表
                rolesList:[],
                //权限列表
                rightsList:[],
                //树形控件的属性绑定对象
                treeProps:{
                    children: 'children',
                    label: 'authName'
                },
                EditdialogVisible:false,
                addFormRules:{
                   roleName:[
                                { required: true, message: '请输入角色名称', trigger: 'blur' },
                            ],
                    roleDesc:[
                                { required: true, message: '请输入角色描述', trigger: 'blur' },
                               
                            ],
                },//添加表单的验证规则
                // 默认选中的节点的id
                defkeys:[],
                //当前即将分配权限的角色id
                roleId:""
            }  
        },
        created () {
            this.getRolesList()
        },
        methods:{
            //获取角色列表
           async getRolesList () {
               const {data: res} = await this.$http.get('roles')
               console.log('角色列表:',res)
               if(res.meta.status !== 200) {
                   return this.$message.error(res.meta.msg)
               }
               //获取成功的话:
               this.rolesList = res.data
               console.log('rolesList',this.rolesList)
            },
          
          //编辑角色
           async editRole (id) {
                this.EditdialogVisible = true
                //根据id获取用户信息;
               const {data:res} = await this.$http.get(`roles/${id}`,this.editForm)
               console.log("Res:",res)
               
               if (res.meta.status !== 200){
                   return this.$message.error(res.meta.msg)
               }
               this.editForm = res.data
               console.log("editForm:",this.editForm)
               this.EditdialogVisible = true
            },
            //删除角色
              async deleteRole (id) {
                    
               console.log('id',id)
               const result =   await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .catch(err => err)
                //如果确认删除就是返回的是confirm
                //如果取消删除就是返回的是cancel
                //console.log("result",result)

                if(result !== "confirm") {
                    return this.$message.info("已经取消删除")
                } 

                //确认删除
               const {data:res} = await this.$http.delete(`roles/${id}`)

                console.log("delete res:",res)
                if(res.meta.status !== 200){
                    return this.$message.error("删除角色失败")
                }

                this.$message.success("删除角色成功")
                this.getRolesList()

            },
            //权限分配角色:
            async showSetRightDialog (role) {
                this.roleId = role.id
                //获取所有的权限数据;
                const {data:res} = await this.$http.get('rights/tree')
                if(res.meta.status !==200) {return this.$message.error('获取权限数据失败')}
                //把获取到的数据存在data中;
                this.rightsList = res.data
                this.getLeafKeys(role,this.defkeys)
              
                this.SetRightDialogVisible = true
            },
            //通过递归的fangshi,huoqu角色下的所有的三级权限的id并保存在数组defkeys中
            getLeafKeys(node,arr){                
                if(!node.children){
                    return arr.push(node.id)
                }

                node.children.map(item => 
                this.getLeafKeys(item,arr)
                )
            },
             //关闭权限列表
            setRightDialogClosed () {
                this.defkeys = []
            },
            //关闭添加用户对话框实现重置:
            dialogClose () {
                this.$refs.addFormRef.resetFields();
            },
            //点击添加实现添加角色功能:
            addRole () {
                this.$refs.addFormRef.validate(async valid => {
                   if(!valid) return;
                   //校验通过 发送网络请求;
                   const {data:res} = await this.$http.post('roles',this.addForm)
                   if(res.meta.status !== 201) {
                       this.$message.error(res.meta.msg)
                   }
                   this.$message.success(res.meta.msg)
                   //对话框隐藏:
                   this.addDialogVisible = false;
                   //重新获取角色信息列表;
                   this.getRolesList()
                })
            },
           //关闭编辑实现重置:
           editDialogClose () {
               this.$refs.aditFormRef.resetFields()
           },
           //点击为角色分配权限
          async allotRights () {
              const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
              ]
              
            const idStr = keys.join(',')
            const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !==200) {return this.$message.error("分配权限失败!")}
            this.$message.success("分配权限成功")
            this.getRolesList()
            this.SetRightDialogVisible = false
          },
           //删除对应的权限:
          async removeRightById (role,rightId) {
              const result =   await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .catch(err => err)
                //如果确认删除就是返回的是confirm
                //如果取消删除就是返回的是cancel
                //console.log("result",result)

                if(result !== "confirm") {
                    return this.$message.info("已经取消删除")
                } 
                //确认删除
               const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !== 200){
                    return this.$message.error("删除权限失败")
                }

               this.$message.success("删除权限成功成功")
               role.children = res.data
           }
          },
          
         
         
          
    }
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top:1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display:flex;
        align-items: center;
    }
</style>