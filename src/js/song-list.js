{
  let view = {
    el: "#songList-container",
    template: `
        <ul class="songList"></ul>
        `,
    render(data) {
      let $el = $(this.el);
      $el.html(this.template);
      let { songs } = data;
      // let liList = songs.map((song) => $("<li></li>").text(song.name));
      let liList = songs.map(song => $("<li></li>").text(song.name).attr('data-song-id',song.id));
      $el.find("ul").empty();
      liList.map(domLi => {
        $el.find("ul").append(domLi);
      });
      //$(this.el).html(this.template);
    },activeItem(li){
      let $li=$(li)
        $li.addClass('active')
        .siblings('.active')
        .removeClass('active');
    },clearActive() {
      $(this.el)
        .find(".active")
        .removeClass("active");
    }
  };

  let model = {
    data: {
      songs: []
    },find() {
      var query = new AV.Query("Song");
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return { id: song.id, ...song.attributes };
        });
        return songs;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      //里面初始化方法 使用view的render函数 进行对model的数据进行渲染操作!
      this.view.render(this.model.data);
      this.bindEvents();
      this.getAllSongs();
      this.bindEventsHub();
    },getAllSongs(){
     return this.model.find().then(() => {
        this.view.render(this.model.data);
      });
    },bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
      /*
      如果点击了其中的某一个li标签的话 就会调用一个方法
      在当前的标签上面加上active 把对应的兄弟的active删除掉!
      */
      this.view.activeItem(e.currentTarget);
      let songId=e.currentTarget.getAttribute('data-song-id');
      let songs=this.model.data.songs;
      let data;
      for(let i=0;i<songs.length;i++){
      //如果对应的songs的第i个的id等与当前的songId 那么就找到了当前的song对象!
        if (songs[i].id === songId) {
          data=songs[i];
          break;
        }
      }
      /*
      将一个javaScript对象转换成为一个字符串! let copy=JSON.stringify(data);
      用来解析JSON字符串,构造有字符串描述的JavaScript值或对象!
      是从新的内存里面开辟出来的 因此不会改变原有的data!
      JSON.parse(字符串/JSON.stringify({}))
      */
      window.eventHub.emit('select',JSON.parse(JSON.stringify(data)));
      })
    },bindEventsHub(){
      //订阅
      window.eventHub.on("create", songData => {
        this.model.data.songs.push(songData);
        this.view.render(this.model.data);
      });
      //订阅
      window.eventHub.on('new',()=>{
        this.view.clearActive();
      });
      window.eventHub.on('update',(song)=>{ 
        let songs=this.model.data.songs;
        for(let i=0;i<songs.length;i++){
          if (songs[i].id===song.id) {
          Object.assign(songs[i],song); 
          }
        }
        this.view.render(this.model.data);
      })
    }
  };
  controller.init(view, model);
}
