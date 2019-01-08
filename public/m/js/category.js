$(function () {



    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 1.使用zepto的$.ajax发送请求
    $.ajax({
        // type:'get',//可以省略
        url: '/category/queryTopCategory',
        success: function (data) {
            console.log(data);
            // 2.调用模板引擎函数,传入模板
            var html = template('categoryLeftTpl', data);
            $('.category-left ul').html(html);
        }
    })
    ajax1(1);
    // 事件委托添加事件
    // 拿到当前点击li的id
    //1.使用事件委托添加事件 使用tap 解决click延迟
    $('.category-left ul').on('tap', 'li a', function () {
        // console.log(this.dataset['id']); //拿了之后会做类型转换
        // console.log($(this).data('id')); //拿了之后不会做类型转换
        var id = $(this).data('id');
        $(this).parent().addClass('active').siblings('li').removeClass('active');
        ajax1(id);
    })


    function ajax1(id) {
        $.ajax({
            // type:'get',//可以省略
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                // 2.调用模板引擎函数,传入模板
                var html = template('categoryRightTpl', data);
                $('.category-right .mui-row').html(html);
            }
        })
    }
})