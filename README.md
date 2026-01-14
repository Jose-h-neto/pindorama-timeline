# 🇧🇷 Pindorama: Linha do Tempo

O **Pindorama** é um jogo educativo interativo sobre a História do Brasil. O projeto foi feito inspirado no jogo Wikitrivia, e o objetivo é organizar eventos históricos em uma linha do tempo cronológica, testando os conhecimentos do jogador sobre diferentes períodos, desde o Brasil Colonial até a República.

## 🚀 Demonstração
Você pode jogar a versão atualizada aqui: https://pindorama-timeline.vercel.app/

## 🛠️ Tecnologias Utilizadas
- **HTML5 & CSS3**: Estrutura e estilização customizada (incluindo animações de pulso e scrollbars personalizadas).
- **JavaScript (ES6+)**: Lógica do jogo, manipulação de DOM e eventos de Drag and Drop.
- **Supabase**: Banco de Dados as a Service para armazenamento e recuperação dos eventos históricos.
- **DragDropTouch**: Polyfill para garantir a compatibilidade com dispositivos touch.

## ✨ Funcionalidades
- **Modos de Jogo**: Filtros por períodos como Presidentes, Colonial, Monárquico e Republicano.
- **Feedback Visual**: Cartas que acertam a posição brilham em verde com efeito de pulso.
- **Experiência de Usuário**:
  - *Edge Scrolling*: A linha do tempo desliza automaticamente ao arrastar uma carta para as bordas.
  - *Scroll Manual*: Possibilidade de navegar pela linha do tempo arrastando o fundo.
  - *Aviso Mobile*: Detecção de tamanho de tela para informar que a versão desktop é a recomendada.

## 📦 Como rodar o projeto localmente
1. Clone este repositório:
   ```bash
   git clone [https://github.com/Jose-h-neto/pindorama-timeline.git](https://github.com/Jose-h-neto/pindorama-timeline.git)

    Abra o arquivo index.html usando um servidor local (como a extensão Live Server do VS Code).

    Certifique-se de estar conectado à internet para carregar os dados do Supabase.

📝 Licença

Este projeto foi desenvolvido para fins educacionais e de aprendizado. Sinta-se à vontade para estudar e contribuir!

Desenvolvido por Jose Hipólito Neto
