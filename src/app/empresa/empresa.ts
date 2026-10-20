import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  imports: [FormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css',
})
export class Empresa {
  dados = {
    nome: '',
    cnpj: '',
    logomarca: '',
    fundacao: '',
    descricao: ''
  };

  limparFormulario(): void {
    this.dados = {
      nome: '',
      cnpj: '',
      logomarca: '',
      fundacao: '',
      descricao: ''
    };
  }

  salvar(): void {
    console.log('Empresa salva:', this.dados);
  }
}
