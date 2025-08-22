import ButtonPrimary from '../ButtonPrimary';
import './style.css';

type Props = {

    qrCode?: string;
    onDialogClose: Function
}

export default function QrCodePix({ qrCode, onDialogClose }: Props) {



    return (

        <>

            {qrCode &&
                <div className="dsc-dialog-background">

                    <div className="dsc-dialog-box"  >
                        <img  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`} alt="QR PIX" />

                        <div className="dsc-dialog-btn" onClick={() => onDialogClose()}>
                            <ButtonPrimary text="Ok" />
                        </div>
                    </div>
                </div>
            }
        </>

    );
}