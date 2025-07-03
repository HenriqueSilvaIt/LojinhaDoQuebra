import './styles.css'

type Props = {
    onNextPage: Function;
}

export default function ButtonNextPage({onNextPage}: Props) {

    return (
        <div onClick={() => onNextPage()} className="dsc-btn-next-page">Carregar mais</div>
    );
}