# ProductAssistant UI

Frontend da aplicação **ProductAssistant**, desenvolvida com [Angular](https://angular.io/). Esta interface permite o gerenciamento completo de produtos: criação, edição, visualização e deleção.

## Pré-requisitos

Antes de executar a aplicação, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [Angular CLI](https://angular.io/cli) (v17 ou superior)

Para instalar o Angular CLI globalmente, execute:

```bash
npm install -g @angular/cli
```

## Como executar

1. Clone este repositório e acesse o diretório do frontend:

```bash
git clone https://github.com/stellafraguas/product-assistant-ui.git
cd product-assistant-ui
```

2. Instale as dependências do projeto:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
ng serve
```

4. Acesse a aplicação em [http://localhost:4200](http://localhost:4200)

## Backend (API)

Este projeto consome a API REST do backend Java, disponível no repositório:

[https://github.com/stellafraguas/ProductAssistant](https://github.com/stellafraguas/ProductAssistant)

Certifique-se de que o backend esteja em execução localmente (porta 8080 por padrão) para que a interface funcione corretamente.

## Build de produção

Para gerar uma versão pronta para produção:

```bash
ng build
```

Os arquivos serão gerados na pasta `dist/`.

