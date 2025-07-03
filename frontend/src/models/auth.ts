
/* tipo enumerado para reprsentar o authorities do token do jwt, que seria os perfis dos usuários
no backend */
export type RoleEnum = "ROLE_ADMIN" | "ROLE_CLIENT"; // declaração de tipo enumerado no java script


/* utilziado para pegar informação do usuário */

export type CredentialsDTO = {
    username: string;
    password: string;
}

/* utilizado para pegar informações do token */

export type AccessTokenPayloadDTO = {
    exp: number,
    user_name: string,
    authorities: RoleEnum[] /* Array(list, de role enum, porque um usuário pode ter um ou mais perfi*/

}