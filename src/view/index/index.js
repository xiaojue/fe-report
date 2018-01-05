/**
 * @author xiaojue
 * @fileoverview 前端信息上报demo
 * @date 2018/01/04
 */
import Report from '../../index'

const rep = new Report({
  dataKey: 'err_msg', //上报数据的属性名，用于服务器获取数据
  mergeReport: true, // mergeReport 是否合并上报， false 关闭， true 启动（默认）
  delay: 1000, // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
  url: 'http://localhost:80', // 指定错误上报地址
  getPath: '/read.gif', // get请求路径
  postPath: '/post/jserr', // post请求路径
  random: 1, // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
});

rep.on('afterReport', function () {
  console.log('afterReport');
});
rep.reportByPost({msg: '1111'}, function (data) {
  console.log(data);
});
