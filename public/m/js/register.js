$(function () {

  /*   $('.btn-registr').on('tap',function(){
        //1.1默认是通过了验证了
        var check = true;
        //1.2获取所有输入框
        var inputs = $('.mui-input-group input');
        //1.3遍历每一个输入框
        inputs.each(function(index,value){
            // 1.4获取每个输入框的value值 并且去除空格
            var val =$(value).val().trim();
            // 1.5判断当前输入框 的值是否为空
            if(!val){
                // 1.6为空变获取为空的元素的上一个兄弟label 元素里面的文本值
                var label = $(value).prev().test();
                //拼接上文本值,不允许为空
                mui.toast(label+"不允许为空");
                //只要进入了这个判断表示为空,为空就把check改成false
                check = false;
                //只要有其中一个为空 结束 只是退出了这个循环
                return false;
            }
        })
    }) */

    $('.btn-register').on('tap', function () {
        var check = true;
        mui(".mui-input-group input").each(function () {
            //若当前input为空，则alert提醒 
            if (!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        }); //校验通过，继续执行业务逻辑 
        if (check) {
            // mui.alert('验证通过!')
            var mobile = $('.mobile').val();
            // console.log(mobile);
            
            if (!(/^1[3456789]\d{9}$/.test(mobile))) {
                mui.toast("手机号码有误，请重填");
                return false;
            }
            var username = $('.username').val();
            console.log(username);
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            if (password1 != password2) {
                mui.toast("两次输入的密码不一致");
                return false;
            }
            var vcode = $('.vcode').val();
            console.log(vcode);
            
            if (vcode != vCode) {
                mui.toast("验证码输入错误");
                return false;
            }

            //调用注册api去注册,传入这些参数
            $.ajax({
                url: '/user/register',
                type: 'post',
                data:{
                    username:username,
                    password:password1,
                    mobile:mobile,
                    vCode:vCode
                },
                success:function(data){
                    if(data.success){
                        // 我从注册去登录 我登录成功去到个人中心
                        location =  'login.html?returnUrl=user.html';;
                    }else{
                        mui.toast(data.message,{ duration:'short', type:'div' }) ;
                    }
                }
            })
        }
    })

    var vCode = '';
    $('.get-vcode').on('tap', function () {

        $.ajax({
            url: '/user/vCode',
            success: function (data) {
                console.log(data);
                // 3. 把后台返回的 验证码保存到全局变量中 要和用户输入进行判断
                vCode = data.vCode;
            }
        })
    })



})