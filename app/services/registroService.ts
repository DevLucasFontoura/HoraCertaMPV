import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { auth } from '../lib/firebase';

export interface TimeRecord {
  type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit';
  time: string;
  timestamp: Date;
  label: string;
}

export interface DayRecord {
  userId: string;
  date: string; // formato YYYY-MM-DD
  records: TimeRecord[];
  totalHours?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class RegistroService {
  private getUserId(): string {
    const user = auth.currentUser;
    if (!user) {
      // Para teste, usar o ID que vemos nos dados
      return '5xwTPB9evPbnWGLrLM0lkQE3Xq23';
    }
    return user.uid;
  }

  private getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  private getDocId(userId: string, date: string): string {
    return `${userId}_${date}`;
  }

  async registrarPonto(type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit'): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const date = this.getDateString();
      const docId = this.getDocId(userId, date);
      const now = new Date();
      
      const timeString = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const typeLabels = {
        entry: 'Entrada',
        lunchOut: 'Saída para almoço',
        lunchReturn: 'Retorno do almoço',
        exit: 'Saída'
      };

      const newRecord: TimeRecord = {
        type,
        time: timeString,
        timestamp: now,
        label: typeLabels[type]
      };

      // Verificar se já existe um documento para hoje
      const docRef = doc(db, 'registros', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Atualizar documento existente
        const existingData = docSnap.data() as DayRecord;
        const updatedRecords = [...existingData.records, newRecord];
        
        await setDoc(docRef, {
          ...existingData,
          records: updatedRecords,
          updatedAt: Timestamp.now()
        }, { merge: true });
      } else {
        // Criar novo documento
        const newDayRecord: DayRecord = {
          userId,
          date,
          records: [newRecord],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await setDoc(docRef, newDayRecord);
      }

      return true;
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      return false;
    }
  }

  async getRegistrosDoDia(date: Date = new Date()): Promise<TimeRecord[]> {
    try {
      const userId = this.getUserId();
      const dateString = this.getDateString(date);
      const docId = this.getDocId(userId, dateString);
      
      const docRef = doc(db, 'registros', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as DayRecord;
        return data.records || [];
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar registros do dia:', error);
      return [];
    }
  }

  async getRegistrosDoPeriodo(startDate: Date, endDate: Date): Promise<DayRecord[]> {
    try {
      const allRegistros = await this.getAllRegistros();
      const startDateString = this.getDateString(startDate);
      const endDateString = this.getDateString(endDate);
      
      return allRegistros.filter(registro => 
        registro.date >= startDateString && registro.date <= endDateString
      );
    } catch (error) {
      console.error('Erro ao buscar registros do período:', error);
      return [];
    }
  }

  async getAllRegistros(): Promise<DayRecord[]> {
    try {
      const userId = this.getUserId();
      
      const registrosRef = collection(db, 'registros');
      const q = query(
        registrosRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const registros: DayRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DayRecord;
        registros.push(data);
      });
      
      // Ordenar no código para evitar necessidade de índice
      const registrosOrdenados = registros.sort((a, b) => b.date.localeCompare(a.date));
      return registrosOrdenados;
    } catch (error) {
      console.error('Erro ao buscar todos os registros:', error);
      return [];
    }
  }

  async getRegistrosDoMes(year: number, month: number): Promise<DayRecord[]> {
    try {
      const allRegistros = await this.getAllRegistros();
      const monthStr = month.toString().padStart(2, '0');
      const yearStr = year.toString();
      
      return allRegistros.filter(registro => 
        registro.date.startsWith(`${yearStr}-${monthStr}`)
      );
    } catch (error) {
      console.error('Erro ao buscar registros do mês:', error);
      return [];
    }
  }

  // Validar se o próximo registro pode ser feito
  validarProximoRegistro(registrosAtuais: TimeRecord[], tipo: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit'): boolean {
    const tipos = registrosAtuais.map(r => r.type);
    
    switch (tipo) {
      case 'entry':
        return !tipos.includes('entry');
      case 'lunchOut':
        return tipos.includes('entry') && !tipos.includes('lunchOut');
      case 'lunchReturn':
        return tipos.includes('lunchOut') && !tipos.includes('lunchReturn');
      case 'exit':
        return tipos.includes('entry') && !tipos.includes('exit');
      default:
        return false;
    }
  }

  // Calcular horas trabalhadas
  calcularHorasTrabalhadas(registros: TimeRecord[]): number {
    if (registros.length < 2) return 0;
    
    const entrada = registros.find(r => r.type === 'entry');
    const saida = registros.find(r => r.type === 'exit');
    
    if (!entrada || !saida) return 0;
    
    const entradaTime = entrada.timestamp.getTime();
    const saidaTime = saida.timestamp.getTime();
    
    return (saidaTime - entradaTime) / (1000 * 60 * 60); // Converter para horas
  }

  // Atualizar registros de um dia específico
  async atualizarRegistro(userId: string, date: string, records: TimeRecord[]) {
    try {
      const docId = this.getDocId(userId, date);
      const docRef = doc(db, 'registros', docId);
      await setDoc(docRef, {
        records,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      throw error;
    }
  }

  // Adicionar registro manual para uma data específica
  async adicionarRegistroManual(
    date: string, // formato YYYY-MM-DD
    entrada?: string,
    saidaAlmoco?: string,
    retornoAlmoco?: string,
    saida?: string
  ): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const docId = this.getDocId(userId, date);
      const docRef = doc(db, 'registros', docId);
      
      const records: TimeRecord[] = [];
      
      // Adicionar entrada se fornecida
      if (entrada) {
        records.push({
          type: 'entry',
          time: entrada,
          timestamp: new Date(`${date}T${entrada}:00`),
          label: 'Entrada'
        });
      }
      
      // Adicionar saída almoço se fornecida
      if (saidaAlmoco) {
        records.push({
          type: 'lunchOut',
          time: saidaAlmoco,
          timestamp: new Date(`${date}T${saidaAlmoco}:00`),
          label: 'Saída para almoço'
        });
      }
      
      // Adicionar retorno almoço se fornecida
      if (retornoAlmoco) {
        records.push({
          type: 'lunchReturn',
          time: retornoAlmoco,
          timestamp: new Date(`${date}T${retornoAlmoco}:00`),
          label: 'Retorno do almoço'
        });
      }
      
      // Adicionar saída se fornecida
      if (saida) {
        records.push({
          type: 'exit',
          time: saida,
          timestamp: new Date(`${date}T${saida}:00`),
          label: 'Saída'
        });
      }
      
      // Ordenar registros por timestamp
      records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      // Verificar se já existe um documento para esta data
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Atualizar documento existente
        const existingData = docSnap.data() as DayRecord;
        const updatedRecords = [...existingData.records, ...records];
        
        await setDoc(docRef, {
          ...existingData,
          records: updatedRecords,
          updatedAt: Timestamp.now()
        }, { merge: true });
      } else {
        // Criar novo documento
        const newDayRecord: DayRecord = {
          userId,
          date,
          records,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await setDoc(docRef, newDayRecord);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar registro manual:', error);
      return false;
    }
  }

  // Atualizar registro manual para uma data específica (substitui registros existentes)
  async atualizarRegistroManual(
    date: string, // formato YYYY-MM-DD
    entrada?: string,
    saidaAlmoco?: string,
    retornoAlmoco?: string,
    saida?: string
  ): Promise<boolean> {
    try {
      // Verificar se o Firebase está configurado corretamente
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "mock-api-key") {
        throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
      }

      // Verificar se o Firebase está configurado corretamente
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "mock-api-key") {
        throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
      }

      const userId = this.getUserId();
      const docId = this.getDocId(userId, date);
      const docRef = doc(db, 'registros', docId);
      
      const records: TimeRecord[] = [];
      
      // Adicionar entrada se fornecida
      if (entrada) {
        records.push({
          type: 'entry',
          time: entrada,
          timestamp: new Date(`${date}T${entrada}:00`),
          label: 'Entrada'
        });
      }
      
      // Adicionar saída almoço se fornecida
      if (saidaAlmoco) {
        records.push({
          type: 'lunchOut',
          time: saidaAlmoco,
          timestamp: new Date(`${date}T${saidaAlmoco}:00`),
          label: 'Saída para almoço'
        });
      }
      
      // Adicionar retorno almoço se fornecida
      if (retornoAlmoco) {
        records.push({
          type: 'lunchReturn',
          time: retornoAlmoco,
          timestamp: new Date(`${date}T${retornoAlmoco}:00`),
          label: 'Retorno do almoço'
        });
      }
      
      // Adicionar saída se fornecida
      if (saida) {
        records.push({
          type: 'exit',
          time: saida,
          timestamp: new Date(`${date}T${saida}:00`),
          label: 'Saída'
        });
      }
      
      // Ordenar registros por timestamp
      records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      // Verificar se já existe um documento para esta data
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Atualizar documento existente - SUBSTITUIR registros, não adicionar
        const existingData = docSnap.data() as DayRecord;
        
        await setDoc(docRef, {
          ...existingData,
          records: records, // Substituir completamente os registros
          updatedAt: Timestamp.now()
        }, { merge: true });
      } else {
        // Criar novo documento
        const newDayRecord: DayRecord = {
          userId,
          date,
          records,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await setDoc(docRef, newDayRecord);
      }
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar registro manual:', error);
      
      // Retornar mensagem de erro específica
      if (error.message?.includes('Firebase não está configurado')) {
        throw new Error('Firebase não está configurado. Configure as variáveis de ambiente do Firebase.');
      } else if (error.code === 'permission-denied') {
        throw new Error('Sem permissão para acessar o Firebase. Verifique as regras de segurança.');
      } else if (error.code === 'unavailable' || error.message?.includes('offline')) {
        throw new Error('Sem conexão com o Firebase. Verifique sua conexão com a internet.');
      } else {
        throw new Error(`Erro ao salvar registro: ${error.message || 'Erro desconhecido'}`);
      }
    }
  }
}

export const registroService = new RegistroService(); 