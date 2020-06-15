<template>

    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt=""> 
                <span>电商后台管理平台</span>
            </div>
            <Button type="info" @click="logout"  plain class="btn">退出</Button>
        </el-header>
        <!-- 头部区域 -->
        <!-- 页面主体 -->
        <el-container>
            <!-- 左侧边栏 -->
            <el-aside :width="isCollapse ? '64px': '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 多级菜单列表 -->
                 <el-menu
                    class="el-menu-vertical-demo"
                    unique-opened
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff"
                    :collapse="isCollapse"
                    :collapse-transition = "false"
                    router
                    :default-active = 'activePath'
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id +''" v-for="item in menulists" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 一级菜单的图标 -->
                            <i :class="iconObjs[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 一级菜单的模板区域 -->
                        
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                            <!-- 二级菜单的图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </template>

                        </el-menu-item>
                        
                    </el-submenu>
                    <!-- 一级菜单 -->
                </el-menu>
                <!-- 多级菜单列表 -->
            </el-aside>
            <!-- 左侧边栏 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
                <!-- 路由占位符 -->
            </el-main>
        </el-container>
        <!-- 页面主体 -->
    </el-container>
</template>

<script>
    export default {
        name:"Home",
        data () {
            return {
                //左侧列表数据
                menulists:[],
                iconObjs:{
                    "125":"iconfont icon-yonghuguanli",
                    "103":"iconfont icon-quanxian",
                    "101":"iconfont icon-shangpin",
                    "102":"iconfont icon-dingdanguanli",
                    "145":"iconfont icon-icon-test"
                },
                isCollapse:false,
                //被激活的链接地址
                activePath:""
            }
        },
        created () {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods:{
            //退出
            logout () {
                    window.sessionStorage.clear()
                    //跳转到login
                    this.$router.push('/login')
            },
            //获取所有的菜单
            async getMenuList () {
                const {data:res} = await this.$http.get('menus') 
                console.log("caidan:",res)
                if(res.meta.status !== 200) return this.$message.error("获取菜单列表失败")
                this.menulists = res.data
            },
            //点击按钮实现菜单全展开与折叠
            toggleCollapse () {
               this.isCollapse = !this.isCollapse
            },
            //保存链接的激活状态
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath = activePath
            }
        },
        
    }
</script>h

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header {
    padding-left: 0;
    align-items: center;
    background: #373d41;
    display: flex;
    justify-content: space-between;//左右贴边对齐
    color:#fff;
    font-size: 20px;
    div{
        display: flex;
        align-items: center;
        height:100%;
        margin:15px 5px;
        span {
            margin-left: 5px;
        }
        img {
            margin-top:5px;
            height:80%;
        }
    }
    .btn {
        height:60%;
        width:60px;
        font-size: 14px;
    }
   
}
.el-aside {
    background: #333744;
    .el-menu {
        border-right:none;
    }
}
.el-main {
    background: #eaedf1;
}
.iconfont {
    margin-right: 8px;
}
.toggle-button{
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>