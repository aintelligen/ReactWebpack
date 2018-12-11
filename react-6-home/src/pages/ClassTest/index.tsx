import * as React from 'react'

export interface ListProps {
  compiler?: string;
  framework?: string;
}
/**
 * SOLID原则
 * S：单一职责 一个类只负责一件事
 * O: 开闭  虚拟方法 让每一种动物扩展 Animal 类 并实现 makeSound 方法
 * L: 里氏替换 子类必须可以替换它的超类 重写
 * I: 接口隔离 接口方法最好一个 因为使用接口必须实现里面的所有方法
 * D: 依赖倒置 http
 * @class Animal
 */
class Animal {
  constructor(name?: string) {
  }
  makeSound(sound?: string) {
    console.log(sound);
  }
  legCount() {

  }
}

class Loin extends Animal {
  makeSound() {
    return 'Loin'
  }
  legCount() {
    super.legCount()
    return '4'
  }
}
class Snake extends Animal {
  makeSound() {
    super.makeSound('Snake');
    return 'Snake'
  }
  legCount() {
    super.legCount()
    return '0'
  }
}

function AnimalLenCount(a: Array<Animal>) {
  for (let i = 0; i < a.length; i++) {
    console.log(a[i].legCount());
  }
}
let loin = new Loin();
let snake = new Snake();
let animals = [
  loin,
  snake
]

AnimalLenCount(animals);

// I: 接口隔离 接口方法最好一个 减少不必要的方法
interface IShape {
  drawCircle();
  drawSquare();
  drawRectangle();
}
class Drawpanle implements IShape {
  drawCircle() {

  }
  drawSquare() {

  }
  drawRectangle() {

  }
}

// D: 依赖倒置
interface Connection {
  request(url: string, options: any);
}
class Http {
  constructor(private httpConnection: Connection) { }
  get(url: string, options: any) {
    this.httpConnection.request(url, 'GET')
  }
  post(url: string, options: any) {
    this.httpConnection.request(url, 'POST')
  }
}
class XMLHttpService implements Connection {
  request(url: string, options: any) {
  }
}
console.log(new Http(new XMLHttpService()))




export default class ClassTest extends React.Component<ListProps, {}>{
  render() {
    return <div>typescript list</div>
  }
}
