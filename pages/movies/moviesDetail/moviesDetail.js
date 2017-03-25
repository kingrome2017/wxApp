//var util = require('../../utils/utils.js');
import { Movie } from 'class/movie.js';
var app = getApp();
Page({
  data:{
    movie:{}
  },
  onLoad:function(options){
    var movieId = options.id;
    var url = app.globalData.doubanBase+"/v2/movie/subject/"+movieId;
    var movie = new Movie(url);
    movie.getMovieData((movie) => {
      this.setData({
        movie:movie
      })
    })
    // movie.getMovieData(function(movie){
    //   that.setData({
    //     movie:movie
    //   })
    // })
    //util.http(url,this.processDoubanData)
  },

  // processDoubanData:function(data){
  //   console.log(data);
  //   //数据很多，避免数据为空
  //   var director={
  //     avatar:'',
  //     name:'',
  //     id:''
  //   }
  //   if(data.directors[0]!=null){
  //     if(data.directors[0].avatars!=null){
  //       director.avatar=data.directors[0].avatars.large
  //     }
  //     director.name = data.directors[0].name;
  //     director.id = data.directors[0].id
  //   }
  //   var movie = {
  //     movieImg:data.images?data.images.large:'',
  //     country:data.countries[0],
  //     title:data.title,
  //     originalTitle:data.original_title,
  //     wishCount:data.wish_count,
  //     commentCount:data.comments_count,
  //     year:data.year,
  //     generes:data.genres.join('、'),
  //     stars:util.convertToStarsArray(data.rating.stars),
  //     score:data.rating.average,
  //     director:director,
  //     casts:util.convertToCastString(data.casts),
  //     castsInfo:util.convertToCastInfos(data.casts),
  //     summary:data.summary
  //   }
  //   console.log(movie);
  //   this.setData({
  //     movie:movie
  //   })
  // },

  viewMoviePostImg:function(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, 
      urls: [src]
    })
  }
})