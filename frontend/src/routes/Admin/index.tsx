import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../components/header-admin";

export default function Admin() {

    return (
        <>
        <HeaderAdmin/>
        <Outlet /> 
        </>
    ); /* no outlet vamos colocar o conteúdo da página(subrota) 
    com isso vamos colocar o catalog para dentro da pasta da subhome*/
}