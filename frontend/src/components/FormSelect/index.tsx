/*o import é só import Select from 'react-select';, se você importa automatico vai trazer errado
tem que fica igual no import da documentação ficial*/

import { isMobileOnly } from "react-device-detect";
import Select from "react-select";




export default function FormSelect(props: any) { /* n colocamos
     o prop em cima com type, porque vamos passar dados variados aqui dentro, text,
     que são as coias que estavam dentro do input*/
  const { 
    className,
    validation,
    invalid = "false", /*falso caso o valor n exista, por padrão vai começar com falso*/
    dirty = "false",/*falso caso o valor n exista, por padrão vai começar com falso*/
    onTurnDirty,
    ...selectProps } = props; /* tiramos o validation, toTur invalid do objeto input para n fazer
    parte da props */

  function handleBlur(event :any) {
    event.preventDefault();
    
    if (!isMobileOnly) {
      event.preventDefault();
    }
  }

  

  return (
    <div
      className={className} /* o className do dsc form control que pinta de vermelho
      tem que que vir para esse div que ele só pega quando o tiver esses campos abaixo true
      ,por isso desistruturamos ele lá em cima para esse ser aplicado nesse di*/
      data-invalid={invalid}
      data-dirty={dirty}>

      <Select 
      {...selectProps}
        onBlur={handleBlur}
        
        
      />

    </div> /*nesse input vamos passar os props acima
      tiramos o invalid do objeto e craimos um atributo data-invalid para receber o invalid, 
       o correto quando criar atributo no elemento é você colocar data-alguma, que ai você cria seu data set 
       
       onBlur é um evento nativo do input, que é disparado quando você está nesse campo e clica em outro lugar*/
  );


};