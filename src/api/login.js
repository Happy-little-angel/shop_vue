import Mock from 'mockjs'
Mock.mock("login.php","post",(option)=>{
    var url=JSON.parse(option.body);
    var username=url["username"];
    var password=url["password"];
    if(username=="admin" && password=="123456"){
        return Mock.mock({
            status:200,
            info:"登录成功",
            token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE1OTE3ODk1NzgsImV4cCI6MTU5MTg3NTk3OH0.8YG3Hny7MVgB10IVCGICgrGEp8dyrII1FTb9qVMJrB4"
        })
    }else{
        return Mock.mock({
            status:"10002",
            info:"用户名或者密码错误"
        })
    }
  
})