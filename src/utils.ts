import { EventEmitter } from 'events'

export class vec2 {
  x: number
  y: number

  constructor(x:number|null = 0, y:number|null = 0){
    x = x || 0
    y = y || 0

    this.x = x
    this.y = y
  }

  sub(x:number|vec2, y:number = 0):vec2{
    if(typeof x === 'object'){
      return new vec2(this.x - x.x, this.y - x.y)
    }

    y = y || x

    return new vec2(this.x - x, this.y - y)
  }

  add(x:number|vec2, y:number = 0):vec2{
    if(typeof x === 'object'){
      return new vec2(this.x + x.x, this.y + x.y)
    }

    return new vec2(this.x + x, this.y + y)
  }

  scl(s:number|vec2 = 0): vec2{
    if(typeof s === 'object'){
      return new vec2(this.x*s.x, this.y*s.y)
    }

    return new vec2(this.x*s, this.y*s)
  }

  len():number{
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }

  norm():vec2{
    let l = this.len()
    if(l === 0) return new vec2(0, 0)
    return new vec2(this.x/l, this.y/l)
  }

  fn(a:any):vec2{
    return new vec2(a(this.x), a(this.y))
  }

  min(v: vec2){
    return new vec2(Math.min(this.x, v.x), Math.min(this.x, v.y))
  }

  max(v: vec2){
    return new vec2(Math.max(this.x, v.x), Math.max(this.x, v.y))
  }

  dot(v: vec2){
    return this.x*v.x + this.y*v.y
  }

}

export class rect {
  size: vec2
  position: vec2

  center: vec2

  constructor(pos: vec2, size: vec2){
    this.position = pos
    this.size = size

    this.center = this.position.add(this.size).scl(1/2)
  }

  isInside(point: vec2){
    let insideX = (point.x > this.position.x) && (point.x < (this.position.x + this.size.x))
    let insideY = (point.y > this.position.y) && (point.y < (this.position.y + this.size.y))
    return insideX && insideY
  }


}

export enum parameter_type {
  universal,
  entity_scoped,
  universal_percentage
}

export class parameter {
  static paramList: parameter[] = []
  static emitter: EventEmitter = new EventEmitter()

  min: number
  max: number
  type: parameter_type
  name: string

  value: number
  _values: number[]

  dependecies: any[] = []

  n: parameter|null

  constructor(min: number, max:number, type: parameter_type, name: string = 'none', nparam: parameter|null = null){
    if(type === parameter_type.universal_percentage){
      // ignore min / max assignment
      this.min = 0
      this.max = 1
    } else {
      this.min = Math.min(min, max)
      this.max = Math.max(min, max)
    }

    this.type = type
    this.name = name

    this.n = nparam || parameter.getParameterByName('nEntities')

    this.value = (this.max - this.min)/2 + this.min
    this._values = []
    if(this.type === parameter_type.entity_scoped){
      if(this.n){
        this.n.registerDependency(this._updateHandler.bind(this))
        for(let i=0; i<this.n.getValue(); i++){
          this._values.push(this._randomValue())
        }
      }
    }

    parameter.paramList.push(this)
    // console.log(parameter.paramList)
    parameter.emitter.emit('paramAdded', this)
  }

  _updateHandler(param: parameter|null = null){
    if(param && param.name === 'nEntities'){
      let n = this._values.length
      let diff = param.getValue() - n
      for(let i=0; i<Math.abs(diff); i++) (diff>0)? this._values.push(0) : this._values.pop()
    }

    //update all values
    this._updateValues()

    // pass change event onto dependencies :)
    for(let cb of this.dependecies){
      setImmediate(cb, this)
    }
  }

  _randomValue(): number{
    let rnd:number = Math.random()
    let val:number = (this.max - this.min)*rnd + this.min
    return val
  }

  _updateValues(){
    if(this.n){
      for(let i=0; i<this.n.getValue(); i++){
        this._values[i] = this._randomValue()
      }
    }
  }

  registerDependency(callback: any){
    this.dependecies.push(callback)
  }

  valueOf(): number{
    return 10
  }

  getValue(id: number = 0): number {
    switch(this.type){
      case parameter_type.universal:
      case parameter_type.universal_percentage:
        return this.value
      case parameter_type.entity_scoped:
        if(id < 0) id = 0
        if(id >= this._values.length) id = this._values.length-1
        return this._values[id]
    }
    return 0
  }

  setValue(val: number){
    if(val > this.max) val = this.max
    if(val < this.min) val = this.min
    this.value = val
    this._updateHandler()
  }

  setMin(val: number){
    this.min = (this.type === parameter_type.universal_percentage)? 0 : val
    this._updateHandler()
  }

  setMax(val: number){
    this.max = (this.type === parameter_type.universal_percentage)? 1 : val
    this._updateHandler()
  }




  static getParametersByName(name: string){
    let params:parameter[] = []
    for(let param of parameter.paramList){
      if(param.name === name) params.push(param)
    }
    return params
  }

  static getParameterByName(name: string): parameter|null{
    return this.getParametersByName(name)[0]
  }

  static getParameterByNameOrCreate(name: string, type:parameter_type=parameter_type.entity_scoped, min:number=0, max:number= 1): parameter{
    let _param = this.getParametersByName(name)[0]
    if(!_param){
      _param = new parameter(min, max, type, name)
    }

    return _param
  }

  static getParameters(){
    return parameter.paramList
  }

}

export class ruler {
  static element: HTMLElement|null
  static checkLength(str: string, fontStyle: string){
    if(!ruler.element){
      ruler._getElement()
    }
    if(!ruler.element) return 0
    ruler.element.style.font = fontStyle
    ruler.element.innerHTML = str
    return ruler.element.offsetWidth
  }

  static checkHeight(str: string, fontStyle: string){
    if(!ruler.element){
      ruler._getElement()
    }
    if(!ruler.element) return 0
    ruler.element.style.font = fontStyle
    ruler.element.innerHTML = str
    return ruler.element.offsetHeight
  }

  static _getElement(){
    // document.write('<span id="ruler"></span>')
    ruler.element = document.createElement('span') as HTMLElement
    document.body.appendChild(ruler.element)
    ruler.element.style.visibility = 'hidden'
    ruler.element.style.position = 'absolute'
    ruler.element.style.top = '0'
    ruler.element.style.whiteSpace = 'nowrap'
  }
}
