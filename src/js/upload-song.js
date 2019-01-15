{
  let view = {
    el: ".uploadArea",
    find(selector) {
      return $(this.el).find(selector)[0];
    },
    template: `
    <div id="uploadContainer" class="draggable">
      <div id="uploadButton" class="clickable">
        <p>点击或拖曳上传!</p>
        <p>文件大小不能超过40mb</p>
      </div>
    </div>
    `,render(data) {
      $(this.el).html(this.template);
    }
  };
  let model = {};
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render(this.model.data)
      this.initQiniu();
    },
    initQiniu() {
      var uploader = Qiniu.uploader({
        runtimes: "html5", // 上传模式,依次退化
        browse_button: this.view.find("#uploadButton"),
        uptoken_url: "http://localhost:8888/uptoken",
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的 uptoken
        domain: "pl22uq4tx.bkt.clouddn.com", // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
        max_file_size: "20mb", // 最大文件体积限制
        dragdrop: true, // 开启可拖曳上传
        drop_element: this.view.find("#uploadContainer"), // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        init: {
          FilesAdded: function(up, files) {
            plupload.each(files, function(file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          BeforeUpload: function(up, file) {
            // 每个文件上传前,处理相关的事情
          },
          UploadProgress: function(up, file) {
            // 每个文件上传时,处理相关的事情
          },
          FileUploaded: function(up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
            var domain = up.getOption("domain");
            var response = JSON.parse(info.response);
            var sourceLink =
              "http://" + domain + "/" + encodeURIComponent(response.key); //获取上传成功后的文件的Url
            //uploadStatus.textContent ="文件链接:" + sourceLink + " " + "文件名:" + response.key;
            window.eventHub.emit("upload", {
              url: sourceLink,
              name: response.key
            });
          },
          Error: function(up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          UploadComplete: function() {
            //队列文件处理完毕后,处理相关的事情
          }
        }
      });
    }
  };
  controller.init(view, model);
}
