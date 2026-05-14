# App Right House

Aplicacao web para simular e comparar opcoes de aquisicao de imovel, como financiamento e consorcio. O projeto usa React no frontend, Supabase para autenticacao e persistência de dados e uma API Node/Express preparada para concentrar regras de negocio e futuras integracoes.

## Estrutura

```text
.
|-- src/                  # Frontend React + Vite
|   |-- components/        # Componentes reutilizaveis
|   |-- lib/               # Clientes e utilitarios
|   `-- pages/             # Paginas da aplicacao
|-- api/                  # Backend Node + Express
|   `-- src/
|       |-- routes/        # Rotas HTTP
|       |-- app.ts         # Configuracao do Express
|       `-- server.ts      # Inicializacao da API
|-- public/               # Arquivos estaticos
`-- package.json          # Scripts e dependencias do frontend
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
