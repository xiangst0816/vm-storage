<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <strong>This is build for Vue!</strong>
        <hr>
        <section>
            <h2>localStorage Service</h2>
            <div class="state">
                <div class="state__name">
                    <h3>State</h3>
                </div>
                <div class="state__paramsBox">
                    <div class="state__params">
                        <span class="state__params--name">Prefix:</span>
                        <span class="state__params--value">{{$localStorage._prefix}}</span>

                    </div>
                    <div class="state__params">
                        <span class="state__params--name">Prefix Length:</span>
                        <span class="state__params--value">{{$localStorage._prefixLength}}</span>
                    </div>
                    <div class="state__params">
                        <span class="state__params--name">Storage Type:</span>
                        <span class="state__params--value">{{$localStorage._storageType}}</span>
                    </div>
                </div>
            </div>

            <div class="resultBox">
                <div class="strage">
                    <h3>$localStorage length:{{$localStorage.length}}</h3>
                    <div>
                        <input placeholder="key" type="text" v-model="innerLocalStorageKey">
                        <input placeholder="value" type="text" v-model="innerLocalStorageValue">
                        <button @click="addInnerLocalStorage">add</button>
                    </div>

                    <p v-for="(value,key) in innerLocalStorageList">
                        <span>{{key}}:</span>
                        <span>{{value}}</span>
                        <button @click="removeInnerLocalStorageItem(key)">remove</button>
                    </p>
                </div>

                <div class="strage borderLeft">
                    <div class="strage">
                        <h3>localStorage length:{{localStorageListLength}}</h3>
                        <div>
                            <input placeholder="key" type="text" v-model="outerLocalStorageKey">
                            <input placeholder="value" type="text" v-model="outerLocalStorageValue">
                            <button @click="addOuterLocalStorage">add</button>
                        </div>

                        <p v-for="(value,key) in outerLocalStorageList">
                            <span>{{key}}:</span>
                            <span>{{value}}</span>
                            <button @click="removeOuterLocalStorageItem(key)">remove</button>
                        </p>
                    </div>
                </div>
            </div>

        </section>
        <hr>
        <section>
            <h2>sessionStorage Service</h2>
            <div class="state">
                <div class="state__name">
                    <h3>State</h3>
                </div>
                <div class="state__paramsBox">
                    <div class="state__params">
                        <span class="state__params--name">Prefix:</span>
                        <span class="state__params--value">{{$sessionStorage._prefix}}</span>

                    </div>
                    <div class="state__params">
                        <span class="state__params--name">Prefix Length:</span>
                        <span class="state__params--value">{{$sessionStorage._prefixLength}}</span>

                    </div>
                    <div class="state__params">
                        <span class="state__params--name">Storage Type:</span>
                        <span class="state__params--value">{{$sessionStorage._storageType}}</span>
                    </div>
                </div>
            </div>

            <div class="resultBox">
                <div class="strage">
                    <h3>$sessionStorage length:{{$sessionStorage.length}}</h3>
                    <div>
                        <input placeholder="key" type="text" v-model="innerSessionStorageKey">
                        <input placeholder="value" type="text" v-model="innerSessionStorageValue">
                        <button @click="addInnerSessionStorage">add</button>
                    </div>

                    <p v-for="(value,key) in $sessionStorage" v-if="key.indexOf('_') !== 0 && key!=='length'">
                        <span>{{key}}:</span>
                        <span>{{value}}</span>
                        <button @click="removeInnerSessionStorageItem(key)">remove</button>
                    </p>
                </div>

                <div class="strage borderLeft">
                    <div class="strage">
                        <h3>sessionStorage length:{{sessionStorageListLength}}</h3>
                        <div>
                            <input placeholder="key" type="text" v-model="outerSessionStorageKey">
                            <input placeholder="value" type="text" v-model="outerSessionStorageValue">
                            <button @click="addOuterSessionStorage">add</button>
                        </div>

                        <p v-for="(value,key) in outerSessionStorageList">
                            <span>{{key}}:</span>
                            <span>{{value}}</span>
                            <button @click="removeOuterSessionStorageItem(key)">remove</button>
                        </p>
                    </div>
                </div>
            </div>

        </section>


    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to vm-storage!',
        innerLocalStorageList: {},
        innerSessionStorageList: {},

        outerLocalStorageList: {},
        outerSessionStorageList: {},

        innerLocalStorageKey: '',
        innerLocalStorageValue: '',
        outerLocalStorageKey: '',
        outerLocalStorageValue: '',

        innerSessionStorageKey: '',
        innerSessionStorageValue: '',
        outerSessionStorageKey: '',
        outerSessionStorageValue: '',

        localStorageListLength: 0,
        sessionStorageListLength: 0,
      }
    },
    methods: {
      getInnerLocalStorageLength(){
        this.localStorageListLength = window.localStorage.length
      },
      getSessionStorageListLength(){
        this.sessionStorageListLength = window.sessionStorage.length
      },
      getInnerLocalStorage(){
        for (let key in this.$localStorage) {
          if (key.indexOf('_') !== 0 && key !== 'length') {
            this.innerLocalStorageList[key] = this.$localStorage[key];
          }
        }
        return this.innerLocalStorageList
      },
      getInnerSessionStorage(){
        for (let key in this.$sessionStorage) {
          if (key.indexOf('_') !== 0 && key !== 'length') {
            this.innerSessionStorageList[key] = this.$sessionStorage[key];
          }
        }
        return this.innerSessionStorageList
      },
      getOuterLocalStorage(){
        if (!!window.localStorage) {
          for (let i = 0, l = window.localStorage.length, k; i < l; i++) {
            k = window.localStorage.key(i);
            this.outerLocalStorageList[k] = window.localStorage.getItem(k)
          }
        }
      },
      getOuterSessionStorage(){
        if (!!window.sessionStorage) {
          for (let i = 0, l = window.sessionStorage.length, k; i < l; i++) {
            k = window.sessionStorage.key(i);
            this.outerSessionStorageList[k] = window.sessionStorage.getItem(k)
          }
        }
      },
      addInnerLocalStorage(){
        this.$localStorage.setItem(this.innerLocalStorageKey, this.innerLocalStorageValue)
        this.refresh()
      },
      removeInnerLocalStorageItem(key){
        this.$localStorage.removeItem(key)
        this.refresh()
      },
      addOuterLocalStorage(){
        window.localStorage.setItem(this.outerLocalStorageKey, this.outerLocalStorageValue);
        this.refresh()
      },
      removeOuterLocalStorageItem(key){
        window.localStorage.removeItem(key)
        this.refresh()
      },
      addInnerSessionStorage(){
        this.$sessionStorage.setItem(this.innerSessionStorageKey, this.innerSessionStorageValue)
        this.refresh()
      },
      removeInnerSessionStorageItem(key){
        this.$sessionStorage.removeItem(key)
        this.refresh()
      },
      addOuterSessionStorage(){
        window.sessionStorage.setItem(this.outerSessionStorageKey, this.outerSessionStorageValue);
        this.refresh()
      },
      removeOuterSessionStorageItem(key){
        window.sessionStorage.removeItem(key)
        this.refresh()
      },
      refresh(){
        this.innerLocalStorageList = {};
        this.innerSessionStorageList = {};
        this.outerLocalStorageList = {};
        this.outerSessionStorageList = {};
        this.innerLocalStorageKey = '';
        this.innerLocalStorageValue = '';
        this.outerLocalStorageKey = '';
        this.outerLocalStorageValue = '';
        this.innerSessionStorageKey = '';
        this.innerSessionStorageValue = '';
        this.outerSessionStorageKey = '';
        this.outerSessionStorageValue = '';
        this.getAllData();
        console.debug(this.$localStorage)
        console.debug(this.$sessionStorage)
      },
      getAllData(){
        this.getInnerLocalStorage();
        this.getInnerSessionStorage();
        this.getOuterLocalStorage();
        this.getOuterSessionStorage();
        this.getInnerLocalStorageLength();
        this.getSessionStorageListLength();
      },
    },
    created(){
      this.getAllData();
    },
    mounted () {
      for (let i = 0, l = this.$localStorage.length, k; i < l; i++) {
        // #8, #10: ` _storage.key(i)` may be an empty string (or throw an exception in IE9 if ` _storage` is empty)
        k = this.$localStorage.key(i);
      }

      console.debug('mounted')
      console.debug(this.$localStorage)

      if (this.$localStorage.getItem('testArr1')) {
        console.debug(this.$localStorage.getItem('testArr1'))
      } else {
        var arr = [1, 2, 3, 5]
        this.$localStorage.setItem('testArr1', arr)
      }

      if (this.$localStorage.getItem('testObject')) {
        console.debug(this.$localStorage.getItem('testObject'))
      } else {
        this.$localStorage.setItem('testObject', {a: 1, b: 2})
      }

      if (this.$localStorage.getItem('testFun')) {
        console.debug(this.$localStorage.getItem('testFun'))
      } else {
        let fun = function () {
          console.debug('function')
        }
        this.$localStorage.setItem('testFun', fun)
      }

//      setInterval(function () {
//        let name = 'tes' + parseInt(Math.random() * 100)
//        window.localStorage.setItem(name, Math.random())
//      },1000)

      window.localStorage.setItem('_AMap_maintcvcg', 'adf')
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    * {
        /*outline: 1px solid #ddd;*/
    }

    .state {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        .state__name {
            width: 100px;
            height: 100%;
            margin-right: 10px;
            border-right: 1px solid #ddd;
        }
        .state__paramsBox {
            height: 100%;
            .state__params {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .state__params--name {
                    width: 120px;
                    text-align: left;
                    font-weight: bold;
                }
                .state__params--value {
                    text-align: left;
                }
            }
        }
    }

    .resultBox {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .borderLeft {
            border-left: 1px solid #ddd;;
        }
        .strage {
            width: 400px;
            h3 {
                margin-bottom: 10px;
            }
            p {
                margin: 0 0 5px 0;
            }

        }
    }

</style>
