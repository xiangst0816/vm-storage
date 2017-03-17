# vm-storage

一个在vue框架下操作localStorage和sessionStorage而不造成性能问题的插件


<p align="center">
  <a href="https://circleci.com/gh/vuejs/vue/tree/dev"><img src="https://img.shields.io/circleci/project/vuejs/vue/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/vuejs/vue?branch=dev"><img src="https://img.shields.io/codecov/c/github/vuejs/vue/dev.svg" alt="Coverage Status"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/dt/vue.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/v/vue.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
</p>


> 已经使用的项目点这里: [X-SONGTAO](http://xiangsongtao.com "X-SONGTAO")

> 因为小站带宽的问题，请求数据的返回都放到了sessionStorage中，提高浏览流畅度。清除缓存的hack在左上角的那个小树icon上，点击可清除缓存，这个在控制台中能看到效果。


## Table of Contents

- Requirements
- Usage

## Requirements

vStorage requires the following ro run:

- vue 1.0+
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

- 在vue实例之外

```
 import Vue from "vue";
 //设置

Vue.$localStorage.$set({
        'key1':{
            'key1_1':'value1_1',
            'key1_2':'value1_2',
        },
        'key2':{
            'key2_1':'value2_1',
            'key2_2':'value2_2',
        }
})

Vue.$localStorage.$set('key1',{
    'key1_1':'value1_1',
    'key1_2':'value1_2',
})


//读取 
 Vue.$localStorage.value;

```

- 在vue实例之内

```
//比如在ready中
ready() {
 	//设置
	this.$localStorage.$set({
        'key1':{
            'key1_1':'value1_1',
            'key1_2':'value1_2',
        },
        'key2':{
            'key2_1':'value2_1',
            'key2_2':'value2_2',
        }
	})

	this.$localStorage.$set('key1',{
    	'key1_1':'value1_1',
    	'key1_2':'value1_2',
	})
	
	//读取 
	let name = this.$localStorage.value;

}

```

> 使用还是很简单的。


## API


#### $reset(item)
**参数：**item （可选）  
**类型：**object

- 将带有指定前缀的key都清除(清除全部)

```
Vue.$localStorage.$reset()
```

- 将带有指定前缀的key都清除(清除全部)，之后初始化括号内的数据

```
Vue.$localStorage.$reset({
	'key1':{
        'key1_1':'value1_1',
        'key1_2':'value1_2',
    }
})

```

webStorage中最后的存储结果：

|      key      |       value   |
| ------------- | --------------- |
|    vStorage-key1    |       {"key1_1":"value1_1","key1_2":"value1_2"}     |   


- 清除特例（期望保存的值不被清除的做法）

如果项目中有些数据是不希望清除的，请已'$'开头命名变量key值，例如下面的键值对，$reset是不会处理的。但是也意味着此键值对将为内置键值对，不会同步到本地webStorage中。

```
Vue.$localStorage.$reset({
	'$key1':{
        'key1_1':'value1_1',
        'key1_2':'value1_2',
    }
})
```

#### $fetch()
**参数：**无

将本地webStorage中的数据拉取到storage中。



#### $set(params)
- 当只有一个参数时，传入参数params是包含键值对的对象；故可进行多个键值对的设定。

- 当传入两个参数时，第一个参数为key，第二个参数为value；


示例如下：

```
Vue.$localStorage.$set({
    	'key1':{
        	'key1_1':'value1_1',
        	'key1_2':'value1_2',
    	},
    	'key2':{
        	'key2_1':'value2_1',
        	'key2_2':'value2_2',
    	}
})

Vue.$localStorage.$set('key1',{
    'key1_1':'value1_1',
    'key1_2':'value1_2',
})
```





#### $delete(key)

数据删除，双向同步
推荐将删除属性的value置空

> 在vue中操作key时，都是不带前缀的，请注意。






## QA

Q: $localStorage是单例对象吗？    
A: 是的，每次调用都返回同一个，且可以在不同的组件中使用，$localStorage只是挂载到Vue上面的一个对象。

Q: 每次访问$localStorage都会操作本地web storage吗？    
A: 取值和设值都只是对$localStorage对象进行操作，本地webStorage只是起到备份的作用,只会使用到setItem。故整体性能会好一些


