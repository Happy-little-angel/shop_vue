<template>
    <div>
        <Button type="info" @click="logout">退出</Button>
    </div>
</template>

<script>
    export default {
        name:"Home",
        methods:{
            //退出
            logout () {
                    window.sessionStorage.clear()
                    //跳转到login
                    this.$router.push('/login')

            }
        }
    }
</script>

<style lang="less" scoped>

</style>