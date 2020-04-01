import { boid } from './boids'
import { vec2, rect, parameter, parameter_type } from './utils'
import { sickness, sickness_state } from './pandemic'

export class distanceElement{
  dist: number = 0
  vec: vec2 = new vec2()
}

export function distanceAccelerator(entities: boid[]): distanceElement[][]{
  let n = entities.length
  let distMatrix: distanceElement [][] = []


  let tmp: distanceElement[] = []
  for(let i=0; i<n; i++){
    tmp = []
    // for(let ii=0; ii<n; ii++){
    //   tmp.push({dist: 0, vec: new vec2()})
    // }
    distMatrix.push(tmp)
  }

  for(let i=0; i<n; i++){
    for(let ii=i; ii<n; ii++){
      let dvec = entities[i].position.sub(entities[ii].position)
      let dist = dvec.len()
      distMatrix[i][ii] = {dist:dist, vec: dvec}
      distMatrix[ii][i] = {dist:dist, vec: dvec.scl(-1)}
    }
  }
  return distMatrix
}

export class boidRule {
  ruleName: string;

  constructor(name:string){
    this.ruleName = name;
    console.log('Constructed new rule w/ name:', name)
  }

  executeRule(entity: boid, entities: boid[], distanceMatrix:distanceElement[][]): vec2{
    console.log('Excuting base rule :)')
    return new vec2()
  }

  weightRule(dir: vec2, entity: boid): vec2{
    let weightParamNormal = parameter.getParameterByNameOrCreate(`${this.ruleName} weight`)
    let weightParamSick = parameter.getParameterByNameOrCreate(`${this.ruleName} weight (sick)`)

    let weightParam = (entity.immuneState === sickness_state.sick)? weightParamSick : weightParamNormal
    return dir.scl(weightParam.getValue(entity.id))
  }

}

export class socialRule extends boidRule{

  view_distance: parameter
  entity_size: parameter

  constructor(){
    super('SocialRule')
    this.view_distance = parameter.getParameterByNameOrCreate('View Distance', parameter_type.universal, 10, 30)
    this.entity_size = parameter.getParameterByNameOrCreate('EntitySize', parameter_type.universal, 4, 8)
  }

  executeRule(entity: boid, entities: boid[], distanceMatrix:distanceElement[][]): vec2 {
    let nEntities = distanceMatrix.length
    let viewDistance = this.view_distance.getValue()

    let rule_dir = new vec2()
    for(let i:number=0; i<nEntities; i++){
      let _entity = entities[i]
      if(entity === _entity) continue
      //let distEl = distanceMatrix[entity.id][i]
      let dist = entity.position.sub(_entity.position)
      if(dist.len() < viewDistance){
        // if(dist <= this.entity_size.getValue(id)*1.2) continue
        rule_dir = rule_dir.add(dist.fn((e:number) => 1/e))
      }
    }
    return rule_dir.norm()
  }

}

export class randomRule extends boidRule{

  constructor(){
    super('randomRule')
  }

  executeRule(entity: boid, entities: boid[], distanceMatrix:distanceElement[][]): vec2 {
    let x = (Math.random() - 0.5) * 2
    let y = (Math.random() - 0.5) * 2

    let rule_dir = new vec2(x, y)
    return rule_dir.norm()
}

}

export class avoidanceRule extends boidRule{
  avoidance_distance: parameter;


  constructor(){
    super('avoidanceRule')

    this.avoidance_distance = parameter.getParameterByNameOrCreate('Avoidance Distance', parameter_type.universal, 10, 30)

  }

  executeRule(entity:boid, entities: boid[], distanceMatrix:distanceElement[][]): vec2 {
    let nEntities: number = distanceMatrix.length

    let avoidanceDistance = this.avoidance_distance.getValue()

    let rule_dir: vec2 = new vec2()

    // TODO extract this into new method.
    for(let i=0; i<nEntities; i++){
      let _entity = entities[i]
      if(entity === _entity) continue
      //let distEl = distanceMatrix[entity.id][i]
      let dist = _entity.position.sub(entity.position)
      if(dist.len() < avoidanceDistance){
        rule_dir = rule_dir.add(dist.fn((e:number) => 100 * 1/e))
      }
    }

    return rule_dir.norm()
  }

}

/*
This rule does not return a distance, but abuses the rule interface to handle infections...
*/
export class sicknessRule extends boidRule{
  infection_distance: parameter;

  constructor(){
    super('sicknessRule')
    this.infection_distance = parameter.getParameterByNameOrCreate('Infection Distance', parameter_type.universal, 10, 15)
  }

  weightRule(dir: vec2, entity: boid): vec2{
    return dir;
  }

  executeRule(entity: boid, entities: boid[], distanceMatrix:distanceElement[][]): vec2 {

    let nEntities: number = distanceMatrix.length

    let infecting = entity.infection.state === sickness_state.incubating || entity.infection.state === sickness_state.sick

    let infectionDistance = this.infection_distance.getValue()

    // TODO extract this into new method.
    for(let i=0; i<nEntities; i++){
      let _entity = entities[i]
      if(entity === _entity) continue
      //let distEl = distanceMatrix[entity.id][i]
      let dist = entity.position.sub(_entity.position)

      // let distEl: distanceElement = distanceMatrix[id][i]
      if(dist.len() < infectionDistance && infecting){
        // possibly infect the other boid...
        let otherEntity = entities[i]
        otherEntity.inVirusVicinity()
      }
    }

    return new vec2()
  }

}
