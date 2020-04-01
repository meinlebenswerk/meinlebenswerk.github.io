import { parameter, parameter_type } from './utils'

export class ParameterControl {
  controller: ParameterController
  controlledParameter: parameter

  minElement: HTMLInputElement|null = null
  maxElement: HTMLInputElement|null = null
  valueSlider: HTMLInputElement|null = null

  constructor(controller: ParameterController, param: parameter){
    this.controller = controller
    this.controlledParameter = param
    this.createUIElement()
    this.attachListeners()
  }

  createUIElement(){
    let listElem = document.createElement('li');
    listElem.className = ''
    let param_ctrl = document.createElement('div')
    param_ctrl.className = 'param_options | no_select'
    param_ctrl.innerText = this.controlledParameter.name + '\n'

    if(this.controlledParameter.type === parameter_type.entity_scoped ||
       this.controlledParameter.type === parameter_type.universal){

         let label_min: HTMLLabelElement = document.createElement('label')
         label_min.htmlFor = `${this.controlledParameter.name}_min`
         label_min.innerText = 'min:'
         let input_min: HTMLInputElement = document.createElement('input')
         input_min.name = `${this.controlledParameter.name}_min`
         input_min.type = 'number'
         input_min.value = this.controlledParameter.min + ''

         let br_el = document.createElement('br')

         let label_max: HTMLLabelElement = document.createElement('label')
         label_max.htmlFor = `${this.controlledParameter.name}_max`
         label_max.innerText = 'max:'
         let input_max: HTMLInputElement = document.createElement('input')
         input_max.name = `${this.controlledParameter.name}_max`
         input_max.type = 'number'
         input_max.value = this.controlledParameter.max + ''

         this.minElement = input_min
         this.maxElement = input_max

         param_ctrl.appendChild(label_min)
         param_ctrl.appendChild(input_min)
         param_ctrl.appendChild(br_el)
         param_ctrl.appendChild(label_max)
         param_ctrl.appendChild(input_max)
    }
    listElem.appendChild(param_ctrl)

    if(this.controlledParameter.type === parameter_type.universal ||
       this.controlledParameter.type === parameter_type.universal_percentage){
      let param_setpoint = document.createElement('div')
      param_setpoint.className = 'param_setpoint'

      let param_slider: HTMLInputElement = document.createElement('input')
      param_slider.type = 'range'
      param_slider.min = '0'
      param_slider.max = '1000'
      param_slider.value = '500'

      param_setpoint.appendChild(param_slider)

      listElem.appendChild(param_setpoint)
      this.valueSlider = param_slider
    }
    this.controller.addUIElement(listElem)
  }

  attachListeners(){
    if(this.minElement){
      let _el: HTMLInputElement = this.minElement
      this.minElement.onchange = () => { this.controlledParameter.setMin(parseInt(_el.value)) }
    }

    if(this.maxElement){
      let _el: HTMLInputElement = this.maxElement
      this.maxElement.onchange = () => { this.controlledParameter.setMax(parseInt(_el.value)) }
    }

    if(this.valueSlider){
      let _el: HTMLInputElement = this.valueSlider
      this.valueSlider.onchange = () => {
        let val: number = parseInt(_el.value)/1000.0
        val *= this.controlledParameter.max - this.controlledParameter.min
        val += this.controlledParameter.min
        this.controlledParameter.setValue(val)
       }
    }
  }
}

export class ParameterController {
  parameter_container: HTMLElement
  controlElements: ParameterControl[]

  constructor(container: HTMLElement){
    this.parameter_container = container
    parameter.emitter.on('paramAdded', this.parameterAddHandler.bind(this))

    this.controlElements = []
  }

  parameterAddHandler(param: parameter){
    let _ctrl = new ParameterControl(this, param)
    this.controlElements.push(_ctrl)
  }

  addUIElement(element: HTMLElement){
    this.parameter_container.appendChild(element)
  }

}
