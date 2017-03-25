// pages/movies/movies.js
var utils = require('../utils/utils.js')
var app = getApp();
Page({
  //RESTFul API JSON
  //SOAP XML
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    searchResult:{},
    containerShow:true,
    searchBox:false
  },
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSonnUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?strat=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSonnUrl,"comingSoon" ,"即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣top250");
  },


  onMoretap:function(event){
    var cate = event.currentTarget.dataset.cate;
      wx.navigateTo({
        url: 'movie-more/movie-more?cate='+cate,
      })
  },

  getMovieListData: function (url ,settedkey,cateTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/xml"
      }, // 设置请求的 header
      success: function (res) {
        // success
        //console.log(res)
        that.processDoubanData(res.data,settedkey ,cateTitle);
      },
      fail: function (error) {
        // fail
        console.log(error);
      },
    })
  },

  processDoubanData: function (moviesDouban,settedkey,cateTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      };
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars:utils.convertToStarsArray(subject.rating.stars)
      };
      movies.push(temp);
    };
    //数据动态绑定
    var readyData = {};
    readyData[settedkey] = {
      movies:movies,
      cateTitle:cateTitle
    }
    this.setData(readyData);
  },
  //搜索框
  onSearch:function(){
    this.setData({
      containerShow:false,
      searchBox:true
    })
  },

  onclose:function(){
    this.setData({
      containerShow:true,
      searchBox:false,
      searchResult:{}
    })
  },

  onbindchange:function(e){
    var value = e.detail.value;
    var searchUrl = app.globalData.doubanBase+"/v2/movie/search?q="+value;
    this.getMovieListData(searchUrl,'searchResult','')
  },

  onMovieDetail:function(event){
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'moviesDetail/moviesDetail?id='+movieId
    })
  }
})