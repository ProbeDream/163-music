{
  let view = {
    el:'#app',
    template:`
    <audio src={{url}}></audio>
    <div>
      <button class="play">播放</button>
      <button class="pause">暂停</button>
    </div> 
    `,render(data){
      $(this.el).html(this.template.replace('{{url}}',data.url));
    },play(){
      let audio=$(this.el).find('audio')[0];
      audio.play();
    },pause(){
      let audio=$(this.el).find('audio')[0];
      audio.pause();
    }
  };

  let model = {
    data:{
      id:'',
      name:'',
      singer:'',
      url:''
    },
    getSongId() {
      //查询参数的获取!
      let parameter = window.location.search;
      //如果查询参数中的?号 索引值为0的话 那么就说明?在第一位
      if (parameter.indexOf("?") === 0) {
        parameter = parameter.substring("1");
      }
      /*
      将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回。
      https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
      其实当时的filter函数中的v => v
      (v)=>{if(v){return v}}
      */
      let array = parameter.split("&").filter(v => v);
      let id = "";
      for (let index = 0; index < array.length; index++) {
        let kv = array[index].split("=");
        let key = kv[0];
        let value = kv[1];
        if (key === "id") {
          id = value;
          break;
        }
      }
     return id;
    },getObjectById(id){
      var song = new AV.Query('Song');
      //通过对应的id 拿到的是一个对象 并不是多个对象!
      return song.get(id).then((todo)=>{
       //将对应的对象拷贝到当前的data对象上面就行了! ...表示 attributes有什么属性 该对象就会有什么属性!
        Object.assign(this.data,{id:todo.id,...todo.attributes});
        return todo;
      }, function (error) {
        // 异常处理
      });
    }
  };

  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      let id=this.model.getSongId();
      //当找到对应了song对象 然后渲染template  最后通过setTimeout 3秒之后调用play方法进行播放!
      this.model.getObjectById(id).then(()=>{
        this.view.render(this.model.data);
      });
      this.bindEvents();
    },bindEvents(){
      $(this.view.el).on('click','.play',()=>{
        this.view.play();
      })
      $(this.view.el).on('click','.pause',()=>{
        this.view.pause();
      })
    }
  };
  controller.init(view, model);
}
