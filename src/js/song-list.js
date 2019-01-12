{
  let view = {
    el: "#songList-container",
    template: `
        <ul class="songList"></ul>
        `,
    render(data) {
      let $el=$(this.el);
      $el.html(this.template);  
      let {songs} = data;
      // let liList = songs.map((song) => $("<li></li>").text(song.name));
      let liList = songs.map((song) => 
      $("<li></li>").text(song.name));
      $el.find("ul").empty();
      liList.map((domLi) => {
        $el.find("ul").append(domLi);
      });
      //$(this.el).html(this.template);
    },
    clearActive() {
      $(this.el).find(".active").removeClass("active");
    }
  };

  let model = {
    data: {
      songs: []
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      //里面初始化方法 使用view的render函数 进行对model的数据进行渲染操作!
      this.view.render(this.model.data);
      window.eventHub.on("upload", () => {
        this.view.clearActive();
      });
      //订阅
      window.eventHub.on("create", (songData) => {
        this.model.data.songs.push(songData);
        this.view.render(this.model.data);
      });
    }
  };
  controller.init(view, model);
}
