import { vec2, rect, parameter, parameter_type } from "./utils";
import { boidRule, distanceAccelerator, distanceElement} from './boidRules'
import { sickness, sickness_state } from './pandemic'

import { graphedVariable } from './grapher'

type timerHandle = number;

export class boidEngineConfig {
  maxEntities: number = 500;
  minEntitySize: number = 3;
  maxEntitySize: number = 3;

  fps: number|null = null;

  continuum: boolean = true;
}

export class boidRuleConfig {

}

export class boidEngine {

  nEntities: parameter
  ctx: CanvasRenderingContext2D

  size: vec2
  bound_size: vec2
  _hbs: vec2

  entity_size: parameter

  entities: boid[]
  entitiesToBeRemoved: boid[] = []
  resetInNext: boolean = false

  renderIntervalID: timerHandle|null = null
  updateIntervalID: timerHandle|null = null
  updateInterval: number = 0;

  entitiesToInfect: parameter

  rules: boidRule[] = []

  continuum: boolean;

  // graphed data:
  gv_EntitiesAlive: graphedVariable
  gv_EntitiesInfected: graphedVariable
  gv_EntitiesSick: graphedVariable
  gv_EntitesImmune: graphedVariable
  gv_EntitiesDead: graphedVariable

  // Initialization

  constructor(ctx: CanvasRenderingContext2D, options: boidEngineConfig = new boidEngineConfig()){
    this.ctx = ctx

    this.nEntities = new parameter(10, options.maxEntities, parameter_type.universal, 'nEntities')
    this.nEntities.registerDependency(this._parameterUpdateHandler.bind(this))

    let eps = parameter.getParameterByName('EntitySize')
    this.entity_size = (eps)? eps :  new parameter(options.minEntitySize, options.maxEntitySize, parameter_type.entity_scoped, 'EntitySize')
    this.entity_size.registerDependency(this._parameterUpdateHandler.bind(this))

    this.entitiesToInfect = parameter.getParameterByNameOrCreate('# Infected at Start', parameter_type.universal, 0, 10)

    this.continuum = options.continuum

    let width:number = this.ctx.canvas.width
    let height:number = this.ctx.canvas.height

    this.size = new vec2(width, height)

    this.bound_size = this.size.sub(this.entity_size.getValue()*4)
    this._hbs = this.bound_size.scl(1/2)
    this.entities = []

    this._initBoids()

    if(options.fps){
      let frametime = 1000/options.fps;
      this.startRenderInterval(frametime)
      this.startUpdateInterval(frametime)
      this.updateInterval = frametime;
    }
    this.gv_EntitiesAlive = graphedVariable.getGraphVariableByNameOrCreate('Entites Alive', '#198c19')
    this.gv_EntitiesInfected = graphedVariable.getGraphVariableByNameOrCreate('Entites Infected' , '#73e500')
    this.gv_EntitiesSick = graphedVariable.getGraphVariableByNameOrCreate('Entites Sick', '#ff4c4c')
    this.gv_EntitesImmune = graphedVariable.getGraphVariableByNameOrCreate('Entites Immune', '#004c00')
    this.gv_EntitiesDead = graphedVariable.getGraphVariableByNameOrCreate('Entities Dead', '#b20000')

    window.addEventListener('resize', () => setTimeout(this.resizeEvent.bind(this), 10))
  }

  resizeEvent(){
    let width:number = this.ctx.canvas.width
    let height:number = this.ctx.canvas.height

    this.size = new vec2(width, height)

    this.bound_size = this.size.sub(this.entity_size.getValue()*4)
    this._hbs = this.bound_size.scl(1/2)
  }

  infectOne(){
    let idx = Math.floor(this.entities.length * Math.random())
    this.entities[idx].setImmuneSystemState(sickness_state.incubating)
  }

  boidStateUpdateHandler(entity: boid, state: sickness_state){
    console.log(`boid #${entity.id} state is now: ${state}`)
    if(state === sickness_state.deceased){
      //console.log 'removing boid'
      this.entitiesToBeRemoved.push(entity)
    }
  }

  _generateNewBoid(){
    let id = this.entities.length
    // choose a new starting point randomly :)
    let _x = Math.random()
    let _y = Math.random()
    let _pos = new vec2(_x, _y).scl(this.bound_size)

    // generate a new entity
    let _ent = new boid(_pos, this.entity_size, id)

    _ent.onImmuneSystemStateUpdated = this.boidStateUpdateHandler.bind(this, _ent)

    this.entities.push(_ent)
  }

  _initBoids(){
    for(let i=0; i<this.nEntities.getValue(); i++){
      this._generateNewBoid()
    }
    for(let i =0; i<this.entitiesToInfect.getValue(); i++){
      this.infectOne()
    }
  }

  _parameterUpdateHandler(param: parameter){
    switch(param.name){
      case 'nEntities':
        let n = param.getValue()
        let diff = n - this.entities.length
        for(let i=0; i<Math.abs(diff); i++) (diff > 0)? this._generateNewBoid() : this.entities.pop()
      break;
      case 'EntitySize':
        this.bound_size = this.size.sub(this.entity_size.getValue()*4)
      break;
    }
  }

  // Render/Update Intervals

  startRenderInterval(interval: number){
    if(this.renderIntervalID !== null){
      clearInterval(this.renderIntervalID)
    }
    this.renderIntervalID = setInterval(this._render.bind(this), interval) as unknown as number
  }

  stopRenderInterval(){
    if(this.renderIntervalID){
      clearInterval(this.renderIntervalID)
      this.renderIntervalID = null
    }
  }

  startUpdateInterval(interval: number){
    if(this.updateIntervalID !== null){
      clearInterval(this.updateIntervalID)
    }
    this.updateIntervalID = setInterval(this._update.bind(this), interval) as unknown as number

    this.updateInterval = interval
  }

  stopUpdateInterval(){
    if(this.updateIntervalID){
      clearInterval(this.updateIntervalID)
      this.updateIntervalID = null
    }
  }

  // interface Methods

  reset(){
    this.entities = []
    this._initBoids()
  }

  addRule(_rule: boidRule){
    console.log(_rule)
    this.rules.push(_rule)
  }

  clearRules(){
    this.rules = []
  }

  // Render/Update Methods

  _render(){
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.beginPath();

    let id=0
    for(let entity of this.entities){
      this.ctx.beginPath();
      this.ctx.arc(entity.position.x, entity.position.y, this.entity_size.getValue(id)/2, 0, 2 * Math.PI, false);
      switch(entity.immuneState){
        case sickness_state.cured:
        this.ctx.fillStyle = '#004c00';
        break;

        case sickness_state.healthy:
        this.ctx.fillStyle = '#198c19';
        break;

        case sickness_state.incubating:
        this.ctx.fillStyle = '#ffff7f';
        break;

        case sickness_state.sick:
        this.ctx.fillStyle = '#ff4c4c';
        break;
      }

      this.ctx.fill();
      id ++
    }
  }

  _updateGraphData(){
    let nEntitesMax = this.nEntities.getValue()
    let nAlive: number = this.entities.length
    let nInfected: number = 0
    let nSick: number = 0
    let nImmune: number = 0
    let nDead: number = nEntitesMax - this.entities.length

    for(let ent of this.entities){
      switch(ent.immuneState){
        case sickness_state.cured:
          nImmune ++
          break;
        case sickness_state.incubating:
          nInfected ++
          break;
        case sickness_state.sick:
          nSick ++
          break;
      }
    }

    this.gv_EntitiesAlive.appendValue(nAlive)
    this.gv_EntitiesInfected.appendValue(nInfected)
    this.gv_EntitiesSick.appendValue(nSick)
    this.gv_EntitesImmune.appendValue(nImmune)
    this.gv_EntitiesDead.appendValue(nDead)
  }

  _update(){
    if(this.resetInNext){
      this.entities = []
      this._initBoids()
      this.resetInNext = false;
    }

    if(this.entities.length > 0) this._updateGraphData();
    for(let ent of this.entitiesToBeRemoved){
      this.entities.splice(this.entities.indexOf(ent), 1)
    }
    this.entitiesToBeRemoved = []
    //console.log('stepping panda')
    let diff = this.updateInterval;
    //TODO calulate distance matrix
    let distMatrix = distanceAccelerator(this.entities)
    //let rules_list = [rules.socialRule, rules.randomRule, rules.makeBorderRule(this.size)]

    for(let entity of this.entities){
      entity.update(diff, this.entities, distMatrix, this.rules)
    }

    if(this.continuum){
      let id = 0
      for(let entity of this.entities){
        let point = entity.position
        if(point.x < -this.entity_size){
          entity.position.x += this.size.x + entity.size
        }else if (point.x > (this.size.x + this.entity_size.getValue(id))){
          entity.position.x -= this.size.x + entity.size
        }

        if(point.y < -this.entity_size){
          entity.position.y += this.size.y + entity.size
        }else if (point.y > (this.size.y + this.entity_size.getValue(id))){
          entity.position.y -= this.size.y + entity.size
        }
        id ++
      }
    }
  }

  restart(){
    console.log('restarting be')

    this.resetInNext = true

    this.gv_EntitiesAlive.resetData()
    this.gv_EntitiesInfected.resetData()
    this.gv_EntitiesSick.resetData()
    this.gv_EntitesImmune.resetData()
    this.gv_EntitiesDead.resetData()
  }

}

let limit = (min: number, max: number, val:number) => {
  if(val < min) return min
  if(val > max) return max
  return val
}

let limit_vec_len = (vec:vec2, limit:number) => {
  let len = vec.len()
  if(len>limit) return vec.norm().scl(limit)
  return vec
}

export class boid {
  position: vec2
  velocity: vec2 = new vec2()
  state: string
  _size: parameter

  id: number

  acceleration: parameter
  speed: parameter

  infection: sickness
  ImmuneSystemStateUpdateHandler: any | null

  constructor(pos: vec2 = new vec2(), size:parameter, id:number=0) {
    this.position = pos
    this._size = size
    this.state = 'base'

    this.id = id

    this.acceleration = parameter.getParameterByNameOrCreate('Entity Acceleration', parameter_type.universal, 15, 25)
    this.speed = parameter.getParameterByNameOrCreate('Entity Speed', parameter_type.universal, 15, 20)

    this.infection = new sickness()
  }

  update(diff: number, entities:boid[], distanceMatrix:distanceElement[][], rules: boidRule[]){
    let walk_dir = new vec2()

    for(let idx=0; idx < rules.length; idx ++){
      let rule = rules[idx]

      // get the corresponding parameter :)
      let rule_dir = rule.executeRule(this, entities, distanceMatrix)
      rule_dir = rule.weightRule(rule_dir, this)
      walk_dir = walk_dir.add(rule_dir)
    }
    let walk_acc = walk_dir.norm().scl(this.acceleration.getValue() * diff/1000)
    this.velocity = this.velocity.add(walk_acc)
    this.velocity = limit_vec_len(this.velocity, this.speed.getValue())

    let new_position = this.position.add(this.velocity.scl(diff/1000))
    // console.log(new_position.sub(this.position).len())

    this.position = this._resolveCollisions(new_position, walk_dir, entities)

    this.infection.update(diff)
  }

  inVirusVicinity(){
    this.infection.inVirusVicinity()
  }

  setImmuneSystemState(state: sickness_state){
    this.infection.state = state
  }

  // TODO move this to the engine :)
  _resolveCollisions(newpos: vec2, walk_dir: vec2, entities:boid[]): vec2{
    // could be sped up by only checking entities which were in the neighborhood before via max_walk_dist & distanceMatrix

    let nEntities = entities.length

    for(let i=0; i<nEntities; i++){
      let entity = entities[i]
      if(entity === this) continue
      let dvec = entities[i].position.sub(newpos)
      let len = dvec.len()

      let mindist = this.size/2 + entities[i].size/2
      if(len < mindist){
        let resolve_vector = dvec.norm().scl(mindist - len)
        // entities[i].position = entities[i].position.add(dvec.scl(0.25))
        newpos = newpos.sub(resolve_vector)
      }
    }

    return newpos
  }

  get size(): number{
    return this._size.getValue(this.id)
  }

  get immuneState(){
    return this.infection.state
  }

  set onImmuneSystemStateUpdated(callback: any){
    this.infection.onStateUpdated = callback
  }

}

/*


size: vec2
bound_size: vec2
_hbs: vec2
entities: pandaEntity[]

constructor(ctx: CanvasRenderingContext2D, n: number){


  this.ctx = ctx
*/
