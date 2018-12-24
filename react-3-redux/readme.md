#前言
本文不会拿redux、react-redux等一些react的名词去讲解，然后把各自用法举例说明，这样其实对一些react新手或者不太熟悉redux模式的开发人员不够友好，他们并不知道这样使用的原因。本文通过一个简单的例子展开，一点点自己去实现一个redux+react-redux，让大家充分理解redux+react-redux出现的必要。

#预备知识
在阅读本文之前，希望大家对以下知识点能提前有所了解并且上好厕所（文章有点长）：
状态提升的概念
react高阶组件(函数)
es6基础
pure 组件(纯函数)
Dumb 组件

# React.js的context
这一节的内容其实是讲一个react当中一个你可能永远用不到的特性——context，但是它对你理解react-redux很有好处。那么context是干什么的呢？看下图：
  
![图片](/react-3-redux/img/1.png)  
假设现在这个组件树代表的应用是用户可以自主换主题色的，每个子组件会根据主题色的不同调整自己的字体颜色。“主题色”这个状态是所有组件共享的状态，根据状态提升中所提到的，需要把这个状态提升到根节点的 Index 上，然后把这个状态通过 props 一层层传递下去：
  
![](/react-3-redux/img/2.png)  
如果要改变主题色，在 Index 上可以直接通过 this.setState({ themeColor: 'red' }) 来进行。这样整颗组件树就会重新渲染，子组件也就可以根据重新传进来的 props.themeColor 来调整自己的颜色。

但这里的问题也是非常明显的，我们需要把 themeColor 这个状态一层层手动地从组件树顶层往下传，每层都需要写 props.themeColor。如果我们的组件树很层次很深的话，这样维护起来简直是灾难。

如果这颗组件树能够全局共享这个状态就好了，我们要的时候就去取这个状态，不用手动地传：
  
![](/react-3-redux/img/3.png)  
就像这样，Index 把 state.themeColor 放到某个地方，这个地方是每个 Index 的子组件都可以访问到的。当某个子组件需要的时候就直接去那个地方拿就好了，而不需要一层层地通过 props 来获取。不管组件树的层次有多深，任何一个组件都可以直接到这个公共的地方提取 themeColor 状态。

React.js 的 context 就是这么一个东西，某个组件只要往自己的 context 里面放了某些状态，这个组件之下的所有子组件都直接访问这个状态而不需要通过中间组件的传递。一个组件的 context 只有它的子组件能够访问。
下面我们看看 React.js 的 context 代码怎么写，我们先把整体的组件树搭建起来。
用create-react-app创建工程：
```js
create-react-app react-redux-demo1
```

现在我们修改 App，让它往自己的 context 里面放一个 themeColor：
```jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Main from './main';
import './App.css';
 
class App extends Component {
  static childContextTypes = {
    themeColor :PropTypes.string
  }
  constructor () {
    super()
    this.state = {
      themeColor : 'red'
    }
  }
  getChildContext () {
    return {
      themeColor : this.state.themeColor
    }
  }
  render () {
    return (
      <div>
        <Header />
        <Main />
      </div>
    )
  }
}
 
export default App;
```
构造函数里面的内容其实就很好理解，就是往 state 里面初始化一个 themeColor 状态。getChildContext 这个方法就是设置 context 的过程，它返回的对象就是 context（也就是上图中处于中间的方块），所有的子组件都可以访问到这个对象。我们用 this.state.themeColor 来设置了 context 里面的 themeColor。

接下来我们要看看子组件怎么获取这个状态，修改 App 的孙子组件 Title和Content：
```jsx
//title.js
class Title extends Component {
  static contextTypes = {
    themeColor: PropTypes.string
  }
 
  render () {
    return (
      <h1 style={{ color: this.context.themeColor }}>React.js 小书标题</h1>
    )
  }
}
```
```jsx
//content.js
import React, { Component } from 'react';
class Content extends Component {
    render () {
        return (
        <div>
            <h2>this is 内容</h2>
        </div>
        )
    }
}
 
export default Content;
```
一个组件可以通过 getChildContext 方法返回一个对象，这个对象就是子树的 context，提供 context 的组件必须提供 childContextTypes 作为 context 的声明和验证。

如果一个组件设置了 context，那么它的子组件都可以直接访问到里面的内容，它就像这个组件为根的子树的全局变量。任意深度的子组件都可以通过 contextTypes 来声明你想要的 context 里面的哪些状态，然后可以通过 this.context 访问到那些状态。

context 打破了组件和组件之间通过 props 传递数据的规范，极大地增强了组件之间的耦合性。而且，就如全局变量一样，context 里面的数据能被随意接触就能被随意修改，每个组件都能够改 context 里面的内容会导致程序的运行不可预料。

#动手实现Redux
上节内容讲了React.js的content的特性，这个跟redux和react-redux什么关系呢？看下去就知道了，这边先卖个关子：）。Redux 和 React-redux 并不是同一个东西。Redux 是一种架构模式（Flux 架构的一种变种），它不关注你到底用什么库，你可以把它应用到 React 和 Vue，甚至跟 jQuery 结合都没有问题。而 React-redux 就是把 Redux 这种架构模式和 React.js 结合起来的一个库，就是 Redux 架构在 React.js 中的体现。这节主要讲如何自己手动实现一个redux模式。

#“大张旗鼓”的修改共享状态
用 create-react-app 新建一个项目：react-redux-demo2：
```jsx
create-react-app react-redux-demo2
```
修改 public/index.html 里面的 body 结构为：
```html
<body>
    <div id='title'></div>
    <div id='content'></div>
</body>
```
删除 src/index.js 里面所有的代码，添加下面代码，代表我们应用的状态：
```jsx
const appState = {
  title: {
    text: 'this is title',
    color: 'red',
  },
  content: {
    text: 'this is content',
    color: 'blue'
  }
}
```
我们新增几个渲染函数，它会把上面状态的数据渲染到页面上：
```jsx
function renderApp (appState) {
  renderTitle(appState.title)
  renderContent(appState.content)
}
 
function renderTitle (title) {
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = title.text
  titleDOM.style.color = title.color
}
 
function renderContent (content) {
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = content.text
  contentDOM.style.color = content.color
}
renderApp(appState)
```
很简单，renderApp 会调用 rendeTitle 和 renderContent，而这两者会把 appState 里面的数据通过原始的 DOM 操作更新到页面上。

  
![](/react-3-redux/img/4.png)  
这是一个很简单的 App，但是它存在一个重大的隐患，我们渲染数据的时候，使用的是一个共享状态 appState，每个人都可以修改它。这里的矛盾就是：“模块（组件）之间需要共享数据”，和“数据可能被任意修改导致不可预料的结果”之间的矛盾。

为了解决这个问题，我们可以学习 React.js 团队的做法，把事情搞复杂一些，提高数据修改的门槛：模块（组件）之间可以共享数据，也可以改数据。但是我们约定，这个数据并不能直接改，你只能执行某些我允许的某些修改，而且你修改的必须大张旗鼓地告诉我。

我们定义一个函数，叫 dispatch，它专门负责数据的修改：
```jsx
function dispatch (action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      appState.title.text = action.text
      break
    case 'UPDATE_TITLE_COLOR':
      appState.title.color = action.color
      break
    default:
      break
  }
}
```
所有对数据的操作必须通过 dispatch 函数。它接受一个参数 action，这个 action 是一个普通的 JavaScript 对象，里面必须包含一个 type 字段来声明你到底想干什么。dispatch 在 swtich 里面会识别这个 type 字段，能够识别出来的操作才会执行对 appState 的修改。

任何的模块如果想要修改 appState.title.text，必须大张旗鼓地调用 dispatch：
```jsx
dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'this is dispatch' }) // 修改标题文本
dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
```
我们再也不用担心共享数据状态的修改的问题，我们只要把控了 dispatch，所有的对 appState 的修改就无所遁形，毕竟只有一根箭头指向 appState 了。
  
![](/react-3-redux/img/5.png)  

#构建共享状态仓库
上一节我们有了 appState 和 dispatch，现在我们把它们集中到一个地方，给这个地方起个名字叫做 store，然后构建一个函数 createStore，用来专门生产这种 state 和 dispatch 的集合，这样别的 App 也可以用这种模式了：
```jsx
function createStore (state, stateChanger) {
  const getState = () => state
  const dispatch = (action) => stateChanger(state, action)
  return { getState, dispatch }
}
```
createStore 接受两个参数，一个是表示应用程序状态的 state；另外一个是 stateChanger，它来描述应用程序状态会根据 action 发生什么变化，其实就是相当于本节开头的 dispatch 代码里面的内容。

createStore 会返回一个对象，这个对象包含两个方法 getState 和 dispatch。getState 用于获取 state 数据，其实就是简单地把 state 参数返回。

dispatch 用于修改数据，和以前一样会接受 action，然后它会把 state 和 action 一并传给 stateChanger，那么 stateChanger 就可以根据 action 来修改 state 了。

现在有了 createStore，我们可以这么修改原来的代码，保留原来所有的渲染函数不变，修改数据生成的方式：
```jsx
let appState = {
  title: {
    text: 'this is title',
    color: 'red',
  },
  content: {
    text: 'this is content',
    color: 'blue'
  }
}
 
function stateChanger (state, action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      state.title.text = action.text
      break
    case 'UPDATE_TITLE_COLOR':
      state.title.color = action.color
      break
    default:
      break
  }
}
 
const store = createStore(appState, stateChanger)
 
renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'this is dispatch' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
renderApp(store.getState()) // 把新的数据渲染到页面上
```
针对每个不同的 App，我们可以给 createStore 传入初始的数据 appState，和一个描述数据变化的函数 stateChanger，然后生成一个 store。需要修改数据的时候通过 store.dispatch，需要获取数据的时候通过 store.getState。

#监控数据变化
上面代码有个问题，就是每次dispatch修改数据的时候，其实只是数据发生了变化，如果我们不手动调用renderApp，页面不会发生变化。如何数据变化的时候程序能够智能一点地自动重新渲染数据，而不是手动调用？

往 dispatch里面加 renderApp 就好了，但是这样 createStore 就不够通用了。我们希望用一种通用的方式“监听”数据变化，然后重新渲染页面，这里要用到观察者模式。修改 createStore：
```jsx
function createStore (state, stateChanger) {
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    stateChanger(state, action)
    listeners.forEach((listener) => listener())
  }
  return { getState, dispatch, subscribe }
}
```
我们在 createStore 里面定义了一个数组 listeners，还有一个新的方法 subscribe，可以通过 store.subscribe(listener) 的方式给 subscribe 传入一个监听函数，这个函数会被 push 到数组当中。每当 dispatch 的时候，监听函数就会被调用，这样我们就可以在每当数据变化时候进行重新渲染：
```jsx
const store = createStore(appState, stateChanger)
store.subscribe(() => renderApp(store.getState()))
 
renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'this is dispatch' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
// ...后面不管如何 store.dispatch，都不需要重新调用 renderApp
```
#共享结构的对象来提高性能
其实我们之前的例子当中是有比较严重的性能问题的。我们在每个渲染函数的开头打一些 Log 看看：
```jsx
function renderApp (appState) {
  console.log('render app...')
  renderTitle(appState.title)
  renderContent(appState.content)
}
 
function renderTitle (title) {
  console.log('render title...')
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = title.text
  titleDOM.style.color = title.color
}
 
function renderContent (content) {
  console.log('render content...')
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = content.text
  contentDOM.style.color = content.color
}
```
依旧执行一次初始化渲染，和两次更新，这里代码保持不变：
```jsx
renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'this is dispatch' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
```
  
![](/react-3-redux/img/6.png)  
可以看到问题就是，每当更新数据就重新渲染整个 App，但其实我们两次更新都没有动到 appState 里面的 content 字段的对象，而动的是 title 字段。其实并不需要重新 renderContent，它是一个多余的更新操作，现在我们需要优化它。

这里提出的解决方案是，在每个渲染函数执行渲染操作之前先做个判断，判断传入的新数据和旧的数据是不是相同，相同的话就不渲染了。
```jsx
function renderApp (newAppState, oldAppState = {}) { // 防止 oldAppState 没有传入，所以加了默认参数 oldAppState = {}

if (newAppState === oldAppState) return // 数据没有变化就不渲染了
  console.log('render app...')
  renderTitle(newAppState.title, oldAppState.title)
  renderContent(newAppState.content, oldAppState.content)
}
 
function renderTitle (newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return // 数据没有变化就不渲染了
  console.log('render title...')
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newTitle.text
  titleDOM.style.color = newTitle.color
}
 
function renderContent (newContent, oldContent = {}) {
  if (newContent === oldContent) return // 数据没有变化就不渲染了
  console.log('render content...')
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newContent.text
  contentDOM.style.color = newContent.color
}
```
然后我们用一个 oldState 变量保存旧的应用状态，在需要重新渲染的时候把新旧数据传进入去：
```jsx
const store = createStore(appState, stateChanger)
let oldState = store.getState() // 缓存旧的 state
store.subscribe(() => {
  const newState = store.getState() // 数据可能变化，获取新的 state
  renderApp(newState, oldState) // 把新旧的 state 传进去渲染
  oldState = newState // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
})
...
function stateChanger (state, action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      state.title.text = action.text
      break
    case 'UPDATE_TITLE_COLOR':
      state.title.color = action.color
      break
    default:
      break
  }
}
...
```
其实上面一顿操作根本达不到我们的预期的要求，你会发现还是渲染了content，这些引用指向的还是原来的对象，只是对象内的内容发生了改变。所以即使你在每个渲染函数开头加了那个判断又什么用？就像下面这段代码一样自欺欺人：
```jsx
let people = {
    name:'ddvdd'
}
const oldPeople = people
people.name = 'yjy'
oldPeople !== people //false 其实两个引用指向的是同一个对象，我们却希望它们不同。
```
那怎么样才能达到我们要的要求呢？引入共享结构的对象概念：
```jsx
const obj = { a: 1, b: 2}
const obj2 = { ...obj } // => { a: 1, b: 2 }
```
const obj2 = { ...obj } 其实就是新建一个对象 obj2，然后把 obj 所有的属性都复制到 obj2 里面，相当于对象的浅复制。上面的 obj 里面的内容和 obj2 是完全一样的，但是却是两个不同的对象。除了浅复制对象，还可以覆盖、拓展对象属性：
```jsx
const obj = { a: 1, b: 2}
const obj2 = { ...obj, b: 3, c: 4} // => { a: 1, b: 3, c: 4 }，覆盖了 b，新增了 c
```
我们可以把这种特性应用在 appstate 的更新上，我们禁止直接修改原来的对象，一旦你要修改某些东西，你就得把修改路径上的所有对象复制一遍。我们修改 stateChanger，让它修改数据的时候，并不会直接修改原来的数据 state，而是产生上述的共享结构的对象：
```jsx
function stateChanger (state, action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return { // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      return { // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state // 没有修改，返回原来的对象
  }
}
```
因为 stateChanger 不会修改原来对象了，而是返回对象，所以我们需要修改一下 createStore。让它用每次 stateChanger(state, action) 的调用结果覆盖原来的 state：
```jsx
function createStore (state, stateChanger) {
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = stateChanger(state, action) // 覆盖原对象
    listeners.forEach((listener) => listener())
  }
  return { getState, dispatch, subscribe }
}
```
好了，我们在运行下看看结果是不是变成我们预期的那样了？
  
![](/react-3-redux/img/7.png)  

#我就喜欢叫它 “reducer”
经过了这么多节的优化，我们有了一个很通用的 createStore，主要传入appState、stateChanger就能使用。那么appState和stateChanger是否可以合并到一起去呢？显然可以：
```jsx
function stateChanger (state, action) {
  if (!state) {
    return {
      title: {
        text: 'this is title',
        color: 'red',
      },
      content: {
        text: 'this is content',
        color: 'blue'
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      return {
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state
  }
}
```
stateChanger 现在既充当了获取初始化数据的功能，也充当了生成更新数据的功能。如果有传入 state 就生成更新数据，否则就是初始化数据。这样我们可以优化 createStore 成一个参数，因为 state 和 stateChanger 合并到一起了：
```jsx
function createStore (stateChanger) {
  let state = null
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = stateChanger(state, action)
    listeners.forEach((listener) => listener())
  }
  dispatch({}) // 初始化 state
  return { getState, dispatch, subscribe }
}
```
createStore 内部的 state 不再通过参数传入，而是一个局部变量 let state = null。createStore 的最后会手动调用一次 dispatch({})，dispatch 内部会调用 stateChanger，这时候的 state 是 null，所以这次的 dispatch 其实就是初始化数据了。createStore 内部第一次的 dispatch 导致 state 初始化完成，后续外部的 dispatch 就是修改数据的行为了。

我们给 stateChanger 这个玩意起一个通用的名字：reducer，不要问为什么，它就是个名字而已，修改 createStore 的参数名字：
```jsx
function createStore (reducer) {
  let state = null
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }
  dispatch({}) // 初始化 state
  return { getState, dispatch, subscribe }
}
```
这是一个最终形态的 createStore，它接受的参数叫 reducer，reducer 是一个函数，细心的朋友会发现，它其实是一个纯函数（Pure Function）。

#Redux在React当中的实践
看到这里你会发现自己莫名其妙的对redux已经了解的差不多了，甚至还自己动手实现了一个。文章进行到这里，偷偷告诉大家才过了一半。。。没上过厕所的去上下，回来我们继续：）

#搭建工程
前面我们在react.js的context中提出，我们可用把共享状态放到父组件的 context 上，这个父组件下所有的组件都可以从 context 中直接获取到状态而不需要一层层地进行传递了。但是直接从 context 里面存放、获取数据增强了组件的耦合性；并且所有组件都可以修改 context 里面的状态就像谁都可以修改共享状态一样，导致程序运行的不可预料。

既然这样，为什么不把 context 和 store 结合起来？毕竟 store 的数据不是谁都能修改，而是约定只能通过 dispatch 来进行修改，这样的话每个组件既可以去 context 里面获取 store 从而获取状态，又不用担心它们乱改数据了。我们还是以“主题色”这个例子来讲解，假设我们有这么一颗组件树：
  
![](/react-3-redux/img/8.png)  
Header 和 Content 的组件的文本内容会随着主题色的变化而变化，而 Content 下的子组件 ThemeSwitch 有两个按钮，可以切换红色和蓝色两种主题，按钮的颜色也会随着主题色的变化而变化。

用 create-react-app 新建一个工程react-redux-demo3：
```jsx
create-react-app react-redux-demo3
```
安装好后在 src/ 目录下新增三个文件：Header.js、Content.js、ThemeSwitch.js。
```jsx
//./src/Header.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
 
class Header extends Component {
  render () {
    return (
      <h1>this is header</h1>
    )
  }
}
 
export default Header
 
//./src/Content.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ThemeSwitch from './ThemeSwitch'
 
class Content extends Component {
  render () {
    return (
      <div>
        <p>this is content</p>
        <ThemeSwitch />
      </div>
    )
  }
}
 
export default Content
 
//./src/ThemeSwitch.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
 
class ThemeSwitch extends Component {
  render () {
    return (
      <div>
        <button>Red</button>
        <button>Blue</button>
      </div>
    )
  }
}
 
export default ThemeSwitch
 
//修改app.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Header from './Header'
import Content from './Content'
import './index.css'
 
class App extends Component {
  render () {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}
 
export default App
```
这样我们就简单地把整个组件树搭建起来了，用 npm start 启动工程，然后可以看到页面上显示：
  
![](/react-3-redux/img/9.png)  

#结合 context 和 store
既然要把 store 和 context 结合起来，我们就先在 src目下创建store.js 和 reducer.js俩文件：
```jsx
//store.js
function createStore (reducer) {
    let state = null
    const listeners = []
    const subscribe = (listener) => listeners.push(listener)
    const getState = () => state
    const dispatch = (action) => {
      state = reducer(state, action)
      listeners.forEach((listener) => listener())
    }
    dispatch({}) // 初始化 state
    return { getState, dispatch, subscribe }
}
 
export default createStore
 
//reducer.js
const themeReducer = (state, action) => {
    if (!state) return {
      themeColor: 'red'
    }
    switch (action.type) {
      case 'CHANGE_COLOR':
        return { ...state, themeColor: action.themeColor }
      default:
        return state
    }
}
export default themeReducer
```
themeReducer 定义了一个表示主题色的状态 themeColor，并且规定了一种操作 CHNAGE_COLOR，只能通过这种操作修改颜色。现在我们把 store 放到 App 的 context 里面，这样每个子组件都可以获取到 store 了，修改 src/App.js 里面的 App：
```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Header from './Header'
import Content from './Content'
 
import createStore from './store'
import themeReducer from './reducer'
 
const store = createStore(themeReducer)
 
class App extends Component {
  static childContextTypes = {
    store: PropTypes.object
  }
 
  getChildContext () {
    return { store }
  }
 
  render () {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}
export default App
```
然后修改 src/Header.js、Content.js、ThemeSwitch.js，让它从 App 的 context 里面获取 store，并且获取里面的 themeColor 状态来设置自己的颜色：
```jsx
//header.js
class Header extends Component {
  static contextTypes = {
    store: PropTypes.object
  }
 
  constructor () {
    super()
    this.state = { themeColor: '' }
  }
 
  componentWillMount () {
    this._updateThemeColor()
  }
 
  _updateThemeColor () {
    const { store } = this.context
    const state = store.getState()
    this.setState({ themeColor: state.themeColor })
  }
 
  render () {
    return (
      <h1 style={{ color: this.state.themeColor }}>this is header</h1>
    )
  }
}
 
//content.js
class Content extends Component {
  static contextTypes = {
    store: PropTypes.object
  }
 
  constructor () {
    super()
    this.state = { themeColor: '' }
  }
 
  componentWillMount () {
    this._updateThemeColor()
  }
 
  _updateThemeColor () {
    const { store } = this.context
    const state = store.getState()
    this.setState({ themeColor: state.themeColor })
  }
 
  render () {
    return (
      <div>
        <p style={{ color: this.state.themeColor }}>this is content</p>
        <ThemeSwitch />
      </div>
    )
  }
}
 
//themeswitch.js
class ThemeSwitch extends Component {
  static contextTypes = {
    store: PropTypes.object
  }
 
  constructor () {
    super()
    this.state = { themeColor: '' }
  }
 
  componentWillMount () {
    this._updateThemeColor()
  }
 
  _updateThemeColor () {
    const { store } = this.context
    const state = store.getState()
    this.setState({ themeColor: state.themeColor })
  }
 
  // dispatch action 去改变颜色
  handleSwitchColor (color) {
    const { store } = this.context
    store.dispatch({
      type: 'CHANGE_COLOR',
      themeColor: color
    })
  }
 
  render () {
    return (
      <div>
        <button
          style={{ color: this.state.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'red')}>Red</button>
        <button
          style={{ color: this.state.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'blue')}>Blue</button>
      </div>
    )
  }
}
```
我们在 constructor 里面初始化了组件自己的 themeColor 状态。然后在生命周期中 componentWillMount 调用 _updateThemeColor，_updateThemeColor 会从 context 里面把 store 取出来，然后通过 store.getState() 获取状态对象，并且用里面的 themeColor 字段设置组件的 state.themeColor。

然后在 render 函数里面获取了 state.themeColor 来设置标题的样式，页面上就会显示：
  1
![](/react-3-redux/img/10.png)  
我们给两个按钮都加上了 onClick 事件监听，并绑定到了 handleSwitchColor 方法上，两个按钮分别给这个方法传入不同的颜色 red 和 blue，handleSwitchColor 会根据传入的颜色 store.dispatch 一个 action 去修改颜色。

当然你现在点击按钮还是没有反应的。因为点击按钮的时候，只是更新 store 里面的 state，而并没有在 store.state 更新以后去重新渲染数据，我们其实就是忘了 store.subscribe 了。

给 Header.js、Content.js、ThemeSwitch.js 的 componentWillMount 生命周期都加上监听数据变化重新渲染的代码：
```jsx
...
  componentWillMount () {
    const { store } = this.context
    this._updateThemeColor()
    store.subscribe(() => this._updateThemeColor())
  }
...
```
通过 store.subscribe，在数据变化的时候重新调用 _updateThemeColor，而 _updateThemeColor 会去 store 里面取最新的 themeColor 然后通过 setState 重新渲染组件，这时候组件就更新了。现在可以自由切换主题色了：
  1
![](/react-3-redux/img/11.png)  
我们顺利地把 store 和 context 结合起来，这是 Redux 和 React.js 的第一次胜利会师，当然还有很多需要优化的地方。

connect 和 mapStateToProps
我们来观察一下刚写下的这几个组件，可以轻易地发现它们有两个重大的问题：

有大量重复的逻辑：它们基本的逻辑都是，取出 context，取出里面的 store，然后用里面的状态设置自己的状态，这些代码逻辑其实都是相同的。
对 context 依赖性过强：这些组件都要依赖 context 来取数据，使得这个组件复用性基本为零。想一下，如果别人需要用到里面的 ThemeSwitch 组件，但是他们的组件树并没有 context 也没有 store，他们没法用这个组件了。
对于第一个问题我们可以用高阶组件（高阶组件就是一个函数，传给它一个组件，它返回一个新的组件。）来解决，可以把一些可复用的逻辑放在高阶组件当中，高阶组件包装的新组件和原来组件之间通过 props 传递信息，减少代码的重复程度。

对于第二个问题，我们得弄清楚一件事情，到底什么样的组件才叫复用性强的组件。如果一个组件对外界的依赖过于强，那么这个组件的移植性会很差，就像这些严重依赖 context 的组件一样。

如果一个组件的渲染只依赖于外界传进去的 props 和自己的 state，而并不依赖于其他的外界的任何数据，也就是说像纯函数一样，给它什么，它就吐出（渲染）什么出来。这种组件的复用性是最强的，别人使用的时候根本不用担心任何事情，只要看看 PropTypes 它能接受什么参数，然后把参数传进去控制它就行了。

我们把这种组件叫做 Pure Component，因为它就像纯函数一样，可预测性非常强，对参数（props）以外的数据零依赖，也不产生副作用。这种组件也叫 Dumb Component，因为它们呆呆的，让它干啥就干啥。写组件的时候尽量写 Dumb Component 会提高我们的组件的可复用性。

到这里思路慢慢地变得清晰了，我们需要高阶组件帮助我们从 context 取数据，我们也需要写 Dumb 组件帮助我们提高组件的复用性。所以我们尽量多地写 Dumb 组件，然后用高阶组件把它们包装一层，高阶组件和 context 打交道，把里面数据取出来通过 props 传给 Dumb 组件。
  1
![](/react-3-redux/img/12.png)  
我们把这个高阶组件起名字叫 connect，因为它把 Dumb 组件和 context 连接（connect）起来了：
```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
 
export connect = (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
 
    // TODO: 如何从 store 取数据？
 
    render () {
      return <WrappedComponent />
    }
  }
 
  return Connect
}
```
connect 函数接受一个组件 WrappedComponent 作为参数，把这个组件包含在一个新的组件 Connect 里面，Connect 会去 context 里面取出 store。现在要把 store 里面的数据取出来通过 props 传给 WrappedComponent。

但是每个传进去的组件需要 store 里面的数据都不一样的，所以除了给高阶组件传入 Dumb 组件以外，还需要告诉高级组件我们需要什么数据，高阶组件才能正确地去取数据。为了解决这个问题，我们可以给高阶组件传入类似下面这样的函数：
```jsx
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor,
    themeName: state.themeName,
    fullName: `${state.firstName} ${state.lastName}`
    ...
  }
}
```
这个函数会接受 store.getState() 的结果作为参数，然后返回一个对象，这个对象是根据 state 生成的。mapStateTopProps 相当于告知了 Connect 应该如何去 store 里面取数据，然后可以把这个函数的返回结果传给被包装的组件：
```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
 
export const connect = (mapStateToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
 
    render () {
      const { store } = this.context
      let stateProps = mapStateToProps(store.getState())
      // {...stateProps} 意思是把从store里面所需要的属性拿出来全部通过 `props` 方式传递进去
      return <WrappedComponent {...stateProps} />
    }
  }
 
  return Connect
}
```
好了既然有了connect这个高阶组件，我们来看看之前的代码怎么改造？我们把上面 connect 的函数代码单独分离到一个模块当中，在 src/ 目录下新建一个 react-redux.js，把上面的 connect 函数的代码复制进去，然后就可以在 src/Header.js 里面使用了：
```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from './react-redux'
 
class Header extends Component {
  static propTypes = {
    themeColor: PropTypes.string
  }
 
  render () {
    return (
      <h1 style={{ color: this.props.themeColor }}>this is header</h1>
    )
  }
}
 
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}
Header = connect(mapStateToProps)(Header)
 
export default Header
```
可以看到 Header 删掉了大部分关于 context 的代码，它除了 props 什么也不依赖，它是一个 Pure Component，然后通过 connect 取得数据。我们不需要知道 connect 是怎么和 context 打交道的，只要传一个 mapStateToProps 告诉它应该从store里面取哪些数据就可以了。同样的方式修改 src/Content.js，这里不贴了，留给大家自己去完成。

现在的 connect 还没有监听数据变化然后重新渲染，所以现在点击按钮只有按钮会变颜色。我们给 connect 的高阶组件增加监听数据变化重新渲染的逻辑，稍微重构一下 connect：
```jsx
export const connect = (mapStateToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
 
    constructor () {
      super()
      this.state = { allProps: {} }
    }
 
    componentWillMount () {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())
    }
 
    _updateProps () {
      const { store } = this.context
      let stateProps = mapStateToProps(store.getState(), this.props) // 额外传入 props，让获取数据更加灵活方便
      this.setState({
        allProps: { // 整合普通的 props 和从 state 生成的 props
          ...stateProps,
          ...this.props
        }
      })
    }
 
    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
 
  return Connect
}
```
我们在 Connect 组件的 constructor 里面初始化了 state.allProps，它是一个对象，用来保存需要传给被包装组件的所有的参数。生命周期 componentWillMount 会调用调用 _updateProps 进行初始化，然后通过 store.subscribe 监听数据变化重新调用 _updateProps。

为了让 connect 返回新组件和被包装的组件使用参数保持一致，我们会把所有传给 Connect 的 props 原封不动地传给 WrappedComponent。所以在 _updateProps 里面会把 stateProps 和 this.props 合并到 this.state.allProps 里面，再通过 render 方法把所有参数都传给 WrappedComponent。

mapStateToProps 也发生点变化，它现在可以接受两个参数了，我们会把传给 Connect 组件的 props 参数也传给它，那么它生成的对象配置性就更强了，我们可以根据 store 里面的 state 和外界传入的 props 生成我们想传给被包装组件的参数。

现在已经很不错了，Header.js 和 Content.js 的代码都大大减少了，并且这两个组件 connect 之前都是 Dumb 组件。接下来会继续重构 ThemeSwitch。

#mapDispatchToProps
在重构 ThemeSwitch 的时候我们发现，ThemeSwitch 除了需要 store 里面的数据以外，还需要 store 来 dispatch：
```jsx
...
  // dispatch action 去改变颜色
  handleSwitchColor (color) {
    const { store } = this.context
    store.dispatch({
      type: 'CHANGE_COLOR',
      themeColor: color
    })
  }
...
```
目前版本的 connect 是达不到这个效果的，我们需要改进它。

想一下，既然可以通过给 connect 函数传入 mapStateToProps 来告诉它如何获取、整合状态，我们也可以想到，可以给它传入另外一个参数来告诉它我们的组件需要如何触发 dispatch。我们把这个参数叫 mapDispatchToProps：
```jsx
const mapDispatchToProps = (dispatch) => {
  return {
    onSwitchColor: (color) => {
      dispatch({ type: 'CHANGE_COLOR', themeColor: color })
    }
  }
}
```
和 mapStateToProps 一样，它返回一个对象，这个对象内容会同样被 connect 当作是 props 参数传给被包装的组件。不一样的是，这个函数不是接受 state 作为参数，而是 dispatch，你可以在返回的对象内部定义一些函数，这些函数会用到 dispatch 来触发特定的 action。

调整 connect 让它能接受这样的 mapDispatchToProps：
```jsx
export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
 
    constructor () {
      super()
      this.state = {
        allProps: {}
      }
    }
 
    componentWillMount () {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())
    }
 
    _updateProps () {
      const { store } = this.context
      let stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), this.props)
        : {} // 防止 mapStateToProps 没有传入
      let dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch, this.props)
        : {} // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }
 
    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}
```
在 _updateProps 内部，我们把store.dispatch 作为参数传给 mapDispatchToProps ，它会返回一个对象 dispatchProps。接着把 stateProps、dispatchProps、this.props 三者合并到 this.state.allProps 里面去，这三者的内容都会在 render 函数内全部传给被包装的组件。

这时候我们就可以重构 ThemeSwitch，让它摆脱 store.dispatch：
```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from './react-redux'
 
class ThemeSwitch extends Component {
  static propTypes = {
    themeColor: PropTypes.string,
    onSwitchColor: PropTypes.func
  }
 
  handleSwitchColor (color) {
    if (this.props.onSwitchColor) {
      this.props.onSwitchColor(color)
    }
  }
 
  render () {
    return (
      <div>
        <button
          style={{ color: this.props.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'red')}>Red</button>
        <button
          style={{ color: this.props.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'blue')}>Blue</button>
      </div>
    )
  }
}
 
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onSwitchColor: (color) => {
      dispatch({ type: 'CHANGE_COLOR', themeColor: color })
    }
  }
}
ThemeSwitch = connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch)
 
export default ThemeSwitch
```
这时候这三个组件的重构都已经完成了，代码大大减少、不依赖 context，并且功能和原来一样。

#Provider
我们要把 context 相关的代码从所有业务组件中清除出去，现在的代码里面还有一个地方是被污染的。那就是 src/App.js 里面的 App：
```jsx
...
class Index extends Component {
  static childContextTypes = {
    store: PropTypes.object
  }
 
  getChildContext () {
    return { store }
  }
 
  render () {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}
...
```
其实它要用 context 就是因为要把 store 存放到里面，好让子组件 connect 的时候能够取到 store。我们可以额外构建一个组件来做这种脏活，然后让这个组件成为组件树的根节点，那么它的子组件都可以获取到 context 了。

我们把这个组件叫 Provider，因为它提供（provide）了 store，把它放在react-redux.js：
```jsx
export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }
 
  static childContextTypes = {
    store: PropTypes.object
  }
 
  getChildContext () {
    return {
      store: this.props.store
    }
  }
 
  render () {
    return (
      <div>{this.props.children}</div>
    )
  }
}
```
Provider 做的事情也很简单，它就是一个容器组件，会把嵌套的内容原封不动作为自己的子组件渲染出来。它还会把外界传给它的 props.store 放到 context，这样子组件 connect 的时候都可以获取到。

可以用它来重构我们的 src/index.js：
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import createStore from './store'
import { Provider } from './react-redux'
import themeReducer from './reducer'
 
const store = createStore(themeReducer)
 
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')
);
 ```
这样我们就把所有关于 context 的代码从组件里面删除了。做完这些你其实已经自己动手完成了一个react-redux的开发，不信？怎么可能那么简单？至今为止都没用react-redux。。。那么现在来看一件神奇的事情，把 src/ 目录下 Header.js、ThemeSwitch.js、Content.js 的模块中的./react-redux 导入的 connect 改成从第三方 react-redux 模块中导入。
```jsx
import { connect } from './react-redux' 
//改成
import { connect } from 'react-redux'
```
删除自己写的 createStore，改成使用第三方模块 redux 的 createStore；Provider 本来从本地的 ./react-redux 引入，改成从第三方 react-redux 模块中引入。其余代码保持不变。
```jsx
import { createStore } from 'redux'
 
import { Provider } from 'react-redux'
```
接着删除 src/react-redux.js，它的已经用处不大了。最后启动工程 npm start：

  1
![](/react-3-redux/img/13.png)  

我们看到项目神奇的运行了，好了文章到了这里也算结束了，第一遍消化不了的建议多看几篇


参考文献:[跟着例子一步步学习redux+react-redux](https://blog.csdn.net/bbsyi/article/details/82426733)