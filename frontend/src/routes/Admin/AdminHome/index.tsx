import { useEffect, useState } from 'react';
import cartIm from '../../../assets/cart.svg'
import './style.css'
import { UserDTO } from '../../../models/user';
import * as userService from '../../../services/user-service';

export default function AdminHome() {

    const [user, setUser] = useState<UserDTO>();


    /* Use effect para fazer requisição no banco */

    useEffect(() => {
        userService.findLoggedUser()
        .then(response =>{
            setUser(response.data);
            console.log(response.data)
        });
       
    }, [])

    return ( 
        /* {user?.name} ficou dessa forma porque talvez esse user pode retorna undefined , 
        se n existir o objeto usuário*/
    <main>
      <section id="admin-home-section" className="dsc-container">
        <h2 className="dsc-section-title dsc-mb20">Bem vindo à area administrativa {user?.name}</h2>
        <div className="dsc-login-form-container"> 
          
          <img className="dsc-card-home"src={cartIm} alt="hom"/>
        </div>

        
      </section>
    </main>
    );
}