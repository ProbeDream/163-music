{
  let view={
      el:'.newSong',
      template:`
        新建歌曲
      `,
      render(data){
          //通过操作对应的 el 表达式 然后对其对应的内容渲染!
        $(this.el).html(this.template);
      }
  }  
  let model={}
  let controller={
      init(view,model){
          this.view=view;
          this.model=model;
          this.view.render(this.model.data);
          //在默认的时候就激活 当前的item!
          this.active();
          window.eventHub.on('upload',(data)=>{
            this.active();  
        });
        window.eventHub.on('select',(data)=>{
            this.deactive();
        })
        $(this.view.el).on('click',this.active.bind(this));
      },active(){
          $(this.view.el).addClass('active');
          window.eventHub.emit('new');
      },deactive(){
          //取消当前的新建歌曲栏的激活!
          $(this.view.el).removeClass('active');
      }
  }
  controller.init(view,model);
}