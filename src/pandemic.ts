import { parameter, parameter_type } from './utils'

export enum immune_system_state {
  healthy,
  incubating,
  sick,
  deceased,
  immune
}

export class immune_system {
  mortality_rate: parameter
  infection_rate: parameter
  incubation_time: parameter
  healing_time: parameter
  immune_time: parameter

  _state: immune_system_state
  timer: number;

  onStateUpdated: any|null;

  constructor(){
    this.mortality_rate = parameter.getParameterByNameOrCreate('Mortality Rate', parameter_type.universal_percentage)
    this.infection_rate = parameter.getParameterByNameOrCreate('Infection Rate', parameter_type.universal_percentage)
    this.incubation_time = parameter.getParameterByNameOrCreate('Incubation Time', parameter_type.universal, 0, 100)
    this.healing_time = parameter.getParameterByNameOrCreate('Healing Time', parameter_type.universal, 0, 100)
    this.immune_time = parameter.getParameterByNameOrCreate('Immune Time', parameter_type.universal, 0, 100)

    this._state = immune_system_state.healthy
    this.timer = 0
  }

  makeSick(){
    if(this.state !== immune_system_state.deceased){
      this.state = immune_system_state.sick;
    }
  }

  set state(newstate: immune_system_state){
    this._state = newstate
    if(this.onStateUpdated) this.onStateUpdated(this._state)
  }

  get state(){
    return this._state
  }

  update(diff: number){
    switch(this.state){
      case immune_system_state.healthy:
        // do nothing :)
      break;
      case immune_system_state.incubating:
        this.timer += diff
        if(this.timer > this.incubation_time.getValue()*1000){
          this.state = immune_system_state.sick
          this.timer = 0
        }
      break;
      case immune_system_state.sick:
        this.timer += diff
        if(this.timer > this.healing_time.getValue()*1000){
          let rnd = Math.random()
          if(rnd > this.mortality_rate.getValue()){
            this.state = immune_system_state.immune
          }else{
            this.state = immune_system_state.deceased
          }
          this.timer = 0
        }
      break;
      case immune_system_state.deceased:
        // can't do anything :)
      break;
      case immune_system_state.immune:
        this.timer += diff
        if(this.timer > this.immune_time.getValue()*1000){
          this.state = immune_system_state.healthy
          this.timer = 0
        }
      break;
    }
  }

  get infectable() {
    return this._state === immune_system_state.healthy
  }

  inVirusVicinity(){
    if(!this.infectable) return
    let _rnd = Math.random()
    if(_rnd <= this.infection_rate.getValue()){
      this.state = immune_system_state.incubating
    }
  }



}
