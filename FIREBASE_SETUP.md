# Configuração do Firebase

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Como obter essas informações:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em "Configurações do Projeto" (ícone de engrenagem)
4. Na aba "Geral", role até "Seus aplicativos"
5. Clique em "Adicionar app" e escolha "Web"
6. Copie as configurações fornecidas

## Configurações necessárias no Firebase:

### Authentication
1. Vá em "Authentication" no menu lateral
2. Clique em "Get started"
3. Na aba "Sign-in method", habilite "Email/Password"

### Firestore Database
1. Vá em "Firestore Database" no menu lateral
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima

### Regras de Segurança do Firestore
Configure as regras básicas de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler e escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Estrutura dos dados no Firestore:

### Coleção: `users`
Cada documento representa um usuário com o ID igual ao UID do Firebase Auth:

```javascript
{
  uid: "user_uid_from_firebase_auth",
  createdAt: "2024-01-15T10:30:00.000Z",
  email: "usuario@email.com",
  name: "Nome Completo",
  workHours: 8,
  plan: "free",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

## Funcionalidades implementadas:

- ✅ Registro de usuário no Firebase Authentication
- ✅ Salvamento de dados no Firestore com mesmo ID
- ✅ Verificação de email duplicado
- ✅ Tratamento de erros específicos do Firebase
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Interface de usuário com feedback de erros 