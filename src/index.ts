import * as boids from "./boids";
import * as rules from "./boidRules"
import { vec2, rect, parameter, parameter_type } from './utils'
import { ParameterController } from './parametercontrol'
import { grapher } from './grapher'



let initCanvas = (canvasElement: HTMLCanvasElement, container: HTMLElement) => {
  let canvasContext: CanvasRenderingContext2D|null = canvasElement.getContext('2d');

  let resizeHandler = () => {
    let h = canvasElement.clientHeight
    let w = canvasElement.clientWidth

    // Experimental oversize handler, for mobile
    if(h < 400 || w < 400){
      h = h*2
      w = w*2
    }

    if(canvasContext){
      canvasContext.canvas.width  = w;
      canvasContext.canvas.height = h;
    }

  }

  window.addEventListener('resize', resizeHandler);

  resizeHandler()

  return canvasContext
}

let _initPandaemicApplication = (canvas: HTMLCanvasElement) => {
  let container: HTMLElement|null = document.getElementById('be_canvas_container')
  if(!container) return
  let ctx = initCanvas(canvas, container)
  if(!ctx) return

  let options = new boids.boidEngineConfig()
  options.maxEntities = 200
  options.maxEntitySize = 8
  options.minEntitySize = 8
  options.fps = 25

  let be = new boids.boidEngine(ctx, options)

  let randr = new rules.randomRule()
  be.addRule(randr)

  let socr = new rules.socialRule();
  be.addRule(socr)

  let avr = new rules.avoidanceRule()
  be.addRule(avr)

  let sickr = new rules.sicknessRule()
  be.addRule(sickr)

  window.infectOne = be.infectOne.bind(be)

  // be.startRenderInterval(100)
  // setInterval(be.reset.bind(be), 1000)
  return be
}

let _initParameterController = () => {
  let param_container = document.getElementById('p_container')
  let app_window = document.getElementById('window')


  if(param_container && app_window){
    param_container.style.maxHeight = 0.95*app_window.getBoundingClientRect().height + 'px';
    let _ctrl = new ParameterController(param_container)
  }
}

let _initGrapher = (canvas: HTMLCanvasElement) => {

  let container: HTMLElement|null = document.getElementById('graph_canvas_container')
  if(!container) return

  let ctx = initCanvas(canvas, container)
  if(!ctx) return
  let _grapher = new grapher(ctx)
  return _grapher
}

let _initControls = (be: boids.boidEngine, gr: grapher) => {
  let btnRestart: HTMLElement|null = document.getElementById('btn_restart')
  if(btnRestart){
    btnRestart.onclick = () => {
      if(!btnRestart) return
      be.restart()
      gr.reset()
    }
  }
}

let main = () => {

  _initParameterController()

  let be = null, gr = null

  //get the grapher canvas element
  let grapherCanvasElement: HTMLCanvasElement|null = document.getElementById('graph_canvas') as HTMLCanvasElement
  if(grapherCanvasElement) gr = _initGrapher(grapherCanvasElement)

  // get the canvas element
  let canvasElement: HTMLCanvasElement|null = document.getElementById('canvas') as HTMLCanvasElement
  if(canvasElement) be = _initPandaemicApplication(canvasElement)

  if(be && gr){
    _initControls(be, gr)
  }

  // Mobile scroll test:
  window.addEventListener("load",() => {
    setTimeout(() => window.scrollTo(0, 1), 0);
  });

  /*
  for(let i=0; i<20; i++){
    let param = new parameter(0, 1, parameter_type.universal, `rule_${i}`)
  }
  */

}

window.onload = main
