

$(function(){


    $('.btn-login').on('tap', function() {

        // 2. 获取当前输入用户名 和 密码
        var username = $('.username').val().trim();
        // 3. 验证用户是否输入 没有输入使用mui 确认框提示用户
        if (!username.trim()) {
            mui.toast('请输入用户名',{ duration:'short', type:'div' }) ;
            return false;//不仅结束后面的代码,还阻止默认行为
        }
        var password = $('.password').val().trim();
        if (!password.trim()) {
            mui.toast('请输入密码',{ duration:'short', type:'div' }) ;
            return false;
        }

        $.ajax({
            url:'/user/login',
            type:'post',
            data:{
                username:username,
                password:password
            },
            success:function(data){
                console.log(data);
                if(data.success){
                    var returnUrl = getQueryString('returnUrl')
                    location = returnUrl;
                }else{
                    mui.toast(data.message,{ duration:'short', type:'div' }) ;
                }
            }
        })
    })

    $('.btn-register').on('tap', function() {
        location = 'register.html';
    })

    // 获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        // console.log(r); 
        if (r != null) return decodeURI(r[2]);
        return null;
    }
})