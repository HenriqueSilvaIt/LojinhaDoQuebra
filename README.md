# **PDV — Sistema de Ponto de Venda com Integração Mercado Pago Point**  

![Java Badge](https://img.shields.io/badge/Java_17-007396?style=for-the-badge&logo=java&logoColor=white)  
![Spring Boot Badge](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)  
![React Badge](https://img.shields.io/badge/React_JS-61DAFB?style=for-the-badge&logo=react&logoColor=black)  
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)  

---

## 📌 Descrição
Sistema de **Ponto de Venda (PDV)** desenvolvido para uso real em comércio, com **integração direta com máquina de cartão Mercado Pago Point**, cálculo automático de troco e histórico detalhado de vendas.  
O sistema está **em produção** e é utilizado diariamente por cliente real desde **05/2025**.

---

## 🚀 Funcionalidades
- Registro de vendas com cálculo automático de troco.  
- Consulta de histórico de vendas com filtros por data e produto.  
- Integração **Mercado Pago Point** para pagamentos por cartão.  
- Interface web responsiva para operação em desktop ou tablet.  
- Painel administrativo para gestão de produtos e preços.  

---

## 🏗 Arquitetura
- **Back-end:** Java 17, Spring Boot, Spring Data JPA, Spring Security, PostgreSQL  
- **Front-end:** ReactJS, Axios, Styled Components  
- **Integração Pagamentos:** SDK oficial Mercado Pago  
- **Deploy:** Oracle Cloud  
- **Controle de versão:** Git + GitHub  

![Arquitetura do Sistema](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Diagram.png) <!-- Substituir pelo caminho real da imagem -->

---

## 📸 Capturas de tela
<!-- Substituir pelos prints reais -->

**Tela de Venda**

![Tela de Venda](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/CaixaLivre.png) 

**Histórico de Venda**

![Histórico de Vendas](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Hist%C3%B3rico%20de%20venda%20%20com%20produt.png)  

**Gestão de Produtos**

![Gestão de Produtos](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Cadastro.png)  

---

## ⚙️ Como executar localmente

### 1️⃣ Clonar repositório
```bash
git clone https://github.com/HenriqueSilvaIt/LojinhaDoQuebra.git
2️⃣ Backend
bash
cd backend/target/
./mvnw clean install
java -jar dscommerce-0.0.1-SNAPSHOT.jar 💻
3️⃣ Frontend
bash
cd frontend
yarn
yarn dev

Obs: Para ver a funcionalidade de integração com a máquina de cartão mercado point é necessário configurar variáveis
de ambiente com credenciais do Mercado Pago (MP_ACCESS_TOKEN, MP_PUBLIC_KEY), como isso é privado essa funcionalidade não é possível visualizar.
```
📈 **Resultados**
Sistema em produção desde 04/2025.

Mais de **2400** vendas processadas até o momento.

Redução de erros manuais de troco em 30%.
Redução no tempo de calcúlo de vendas 40,4hs/Mês

👨‍💻 **Autor**
Henrique Oliveira da Silva

**Linkendin** : [![Linkedin Badge](https://img.shields.io/badge/-HenriqueSilva-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/henriqueoliveirati/) |
**Gmail**:
[![Gmail Badge](https://img.shields.io/badge/-hikysilva2@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white)](mailto:hikysilva2@gmail.com)

---

