var postsData = require('../../data/post-data.js')//只能用相对路径

Page({
    data: {

    },
    imgPath: "/images/...",
    process: function () {
        var date = "Nov 21 2016";
        var date_ele = document.getElementById('id');
    },
    onLoad: function (options) {
        //页面初始化 options 为页面跳转带来的参数
        this.setData({
            posts_key:postsData.postList
        });
        // this.data.postList = postsData.postList 用法失效
    },
    onPostTap:function(event){
        var postId = event.currentTarget.dataset.postid;
        //console.log(postId);
        wx.navigateTo({
          url: '../post-details/post-detail?id='+postId
        })
    },
    //轮播图跳转方法
    onSwiperTap:function(event){
        var postId = event.target.dataset.postid;
        wx.navigateTo({
          url:'../post-details/post-detail?id='+postId
        })
    },
})