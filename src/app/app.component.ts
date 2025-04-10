import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'projetoApi';
  apiKey = 'bb84c8ab86ac51f12249c85fd8d274fd';
  filmeTitulo = '';
  filmeDetalhes: any;
  nivelBlur = 15;

  constructor(private cliente: HttpClient) {}

  ngOnInit(): void{
    this.buscarFilmeRandom()
  }

  reduzirBlur(): void{
    if(this.nivelBlur > 0){
      this.nivelBlur -= 5
    }
  }

  buscarFilmeRandom(): void {
    const urlBase = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&sort_by=popularity.desc&language=en-US&with_original_language=en`
    
    this.cliente.get<any>(urlBase).subscribe({
      next: (resposta_1) => {
        const totalPaginas = resposta_1.total_pages
  
        const paginaAleatoria = Math.floor(Math.random() * Math.min(totalPaginas, 400)) + 1
        const novaUrl = `${urlBase}&page=${paginaAleatoria}`
  
        this.cliente.get<any>(novaUrl).subscribe({
          next: (respostaFinal) => {
            this.nivelBlur = 15
            const filmes = respostaFinal.results
            const indexAleatorio = Math.floor(Math.random() * filmes.length)
            this.filmeDetalhes = filmes[indexAleatorio]
          },
          error: (erro) => console.error('erro buscando página aleatoria', erro)
        })
      },
      error: (erro) => console.error('Erro na requisição:', erro)
    })
  }  

  validar(): void {
    if(this.filmeTitulo.toLowerCase() === this.filmeDetalhes.title.toLowerCase()){
      this.nivelBlur = 0
      this.buscarFilmeRandom()
    } else {
      this.reduzirBlur();
    }
  }

  pular(): void {
    this.nivelBlur = 15;
    this.buscarFilmeRandom();
  }

}