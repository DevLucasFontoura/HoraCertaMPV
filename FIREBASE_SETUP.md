# Configuração do Firebase para Hora Certa MVP

## 1. Configuração do Projeto Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o **Authentication** e **Firestore Database**

## 2. Configuração do Firestore

1. No console do Firebase, vá para **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de teste** (para desenvolvimento)
4. Selecione a localização mais próxima

## 3. Configuração das Regras do Firestore

1. No Firestore, vá para a aba **Regras**
2. Substitua as regras existentes pelas regras do arquivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de registros de ponto
    match /registros/{document} {
      // Permitir leitura e escrita para usuários autenticados
      allow read, write: if request.auth != null;
    }
    
    // Regras para a coleção de usuários (se existir)
    match /users/{userId} {
      // Usuário só pode ler/escrever seus próprios dados
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4. Configuração das Variáveis de Ambiente

1. No console do Firebase, vá para **Configurações do projeto** > **Configurações do SDK**
2. Copie as configurações do Firebase
3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

## 5. Estrutura do Banco de Dados

O sistema criará automaticamente a seguinte estrutura:

### Coleção: `registros`
- **Documento ID**: `{userId}_{date}` (ex: `user123_2024-01-15`)
- **Campos**:
  - `userId`: string (ID do usuário)
  - `date`: string (data no formato YYYY-MM-DD)
  - `records`: array de objetos com:
    - `type`: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit'
    - `time`: string (horário no formato HH:MM)
    - `timestamp`: Date (timestamp do registro)
    - `label`: string (rótulo do registro)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

### Exemplo de documento:
```json
{
  "userId": "user123",
  "date": "2024-01-15",
  "records": [
    {
      "type": "entry",
      "time": "08:00",
      "timestamp": "2024-01-15T08:00:00.000Z",
      "label": "Entrada"
    },
    {
      "type": "lunchOut",
      "time": "12:00",
      "timestamp": "2024-01-15T12:00:00.000Z",
      "label": "Saída para almoço"
    }
  ],
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

## 6. Funcionalidades Implementadas

- ✅ Registro de ponto com validação de sequência
- ✅ Sincronização com Firebase em tempo real
- ✅ Carregamento de registros do dia
- ✅ Validação de usuário autenticado
- ✅ Tratamento de erros
- ✅ Feedback visual para o usuário

## 7. Próximos Passos

1. Implementar autenticação de usuários
2. Adicionar relatórios e estatísticas
3. Implementar notificações
4. Adicionar backup e exportação de dados 