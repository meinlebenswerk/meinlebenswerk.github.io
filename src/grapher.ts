import { vec2, ruler } from './utils'
import { EventEmitter } from 'events'

type timerHandle = number;

export class graphedVariable {
  static variableList: graphedVariable[] = []
  static emitter: EventEmitter = new EventEmitter()

  name: string
  color: string

  values: number[]
  n: number

  constructor(name: string = 'none', color: string = '#000'){
    this.name = name
    this.color = color

    this.n = 0
    this.values = []

    graphedVariable.variableList.push(this)
    // console.log(parameter.paramList)
    graphedVariable.emitter.emit('paramAdded', this)
  }

  appendValue(val: number){
    this.values.push(val)
    graphedVariable.emitter.emit('variableUpdated', val, this)
  }

  get data(){
    // TODO add preprocessing?
    return this.values
  }

  resetData(){
    this.n = 0
    this.values = []
  }

  static on(event: string, callback: any){
    graphedVariable.emitter.on(event, callback)
  }

  static getGraphVariableByName(name: string): graphedVariable|null{
    let vars: graphedVariable[] = []
    for(let variable of graphedVariable.variableList){
      if(variable.name === name) vars.push(variable)
    }

    if(vars.length === 0) return null
    return vars[0]
  }

  static getGraphVariableByNameOrCreate(name: string, color: string): graphedVariable{
    let _var = this.getGraphVariableByName(name)
    if(!_var){
      _var = new graphedVariable(name, color)
    }
    return _var
  }

  static getGraphedVariables(){
    return graphedVariable.variableList
  }

}


export class grapher{
  values: number[][]
  ctx: CanvasRenderingContext2D
  size: vec2
  sizeChanged: boolean = false

  maxVal: number
  minVal: number
  boundsChanged: boolean

  xScale: number
  yScale: number
  stepSize: number
  margin: number = 10
  rowSize: number

  varNamesWidthPx: number = 0
  fontSizePt: number = 10
  colorDotSizePx: number = 4
  varNameSizePx: number = 25

  legendSize: number = 50
  nRows = 4

  dataChanged: boolean = true

  updateIntervalID: timerHandle|null = null

  constructor(ctx: CanvasRenderingContext2D){
    this.values = []
    this.ctx = ctx

    this.minVal = 0
    this.maxVal =  1
    this.boundsChanged = true

    let width:number = this.ctx.canvas.width
    let height:number = this.ctx.canvas.height

    this.size = new vec2(width, height)
    graphedVariable.on('variableUpdated', this.varUpdatedListener.bind(this))
    graphedVariable.on('paramAdded', this.varAddedListener.bind(this))

    // set these values for your data
    let sections = 12;
    this.stepSize = 40;
    this.rowSize = 50;

    this.yScale = (this.size.y - 2*this.margin) / (this.maxVal - this.minVal);
    this.xScale = (this.size.x - this.rowSize) / sections;

    this.startUpdateInterval(100)

    this.redrawLegend()
    window.addEventListener('resize', () => setTimeout(this.resizeEvent.bind(this), 10))

    this._updateLengendSizing()
  }

  resizeEvent(){
    let width:number = this.ctx.canvas.width
    let height:number = this.ctx.canvas.height

    this.size = new vec2(width, height)
    this.yScale = (this.size.y - 2*this.margin) / (this.maxVal - this.minVal);
    this.sizeChanged = true
    this._updateLengendSizing()
  }

  _updateLengendSizing(){

    let fontsize_px = this.size.y / 13
    this.fontSizePt = fontsize_px*0.75
    let fontStyle = `${this.fontSizePt.toFixed(1)}pt Oswald`

    this.varNameSizePx = fontsize_px * 1.5
    this.colorDotSizePx = Math.min(4, this.varNameSizePx/3)


    let maxSizePx = 0
    for (let _var of graphedVariable.variableList){
      let nameSizePx = ruler.checkLength(_var.name + 'aa', fontStyle)
      maxSizePx = Math.max(maxSizePx, nameSizePx)
      // console.log(_var.name + '=>' + nameSizePx)
    }
    this.varNamesWidthPx = maxSizePx + 2*this.colorDotSizePx

    this.legendSize = 2 * ruler.checkLength(this.maxVal.toFixed(1), fontStyle)
  }

  varAddedListener(_var: graphedVariable){
    this._updateLengendSizing()
  }

  varUpdatedListener(newval: number, _var: any): void {
    if(newval < this.minVal){
      this.minVal = newval
      this.boundsChanged = true
      this._updateLengendSizing()
    }
    if(newval > this.maxVal){
      this.maxVal = newval
      this.boundsChanged = true
      this._updateLengendSizing()
    }
    this.dataChanged = true
  }

  startUpdateInterval(interval: number){
    if(this.updateIntervalID !== null){
      clearInterval(this.updateIntervalID)
    }
    this.updateIntervalID = setInterval(this.update.bind(this), interval) as unknown as number
  }

  update(){
    if(!this.dataChanged) return
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if(this.boundsChanged){
      this.yScale = (this.size.y - 2*this.margin) / (this.maxVal - this.minVal);
      // this.xScale = (this.size.x - this.rowSize) / sections;
      this.boundsChanged = false
    }

    this.redrawLegend()
    this.plotAllGraphVariables()
    // console.log(this)
    this.dataChanged = false
  }

  redrawLegend(){
    this.ctx.fillStyle = "#997f89"
    this.ctx.font = `${this.fontSizePt.toFixed(1)}pt Oswald`
    // this.ctx.font = '10pt Oswald'

    let idx = 0
    let offset = this.size.y - graphedVariable.getGraphedVariables().length * this.varNameSizePx
    offset = offset / 2
    for (let _var of graphedVariable.variableList){
      this.ctx.fillStyle = _var.color
      // this.ctx.fillText(_var.name, this.margin, 20);
      this.ctx.fillStyle = '#292c2e'
      let y = offset + this.margin + idx*this.varNameSizePx
      this.ctx.fillText(_var.name, this.margin + this.legendSize, y);
      this.ctx.fillStyle = _var.color
      this.ctx.beginPath();
      this.ctx.arc(this.margin - 8 + this.legendSize,  y - 4, this.colorDotSizePx, 0, 2 * Math.PI, false);
      this.ctx.fill()
      idx ++
    }

    let stepSize = (this.maxVal - this.minVal) / this.nRows
    // print row header and draw horizontal grid lines
    var count =  0;
    this.ctx.strokeStyle="#997f89"; // color of grid lines
    for (let scale=this.maxVal; scale>=this.minVal; scale = scale - stepSize) {
      var y = this.margin + (this.yScale * count * stepSize);

      this.ctx.fillText(scale.toFixed(1), this.margin, y + this.margin/2);
      this.ctx.moveTo(this.legendSize + this.varNamesWidthPx ,y)
      this.ctx.lineTo(this.size.x - this.margin,y)
      count++;
    }
    this.ctx.stroke();
  }

  plotAllGraphVariables(){
    this.ctx.translate(this.legendSize, 0);
    let variables = graphedVariable.getGraphedVariables()
    for(let gv of variables){
      this.ctx.strokeStyle = gv.color
      this.plotData(gv.data)
    }
    this.ctx.translate(-this.legendSize, 0);
  }

  plotData(dataSet: number[]) {
    let sections = dataSet.length
    // let rowsize = this.size.x / sections
    let xScale = this.size.x / sections;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.yScale * (this.maxVal - dataSet[0]) + this.margin);
    for (let i=1;i<sections;i++) {
      this.ctx.lineTo(i * xScale, this.yScale * (this.maxVal - dataSet[i]) + this.margin);
    }
    this.ctx.stroke();
    }

  reset(){
    this.minVal = 0
    this.maxVal =  1
    this.yScale = (this.size.y - 2*this.margin) / (this.maxVal - this.minVal);
  }
}
