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
