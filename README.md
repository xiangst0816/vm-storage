# vm-storage

a vue plugin for operate localStorage and sessionStorage, if the browser not support storage, then fallback to use memory to cache key/value data!

vm-storage插件是一个在vue框架下操作localStorage和sessionStorage而不造成性能问题的插件, 如果当前浏览器不支持本地存储, 则自动降级为使用memory存储.


## Install

npm to install:

```
 npm install vm-storage
```

in your code: 

```
import vmStorage from 'vm-storage'
Vue.use(vmStorage,{
	//'vmStorage-' is default prefix, add this prefix to distinguish the space
	prefix: 'vmStorage-', 
})
```
> prefix为指定前缀，设置在webStorage存储的前缀，区别作用空间, 如果不传入prefix则为空

## Usage

For `normal` style:

```
window.localStorage.getItem('key')
window.localStorage.setItem('key','value')
window.localStorage.removeItem('key')
window.localStorage.key(0)
window.localStorage.clear();
window.localStorage.length
```

For `vm-storage` style:

```
this.$localStorage.get('key')
this.$localStorage.set('key',{key:'value'}')
this.$localStorage.remove('key')
this.$localStorage.clear();
this.$localStorage.supported();
```

## My Thought

在vue和webStorage中间建立一个单例缓冲对象($localStorage和$sessionStorage)，当读取webStorage中的数据时，实际读取的是缓冲对象中的数据，这样会减轻读取的性能问题。但是如果向缓冲对象增加字段，则在webStorage中也保存同样的键值，和原生的setItem方法一样。

SPA项目运行的同时也是vmStorage初始化的时候，其会从webStorage拉去指定前缀的数据到缓冲对象中，每次对缓冲对象的写入都会与webStorage同步数据。

vmStorage只会从webStorage同步指定前缀的键值数据，这样方便标记管理。但是读取设置键值时，不需加前缀。可以理解为webStorage就是一个备份仓库。


## QA

Q: 每次访问$localStorage都会操作本地web storage吗？    
A: 取值是对$localStorage对象进行操作，本地webStorage只是起到备份的作用, 设置值的时候会操作webStorage。故整体性能会好一些.


## 版本信息

- 0.0.7 修改isBlank函数的bug
- 0.0.8 如果前缀不传则不使用前缀
- 0.0.9 如果没有前缀, 则排除前缀是_开头的变量
- 0.1.0 如果没有前缀, 则排除前缀是_开头的变量
- 0.1.2 修复setITem的key如果存在导致length错乱的错误
- 0.2.0 修改了api和打包方式


## LICENSE

MIT