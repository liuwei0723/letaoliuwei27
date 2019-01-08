$(function () {

    // 初始化轮播图插件 可以实现自动轮播图





    var id = getQueryString('id');
    $.ajax({
        url: '/product/queryProductDetail',
        data: {
            id: id
        },
        success: function (data) {
            console.log(data);

            var min = +data.size.split('-')[0];
            var max = +data.size.split('-')[1];
            var size = [];
            for (var i = min; i <= max; i++) {
                size.push(i);
            }
            console.log(size);
            data.size = size;

            var html = template('datailTpl', data);
            $('#main .mui-scroll').html(html);
            // console.log(html);
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 1500 //自动轮播周期,默认为0 不自动轮播
            })

            // 初始化数字框
            mui('.mui-numbox').numbox();

            $('.btn-size').on('tap', function () {
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            })
            // 初始化区域滚动
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
        }
    })
    // 获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        // console.log(r); 
        if (r != null) return decodeURI(r[2]);
        return null;
    }


    /*2. 实现加入购物车
    2. 给加入购物车按钮添加点击事件
    3. 获取当前选择的尺码和数量
    4. 判断是否选择尺码和数量 如果没选提示用户选择
    5. 调用/cart/addCart 加入购车的APi实现加入购车 使用post 传入productId num size*/

    $('.btn-add-cart').on('tap', function () {
        var size = $('.btn-size.mui-btn-warning').data('size');
        console.log(size);
        if (!size) {
            mui.toast('请选择尺码', {
                duration: 'long',
                type: 'div'
            });
            return false;
        }
        var num = mui('.mui-numbox').numbox().getValue();

        console.log(num);
        if (!num) {
            mui.toast('请选择数量', {
                duration: 'long',
                type: 'div'
            });
            return false;
        }

        $.ajax({
            url: '/cart/addCart',
            type: 'post',
            data: {
                productId: id,
                num: num,
                size: size
            },
            success: function (data) {
                console.log(data);
                if (data.success) {
                    // 成功
                    mui.confirm('加入购物车是否去购物车查看?', '温馨提示', ['yes', 'no'], function (e) {
                        // 8. 因为e.index == 0 表示点击了左边的确定 e.index == 1表示点击了右边的取消
                        if (e.index == 0) {
                            // 9.点击了是 跳转到购物车
                            location = 'cart.html';
                        } else {
                            mui.toast('请继续添加！');
                        }
                    });
                } else {
                    location = 'login.html?returnUrl=' + location.href;
                }
            }
        })

    })
})