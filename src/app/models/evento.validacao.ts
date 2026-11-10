export type CampoEvento = 'titulo' | 'data' | 'local' | 'emailResponsavel' | 'vagas';

export function validarTitulo(valor: string | null | undefined): string | null {
  const texto = (valor ?? '').trim();

  if (texto.length < 5 || texto.length > 80) {
    return 'O título deve ter entre 5 e 80 caracteres.';
  }

  return null;
}

export function validarData(valor: string | null | undefined): string | null {
  const texto = (valor ?? '').trim();

  if (!texto) {
    return 'A data não pode ficar em branco.';
  }

  const data = new Date(`${texto}T00:00:00`);
  if (Number.isNaN(data.getTime())) {
    return 'A data não pode ficar em branco.';
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (data < hoje) {
    return 'A data não pode estar no passado.';
  }

  return null;
}

export function validarLocal(valor: string | null | undefined): string | null {
  if (!valor || !valor.trim()) {
    return 'O local não pode ficar em branco.';
  }

  return null;
}

export function validarEmailResponsavel(valor: string | null | undefined): string | null {
  const texto = (valor ?? '').trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!texto || !regex.test(texto)) {
    return 'E-mail em formato inválido.';
  }

  return null;
}

export function validarVagas(
  valor: number | null | undefined,
  local: string | null | undefined
): string | null {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
    return 'As vagas devem ser um número inteiro de 1 a 200.';
  }

  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1 || numero > 200) {
    return 'As vagas devem ser um número inteiro de 1 a 200.';
  }

  const localNormalizado = (local ?? '').trim();
  if ((localNormalizado === 'Laboratório 1' || localNormalizado === 'Laboratório 2') && numero > 30) {
    return 'Para Laboratório 1 e Laboratório 2, o máximo é 30 vagas.';
  }

  return null;
}
