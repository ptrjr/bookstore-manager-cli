# BookStore Manager CLI

> 🇧🇷 **Projeto desenvolvido como trabalho final do curso Backend Developer (SCTEC/SENAI).**
>
> Toda a documentação deste repositório está em português para facilitar a avaliação acadêmica. No entanto, todo o código-fonte foi desenvolvido em inglês seguindo as convenções utilizadas na indústria de software, visando manter um padrão profissional de nomenclatura e organização.
>
> 🇺🇸 **This project was developed as the final assignment for the SCTEC/SENAI Backend Developer course.**
>
> Although this documentation is written in Portuguese for academic evaluation purposes, the entire source code was written in English following common software industry standards.

---

# Sobre o Projeto

O **BookStore Manager CLI** é uma aplicação de linha de comando desenvolvida utilizando **Node.js**, **TypeScript** e **PostgreSQL** para gerenciamento de uma livraria.

O projeto aplica conceitos de:

- Programação Orientada a Objetos (POO)
- Arquitetura em Camadas
- Repository Pattern
- SQL
- PostgreSQL
- Git e GitHub
- Clean Code
- Tratamento de erros
- Boas práticas de desenvolvimento

---

# Funcionalidades

## Autores

- Cadastrar autor
- Listar autores
- Buscar autor por ID
- Atualizar autor
- Remover autor

---

## Livros

- Cadastrar livro
- Listar livros
- Buscar livro por ID
- Atualizar livro
- Remover livro
- Validação de ISBN único
- Controle de estoque

---

## Clientes

- Cadastrar cliente
- Listar clientes
- Buscar cliente por ID
- Atualizar cliente
- Remover cliente
- Validação de e-mail único

---

## Empréstimos

- Registrar empréstimo
- Registrar devolução
- Atualização automática do estoque
- Controle de status
- Validação de disponibilidade do livro

---

## Relatórios

- Livros disponíveis
- Livros emprestados
- Quantidade de livros por autor
- Quantidade de empréstimos por livro
- Clientes com empréstimos ativos

---

# Tecnologias Utilizadas

- Node.js
- TypeScript
- PostgreSQL
- SQL
- Git
- GitHub

---

# Arquitetura do Projeto

```
src
│
├── controllers
├── database
├── menus
├── models
├── repositories
├── services
├── utils
└── main.ts
```

### Responsabilidade das camadas

**Controllers**

Responsáveis pela interação com o usuário através do terminal.

**Services**

Contêm todas as regras de negócio da aplicação.

**Repositories**

Realizam todas as operações SQL no banco de dados.

**Models**

Representam as entidades e interfaces do sistema.

**Menus**

Responsáveis pela navegação da aplicação via CLI.

**Database**

Configuração da conexão e script SQL.

**Utils**

Funções utilitárias compartilhadas.

---

# Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas:

- Authors
- Books
- Customers
- Loans

Relacionamentos:

- Um autor pode possuir vários livros.
- Um cliente pode possuir vários empréstimos.
- Um livro pode ser emprestado diversas vezes.
- Cada empréstimo está associado a apenas um livro.

---

# Estrutura do Banco

```
Authors
  │
Books
  │
Loans
  │
Customers
```

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/ptrjr/bookstore-manager-cli.git
```

Entre na pasta:

```bash
cd bookstore-manager-cli
```

Instale as dependências:

```bash
npm install
```

---

# Configuração

Crie um arquivo `.env` utilizando como base o arquivo `.env.example`.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=bookstore_db
```

---

# Banco de Dados

Crie um banco PostgreSQL e execute o arquivo:

```
src/database/schema.sql
```

O script cria automaticamente:

- tabelas
- chaves primárias
- chaves estrangeiras
- índices
- restrições

---

# Executando o Projeto

Modo desenvolvimento:

```bash
npm run dev
```

Compilar:

```bash
npm run build
```

Executar versão compilada:

```bash
npm start
```

---

# Conceitos SQL Aplicados

O projeto utiliza:

- SELECT
- INSERT
- UPDATE
- DELETE
- INNER JOIN
- LEFT JOIN
- GROUP BY
- ORDER BY
- LIMIT
- COUNT()
- Constraints
- Foreign Keys
- Índices
- Transações (BEGIN, COMMIT e ROLLBACK)

---

# Conceitos de Programação Utilizados

- Programação Orientada a Objetos
- Interfaces
- Classes
- Encapsulamento
- Dependency Injection
- Repository Pattern
- Service Layer
- Arquitetura em Camadas
- Async/Await
- Try/Catch
- Clean Code

---

# Kanban

Link do quadro de desenvolvimento:

**Adicionar o link do GitHub Projects ou Trello aqui.**

---

# Vídeo de Demonstração

Link do vídeo:

**Adicionar o link do vídeo aqui.**

---

# Possíveis Melhorias

- Pesquisa de livros por título
- Pesquisa de clientes por nome
- Paginação
- Docker
- Testes automatizados
- Sistema de autenticação
- Categorias de livros
- Sistema de reservas
- Dashboard Web

---

# Autor

**Mauricio Petri Junior**

GitHub

https://github.com/ptrjr

LinkedIn

https://www.linkedin.com/in/mauricio-petri-junior-a1333a249

---

# Licença

Projeto desenvolvido exclusivamente para fins acadêmicos como trabalho final do curso Backend Developer (SCTEC/SENAI).