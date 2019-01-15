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
      let liList = songs.map(song => $("<li></li>").text(song.name));
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
    },
    find() {
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
      })
    },bindEventsHub(){
      window.eventHub.on("upload", () => {
        this.view.clearActive();
      });  
      //订阅
      window.eventHub.on("create", songData => {
        this.model.data.songs.push(songData);
        this.view.render(this.model.data);
      });

    }
  };
  controller.init(view, model);
}
