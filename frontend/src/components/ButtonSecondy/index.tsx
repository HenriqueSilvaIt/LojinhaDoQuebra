import './style.css'

type Props = {
  text: string;
}

export default function ButtonSecondy ({text} : Props) {

    return (<div className="dsc-btn dsc-btn-white">
        {text}
      </div>);

}