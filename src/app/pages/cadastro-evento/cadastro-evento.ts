import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Evento } from '../../models/evento';
import {
  CampoEvento,
  validarData,
  validarEmailResponsavel,
  validarLocal,
  validarTitulo,
  validarVagas
} from '../../models/evento.validacao';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEvento {
  evento: Evento = {
    id: 0,
    titulo: '',
    data: '',
    local: '',
    emailResponsavel: '',
    vagas: null
  };

  eventosSalvos: Evento[] = [];

  camposTocados: Record<CampoEvento, boolean> = {
    titulo: false,
    data: false,
    local: false,
    emailResponsavel: false,
    vagas: false
  };

  get erros(): Record<CampoEvento, string | null> {
    return {
      titulo: validarTitulo(this.evento.titulo),
      data: validarData(this.evento.data),
      local: validarLocal(this.evento.local),
      emailResponsavel: validarEmailResponsavel(this.evento.emailResponsavel),
      vagas: validarVagas(this.evento.vagas, this.evento.local)
    };
  }

  get temErro(): boolean {
    return Object.values(this.erros).some((mensagem) => mensagem !== null);
  }

  deveMostrar(campo: CampoEvento): boolean {
    return this.camposTocados[campo] && this.erros[campo] !== null;
  }

  mensagem(campo: CampoEvento): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: CampoEvento): void {
    this.camposTocados[campo] = true;
  }

  salvar(): void {
    if (this.temErro) {
      this.marcarTodosComoTocados();
      return;
    }

    const eventoSalvo: Evento = {
      ...this.evento,
      id: this.proximoId(),
      vagas: this.evento.vagas === null ? null : Number(this.evento.vagas)
    };

    this.eventosSalvos = [...this.eventosSalvos, eventoSalvo];
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.evento = {
      id: 0,
      titulo: '',
      data: '',
      local: '',
      emailResponsavel: '',
      vagas: null
    };

    this.camposTocados = {
      titulo: false,
      data: false,
      local: false,
      emailResponsavel: false,
      vagas: false
    };
  }

  private marcarTodosComoTocados(): void {
    this.camposTocados = {
      titulo: true,
      data: true,
      local: true,
      emailResponsavel: true,
      vagas: true
    };
  }

  private proximoId(): number {
    return this.eventosSalvos.reduce((maior, evento) => Math.max(maior, evento.id), 0) + 1;
  }
}
