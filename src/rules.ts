import { pandaEntity } from './panda'
import { vec2 } from './utils'
const ENTITY_SIZE = 3

export let socialRule = (entity: pandaEntity, entities: pandaEntity[]) => {

  let rule_dir = new vec2()

  for(let _ent of entities){
    if(entity == _ent) continue
    let dir = _ent.position.sub(entity.position)
    let dist = dir.len()

    dir = dir.norm()

    if(dist < 20){
      if(dist < 2*ENTITY_SIZE){
        rule_dir = rule_dir.sub(dir).scl(0.8)
      }else{
        rule_dir = rule_dir.add(dir).scl(1.2)
      }
    }
  }
  return rule_dir.norm()
}

export let randomRule = (entity: pandaEntity, entities: pandaEntity[]) => {

  let x = (Math.random() - 0.5) * 2
  let y = (Math.random() - 0.5) * 2

  let rule_dir = new vec2(x, y)
  return rule_dir.norm()
}

export let makeBorderRule = (size: vec2) => {

  let center = size.scl(1/2)
  let bounds = center.sub(10 * ENTITY_SIZE)

  let n2 = (vec: vec2) => {
    return vec.x + vec.y
  }

  let boundVec = (vec: vec2) => {
    let signVec = vec.fn(Math.sign)
    vec = vec.fn(Math.abs)

    let d2bounds = bounds.sub(vec)

    if(n2(d2bounds) < 0){
      vec = signVec
    }else{
      vec = new vec2(0, 0)
    }
    return vec
  }

  let borderRule = (entity: pandaEntity, entities: pandaEntity[]) => {
    let rule_dir = center.sub(entity.position)
    rule_dir = boundVec(rule_dir)

    return rule_dir.norm()
  }

  return borderRule
}
