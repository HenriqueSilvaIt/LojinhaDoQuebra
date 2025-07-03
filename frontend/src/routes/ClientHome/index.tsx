import { Outlet } from "react-router-dom";
import HeaderClient from "../../components/header-client";
import FooterQuebra from "../../components/footer/footer";

export default function ClientHome() {

    return (
        <>
        <HeaderClient/>
        <Outlet /> 
        <FooterQuebra/>
        </>
    ); /* no outlet vamos colocar o conteúdo da página(subrota) 
    com isso vamos colocar o catalog para dentro da pasta da subhome*/
}