# vm-storage


一个在vue框架下操作localStorage和sessionStorage而不造成性能问题的插件


> 已经使用的项目点这里: [X-SONGTAO](http://xiangsongtao.com "X-SONGTAO")

> 因为小站带宽的问题，请求数据的返回都放到了sessionStorage中，提高浏览流畅度。清除缓存的hack在左上角的那个小树icon上，点击可清除缓存，这个在控制台中能看到效果。



## Requirements

vm-storage requires the following ro run:

- vue 2.x
- Node 0.10+
- npm 





## Usage

使用npm命令安装vStorage

```
 npm install vStorage

```




在app.vue中配置如下：

```
import vStorage from './path/to/vStorage.js'
Vue.use(vStorage, {
    storageKeyPrefix: 'vStorage-'
});
```
> storageKeyPrefix为指定前缀，设置在webStorage存储的前缀，区别作用空间

## 插件设计思路

在vue和webStorage中间建立一个单例缓冲对象($localStorage和$sessionStorage)，当读取webStorage中的数据时，实际读取的是缓冲对象中的数据，这样会减轻读取的性能问题。但是如果向缓冲对象增加字段，则在webStorage中也保存同样的键值，和原生的setItem方法一样。

SPA项目运行的同时也是vStorage初始化的时候，其会从webStorage拉去指定前缀的数据到缓冲对象中，每次对缓冲对象的写入都会与webStorage同步数据。

vStorage只会从webStorage同步指定前缀的键值数据，这样方便标记管理。但是读取设置键值时，不需加前缀。可以理解为webStorage就是一个备份仓库。



## 使用

一般使用场景分为两类：






## QA

Q: $localStorage是单例对象吗？    
A: 是的，每次调用都返回同一个，且可以在不同的组件中使用，$localStorage只是挂载到Vue上面的一个对象。

Q: 每次访问$localStorage都会操作本地web storage吗？    
A: 取值和设值都只是对$localStorage对象进行操作，本地webStorage只是起到备份的作用,只会使用到setItem。故整体性能会好一些


