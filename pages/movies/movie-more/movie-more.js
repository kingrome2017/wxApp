// pages/movies/movie-more/movie-more.js
var util = require('../../utils/utils.js');
var app = getApp();
Page({
  data: {
    navgateTitle: "",
    movies:{},
    requestUrl:'',
    tocalCount:0,
    isEmpty:true,
    movieId:''
  },
  onLoad: function (options) {
    var cates = options.cate;
    this.data.navgateTitle = cates;
    var dataUrl = "";
    switch (cates) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/top250"
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },
  onReady: function (event) { 
    //动态设置导航栏标题 
    wx.setNavigationBarTitle({
      title: this.data.navgateTitle,
    })
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }

      var temp = {
        stars:util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        moveId:subject.id
      }
      this.setData({
        movieId:temp.moveId
      })
      movies.push(temp);
    }
    var totalMovies = {}
    //如果要绑定新数据，需要和旧数据绑定在一起
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies)
    }
    else{
      totalMovies = movies;
      this.setData({
        isEmpty:false
      })
    }
    this.setData({
      movies:totalMovies
    });
    this.data.tocalCount+=20
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onscrollLower:function(event){
    var nextUrl = this.data.requestUrl+"?start="+this.data.tocalCount+"&count=20";
    util.http(nextUrl,this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh:function(e){
    var refreshUrl = this.data.requestUrl+"?start=0&count=20";
    this.data.movies ={};
    this.data.isEmpty = true;
    this.data.tocalCount = 0
    util.http(refreshUrl,this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  onMovieDetail:function(event){
    //var movieId = event.currentTarget.dataset.movieid;
    var id = this.data.movieId
    wx.navigateTo({
      url: '../moviesDetail/moviesDetail?id=' + id
    })
  }
})