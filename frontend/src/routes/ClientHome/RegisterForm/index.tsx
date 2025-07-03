import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../../../components/FormInput';
import * as forms from '../../../utils/form';
import * as userService from '../../../services/user-service';
/*o import é só import Select from 'react-select';, se você importa automatico vai trazer errado
 tem que fica igual no import da documentação ficial*/
import { RoleDTO } from '../../../models/role.';
import DialogInfo from '../../../components/DialogInfo';



export default function RegisterForm() {

    const navigate = useNavigate();

    const [dialogInfoData, setDialogInfoData] = useState<{
        visable: boolean;
        message: string;
    }>({
        visable: false,
        message: 'Sucesso'
    });


    const [formData, setFormData] = useState<any>({ /* any é para o type script
        n reclemar dos valores, para objeto ser um objeto livre e ter qualquer atributo dentro dele
        de qualquer tipo */
        /* os objetoa abaixo, vai ser igual o objeto do product by id do postman*/
        name: {
            value: "",
            id: "name",
            name: "name",
            type: "text",
            placeholder: "Nome",
            validation: function (value: string) {
                return /^.{3,80}$/.test(value);
            },
            message: "Favor informar um nome de 3 a 80 caracteres"
        },
        email: {
            value: "",
            id: "email",
            name: "email",
            type: "text", /* para aceitar somente númeroes*/
            placeholder: "Email",
            validation: function (value: any) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value.toLowerCase());/*v convertido para Number*/
            },
            /*messagem de erro caso essa função de falso*/
            message: "Favor informar o seu email"
        },
        phone: {
            value: "", // Alterado para null, pois agora será um arquivo
            id: "phone",
            name: "phone",
            type: "tel",
            placeholder: "Telefone",
            validation: function (value: string) {
                return /^\d{10,11}$/.test(value.replace(/\D/g, ''));
            },
            message: "Favor informar um telefone válido"

        },
        password: {

            value: "",
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Senha",
            validation: function (value: string) {
                return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/.test(value);
            },
            message: "Favor informar uma senha com pelo menos 1 letra, 1 número e 1 caracterer especial"
        },
        birthDate: {
            value: "", /* valor inicial lista vazia, e depois o usuário 
            vai escolher uma ou mais categoria*/
            id: "birtDate",
            name: "birthDate",
            type: "date",
            /*type n precisa porque já é um select do react*/
            placeholder: "DD/MM/YYYY",
            validation: function (value: string /* do tipo lista de categoria */) {
                return value.length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            message: "Digite a data de nascimento"
        },
        role: {
            value: [] as RoleDTO[], /* valor inicial lista vazia, e depois o usuário 
            vai escolher uma ou mais categoria*/
            id: "role",
            name: "role",
            /*type n precisa porque já é um select do react*/
            placeholder: "Perfil",
            validation: function (value: RoleDTO[] /* do tipo lista de categoria */) {
                return value.length > 0;   /* tem que ter pelo menos uma categoria*/
            },
            message: "Escolha ao menos uma categoria",
        }
    });


    function handleInputChange(event: any) {

        /* chamando função para atualizar oque o usuário ta escrevendo no input

           const dataUpdate = forms.update(formData/*objeto já com as informações do input , event.target.name/*campo da cainha
            do input que estou mexendo, event.target.value/*valor que
            digitar); /* destruturamos
        o formData para aproveitar o que tinha nele e onde tem o cmapo com o nome name
        vamos colocar o novo valor value que  está digitado 
        
        Agora novo formulário temos que preservar todo objeto, então vamos pegar tudo que já tinha no objeto, porém no campo
   value, vamos colocar o value criado na função event.target.valu*/


        /*chamando função que valida se o campo foi preenchido corretamente*/

        ; /* 1º argumento
             oque nós digitamos no campo, 2º argumento o nome do campo (exemplo price, name et)*/

        setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value)); /* recebe oque tá sendo  digitado no input
            que é q primeira função dataUpdate e valdia se for executado corretamente
            que é e a segunda função dataValited  (dataUpdate já está dentro da dataValited),
            por que aqui só colocamos  dataValited*/
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            role: {
                ...prevFormData.role,
                value: [{ authority: "ROLE_CLIENT" } as RoleDTO] // Cria um array com o objeto RoleDTO
            }
        }));


    }

    function handleTurnDirty(name: string) {
        setFormData(forms.dirtAndValidate(formData, name)); /* agora 
            com função dirty and validate, ele fica vermelho */
    }

    /*salvar produto  editado ou craido no formulário */
    function handleSubmit(event: any) {

        event.preventDefault();


        /* valida qualquer erro de formulário do front end*/
        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) { /* se tiver algum invalido
            deppois de validar o preenchimento de todos os campos*/
            setFormData(formDataValidated);

            return; /* esse return vai corta e não vai deixa salvar*/

        }
        const requestBody = forms.toValues(formData);

        /*valida erro de formulário do backend caso o front n pega*/




        const request = userService.insertNewUser(requestBody) /*editar produto */
  
        request
            .then((response) => {
                if (response.status < 400) {
                    setDialogInfoData({ visable: true, message: "Usuário criado com sucesso" });

                }
            }).catch(error => {
                setDialogInfoData({ visable: true, message: "Usuário já existe" });

                console.error("Error registering user:", error.response?.data || error);
                if (error.response && error.response.data && error.response.data.errors) {
                    const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
                    setFormData(newInputs);
                } else {
                    // Fallback for network errors or unexpected responses
                    alert("An unexpected error occurred during registration. Please try again.");
                }
                const newInputs = forms.setBackendErrors(formData, error.response.data.errors);
                setFormData(newInputs);
            })


    }

    // --- NOVA FUNÇÃO PARA FECHAR O DIÁLOGO E NAVEGAR ---
    function handleDialogCloseAndNavigate() {
        setDialogInfoData({ ...dialogInfoData, visable: false }); // Esconde o diálogo
        navigate("/login"); // Redireciona para a tela de login
    }

    return (


        <main>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <section id="product-form-section" className="dsc-container">
                <div className="dsc-product-form-container">
                    <form className="dsc-card dsc-form" onSubmit={handleSubmit}>
                        <h2>Novo usuário</h2>
                        <div className="dsc-form-controls-container">
                            <div>
                                <FormInput {...formData.name}
                                    className="dsc-form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="dsc-form-error">{formData.name.message}</div>
                            </div>
                            <div>
                                <FormInput {...formData.email}
                                    className="dsc-form-control"
                                    onChange={handleInputChange}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="dsc-form-error">{formData.email.message}</div>
                            </div>

                            <div>
                                <FormInput {...formData.phone}
                                    className="dsc-form-control"
                                    onChange={handleInputChange}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="dsc-form-error">{formData.phone.message}</div>
                            </div>
                            <div>

                                <FormInput  /*Select, porém customizado em um componente ta sendo chamado lá*/
                                    {...formData.password} /* vamos pegar tudo que tinha já
                                no formData do categories, exceto o validate que estamos
                                desistruturando excluindo lá no Componente FormSelect*/
                                    className="dsc-form-control "
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}/*turn dirty é para
                                ficar vermelho caso o usuário n termine de escrever o que tem que ser preenchido
                                e clique no próximo campo */
                                />
                                <div className="dsc-form-error">{formData.password.message}</div>
                            </div>

                            <div>
                                <FormInput {...formData.birthDate}
                                    className="dsc-form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="dsc-form-error">{formData.birthDate.message}</div>
                            </div>
                        </div>

                        <div className="dsc-product-form-buttons">
                            <Link to="/admin/products">
                                <button type="reset" className="dsc-btn dsc-btn-white">Cancelar</button>
                            </Link>
                            <button type="submit" className="dsc-btn dsc-btn-blue">Salvar</button>
                        </div>
                    </form>
                </div>

                {dialogInfoData.visable && (
                    <DialogInfo
                        message={dialogInfoData.message}
                        onDialogClose={dialogInfoData.message === "Usuário criado com sucesso" ? handleDialogCloseAndNavigate : () => setDialogInfoData({ ...dialogInfoData, visable: false })} />
                )}

            </section>
        </main>


    )
} 