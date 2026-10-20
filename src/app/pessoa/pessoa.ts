import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pessoa',
  imports: [FormsModule],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class Pessoa {
  private readonly storageKey = 'pessoa-formulario';

  dados = {
    nomeCompleto: '',
    dataNascimento: '',
    numeroCpf: '',
    numeroRg: '',
    nomeMae: '',
    nomePai: '',
    paisOrigem: '',
    ufOrigem: '',
    cidadeOrigem: '',
    email: '',
    telefone: ''
  };

  tocados: Record<string, boolean> = {};

  constructor() {
    const salvo = localStorage.getItem(this.storageKey);
    if (salvo) {
      try {
        this.dados = { ...this.dados, ...JSON.parse(salvo) };
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  get erros(): Record<string, string> {
    return {
      nomeCompleto: this.validarNome(this.dados.nomeCompleto),
      dataNascimento: this.validarDataNascimento(this.dados.dataNascimento),
      numeroCpf: this.validarCpf(this.dados.numeroCpf),
      numeroRg: this.validarRg(this.dados.numeroRg),
      nomeMae: this.validarNomeMae(this.dados.nomeMae),
      nomePai: this.validarNomePai(this.dados.nomePai),
      paisOrigem: this.validarPais(this.dados.paisOrigem),
      ufOrigem: this.validarUf(this.dados.ufOrigem),
      cidadeOrigem: this.validarCidade(this.dados.cidadeOrigem),
      email: this.validarEmail(this.dados.email),
      telefone: this.validarTelefone(this.dados.telefone)
    } as Record<string, string>;
  }

  get temErro(): boolean {
    return Object.values(this.erros).some(m => !!m);
  }

  deveMostrar(campo: string): boolean {
    return !!this.tocados[campo] && !!this.erros[campo];
  }

  mensagem(campo: string): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: string): void {
    this.tocados[campo] = true;
  }

  mostrarTudo(): void {
    Object.keys(this.dados).forEach(campo => {
      this.tocados[campo] = true;
    });
  }

  salvarAutomaticamente(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.dados));
  }

  salvar(): void {
    if (this.temErro) {
      this.mostrarTudo();
      return;
    }

    this.salvarAutomaticamente();
    this.limpar();
  }

  limpar(): void {
    this.dados = {
      nomeCompleto: '',
      dataNascimento: '',
      numeroCpf: '',
      numeroRg: '',
      nomeMae: '',
      nomePai: '',
      paisOrigem: '',
      ufOrigem: '',
      cidadeOrigem: '',
      email: '',
      telefone: ''
    };
    this.tocados = {};
    localStorage.removeItem(this.storageKey);
  }

  private validarNome(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O nome completo nao pode ficar em branco.';
    if (texto.length < 3) return 'O nome completo deve ter ao menos 3 caracteres.';
    if (/\d/.test(texto)) return 'O nome completo nao pode conter numeros.';
    return '';
  }

  private validarDataNascimento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A data de nascimento nao pode ficar em branco.';

    const nascimento = new Date(`${texto}T00:00:00`);
    if (Number.isNaN(nascimento.getTime())) return 'Data de nascimento invalida.';

    const hoje = new Date();
    if (nascimento > hoje) return 'A data de nascimento nao pode estar no futuro.';

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    const aindaNaoFezAniversario = mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate());
    if (aindaNaoFezAniversario) idade -= 1;

    if (idade < 16 || idade > 120) return 'A idade deve estar entre 16 e 120 anos.';
    return '';
  }

  private validarCpf(valor: string): string {
    const texto = valor.replace(/\D/g, '');
    if (!texto) return 'O CPF nao pode ficar em branco.';
    if (texto.length !== 11) return 'O CPF deve ter 11 digitos.';
    return '';
  }

  private validarRg(valor: string): string {
    const texto = valor.replace(/\D/g, '');
    if (!texto) return 'O RG nao pode ficar em branco.';
    if (texto.length !== 9) return 'O RG deve ter 9 digitos.';
    return '';
  }

  private validarNomeMae(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O nome da mãe nao pode ficar em branco.';
    if (texto.length < 3) return 'O nome da mãe deve ter ao menos 3 caracteres.';
    if (/\d/.test(texto)) return 'O nome da mãe nao pode conter numeros.';
    return '';
  }

  private validarNomePai(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O nome do pai nao pode ficar em branco.';
    if (texto.length < 3) return 'O nome do pai deve ter ao menos 3 caracteres.';
    if (/\d/.test(texto)) return 'O nome do pai nao pode conter numeros.';
    return '';
  }

  private validarPais(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O país de origem nao pode ficar em branco.';
    if (texto.length < 2) return 'O país de origem deve ter ao menos 2 caracteres.';
    return '';
  }

  private validarUf(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A UF de origem nao pode ficar em branco.';
    if (texto.length !== 2) return 'A UF de origem deve ter 2 caracteres.';
    return '';
  }

  private validarCidade(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A cidade de origem nao pode ficar em branco.';
    if (texto.length < 2) return 'A cidade de origem deve ter ao menos 2 caracteres.';
    return '';
  }

  private validarEmail(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O e-mail nao pode ficar em branco.';
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!formato.test(texto)) return 'E-mail em formato invalido.';
    return '';
  }

  private validarTelefone(valor: string): string {
    const texto = valor.replace(/\D/g, '');
    if (!texto) return 'O telefone nao pode ficar em branco.';
    if (texto.length !== 11) return 'O telefone deve ter 11 digitos.';
    return '';
  }
}
