window.eventHub = {
  events: {},
  //发布 参数 事件名 数据
  emit(eventName, data) {
    //对events对象进行遍历操作 
    for (let key in this.events) {
      //如果说events里面的key等于 传入的事件类型
      if (key === eventName) {
        //那么将当前的对应key的值 赋值给fnList(函数列表)
        let fnList = this.events[key];
        //map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。 将函数列表中的函数调用几次!
        fnList.map((fn) => {
          fn.call(undefined, data);
        });
      }
    }
  },
  //订阅 事件名 函数  如果说当前的事件对象中传入的事件名为空 则将空数组赋值给对应的事件名
  on(eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = [];
    }
    //并且将对应的函数推入进去!
    this.events[eventName].push(fn);
  }
};
