{
  let view = {
    el: "#app",
    init() {
      this.$el = $(this.el);
    },
    render(data) {
      let { song, status } = data;
      this.$el.css("background-image", `url(${song.cover})`);
      this.$el.find("img.cover").attr("src", song.cover);
      // 每次都是重新渲染 audio标签 如果说对应的src里面的内容不是 song.url的话那么就渲染 否则不渲染!
      if (this.$el.find("audio").attr("src") !== song.url) {
        let audio = this.$el.find("audio").attr("src", song.url).get(0);
        audio.onended = () => {
          window.eventHub.emit("songEnd");
        };
        audio.ontimeupdate = () => {
          this.showLyric(audio.currentTime);
        };
      }
      if (status === "playing") {
        this.$el.find(".disc-container").addClass("playing");
      } else {
        this.$el.find(".disc-container").removeClass("playing");
      }
      this.$el.find("div.song-description > h1").text(song.name);
      let { lyric } = song;
      lyric.split("\n").map(string => {
        let p = document.createElement("p");
        let regex = /\[([\d:.]+)\](.+)/;
        let matches = string.match(regex);
        if (matches) {
          p.textContent = matches[2];
          /*
      time为匹配后的第二部分! 通过split进行分割之后
      按照十进制的方式解析当前的时间为数字 然后将分钟转化成为秒钟!
      */
          let time = matches[1];
          let parts = time.split(":");
          let minutes = parts[0];
          let seconds = parts[1];
          let newTime = parseFloat(minutes, 10) * 60 + parseFloat(seconds, 10);
          p.setAttribute("data-time", newTime);
        } else {
          p.textContent = string;
        }
        this.$el.find(".lyric > .lines").append(p);
      });
    },
    play() {
      this.$el.find("audio")[0].play();
    },
    pause() {
      this.$el.find("audio")[0].pause();
    },showLyric(Time) {
      //拿到所有的p标签 然后便利整个p标签 伪数组!
      let allP = this.$el.find(".lyric>.lines>p");
      let p;
      for (let i = 0; i < allP.length; i++) {
        if (i === (allP.length - 1)) {
          p=allP[i];
          break;
        } else {
          let currentTime = allP.eq(i).attr("data-time");
          let nextTime = allP.eq(i + 1).attr("data-time");
          if (currentTime <= Time && Time <= nextTime) {
              p=allP[i]; break; 
          }
        }
      }
      let pHeight=p.getBoundingClientRect().top; 
             let lineHeight=this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top;
             let height=pHeight-lineHeight;
             this.$el.find('.lyric>.lines').css({
               transform:'translateY(${-(height-25)}px)'
      }) 
      $(p).addClass('active').siblings('.active').removeClass('active');
    }
  };

  let model = {
    data: {
      song: {
        id: "",
        name: "",
        singer: "",
        url: ""
      },
      status: "pause"
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
    },
    getObjectById(id) {
      var song = new AV.Query("Song");
      //通过对应的id 拿到的是一个对象 并不是多个对象!
      return song.get(id).then(
        todo => {
          //将对应的对象拷贝到当前的data对象上面就行了! ...表示 attributes有什么属性 该对象就会有什么属性!
          Object.assign(this.data.song, { id: todo.id, ...todo.attributes });
          return todo;
        },
        function(error) {
          // 异常处理
        }
      );
    }
  };

  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      let id = this.model.getSongId();
      //当找到对应了song对象 然后渲染template  最后通过setTimeout 3秒之后调用play方法进行播放!
      this.model.getObjectById(id).then(() => {
        this.view.render(this.model.data);
      });
      this.bindEvents();
    },
    bindEvents() {
      $(this.view.el).on("click", ".icon-play", () => {
        this.model.data.status = "playing";
        this.view.render(this.model.data);
        this.view.play();
      });
      $(this.view.el).on("click", ".icon-pause", () => {
        this.model.data.status = "paused";
        this.view.render(this.model.data);
        this.view.pause();
      });
      //订阅者对订阅的消息进行处理操作!看到了发布者的歌曲结束操作然后对其进行歌曲操作!
      window.eventHub.on("songEnd", () => {
        this.model.data.status = "paused";
        this.view.render(this.model.data);
      });
    }
  };
  controller.init(view, model);
}
