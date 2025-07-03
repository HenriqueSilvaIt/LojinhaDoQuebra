import ButtonPrimary from "../ButtonPrimary";
import ButtonSecondy from "../ButtonSecondy";

type Props = {
    orderId: number | null; // Corrigido: Adicionado orderId
    productId: number; // Corrigido: Usando productId
    message: string;
    onDialogAnswer: (answer: boolean, orderId: number | null, productId: number | null) => void; // Corrigido
};

export default function DialogConfirmation({ orderId, productId, message, onDialogAnswer }: Props) {
    return (
        <div className="dsc-dialog-background" onClick={() => onDialogAnswer(false, orderId, productId)}>
            <div className="dsc-dialog-box" onClick={(e) => e.stopPropagation()}>
                <h2>{message}</h2>
                <div className="dsc-dialog-btn-container">
                    <div onClick={() => onDialogAnswer(false, orderId, productId)}>
                        <ButtonSecondy text="Não" />
                    </div>
                    <div onClick={() => onDialogAnswer(true, orderId, productId)}>
                        <ButtonPrimary text="Sim" />
                    </div>
                </div>
            </div>
        </div>
    );
}