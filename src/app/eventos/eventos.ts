import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventos',
  imports: [FormsModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos {
  private readonly storageKey = 'eventos-formulario';

  dados = {
    nomeEvento: '',
    categoriaEvento: '',
    dataEvento: '',
    horarioEvento: '',
    localEvento: '',
    responsavelEvento: '',
    emailResponsavel: '',
    telefoneContato: '',
    capacidadeParticipantes: '',
    descricaoEvento: ''
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
      nomeEvento: this.validarNomeEvento(this.dados.nomeEvento),
      categoriaEvento: this.validarCategoriaEvento(this.dados.categoriaEvento),
      dataEvento: this.validarDataEvento(this.dados.dataEvento),
      horarioEvento: this.validarHorarioEvento(this.dados.horarioEvento),
      localEvento: this.validarLocalEvento(this.dados.localEvento),
      responsavelEvento: this.validarResponsavelEvento(this.dados.responsavelEvento),
      emailResponsavel: this.validarEmailResponsavel(this.dados.emailResponsavel),
      telefoneContato: this.validarTelefoneContato(this.dados.telefoneContato),
      capacidadeParticipantes: this.validarCapacidadeParticipantes(this.dados.capacidadeParticipantes),
      descricaoEvento: this.validarDescricaoEvento(this.dados.descricaoEvento)
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
      nomeEvento: '',
      categoriaEvento: '',
      dataEvento: '',
      horarioEvento: '',
      localEvento: '',
      responsavelEvento: '',
      emailResponsavel: '',
      telefoneContato: '',
      capacidadeParticipantes: '',
      descricaoEvento: ''
    };
    this.tocados = {};
    localStorage.removeItem(this.storageKey);
  }

  private validarNomeEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O nome do evento é obrigatório.';
    if (texto.length < 3) return 'O nome do evento deve ter pelo menos 3 caracteres.';
    return '';
  }

  private validarCategoriaEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A categoria do evento é obrigatória.';
    return '';
  }

  private validarDataEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A data do evento é obrigatória.';

    const data = new Date(`${texto}T00:00:00`);
    if (Number.isNaN(data.getTime())) return 'A data do evento é inválida.';

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (data < hoje) return 'A data do evento não pode ser anterior a hoje.';

    return '';
  }

  private validarHorarioEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O horário do evento é obrigatório.';

    const horario = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!horario.test(texto)) return 'Informe o horário no formato HH:MM.';

    return '';
  }

  private validarLocalEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O local do evento é obrigatório.';
    if (texto.length < 3) return 'O local deve ter pelo menos 3 caracteres.';
    return '';
  }

  private validarResponsavelEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O responsável pelo evento é obrigatório.';
    if (texto.length < 3) return 'O nome do responsável deve ter pelo menos 3 caracteres.';
    return '';
  }

  private validarEmailResponsavel(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'O e-mail do responsável é obrigatório.';
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!formato.test(texto)) return 'E-mail em formato inválido.';
    return '';
  }

  private validarTelefoneContato(valor: string): string {
    const texto = valor.replace(/\D/g, '');
    if (!texto) return 'O telefone de contato é obrigatório.';
    if (texto.length !== 10 && texto.length !== 11) return 'O telefone deve ter 10 ou 11 dígitos.';
    return '';
  }

  private validarCapacidadeParticipantes(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A capacidade do evento é obrigatória.';

    const numero = Number(texto);
    if (!Number.isInteger(numero) || numero <= 0) return 'A capacidade deve ser um número inteiro maior que zero.';
    if (numero > 5000) return 'A capacidade não pode ultrapassar 5000 participantes.';
    return '';
  }

  private validarDescricaoEvento(valor: string): string {
    const texto = valor.trim();
    if (!texto) return 'A descrição do evento é obrigatória.';
    if (texto.length < 10) return 'A descrição deve ter pelo menos 10 caracteres.';
    return '';
  }
}
