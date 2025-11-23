<div align="center">

  <img src="./pizza.png" alt="Logo" height="200">
  <h1 align="center"><strong>SISTEMA DA PIZZARIA PARMA</strong></h1>
  <p align="center">
	 Este é um projeto completo de um site de pizzaria desenvolvido em HTML + TypeScript + Node.js. <br> Website criado para gerenciar Entrada, Armazenamento, Saída e Consulta pelos dados do pedido.
  </p>

</div>

<br />

## :computer: Tecnologias

Este projeto contém as seguintes linguagens: 
<br><br>
[![My Skills](https://skillicons.dev/icons?i=html,css,typescript,javascript,nodejs&theme=dark)](https://skillicons.dev) 

</div>

<br> 

### 📄 Arquivos 

- package.json - Gerencia as dependências e scripts do projeto.
- tsconfig.json - Configurações do TypeScript.
- db.ts / models.ts / server.ts - Arquivos responsáveis pela conexão e formatação dos dados.
- verificacad.ts e verificacd.ts - Verificação de dados / Rota do Banco de Dados.
- cadastro.ts e produtos.ts - Alterações nos produtos e clientes / Rota do Banco de Dados.
- histprod.ts e histcompra.ts - Histórico de produtos / Histórico de compras.
- consultatab.ts e cons.ts - Consulta de produtos e clientes / Rota do Banco de Dados.
- maisvend.ts e precos.ts - Produtos mais vendidos / Rotas do Banco de Dados
- pedido.ts - Estrutura central de tudo que acontece antes de enviar o pedido.


<br>

## ⚙️ Recursos 

* **Entrada**:  
  Nome, CPF, Telefone, Endereço, Sabores de Pizza, Bebidas, Adicionais, Sobremesas, Observações, Forma de Pagamento e Cupom.  

* **Armazenamento**:  
  Banco de Dados PostgreSQL → armazenamento estruturado em tabelas.

* **Saída**:  
  Preço total, Quantidade de itens, Produtos escolhidos, Cupom aplicado, Forma de pagamento, Frete.  

* **Consulta por CPF**:  
  Verifica histórico de pedidos realizados com esse CPF.  

* **Consulta Produtos Mais Vendidos**:  
  Retorna qual sabor de pizza foi mais vendido no dia/mês/ano.  

* **Cadastro de Clientes**:  
  Registra novos clientes, altera dados, consulta por CPF e exclui registros.  

* **Cadastro de Produtos**:  
  Gerencia pizzas, bebidas, sobremesas e adicionais (inclusão, alteração, exclusão).  

* **Emissão de Comprovante**:  
  Gera comprovante de compra em `.txt` para cada pedido, contendo:  
  - Dados do cliente  
  - Lista de produtos escolhidos  
  - Cupom aplicado  
  - Forma de pagamento  
  - Frete  
  - Valor total  

<br>

## 📁 Estrutura de pastas

```
back/
├─ dist/          # arquivos .js gerados pelo TypeScript
    ├─ data # arquivos de conexão
	├─ services # base da estutura das funções
	├─ routes # rotas do banco de dados
├─ src/           # código-fonte .ts 
    ├─ data # arquivos de conexão
	├─ services # base da estutura das funções
	├─ routes # rotas do banco de dados
├─ node_modules/  # armazena as dependências 

front/ # arquivos .html
    ├─ css # código de estilização
    ├─ img # imagens usadas
    
├─ package.json
├─ package-lock.json
└─ tsconfig.json
```

<br> 

## 🔧 Pré-requisitos

* **Node.js 16+** (recomendado 18 ou 20)
* **npm**
* **bcrypt** → criptografia de senhas  
* **cors** → habilitar requisições cross-origin  
* **express** → framework para criação de APIs e servidor HTTP  
* **pg** → integração com banco de dados **PostgreSQL**  
* **sqlite3** → integração com banco de dados **SQLite**  
* **undici** → cliente HTTP moderno para Node.js  

<br>

## 🚀 Instalação

Na **raiz** do projeto (onde está o `package.json`):

```bash
npm i -D typescript ts-node @types/node
```

Crie (ou confira) os scripts no **package.json**:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
```

`tsconfig.json` mínimo recomendado:

```json
"compilerOptions": {
    // File Layout
    "rootDir": "./back/src",
    "outDir": "./back/dist",

    // Environment Settings
    "module": "ES6",            
    "target": "ES6",           
    "lib": ["DOM", "ES6"],      
   
    {...} // outros comandos
  },
  "include": ["back/src/**/*"]
}
```

Após isso, instale as bibliotecas:

```bash
npm install -D @types/express @types/cors @types/node @types/bcrypt @types/pg
```

> No VS Code, se aparecerem erros de tipos do Node, use **Ctrl+Shift+P → TypeScript: Restart TS Server**.

<br>

## ▶️ Como executar

```bash
npm run dev
```

Transpilar e rodar o JS gerado:

```bash
npx tsc 
node server.js
```


## 🖥️ Uso 

1. **Entrada** → informe **Nome completo**, **CPF**, **Telefone**, **Pizzas**, **Bebidas**, **Modo de Entrega**, **Forma de Pagamento** e **Endereço**. O sistema grava em `pedido.csv`.
2. **Saída** → O Sistema calcula o preço dos produtos escolhidos e cria a nota fiscal do pedido. O sistema grava em `recibo.txt`.
3. **Consulta por CPF** → Procura o histórico de pedidos pelo **CPF** inserido e retorna todos os produtos e valores dos pedidos anteriores feitos por esse cliente.
4. **Relatório de Vendas por Produto** → Insira um **dia/mês/ano** e o sistema mostrará o total vendido de cada produto nesse período, incluindo o número de unidades e valor total.
* **Cadastro de Clientes**: Registra, altera, consulta e exclui clientes.
* **Cadastro de Produtos**: Gerencia produtos.
* **Emissão de Comprovante**: Gerar comprovante de compra para cada pedido.

<br>

## 🗃️ Campos e formatos 

* **Datas**: ISO (ex.: `2025-08-19T18:40:02.123Z`).
* **Nome**: Deve conter apenas letras (sem números) e não pode ser vazio.
* **CPF**: Deve conter exclusivamente números, com exatamente 11 dígitos.
* **Telefone**: Deve conter exclusivamente números, com no mínimo 10 dígitos.
* **Valor**: Deve ser um número decimal válido (exemplo: 12.5).
* **Pedido**: O valor do pedido deve ser calculado pela expressão `p.item.preco × p.quantidade`, com resultado formatado em 2 casas decimais.

<br>

## ⌨ Autores

```
- Gabriele Larena
- João Wagner Bonfim
- Julia Borges
- Karine Silva
- Maria Fernanda Venda
```
<br>
