import { TimeRecord, DayRecord } from './registroService';
import { UserData } from './authService';

export interface WorkTimeConfig {
  dailyWorkHours: number; // horas diárias de trabalho
  lunchBreakHours: number; // horas de almoço
}

export interface WorkTimeResult {
  totalHours: number;
  workedHours: number;
  lunchHours: number;
  overtimeHours: number;
  deficitHours: number;
  isComplete: boolean;
}

export class TimeCalculationService {
  /**
   * Obter configuração de jornada do usuário
   */
  static getWorkTimeConfig(userData: UserData | null): WorkTimeConfig {
    return {
      dailyWorkHours: userData?.workHours || 8, // padrão 8 horas
      lunchBreakHours: userData?.lunchHours || 1 // padrão 1 hora de almoço
    };
  }

  /**
   * Calcular horas trabalhadas para um conjunto de registros
   */
  static calculateWorkTime(records: TimeRecord[], config: WorkTimeConfig): WorkTimeResult {
    const types = records.map(r => r.type);
    const isComplete = types.includes('entry') && types.includes('exit');
    
    if (!isComplete) {
      return {
        totalHours: 0,
        workedHours: 0,
        lunchHours: 0,
        overtimeHours: 0,
        deficitHours: 0,
        isComplete: false
      };
    }

    const entry = records.find(r => r.type === 'entry');
    const exit = records.find(r => r.type === 'exit');
    const lunchOut = records.find(r => r.type === 'lunchOut');
    const lunchReturn = records.find(r => r.type === 'lunchReturn');
    
    if (!entry || !exit) {
      return {
        totalHours: 0,
        workedHours: 0,
        lunchHours: 0,
        overtimeHours: 0,
        deficitHours: 0,
        isComplete: false
      };
    }
    
    // Calcular tempo total (entrada até saída)
    const entryTime = new Date(`2000-01-01T${entry.time}:00`);
    const exitTime = new Date(`2000-01-01T${exit.time}:00`);
    const totalHours = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
    
    // Calcular tempo de almoço
    let lunchHours = config.lunchBreakHours; // usar configuração padrão
    if (lunchOut && lunchReturn) {
      const lunchOutTime = new Date(`2000-01-01T${lunchOut.time}:00`);
      const lunchReturnTime = new Date(`2000-01-01T${lunchReturn.time}:00`);
      lunchHours = (lunchReturnTime.getTime() - lunchOutTime.getTime()) / (1000 * 60 * 60);
    }
    
    // Calcular horas efetivamente trabalhadas (total - almoço)
    const workedHours = Math.max(0, totalHours - lunchHours);
    
    // Calcular horas extras ou déficit
    const expectedHours = config.dailyWorkHours;
    const difference = workedHours - expectedHours;
    
    const overtimeHours = difference > 0 ? difference : 0;
    const deficitHours = difference < 0 ? Math.abs(difference) : 0;
    
    return {
      totalHours: Math.round(totalHours * 100) / 100,
      workedHours: Math.round(workedHours * 100) / 100,
      lunchHours: Math.round(lunchHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      deficitHours: Math.round(deficitHours * 100) / 100,
      isComplete: true
    };
  }

  /**
   * Calcular banco de horas para um período
   */
  static calculateBankHours(records: DayRecord[], config: WorkTimeConfig): {
    total: number;
    positive: number;
    negative: number;
    averageDaily: number;
  } {
    let totalPositive = 0;
    let totalNegative = 0;
    let totalDays = 0;
    
    records.forEach(day => {
      const workTime = this.calculateWorkTime(day.records, config);
      
      if (workTime.isComplete) {
        totalDays++;
        
        if (workTime.overtimeHours > 0) {
          totalPositive += workTime.overtimeHours;
        }
        
        if (workTime.deficitHours > 0) {
          totalNegative += workTime.deficitHours;
        }
      }
    });
    
    const total = Math.round((totalPositive - totalNegative) * 100) / 100;
    const positive = Math.round(totalPositive * 100) / 100;
    const negative = Math.round(totalNegative * 100) / 100;
    const averageDaily = totalDays > 0 ? Math.round((total / totalDays) * 100) / 100 : 0;
    
    return {
      total,
      positive,
      negative,
      averageDaily
    };
  }

  /**
   * Formatar horas para exibição
   */
  static formatHours(hours: number): string {
    if (hours === 0) return '00:00';
    
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * Formatar banco de horas para exibição
   */
  static formatBankHours(hours: number): string {
    const absHours = Math.abs(hours);
    const h = Math.floor(absHours);
    const m = Math.round((absHours - h) * 60);
    const sign = hours < 0 ? '-' : '+';
    return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * Calcular estatísticas do mês
   */
  static calculateMonthlyStats(records: DayRecord[], config: WorkTimeConfig): {
    totalWorkedHours: number;
    totalOvertimeHours: number;
    totalDeficitHours: number;
    averageDailyHours: number;
    totalDays: number;
    completeDays: number;
  } {
    let totalWorkedHours = 0;
    let totalOvertimeHours = 0;
    let totalDeficitHours = 0;
    let totalDays = 0;
    let completeDays = 0;
    
    records.forEach(day => {
      const workTime = this.calculateWorkTime(day.records, config);
      totalDays++;
      
      if (workTime.isComplete) {
        completeDays++;
        totalWorkedHours += workTime.workedHours;
        totalOvertimeHours += workTime.overtimeHours;
        totalDeficitHours += workTime.deficitHours;
      }
    });
    
    const averageDailyHours = completeDays > 0 ? totalWorkedHours / completeDays : 0;
    
    return {
      totalWorkedHours: Math.round(totalWorkedHours * 100) / 100,
      totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
      totalDeficitHours: Math.round(totalDeficitHours * 100) / 100,
      averageDailyHours: Math.round(averageDailyHours * 100) / 100,
      totalDays,
      completeDays
    };
  }
} 