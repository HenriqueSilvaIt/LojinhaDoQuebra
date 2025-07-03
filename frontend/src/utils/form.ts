export function update(inputs: any, name: string, newValue: any) {
    return {
        ...inputs, [name]/* no atributo que chama name*/: {/*novo valor desse name vai ser*/...inputs[name]
            /*oque já tinha nele */, value: newValue
        }/*porém o value vai ser ese novo que passarmos
            na função*/}; /*Estamos reaproveitando
        o que está no atributo name(que seria o nome do campo) e no value estamos passando um novo valor 
        dentreo desse  campo*/
}
/*a ideia dessa função é juntar o objeto price e description, criando um novo objeto pegando apenas o campo value, dess form:
*/
export function toValues(inputs: any) {

    const data: any = {};/* any para n reclamar amis*/

    for (var name in inputs) /*percorre os atributos do objeto inputs
    dando o apelido de cada apelido de name*/ {
        data[name] = inputs[name].value; /*pegando só o campo value dos objetos do input*/
    }

    return data;

}

export function updateAll(inputs: any, newValues: any) {
    const newInputs: any = {};
    for (var name in inputs) { /* para cada nome de atributo
        estamos colocando no input, tudo que tava no input + o newValu que  vai ser
        o valor que colocarmos no input*/
            newInputs[name]/*newInputs atributo name vai conter:*/ = { ...inputs[name] /*tudo que tinha nele
                no inputs*/
                , value: newValues[name]/* porém o campo value, vai ser o newValues
                que é o novo valor que vamos coloca no input*/};
    }

    return newInputs;
}

export function validate(inputs: any, name: string) {


    if(!inputs[name].validation) /* valida se existe a função validation
    no objeto do input em determinado campo, exmplo price,name etc
    porque essa função validade só funciona se tiver a função validation
    que tem o parâmetro de validação no objeto */ {
        return inputs;
    }

    const isInvalid = !inputs[name].validation(inputs[name].value); /*estamos aplicando
    a função de validation no própio value do input, para saber se o valor que o usuário 
    está digitando invalido*/

    return { ...inputs, [name]: { ...inputs[name], invalid: isInvalid.toString()}}; /*acrescentando um
    campo invalid dentro do input que a função validade vai fazer o check se o value ta ok
    usamos o toString no final, porque no objeto n queremos salvar na forma de booleano o  valo do
    isValid e sim na forma de texto*/



}

export function toDirty(inputs: any, name: string) {

    return {...inputs, [name]: {...inputs[name], dirty: "true"}} /* acrestando atributo dirty*/
}

/*u deixar todos os campos  em vermelho caso clique em salvar sem preencher os campos*/

export function toDirtyAll(inputs: any) {

    const newInputs: any = {};
    for ( var  name in inputs) {
        newInputs[name] = { ...inputs[name], dirty: "true"};
    } 

    return newInputs; /* função que pega todos os inputs e inseri dirty true; para
    deixar todos os campos do formulário em vermelho*/
}





/* validar todos inputs, para quando clicar em salvar ele validar se for criado */

export function validateAll(inputs: any) {
    const newInputs: any = {};


    for (var name in inputs) {
        if (inputs[name].validation) { /* se n inpu existi atributo validation faça*/
            const isInvalid = !inputs[name].validation(inputs[name].value); /* testa
            se o valor que o usuário está digitando nos campos são valido*/
            newInputs[name] = {...inputs[name], invalid: isInvalid.toString()};/* vai pegar esses
            cara que foram preenchido de forma errado e colocar verdadeiro no campo invaliad,
            então primeiro ele já pega tudo que já tinha no inputs[name] (name é os campos categoria
            nome, preço etc) e  muda só o campo invalid*/
        }

        else { /* se n existir o campo validate, ele recebe o atributo o name[campo] sem mudar nada*/
            newInputs[name] = {...inputs[name]}
        }

    
    }

    return newInputs;
}


/* função auxiliar para quando clicar em salvar sujar todos campo de vemelho e depois validar
todos os campos, então vamos chamar as outras funções*/
export function dirtyAndValidateAll(inputs: any) {
    return validateAll(toDirtyAll(inputs)); /* ele vai pegar  toDirtyAll  para deixar tudo vermelho
     e depois validaAll para validar se ta tudo preenchdio*/
}


export function updateAndValidate(inputs: any, name: string, newValue:any) {

    const dataUpdated = update(inputs, name, newValue);
    return  validate(dataUpdated, name);
}



export function hasAnyInvalid(inputs: any) {
    for (var name in inputs) {
        if (inputs[name].dirty === "true" && inputs[name].invalid === "true") {
            return true; /*vai em campo por campo e verificar se tem algum  preenchido invaliado
            ou seja o invalid e dirty( vermleho) está true*/
        }
    }

    return false; /* caso n tenha nenhum campo invalido*/
}


/* função para capturar os erros do backend*/
export function setBackendErrors(inputs: any, errors: any[] /* lista de erros do backend*/) {
    const newInputs = { ...inputs}; /* criando novo input pegando oque já tinha nele, ou seja todos os itens*/
    errors.forEach(item => {
        newInputs[item.fieldName].message = item.message; /*como no backend no http ele retorna fieldname(campo)  +
        mesagem de erro, nós estamos atualizando com a mensagem de erro do backed*/
        newInputs[item.fieldName].dirty = "true";
        newInputs[item.fieldName].invalid = "true";
    });
    
    return newInputs;
}

export function dirtAndValidate(inputs: any, name: string) {
    const dataDirty = toDirty(inputs, name);
    return  validate(dataDirty, name);

}
