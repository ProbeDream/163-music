{
  let view = {
    el: "#siteLoading",
    show() {
      $(this.el).addClass("active");
    },
    hidden() {
      $(this.el).removeClass("active");
    }
  };

  let controller = {
    init(view) {
      this.view = view;
      this.bindEventHub();
    },
    bindEventHub() {
      window.eventHub.on("beforeUpload", () => {
        this.view.show();
      });
      window.eventHub.on("afterUpload", () => {
        this.view.hidden();
      });
    }
  };
  controller.init(view);
}
