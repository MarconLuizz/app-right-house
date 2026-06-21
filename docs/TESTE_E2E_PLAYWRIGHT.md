# Teste automatizado E2E - Playwright

## Objetivo

Este teste automatizado valida o fluxo principal do sistema Right House, cobrindo o objetivo central da aplicação: permitir que um usuário realize uma simulação financeira, salve o resultado em seu histórico, visualize o registro salvo e exclua a simulação ao final da execução.

## Fluxo coberto

1. Acessar a página inicial.
2. Acessar login e cadastro.
3. Cadastrar um usuário novo.
4. Realizar logout.
5. Realizar login com o usuário cadastrado.
6. Navegar pelas seções principais da home.
7. Acessar a tela de simulação.
8. Preencher dados específicos da simulação:
   - Valor do imóvel: R$ 420.000,00
   - Entrada: R$ 60.000,00
   - Prazo: 240 meses
   - Taxa de juros: 10% ao ano
   - Taxa administrativa: 1,15% ao ano
9. Calcular a simulação.
10. Validar resultado de financiamento, consórcio, recomendação e gráfico.
11. Salvar a simulação no histórico.
12. Acessar o histórico.
13. Visualizar os detalhes da simulação salva.
14. Voltar ao histórico.
15. Excluir a simulação salva.
16. Validar que a simulação foi removida.

## Como executar

Instale as dependências na raiz do projeto:

```bash
npm install
```

Instale o navegador do Playwright:

```bash
npx playwright install chromium
```

Execute o teste em modo visual:

```bash
npm run test:e2e:headed
```

Execute o teste em modo normal:

```bash
npm run test:e2e
```

Abra o relatório HTML:

```bash
npx playwright show-report
```

## Observação

O teste utiliza os arquivos `.env` já configurados no frontend e na API. Esses arquivos não devem ser versionados no GitHub.
