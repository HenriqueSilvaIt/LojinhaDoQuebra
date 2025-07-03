import { useContext, useState } from 'react';
import './style.css';
import * as authService from '../../../services/auth-service';
import * as forms from '../../../utils/form';
import { useNavigate } from 'react-router-dom';
import { ContextToken } from '../../../utils/context-token';
import FormInput from '../../../components/FormInput';
import { Link } from 'react-router-dom';
export default function Login() {
    const navigate = useNavigate();

    const { setContextTokenPayload } = useContext(ContextToken);

    const [submitResponseFail, setSubmitResponseFail] = useState(false); /* usestate
    para aparecer  usuário e senha inválido caso  preencha se n fica false*/

    const [formData, setFormData] = useState<any>({ /* any é para o type script
        n reclemar dos valores, para objeto ser um objeto livre e ter qualquer atributo dentro dele
        de qualquer tipo */
        username: {
            value: "",
            id: "username",
            name: "username",
            type: "text",
            placeholder: "Email",
            validation: function (value: string) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value.toLowerCase());
            },
            message: "Favor informar um email válido",
        },
        password: {
            value: "",
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Senha",
            /* validation: function (value: string) {
                 return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/.test(value);
             },
             message: "Favor informar  uma senha com pelo menos 1 letra, 1 número e 1 caractere especial"
             */
        }
    });

    function handleInputChange(event: any) {
        const value = event.target.value; /* para pegar o valor que está digitado na caixinha de texto*/
        const name = event.target.name; /* para pegar o nome da caixinha, é o mesmo nome que você coloca
         no input name=" */
        setFormData(forms.update(formData/*objeto já com as informações do input */, name/*campo da cainha
            do input que estou mexendo*/, value/*valor que
            digitar*/)); /* destruturamos
        o formData para aproveitar o que tinha nele e onde tem o cmapo com o nome name
        vamos colocar o novo valor value que  está digitado 
        
        Agora novo formulário temos que preservar todo objeto, então vamos pegar tudo que já tinha no objeto, porém no campo
   value, vamos colocar o value criado na função event.target.valu*/
    }


    function handleTurnDirty(name: string) {
        setFormData(forms.dirtAndValidate(formData, name));
    }



    function handleSubmit(event: any) {
        event.preventDefault();/*mesmo o formData tendo 2 informações  ele puxo argumento */


        setSubmitResponseFail(false) /* para n aparecer mensagem de erro
    de usuário e senha antes de validar campo a campo */

        /* valida qualquer erro campo a campo de formulário do front end*/
        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) { /* se tiver algum invalido
                    deppois de validar o preenchimento de todos os campos*/
            setFormData(formDataValidated);

            return; /* esse return vai corta e não vai deixa salvar*/

        }



        /* valida usuário e senha no backend para ver se está preenchido com sucesso */

        authService.loginRequest(forms.toValues(formData))
            .then(response => {
                authService.saveAcessToken(response.data.access_token); /* response.data e pega o campo
                acess token do postman*/
                navigate("/cart");
                setContextTokenPayload(authService.getAccessTokenPayload());
                console.log(forms.toValues(formData));

            })
            .catch(() => {
                setSubmitResponseFail(true); /* para aparecer a mensagem de login e senha inválido*/
            })
    }

    return (
        /* no input tem que ter o fecha / elemento aqui no tsx é diferente do html que n precisa fechar
         no dsc-form erro depois tem que colocar erro caso não preencha campo */
        <main>
            <section id="login-section" className="dsc-container">
                <div className="dsc-login-form-container">
                    <form className="dsc-card dsc-form" onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        <div className="dsc-form-controls-container">
                            <div>
                                <FormInput
                                    {...formData.username}
                                    className="dsc-form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="dsc-form-error">{formData.username.message}</div>
                            </div>
                            <div>
                                <FormInput
                                    {...formData.password} /* todo os dados
                                já estão nor form data do objeto username */
                                    className="dsc-form-control"
                                    onTurnDirty={handleTurnDirty} /* o password n tem validação
                            , mas estamos colocando para ficar pradonizado*/
                                    onChange={handleInputChange} />
                            </div>
                           
                        </div>

                        {submitResponseFail /* useState caso for preenchido 
                        o login ou senha de forma errado*/  &&

                            <div className="dsc-form-global-error">
                                Usuário ou senha inválido
                            </div>
                        }

                        <div className="dsc-login-form-buttons dsc-mt20">
                            <button type="submit" className="dsc-btn dsc-btn-blue">Entrar</button>

                            <Link to="/register">
                                <div className="dsc-btn dsc-btn-white dsc-mt20">
                                    Registrar
                                </div>
                            </Link>    
                        </div>
                    
                    </form>

                    
                </div>
            </section>
        </main>

    );
}