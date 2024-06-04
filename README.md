# Kaio Felps: site pessoal
Site pessoal com portfólio, exposição de projetos realizados e área de blogposts. Neste repositório, está o código fonte back-end, feito em NestJs.

## Requisitos funcionais
### Editores e administradores
- [x] Fazer login;
- [x] Fazer logout;
- [x] Reautenticar;
- [x] Criar um usuário editor ou admin (se admin);
- [x] Editar um usuário editor e admin (se admin);
- [x] Apagar um usuário editor ou admin (se admin);
- [x] Visualizar uma lista de os usuários existentes com paginação;
- [x] Criar um post;
- [x] Editar um post (próprio, ou de outros, se for admin);
- [x] Apagar um post (próprio, ou de outros se for admin);
- [x] Adicionar um projeto (se admin);
- [x] Editar um projeto (se admin);
- [x] Apagar um projeto (se admin);
- [x] Visualizar uma lista paginada de logs;

### Usuários não-autenticados
- [x] Obter uma lista paginada dos posts existentes e ativos com paginação;
- [x] Visualizar um post;
- [x] Obter uma lista paginada dos projetos criados com paginação;

### Eventos e background tasks
- [x] Registrar um log ao criar um post;
- [x] Registrar um log ao apagar um post;
- [x] Registrar um log ao editar um post;
- [x] Registrar um log ao criar um projeto;
- [x] Registrar um log ao apagar um projeto;
- [x] Registrar um log ao editar um projeto;
- [ ] Registrar um log ao criar um usuário;
- [ ] Registrar um log ao apagar um usuário;
- [ ] Registrar um log ao editar um usuário;

## Installation

```bash
$ npm install
```

## Rodando a aplicação

**Desenvolvimento**

```bash
$ docker compose up -d
$ npm run start:dev
```

**Produção**

```bash
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```
