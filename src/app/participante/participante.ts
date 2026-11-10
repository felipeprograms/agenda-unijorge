import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Participante as DadosParticipante } from '../models/participante';

type CampoParticipante = 'nomeCompleto' | 'email' | 'telefone' | 'formaPagamento';
type NovoParticipante = Omit<DadosParticipante, 'id'>;

@Component({
  selector: 'app-participante',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './participante.html',
  styleUrl: './participante.css'
})
export class Participante {
  @Input({ required: true }) eventoId = 0;
  @Input() participantes: DadosParticipante[] = [];
  @Output() participanteCadastrado = new EventEmitter<NovoParticipante>();

  readonly formasPagamento = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito'];

  participante: NovoParticipante = {
    nomeCompleto: '',
    email: '',
    telefone: '',
    formaPagamento: ''
  };

  camposTocados: Record<CampoParticipante, boolean> = {
    nomeCompleto: false,
    email: false,
    telefone: false,
    formaPagamento: false
  };

  get erros(): Record<CampoParticipante, string | null> {
    return {
      nomeCompleto: this.validarNomeCompleto(this.participante.nomeCompleto),
      email: this.validarEmail(this.participante.email),
      telefone: this.validarTelefone(this.participante.telefone),
      formaPagamento: this.participante.formaPagamento
        ? null
        : 'Selecione a forma de pagamento.'
    };
  }

  get temErro(): boolean {
    return Object.values(this.erros).some((mensagem) => mensagem !== null);
  }

  deveMostrar(campo: CampoParticipante): boolean {
    return this.camposTocados[campo] && this.erros[campo] !== null;
  }

  mensagem(campo: CampoParticipante): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: CampoParticipante): void {
    this.camposTocados[campo] = true;
  }

  salvar(): void {
    if (this.temErro) {
      this.camposTocados = {
        nomeCompleto: true,
        email: true,
        telefone: true,
        formaPagamento: true
      };
      return;
    }

    this.participanteCadastrado.emit({
      ...this.participante,
      nomeCompleto: this.participante.nomeCompleto.trim(),
      email: this.participante.email.trim(),
      telefone: this.participante.telefone.trim()
    });

    this.participante = {
      nomeCompleto: '',
      email: '',
      telefone: '',
      formaPagamento: ''
    };
    this.camposTocados = {
      nomeCompleto: false,
      email: false,
      telefone: false,
      formaPagamento: false
    };
  }

  private validarNomeCompleto(valor: string): string | null {
    if (!valor.trim()) {
      return 'O nome completo do participante é obrigatório.';
    }

    return null;
  }

  private validarEmail(valor: string): string | null {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())) {
      return 'Informe um e-mail válido.';
    }

    return null;
  }

  private validarTelefone(valor: string): string | null {
    const digitos = valor.replace(/\D/g, '');
    if (digitos.length !== 10 && digitos.length !== 11) {
      return 'O telefone deve ter 10 ou 11 dígitos.';
    }

    return null;
  }
}
