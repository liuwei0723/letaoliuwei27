$(function () {
    /*1. 发送ajax请求购物车商品的数据APi
        	2. 创建购物车商品列表的模板
            3. 调用模板 渲染页面*/
    queryCart();


    /*2. 实现购物车列表下拉刷新 和 上拉加载更多
    	1. 先写结构  和 区域滚动一致 有一个父容器 子容器
    	2. 初始化下拉刷新 和 上拉加载更多
    	3. 下拉刷新的回调函数 发送请求 刷新页面   结束下拉刷新  重置page 和 重置上拉加载效果
        4. 在上拉加载回调函数 发送请求下一页数据 追加页面  结束上拉加载*/

    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                callback: pulldownCallback
            },
            up: {
                contentrefresh: "哥正在拼命加载中...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '我是有底线的', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: pullupCallback
            }
        }
    });
    //下拉刷新的回调函数
    function pulldownCallback(params) {

        // 1. 为了模拟延迟写一个定时器
        setTimeout(function () {
            // 下拉刷新之前 要重新请求第一页 要把page重置为1
            page = 1;
            // 2. 请求数据
            queryCart();
            // 3. 结束下拉刷新  注意官方结束代码有问题 改成 endPulldownToRefresh
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 4. 结束了下拉刷新后 要重置上拉加载的效果
            mui('#refreshContainer').pullRefresh().refresh(true);
        }, 1500);

    }
    var page = 1;
    //上拉刷新的回调函数
    function pullupCallback(params) {
        setTimeout(function () {
            page++;
            // 2. 请求数据
            $.ajax({
                url: '/cart/queryCartPaging',
                data: {
                    page: page,
                    pageSize: 4
                },
                success: function (data) {
                    console.log(data);

                    // 因为data数据后台返回有点问题 当没有数据 后台直接返回空数组 而不是对象 
                    // 如果是空数组传入到模板使用里面的data会报错
                    // if (Array.isArray(data)) {
                    //     // 判断如果是一个空数组 赋值给一个对象 里面有data数组值为空
                    //     data = {
                    //         data: []
                    //     };
                    //     // 如果已经是空数组了 表示没有数据了 
                    //     // 3. 结束上拉加载 注意官方结束代码有问题 改成 endPullupToRefresh
                    //     mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    //     // 并且return 后面代码不执行
                    //     return false;
                    // }
                    if (data instanceof Array) {
                        data = {
                            data: data
                        };
                    }
                    if (data.data.length > 0) {

                        var html = template('cartTpl', data);
                        $('.cart-list').append(html);
                        // 3. 结束上拉加载 注意官方结束代码有问题 改成 endPullupToRefresh
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                    } else {
                        // 3. 结束上拉加载 注意官方结束代码有问题 改成 endPullupToRefresh
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    }
                    getSum();
                    
                }
            })
            // 3. 结束上拉加载 注意官方结束代码有问题 改成 endPullupToRefresh
            mui('#refreshContainer').pullRefresh().endPullupToRefresh();
        }, 1500);
    }

    /*3. 商品的删除
    	1. 当前删除按钮点击时候弹出确认框
    	2. 如果点击确定 删除
    		获取当前要删除的商品id
    		调用删除的API删除商品
    		删完成重新刷新页面
        3. 点击取消 不删 什么都不干*/
    $('.cart-list').on('tap', '.btn-delete', function () {
        // 1. 获取当前要滑动回去的li 只能使用dom元素 不能是zpeto对象
        var li = this.parentNode.parentNode;
        var id = $(this).data('id');
        var btnArray = ['确定', '取消']
        mui.confirm('您确定要删除商品吗?', '温馨提示', btnArray, function (e) {
            // 3. 判断用户点击了确定 去删除
            console.log(e);
            if (e.index == 0) {

                // 5. 调用删除的API删除商品
                $.ajax({
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    success: function (data) {
                        // 6. 如果删除成功就刷新页面
                        if (data.success) {
                            // 7. 重置为第一页
                            // page = 1;
                            // 8. 请求第一页商品刷新页面
                            $.ajax({
                                url: '/cart/deleteCart', //请求带分页的API
                                data: {
                                    id: id
                                },
                                success: function (data) {
                                    console.log(data);
                                    // 因为data数据后台返回有点问题 当没有数据 后台直接返回空数组 而不是对象 
                                    // 如果是空数组传入到模板使用里面的data会报错
                                    if (data.success) {
                                        queryCart();
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                //点击了取消 把当前列表滑动回去
                setTimeout(function () {
                    // 2. 调用官方的滑动关闭函数
                    mui.swipeoutClose(li);
                }, 0)

            }
        })

    })


    /*4. 商品的编辑
    	1. 点击编辑按钮弹出一个确认框
    		1. 但是确认框里面的放的不仅是文字 还有代码 尺码按钮  数字框
    		2. 让编辑栏的尺码 和 数量支持点击
    	2. 点击确定了 获取当前选中新的尺码和数量
    	3. 调用编辑的API传入新的尺码和数量去编辑商品
    	4. 编辑成功 重刷新页面
        5. 如果点击了取消 滑动列表回去*/
    $('.cart-list').on('tap', '.btn-edit', function () {
        var li = this.parentNode.parentNode;
        var value = $(this).data('value');
        console.log(value);
        
        var min = +value.productSize.split('-')[0];
        var max = +value.productSize.split('-')[1];
        var size = [];
        for (var i = min; i <= max; i++) {
            size.push(i);
        }
        console.log(size);
        
        value.productSize = size;
        var html = template('editCartTpl', value);
        // console.log(html);
        // 9. 把html字符串的回车换行去掉 \r 回车 \n 换行 都替换成空
        html = html.replace(/[\r\n]/g, '');
        var btnArray = ['确定', '取消']
        mui.confirm(html, '温馨提示', btnArray, function (e) {
            if (e.index == 0) {
                var size = $('.btn-size.mui-btn-warning').data('size');
                console.log(size);

                var num = mui('.mui-numbox').numbox().getValue();
                $.ajax({
                    url: '/cart/updateCart',
                    type: 'post',
                    data: {
                        id: value.id,
                        size: size,
                        num: num
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.success) {
                            queryCart()
                        }
                    }
                })
            } else {
                //点击了取消 把当前列表滑动回去
                setTimeout(function () {
                    // 2. 调用官方的滑动关闭函数
                    mui.swipeoutClose(li);
                }, 0)

            }
        })
        //初始化
        // 初始化数字框
        mui('.mui-numbox').numbox();

        $('.btn-size').on('tap', function () {
            $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
        })

    })

    /* 5. 实现计算总金额
         	1. 获取当前所有选中的复选框  (添加一个change事件 当复选框选择发生变化时时获取)
         	2. 遍历所有选中的复选框  计算每一个复选框的商品价格和数量 为商品单价
         	3. 定义一个和把所有商品单价累加就是总金额
         	4. 把总金额渲染到页面*/
    // 1. 给所有复选框添加一个change事件 当复选框的值发生改变才获取
    $('.cart-list').on('change', '.choose', function () {
        getSum();
    })

    function getSum() {
        // console.log(this);
        // 2. 获取所有选中的复选框
        var checks = $('.choose:checked');
        // console.log(checks);
        // 所有商品的总价
        var sum = 0;
        checks.each(function (index, value) {
            var price = $(value).data('price');
            var num = $(value).data('num');
            sum += (price * num);
        })
        sum = sum.toFixed(2);
        $('.order-total span').html(sum)
    }

    // 公共的请求函数
    function queryCart() {
        /*1. 发送ajax请求购物车商品的数据APi
        	2. 创建购物车商品列表的模板
            3. 调用模板 渲染页面*/
        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (data) {
                console.log(data);
                if (data instanceof Array) {
                    data = {
                        data: data
                    };
                }
                var html = template('cartTpl', data);
                $('.cart-list').html(html);
                getSum();
            }
        })
    }



})