
export default function FormTextArea(props: any) { /* n colocamos
     o prop em cima com type, porque vamos passar dados variados aqui dentro, text,
     que são as coias que estavam dentro do input*/
    const { validation, 
        invalid = "false", /*falso caso o valor n exista, por padrão vai começar com falso*/
         dirty ="false",/*falso caso o valor n exista, por padrão vai começar com falso*/
          onTurnDirty,
           ...textareaProps } = props; /* tiramos o validation, toTur invalid do objeto input para n fazer
    parte da props */

    function handleBlur(event: any) {
      event.preventDefault();
        onTurnDirty(props.name); /* se você n termina de escrever e clicar fora*/
    }
  
    return (
      <textarea{...textareaProps}
        onBlur={handleBlur}
        data-invalid={invalid}
      data-dirty={dirty}/> /*nesse input vamos passar os props acima
      tiramos o invalid do objeto e craimos um atributo data-invalid para receber o invalid, 
       o correto quando criar atributo no elemento é você colocar data-alguma, que ai você cria seu data set 
       
       onBlur é um evento nativo do input, que é disparado quando você está nesse campo e clica em outro lugar*/
      ); 
  
  
    };