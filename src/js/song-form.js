{
  let view = {
    el: ".page > main",
    init() {
      this.$el = $(this.el);
    },
    template: `
        <h1>新建歌曲</h1>
        <form class="form">
          <div class="row">
            <label> 歌曲  </label>
            <input name="name" type="text" value="___name___"/>
          </div>
          <div class="row">
            <label> 歌手  </label>
            <input name="singer" type="text" value="___singer___" />
          </div>
          <div class="row">
            <label> 外链  </label>
            <input name="url" type="text" value="___url___"/>
          </div>
          <div class="row actions">
            <button type="submit">保存</button>
          </div>
        </form>   
        `,
    //如果用户没有传输data的话 那么对应的data的值为空!
    render(data = {}) {
      let placeholders = ["name", "url", "singer", "id"];
      let html = this.template;
      placeholders.map((string) => {
        html = html.replace(`___${string}___`, data[string] || "");
      });
      $(this.el).html(html);
    },reset() {
      //将当前的对象渲染 并且渲染的数据为空!
      this.render({});
    }
  };

  let model = {
    data: { name: "", singer: "", url: "", id: "" },
    create(data) {
      // 声明类型
      var Song = AV.Object.extend("Song");
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set("name", data.name);
      song.set("singer", data.singer);
      song.set("url", data.url);
      // 设置优先级
      return song.save().then((newSong) => {
          let { id, attributes } = newSong;
          Object.assign(this.data,{id, ...attributes});
        },(error) => {
          console.error(error);
        });
    }
  };

  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.view.render(this.model.data);
      this.bindEvents();
      //订阅
      window.eventHub.on("upload", (data) => {
        this.model.data=data;
        this.view.render(this.model.data);
      });
      window.eventHub.on('select',(data)=>{
        //如果用户点击一首歌曲 应该把对应歌曲的信息渲染到对应的歌曲表单当中!
        this.model.data=data;
        //使用view的render函数对其对应的数据进行渲染操作!
        this.view.render(this.model.data);
      })
    },
    bindEvents() {
      //如果说当submit提交的时候 就会阻止默认事件
      /*.on( events [, selector ] [, data ], handler(eventObject) )*/
      this.view.$el.on("submit", "form", (e) => {
        e.preventDefault();
        let needs = 'name singer url'.split(' ')
        let data = {};
        needs.map((string) => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val();
        });
        //调用mode模块的create方法 传入对象的数据data
        this.model.create(data).then(() => {
          //如果创建成功 则会对当前的form表 进行数据清空 并且将对应的data数据 进行JSON转换!并且解析成新的对象!
          this.view.reset();
          let string=JSON.stringify(this.model.data);
          let object=JSON.parse(string);
          //发布 将调用create方法 传入的数据为当前的object!
          window.eventHub.emit("create", object);
        });
      });
    }
  };
  controller.init(view, model);
}
