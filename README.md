# App Right House

Aplicacao web para simular e comparar opcoes de aquisicao de imovel, como financiamento e consorcio. O projeto usa React no frontend, Supabase para autenticacao e persistência de dados e uma API Node/Express preparada para concentrar regras de negocio e futuras integracoes.

# Integrantes:

ELEONORA DE MELLO GASPARI - Product Manager & QA

LUIZ ANTONIO DA SILVA MARCON - Desenvolvedor

FELIPE GODOI CIRINO - Desenvolvedor

IGOR MARTINS DOS SANTOS - Desenvolvedor

VICTOR SANTANA COSTA ANJOS - Desenvolvedor

JOAO VITOR FERNANDES MARQUES - QA (Quality Assurance)

## Estrutura

```text
.
|-- src/                         # Frontend React + Vite
|   |-- components/              # Componentes reutilizáveis da interface
|   |-- lib/                     # Configurações, clientes e utilitários
|   |-- pages/                   # Páginas da aplicação
|   |-- App.tsx                  # Configuração principal de rotas
|   |-- main.tsx                 # Inicialização do React
|   `-- index.css                # Estilos globais + Tailwind
|
|-- api/                         # Backend Node + Express
|   |-- src/
|   |   |-- config/              # Configurações de ambiente e Supabase
|   |   |-- controllers/         # Camada HTTP (req/res)
|   |   |-- middlewares/         # Middlewares da API
|   |   |-- repositories/        # Acesso ao banco de dados
|   |   |-- routes/              # Rotas HTTP
|   |   |-- services/            # Regras de negócio e cálculos
|   |   |-- types/               # Tipagens TypeScript
|   |   |-- app.ts               # Configuração do Express
|   |   `-- server.ts            # Inicialização da API
|   |
|   |-- .env.example             # Exemplo de variáveis de ambiente
|   `-- package.json             # Dependências e scripts do backend
|
|-- public/                      # Arquivos estáticos
|
|-- package.json                 # Dependências e scripts do frontend
`-- README.md                    # Documentação do projeto
```

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Supabase
- Express

## Pre-requisitos

- Node.js instalado
- npm instalado
- Credenciais do Supabase configurado

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variaveis usadas pelo frontend:

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_publica"
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
```

O arquivo `.env` nao deve ser versionado.

## Instalacao

Instale as dependencias do frontend: 

```bash
raiz do projeto
npm install 
```

Instale as dependencias da API:

```bash
cd api
npm install
```

## Como rodar

Em um terminal, inicie o frontend:

```bash
npm run dev
```

Por padrao, o Vite disponibiliza a aplicacao em:

```text
http://localhost:5173
```

Em outro terminal, inicie a API:

```bash
cd api
npm run dev
```

Por padrao, a API roda em:

```text
http://localhost:3000
```

Para validar se a API esta ativa, acesse:

```text
http://localhost:3000/health
```

## Scripts

Frontend:

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # gera a build de producao
npm run lint     # executa o lint
npm run preview  # serve a build localmente
```

API:

```bash
npm run dev      # inicia a API em modo desenvolvimento
npm run build    # compila o TypeScript
npm run start    # executa a API compilada
```

## Observacoes de desenvolvimento

- O frontend consome o Supabase diretamente para autenticacao.
- A API atualmente possui uma rota de health check e esta preparada para receber novas rotas, controllers, services e repositories.
- As paginas de simulacao ainda estao em desenvolvimento.



## Teste Automatizado E2E com Playwright

O projeto possui um teste automatizado E2E implementado com **Playwright**, cobrindo o fluxo principal do sistema Right House.

### Fluxo validado

O teste automatizado executa o seguinte cenário feliz:

* Acessa a página inicial do sistema;
* Realiza o cadastro de um novo usuário;
* Executa logout;
* Realiza login com o usuário cadastrado;
* Navega pelas principais seções da aplicação;
* Acessa a tela de simulação;
* Preenche os dados da simulação com valores específicos;
* Realiza o cálculo da simulação;
* Valida os resultados apresentados;
* Salva a simulação no histórico;
* Acessa o histórico de simulações;
* Visualiza a simulação salva;
* Exclui a simulação;
* Valida a remoção da simulação do histórico.

### Pré-requisitos

Antes de executar o teste, é necessário instalar as dependências do projeto:

```bash
npm install
```

Também é necessário instalar o navegador utilizado pelo Playwright:

```bash
npx playwright install chromium
```

Além disso, o projeto deve possuir os arquivos `.env` configurados corretamente:

```text
.env
api/.env
```

Esses arquivos devem conter as variáveis de ambiente do Supabase e da API local.

### Executar o teste E2E

Para executar o teste automatizado em modo visual, com o navegador aberto:

```bash
npm run test:e2e:headed
```

Para executar o teste em modo headless:

```bash
npm run test:e2e
```

### Relatório de execução

Após a execução, é possível abrir o relatório do Playwright com o comando:

```bash
npx playwright show-report
```

### Observação

Os arquivos `.env`, `api/.env`, `node_modules`, `playwright-report` e `test-results` não devem ser versionados no repositório.
