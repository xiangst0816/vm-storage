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
> prefix为指定前缀，设置在webStorage存储的前缀，区别作用空间

## Usage

for `normal` style:

```
window.localStorage.getItem('key')
window.localStorage.setItem('key','value')
window.localStorage.removeItem('key')
window.localStorage.key(0)
window.localStorage.clear();
window.localStorage.length
```

for `vm-storage` style

```
this.$localStorage.getItem('key')
this.$localStorage.setItem('key','value')
this.$localStorage.removeItem('key')
this.$localStorage.key(0)
this.$localStorage.clear();
this.$localStorage.supported();
this.$localStorage.length
```

## My Thought

在vue和webStorage中间建立一个单例缓冲对象($localStorage和$sessionStorage)，当读取webStorage中的数据时，实际读取的是缓冲对象中的数据，这样会减轻读取的性能问题。但是如果向缓冲对象增加字段，则在webStorage中也保存同样的键值，和原生的setItem方法一样。

SPA项目运行的同时也是vmStorage初始化的时候，其会从webStorage拉去指定前缀的数据到缓冲对象中，每次对缓冲对象的写入都会与webStorage同步数据。

vmStorage只会从webStorage同步指定前缀的键值数据，这样方便标记管理。但是读取设置键值时，不需加前缀。可以理解为webStorage就是一个备份仓库。


## QA

Q: $localStorage是单例对象吗？    
A: 是的，每次调用都返回同一个，且可以在不同的业务组件中使用，$localStorage只是挂载到Vue原型上面的一个对象。

Q: 每次访问$localStorage都会操作本地web storage吗？    
A: 取值和设值都只是对$localStorage对象进行操作，本地webStorage只是起到备份的作用,只会使用到setItem。故整体性能会好一些


