import { expect, type Locator, type Page, test } from '@playwright/test';

const STEP_DELAY_MS = Number(process.env.E2E_STEP_DELAY_MS ?? 2200);
const TYPE_DELAY_MS = Number(process.env.E2E_TYPE_DELAY_MS ?? 80);

async function pausa(page: Page, ms = STEP_DELAY_MS) {
  if (ms > 0) {
    await page.waitForTimeout(ms);
  }
}

async function preencherCampo(campo: Locator, valor: string) {
  await campo.click();
  await campo.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await campo.type(valor, { delay: TYPE_DELAY_MS });
}

async function validarHome(page: Page) {
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText('App Right House').first()).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: /simule seu financiamento e comece a fazer seu sonho virar realidade/i,
    }),
  ).toBeVisible();
}

async function realizarLogin(page: Page, email: string, senha: string) {
  await page.goto('/auth/login');
  await expect(page.getByRole('heading', { name: /^entrar$/i })).toBeVisible();
  await pausa(page);

  await preencherCampo(page.getByTestId('input-email-login'), email);
  await preencherCampo(page.getByTestId('input-senha-login'), senha);
  await pausa(page);

  const loginResponse = page.waitForResponse(
    (response) => response.url().includes('/auth/login') && response.request().method() === 'POST' && response.ok(),
  );

  await page.getByTestId('btn-entrar-login').click();
  await loginResponse;

  await validarHome(page);
  await expect(page.getByTestId('btn-sair')).toBeVisible();
  await expect(page.getByTestId('link-historico')).toBeVisible();
  await pausa(page);
}

test.describe('Right House - fluxo principal completo E2E', () => {
  test.setTimeout(240_000);

  test('deve cadastrar, sair, entrar, navegar, simular, salvar, visualizar histórico e excluir a simulação', async ({ page }) => {
    const timestamp = Date.now();
    const nome = 'João Vitor QA Automatizado';
    const email = `qa.right.house.${timestamp}@example.com`;
    const senha = 'Senha123456!';

    const valorImovel = '420000';
    const valorEntrada = '60000';
    const prazoMeses = '240';

    await test.step('1. Acessar a página inicial', async () => {
      await page.goto('/home');
      await validarHome(page);
      await expect(page.getByTestId('btn-comecar-agora')).toBeVisible();
      await pausa(page);
    });

    await test.step('2. Acessar login e abrir cadastro', async () => {
      await page.getByTestId('link-entrar').click();
      await expect(page).toHaveURL(/\/auth\/login$/);
      await expect(page.getByRole('heading', { name: /^entrar$/i })).toBeVisible();
      await pausa(page);

      await page.getByRole('link', { name: /criar uma/i }).click();
      await expect(page).toHaveURL(/\/auth\/register$/);
      await expect(page.getByRole('heading', { name: /criar conta/i })).toBeVisible();
      await pausa(page);
    });

    await test.step('3. Cadastrar usuário novo', async () => {
      await preencherCampo(page.getByTestId('input-nome-cadastro'), nome);
      await preencherCampo(page.getByTestId('input-email-cadastro'), email);
      await preencherCampo(page.getByTestId('input-senha-cadastro'), senha);
      await pausa(page);

      const cadastroResponse = page.waitForResponse(
        (response) => response.url().includes('/auth/register') && response.request().method() === 'POST' && response.status() === 201,
      );

      await page.getByTestId('btn-criar-conta').click();
      await cadastroResponse;
      await expect(page).toHaveURL(/\/home$|\/auth\/login$/);
      await pausa(page);
    });

    await test.step('4. Realizar logout após o cadastro', async () => {
      if (page.url().includes('/auth/login')) {
        await realizarLogin(page, email, senha);
      }

      await expect(page.getByTestId('btn-sair')).toBeVisible();
      await page.getByTestId('btn-sair').click();
      await validarHome(page);
      await expect(page.getByTestId('link-entrar')).toBeVisible();
      await expect(page.getByTestId('link-historico')).toHaveCount(0);
      await pausa(page);
    });

    await test.step('5. Realizar login com o usuário cadastrado', async () => {
      await realizarLogin(page, email, senha);
    });

    await test.step('6. Passar pelas seções da home', async () => {
      await page.getByRole('link', { name: /^início$/i }).click();
      await validarHome(page);
      await pausa(page);

      await page.getByRole('link', { name: /como funciona/i }).click();
      await expect(page).toHaveURL(/\/home#como-funciona$/);
      await expect(page.getByRole('heading', { name: /como funciona/i })).toBeVisible();
      await expect(page.getByText('Simulação precisa')).toBeVisible();
      await expect(page.getByText('Compare modalidades')).toBeVisible();
      await expect(page.getByText('Recomendação inteligente')).toBeVisible();
      await pausa(page);

      await page.getByRole('heading', { name: /perguntas frequentes/i }).scrollIntoViewIfNeeded();
      await expect(page.getByRole('heading', { name: /perguntas frequentes/i })).toBeVisible();
      await expect(page.getByText('O que são Amortizações?')).toBeVisible();
      await pausa(page);

      await page.getByRole('heading', { name: /pronto para simular/i }).scrollIntoViewIfNeeded();
      await expect(page.getByRole('heading', { name: /pronto para simular/i })).toBeVisible();
      await expect(page.getByTestId('btn-iniciar-simulacao')).toBeVisible();
      await pausa(page);
    });

    await test.step('7. Acessar tela de simulação', async () => {
      await page.getByRole('link', { name: /^simulação$/i }).click();
      await expect(page).toHaveURL(/\/simulation$/);
      await expect(page.getByRole('heading', { name: /hora de dar o primeiro passo/i })).toBeVisible();
      await pausa(page);
    });

    await test.step('8. Preencher dados específicos da simulação', async () => {
      await preencherCampo(page.getByTestId('input-valor-imovel'), valorImovel);
      await preencherCampo(page.getByTestId('input-valor-entrada'), valorEntrada);
      await preencherCampo(page.getByTestId('input-prazo-meses'), prazoMeses);
      await pausa(page);

      await expect(page.getByTestId('input-taxa-juros-financiamento')).toHaveValue('10% ao ano');
      await expect(page.getByTestId('input-taxa-admin-consorcio')).toHaveValue('1.15% ao ano');
      await expect(page.getByTestId('input-taxa-juros-financiamento')).toHaveAttribute('readonly', '');
      await expect(page.getByTestId('input-taxa-admin-consorcio')).toHaveAttribute('readonly', '');
      await pausa(page);
    });

    await test.step('9. Realizar a simulação e validar o resultado', async () => {
      const calcularResponse = page.waitForResponse(
        (response) => response.url().includes('/simulations/calculate') && response.request().method() === 'POST' && response.ok(),
      );

      await page.getByTestId('btn-ver-resultado').click();
      await calcularResponse;

      const resultado = page.getByTestId('resultado-simulacao');
      await expect(resultado).toBeVisible();
      await expect(resultado.getByRole('heading', { name: /resultado da simulação/i })).toBeVisible();
      await expect(resultado.getByRole('heading', { name: 'Financiamento' })).toBeVisible();
      await expect(resultado.getByRole('heading', { name: 'Consórcio' })).toBeVisible();
      await expect(resultado).toContainText('Parcela: R$ 3.474,08');
      await expect(resultado).toContainText('Total pago: R$ 893.778,70');
      await expect(resultado).toContainText('Juros: R$ 473.778,70');
      await expect(resultado).toContainText('Parcela: R$ 1.845,00');
      await expect(resultado).toContainText('Total pago: R$ 502.800,00');
      await expect(resultado).toContainText('Taxa adm.: R$ 82.800,00');
      await expect(resultado).toContainText('Consórcio');
      await expect(resultado).toContainText('Evolução do custo total');
      await pausa(page);
    });

    await test.step('10. Salvar a simulação no histórico', async () => {
      const saveResponse = page.waitForResponse(
        (response) => response.url().endsWith('/simulations') && response.request().method() === 'POST' && response.status() === 201,
      );

      await expect(page.getByTestId('btn-salvar-simulacao')).toBeVisible();
      await page.getByTestId('btn-salvar-simulacao').click();
      await saveResponse;

      await expect(page.getByText(/simulação salva no histórico/i).first()).toBeVisible();
      await pausa(page);
    });

    await test.step('11. Abrir histórico e validar simulação salva', async () => {
      const historicoResponse = page.waitForResponse(
        (response) => response.url().endsWith('/simulations') && response.request().method() === 'GET' && response.status() === 200,
      );

      await page.getByTestId('link-historico').click();
      await expect(page).toHaveURL(/\/simulation\/history$/);
      await historicoResponse;

      await expect(page.getByTestId('historico-simulacoes')).toBeVisible();
      await expect(page.getByTestId('historico-carregando')).toHaveCount(0);

      const simulacaoSalva = page.getByTestId('linha-simulacao').filter({ hasText: 'R$ 420.000,00' }).first();

      await expect(simulacaoSalva).toBeVisible();
      await expect(simulacaoSalva.getByTestId('historico-valor-imovel')).toContainText('R$ 420.000,00');
      await expect(simulacaoSalva.getByTestId('historico-prazo')).toContainText('240 meses');
      await expect(simulacaoSalva.getByTestId('historico-economia')).toContainText('R$ 390.978,70');
      await pausa(page);
    });

    await test.step('12. Visualizar os detalhes da simulação salva', async () => {
      const simulacaoSalva = page.getByTestId('linha-simulacao').filter({ hasText: 'R$ 420.000,00' }).first();
      await expect(simulacaoSalva).toBeVisible();

      await simulacaoSalva.getByTestId('btn-visualizar-simulacao').click();
      await expect(page.getByTestId('detalhe-simulacao-salva')).toBeVisible();
      await expect(page.getByTestId('resultado-simulacao')).toContainText('Resultado da simulação');
      await expect(page.getByTestId('resultado-simulacao')).toContainText('Financiamento');
      await expect(page.getByTestId('resultado-simulacao')).toContainText('Consórcio');
      await expect(page.getByTestId('resultado-simulacao')).toContainText('R$ 390.978,70');
      await pausa(page);

      await page.getByTestId('btn-voltar-historico').click();
      await expect(page.getByTestId('historico-simulacoes')).toBeVisible();
      await pausa(page);
    });

    await test.step('13. Excluir a simulação salva e validar remoção', async () => {
      const simulacoesComMesmoValor = page.getByTestId('linha-simulacao').filter({ hasText: 'R$ 420.000,00' });
      const quantidadeAntes = await simulacoesComMesmoValor.count();

      await expect(simulacoesComMesmoValor.first()).toBeVisible();
      await pausa(page);

      const deleteResponse = page.waitForResponse(
        (response) => response.url().includes('/simulations/') && response.request().method() === 'DELETE' && response.status() === 204,
      );

      await simulacoesComMesmoValor.first().getByTestId('btn-excluir-simulacao').click();
      await deleteResponse;

      await expect(page.getByText(/simulação removida/i).first()).toBeVisible();
      await expect(simulacoesComMesmoValor).toHaveCount(quantidadeAntes - 1);
      await pausa(page, 3000);
    });
  });
});
