import Events from './events';
import utils from './utils';

class Report extends Events{
  constructor( options ) {
    super();
    const config = {
      dataKey: '', //上报数据的属性名，用于服务器获取数据
      mergeReport: true, // mergeReport 是否合并上报， false 关闭， true 启动（默认）
      delay: 1000, // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
      url: '', // 指定错误上报地址
      getPath: '', // get请求路径
      postPath: '', // post请求路径
      random: 1, // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
    }
    this.config = utils.assignObject(config, options);
    this.queue = {
      get: [],
      post: []
    }
    this.getUrl = this.config.url + this.config.getPath;
    this.postUrl = this.config.url + this.config.postPath;
  }
  reportByGet(data){
    this.sendData('get', data);
  }
  reportByPost(data){
    this.sendData('post', data);
  }
  sendData(type, data){
    if(this.catchData(type, data)) {
      this.delayReport();
    }
  }
  delayReport(cb){
    if (!this.trigger( 'beforeReport' ) ) return;
    let delay = this.config.mergeReport ? this.config.delay : 0;
    setTimeout(() => {
      if (!this.trigger( 'beforeSend' ) ) return;
      this.report(cb);
    }, delay);
  }
  // push数据到pool
  catchData(type, data) {
    var rnd = Math.random();
    if ( rnd >= this.config.random ) {
      return false;
    }
    this.queue[type].push(data);
    return this.queue[type];
  }
  report(cb) {
    Promise.all([this.getRequest(), this.postRequest()]).then((urls)=>{
      this.trigger('afterReport');
      cb && cb.call(this, urls);
    });
  }
  getRequest() {
    return new Promise((resolve)=>{
      if(this.queue.get.length === 0){
        resolve();
      } else {
        const parames = this._getParames('get');
        let url = this.getUrl + '?' + this.config.dataKey + '=' + parames;
        let img = new window.Image();
        img.onload = ()=>{
          resolve(parames);
        };
        img.src = url;
      }
    })
  }
  postRequest(){
    return new Promise((resolve)=>{
      if(this.queue.post.length === 0){
        resolve();
      } else {
        const parames = this._getParames('post');
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = ()=>{
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            resolve(parames);
          }
        }
        xmlhttp.open("POST", this.postUrl, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        const data = {};
        data[this.config.dataKey] = parames;
        xmlhttp.send(JSON.stringify(data));
      }
    });
  }
  _getParames(type){
    const queue = this.queue[type];
    let mergeReport = this.config.mergeReport;
    let curQueue = mergeReport ? queue : [ queue.shift() ];
    if(mergeReport) this.queue[type] = [];

    let parames = curQueue.map( obj => {
      return utils.serializeObj( obj );
    } ).join( '|' );
    return parames
  }
};

export default Report;
