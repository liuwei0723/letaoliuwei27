$(function () {
    // 获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        // console.log(r); 
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    // function getQueryString(name) {
    //     var str = location.search;

    //     str = str.substr(1);
    //     // console.log(str);
    //     str = unescape(str);
    //     // str = decodeURI(str);
    //     // console.log(str);
    //     var arr = str.split('&');

    //     for (var i = 0; i < arr.length; i++) {
    //         var arr2 = arr[i].split('=');
    //         // console.log(arr2[0]);

    //         // 判断当前参数数组中的第一个
    //         if (arr2[0] == name) {
    //             return arr2[1];
    //         }
    //     }
    // }
    var obj = {
        proName: '',
        page: 1,
        pageSize: 2
    }
    obj.proName = getQueryString('key');
    console.log(obj.proName);
    queryProduct();

    function queryProduct() {

        $.ajax({
            url: "/product/queryProduct",
            data: {
                proName: obj.proName,
                page: 1,
                pageSize: 2
            },
            dataType: "json",
            success: function (data) {
                // console.log(data);
                var html = template('productlistTpl', data);
                $('.mui-card-content .mui-row').html(html);
            }
        });
    }

    $('.productlist .mui-card-header a').on('tap', function () {

        var sortType = $(this).data('type');
        // console.log(sortType);
        var sort = $(this).data('sort');
        // console.log(sort);

        sort = sort == 1 ? 2 : 1;
        $(this).data('sort', sort);
        console.log(sort);

        // if(sortType=='price'){
        //     obj.price = sort;
        // }else if (sortType=='num'){
        //     obj.num = sort;
        // }
        obj = {
            proName: obj.proName,
            page: 1,
            pageSize: 2
        }

        obj[sortType] = sort; //如果sortType变量的值是price obj['price'] = 1
        console.log(obj);
        $.ajax({
            url: "/product/queryProduct",
            data: obj,
            dataType: "json",
            success: function (data) {
                // console.log(data);
                var html = template('productlistTpl', data);
                $('.mui-card-content .mui-row').html(html);
            }
        });

        $(this).addClass('active').siblings().removeClass('active');
        if (sort == 1) {
            $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
        } else {
            $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        // 4. 下拉刷新完成后去重置上拉加载效果
        mui('#refreshContainer').pullRefresh().refresh(true);
        // 5. 除了重置上拉加载的效果 还要把page也重置为第一页 一定要重置page不然下一次请求到了很大page
        page = 1;
    })

    $('.btn-search').on('tap', function () {
        obj.proName = $('.input-search').val().trim();

        if (obj.proName == '') {
            // 弹出框,不太友好
            // mui.alert('你不输入在下不给看', '温馨提示', function () {

            // });
            mui.toast('你不搜索在下不给!', {
                duration: 'long',
                type: 'div'
            })
            return;
        }
        queryProduct();
        // 4. 下拉刷新完成后去重置上拉加载效果
        mui('#refreshContainer').pullRefresh().refresh(true);
        // 5. 除了重置上拉加载的效果 还要把page也重置为第一页 一定要重置page不然下一次请求到了很大page
        page = 1;
    })

    var page = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {

                callback: function () {
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    setTimeout(() => {
                        queryProduct();
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 4. 下拉刷新完成后去重置上拉加载效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        page = 1;
                    }, 2000);
                }
            },
            up: {
                contentrefresh: "哥正在拼命加载中...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '我是有底线的', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    setTimeout(function () {
                        page++;
                        $.ajax({
                            url: "/product/queryProduct",
                            data: {
                                proName: obj.proName,
                                page: page,
                                pageSize: 2
                            },
                            success: function (data) {
                                console.log(data);
                                if (data.data.length > 0) {
                                    var html = template('productlistTpl', data);
                                    $('.product-list .mui-card-content .mui-row').append(html);
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                } else {
                                    // 没有数据了 结束上拉加载 并且提示没有更多数据了
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        });
                    }, 1500); //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        }

    });


    // 点击立即购买跳转到商品详情页面
    $('.product-list').on('tap','.btn-buy',function(){
        var id = $(this).data('id');
        console.log(id);
        location = 'detail.html?id='+id;
    })

    
    // 获取url参数值的函数
    // function getQueryString(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //     var r = window.location.search.substr(1).match(reg);
    //     // console.log(r); 
    //     if (r != null) return decodeURI(r[2]);
    //     return null;
    // }
})