// pages/post-details/post-detail.js
var postsData = require('../../data/post-data.js')
var app = getApp();
Page({
  data: {
    isPlayingMusic: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var postId = options.id;
    console.log(postId)
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData,
    });
    var postsCollected = wx.getStorageSync('posts_Collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected,
      })
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected)
    }
    //判断全局变量的状态
    if (app.globalData.g_isPlayingMusic&&app.globalData.g_currentMusicPostId===postId) {
      this.setData({
        isPlayingMusic:true,
      })
    }
    //调用方法
    this.setMusicMonitor();
  },
  //监听音乐播放方法
  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true,
      })
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId=that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function(){
      that.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId=null;
    });
    //监听音乐停止
    wx.onBackgroundAudioStop(function() {
      this.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId = null;
    })
  },
  onCollectiontap: function (event) {
    this.getPostsCollectedSyc();
    //this.getPostscollectedAyc();
  },
  //异步缓存 下面的逻辑层都要用到
  getPostscollectedAyc: function () {
    var that = this;
    wx.getStorage({
      key: 'posts_Collected',
      success: function (res) {
        // success
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        //收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId]=postCollected;
        that.showToast(postsCollected, postCollected);
      },
    })
  },
  //同步缓存
  getPostsCollectedSyc: function () {
    var that = this;
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[that.data.currentPostId];
    //收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    //更新变量 
    postsCollected[that.data.currentPostId] = postCollected;
    that.showToast(postsCollected, postCollected);
  },
  //提示框框API
  showToast: function (postsCollected, postCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_Collected', postsCollected);
    //更新数据绑定变量，从而切换图片
    this.setData({
      collected: postCollected,
    });
    //交互提示
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success",
    })
  },
  onsharetap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel 用户是不是点击了取消按钮
        //res.tapIndex 点击的下标
        wx.showModal({
          title: "用户分享到了" + itemList[res.tapIndex],
          content: "是否取消" + res.cancel + "现在还无法实现分享功能"
        })
      }
    })
  },

  //播放音乐
  onMusicPlay:function(){
    //play
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postList[currentPostId];
    if(isPlayingMusic){
       //pause
      wx.pauseBackgroundAudio({
        success: function(res){
          // success
        },
      });
      this.data.isPlayingMusic=false;
    }
    else{
        wx.playBackgroundAudio({
        dataUrl:postData.music.url,
        title:postData.music.title,
        coverImgUrl:postData.music.coverImgUrl,
        success: function(res){
          // success
        },
      })
      this.data.isPlayingMusic=true;
    }
  },
})