import { vec2 } from "./utils";
import * as rules from "./rules"

const ENTITY_SIZE = 3
const FPS_TARGET = 20
const FRAMETIME = 1000/FPS_TARGET

const ENTITY_SPEED = 10

export class pandaEntity {
  /*
  Basically Rule based boids
  */
  position: vec2

  constructor(options: any){
    options = options || {}
    this.position = options.pos || new vec2()
  }

  _step(diff: number, entities: pandaEntity[], rules: any[]){

    let walk_dir = new vec2()

    for(let rule of rules){
      let rule_dir = rule(this, entities)
      walk_dir = walk_dir.add(rule_dir)
    }

    walk_dir = walk_dir.norm().scl(ENTITY_SPEED * diff/1000)
    this.position = this.position.add(walk_dir)
  }

  _render(ctx: CanvasRenderingContext2D){
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, ENTITY_SIZE, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
  }
}

export class pandaemic {

  ctx: CanvasRenderingContext2D

  size: vec2
  bound_size: vec2
  _hbs: vec2
  entities: pandaEntity[]

  constructor(ctx: CanvasRenderingContext2D, n: number){
    let width:number = ctx.canvas.width
    let height:number = ctx.canvas.height

    this.size = new vec2(width, height)
    this.bound_size = this.size.sub(ENTITY_SIZE*4)
    this._hbs = this.bound_size.scl(1/2)
    this.entities = []

    this.ctx = ctx

    for(let i=0; i<n; i++){
      // choose a new starting point randomly :)
      let _x = Math.random()
      let _y = Math.random()
      let _pos = new vec2(_x, _y).scl(this.bound_size)

      // generate a new entity
      let _ent = new pandaEntity({pos:_pos})
      this.entities.push(_ent)
    }

  }

  _step(){
    //console.log('stepping panda')
    let diff = 20;
    let rules_list = [rules.socialRule, rules.randomRule, rules.makeBorderRule(this.size)]
    for(let entity of this.entities){
      entity._step(diff, this.entities, rules_list)
    }
  }

  _render(){
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.beginPath();

    for(let entity of this.entities){
      entity._render(this.ctx)
    }
  }
}
