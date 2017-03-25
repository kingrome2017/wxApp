//index.js
Page({
  onTap: function (event) {
    //从父级跳到子级页面 他会执行onHide
    // wx.navigateTo({
    //   url: "/pages/posts/post"
    // })
    //下面的跳转不存在子父级 他会执行onUnload
    wx.switchTab({
      url: '../posts/post'
    })
  },
  // onText:function(){
  //   console.log('1212')
  // }

  //catchtap  能阻止冒泡事件
})
