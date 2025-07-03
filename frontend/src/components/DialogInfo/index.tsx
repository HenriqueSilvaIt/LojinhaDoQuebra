import ButtonPrimary from "../ButtonPrimary";

type Props = {
    message: string;
    onDialogClose: Function;
}


export default function DialogInfo({message, onDialogClose}: Props) {

    return (/*colocando onClick para fechar quando clicar fora  <div className="dsc-dialog-background" onClick={() => onDialogClose()}>
        e onClick={(e) => e.stopPropagation()}> é para quando clicar na caixinha
        de aviso n fechar, só no botão fech ou clicando for */
        <div className="dsc-dialog-background" onClick={() => onDialogClose()}>
             */
            <div className="dsc-dialog-box" onClick={(e) => e.stopPropagation()}>
                <h2>{message}</h2>

                <div className="dsc-dialog-btn" onClick={() => onDialogClose()}>  
                <ButtonPrimary  text="Ok" />
                </div>
            </div>
        </div>
    )/* n tem como colocar on click direto no botão porque botão n tem os eventos  própios
    dele por isso colocamos em um div, tem que declarar desa forma 
    onClick={() => onDialogClose()}, porque o onClick tem um tipo específico que recebe de argumento
    por isso que nós t emos que colocar dessa forma, para chamara  função onDialogClose quando clicar no botã*/
}