# Sale Point - Sistema de Gestão de Vendas

Sistema completo de gestão de vendas desenvolvido com Node.js, TypeScript, Next.js e Supabase.

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- TypeScript
- Express
- Prisma (ORM)
- PostgreSQL (Supabase)
- JWT para autenticação
- Nodemailer para envio de emails

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod para validação
- React Query
- Supabase para autenticação e storage

## 📋 Funcionalidades

- **Autenticação**
  - Login/Logout
  - Recuperação de senha via email
  - Proteção de rotas

- **Gestão de Usuários**
  - Cadastro de usuários
  - Edição de perfil
  - Alteração de senha

- **Gestão de Clientes**
  - Cadastro de clientes
  - Listagem de clientes
  - Edição de dados
  - Busca por nome

- **Gestão de Produtos**
  - Cadastro de produtos
  - Upload de imagens
  - Controle de estoque
  - Categorização
  - Listagem com filtros

- **Gestão de Pedidos**
  - Criação de pedidos
  - Adição de produtos
  - Cálculo automático de totais
  - Histórico de pedidos
  - Detalhes do pedido

- **Dashboard**
  - Visão geral das vendas
  - Gráficos de desempenho
  - Relatórios

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Mailtrap (para emails)

### Configuração do Backend

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/sale-point.git
cd sale-point/backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na pasta `backend` com:
```env
PORT=3333
JWT_SECRET="seu_jwt_secret"
HOST_EMAIL="seu_host_email"
PORT_EMAIL=587
USER_EMAIL="seu_user_email"
PASS_EMAIL="sua_senha_email"
DB_HOST="seu_host_supabase"
DB_USER="postgres"
DB_PASS="sua_senha_supabase"
DB_NAME="postgres"
DB_PORT=5432
```

4. Execute as migrations
```bash
npm run migration:run
```

5. Inicie o servidor
```bash
npm run dev
```

### Configuração do Frontend

1. Na pasta `frontend`, instale as dependências
```bash
npm install
```

2. Configure as variáveis de ambiente
Crie um arquivo `.env` na pasta `frontend` com:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_SUPABASE_URL="sua_url_supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_anonima_supabase"
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📦 Deploy

### Backend (Vercel)
1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Frontend (Vercel)
1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 🔒 Segurança

- Autenticação JWT
- Validação de dados com Zod
- Proteção contra CSRF
- Sanitização de inputs
- Senhas criptografadas

## 📱 Interface

Interface moderna e responsiva desenvolvida com Tailwind CSS, oferecendo:
- Design limpo e intuitivo
- Adaptação para diferentes tamanhos de tela
- Feedback visual para ações do usuário
- Modo claro/escuro

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Gabriel Avena - Desenvolvimento inicial

## 🙏 Agradecimentos

- Supabase pela infraestrutura
- Vercel pelo deploy
- Mailtrap pelos emails de teste 