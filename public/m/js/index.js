$(function () {

    // 初始化轮播图插件 可以实现自动轮播图
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 1000 //自动轮播周期,默认为0 不自动轮播
    })

    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
})