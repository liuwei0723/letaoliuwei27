$(function () {

    //1.给搜索按钮添加点击事件
    $('.btn-search').on('tap', function () {
        // console.log(this);
        //2.获取当前输入框输入的内容 可能会有首尾空格这种是不合法的输入,把空格去掉 .trim方法
        var search = $('.input-search').val().trim();

        // 3.进行非空判断 提示用户输入
        if (search == '') {
            // 弹出框,不太友好
            // mui.alert('你不输入在下不给看', '温馨提示', function () {

            // });
            mui.toast('你不搜索在下不给!', {
                duration: 'long',
                type: 'div'
            })
            return;
        }
        /* 4.把数据存储加到一个数组中
            1.因为可能不是第一次添加 之前就已经有值在之前的值的基础上再添加
            2.先获取之前的数组 获取之前的键historyData1里面的数组 */
        var arr = localStorage.getItem('historyData1');
        //5.对数组字符串进行一个转换转成一个js数组,但是又有可能是第一次加,之前数组不存在,没有数组转不了就使用空数组
        arr = JSON.parse(arr) || [];
        //6.数组去重,数组中已经有了这个值,先把这个值删掉,再去添加这个值
        //判断当前值在数组中存在,因为存在返回当前值 的索引 不会是-1
        if (arr.indexOf(search) != -1) {
            //7.去数组中删除掉这个值 splice 是数组的删除一个值的函数,第一个参数的是要删除的索引 ,第二个参数是删除几个
            arr.splice(arr.indexOf(search), 1);
        }

        //8.去除了重复之后,在把当前值加到数组的前面unshift函数把一个值往数组的前面添加
        arr.unshift(search);
        //9. 数组加完之后把数组存储到本地存储中,先转出字符串再存储到本地存储中
        arr = JSON.stringify(arr);
        // console.log(arr);
        localStorage.setItem('historyData1', arr);
        // 10.输入完成清空文本框 把输入value值设置为空
        $('.input-search').val('');
        // 11.添加完成后重新查询一下,显示最新添加的记录
        queryHistory();
        // location = 'productlist.html?key='+search+'&time='+ new Date().getTime();
        var params = 'key=' + search + '&time=' + new Date().getTime();
        location = 'productlist.html? ' + escape(params);
    })
    queryHistory();

    function queryHistory() {
        // 获取本地存储的值
        var arr = localStorage.getItem('historyData1');

        arr = JSON.parse(arr) || [];

        // 把arr作为一个值 包装,对象的rows数组上
        // 是对象就不用包本身要求就是对象满足了,是数组就要包,数组不满足要求 需要对象
        var html = template('searchHistoryTpl', {
            rows: arr
        });
        // console.log(html);

        $('.search-history ul').html(html);
    }


    $('.mui-table-view').on('tap', 'li span', function () {
        var index = $(this).data('index');
        console.log(index);


        var arr = JSON.parse(localStorage.getItem('historyData1') || '[]') || [];
        console.log(arr);
        // console.log(arr.splice(index, 1));
        // 去数组中删除掉这个值 splice 是数组的删除一个值的函数,第一个参数的是要删除的索引 ,第二个参数是删除几个
        arr.splice(index, 1);
        // console.log(arr);
        // console.log(JSON.stringify(arr));
        localStorage.setItem('historyData1', JSON.stringify(arr));

        queryHistory();
    })

    $('.fa-trash-o').on('tap', function () {
        // localStorage.clear();

        localStorage.removeItem('historyData1')
        // $('.search-history ul').html();
        queryHistory();
    })


    /* 1. 实现点击某个搜索的连接跳转到商品列表搜索
        1. 给所有li添加tap事件
        2. 获取当前点击li的 data-value的值 搜索的关键字
        3. 拼接url参数跳转页面即可 */
    $('.search-history .mui-table-view').on('tap', 'li', function () {
        // 获取li身上的搜索关键字
        var search = $(this).data('value');
        console.log(search);
        // 拼接url跳转到商品列表并传参过去
        location = 'productlist.html?key=' + search + '&time=' + new Date().getTime();

    });

})