# Ícones Adaptativos

## Problema
Ícones com cores fixas (branco/preto) não funcionam bem com temas personalizados do navegador.

## Solução

### 1. SVG com currentColor (Recomendado)
```tsx
import { ClockIcon } from './ClockIcon';

// O ícone se adapta automaticamente à cor do texto
<ClockIcon size={24} className="text-gray-600" />
```

### 2. Usando o arquivo SVG atualizado
O arquivo `public/clock-icon.svg` foi atualizado para usar `currentColor`:
```svg
<svg stroke="currentColor" ...>
```

### 3. Componente com detecção de tema
```tsx
import { AdaptiveIcon } from './AdaptiveIcon';

<AdaptiveIcon 
  icon="/clock-icon.svg" 
  size={24} 
  alt="Relógio" 
/>
```

## Como usar

### Para ícones em fundos claros:
```tsx
<ClockIcon className="text-black" />
```

### Para ícones em fundos escuros:
```tsx
<ClockIcon className="text-white" />
```

### Para ícones que se adaptam automaticamente:
```tsx
<ClockIcon className="text-current" />
```

## Vantagens
- ✅ Funciona com qualquer tema do navegador
- ✅ Adaptação automática
- ✅ Sem JavaScript adicional
- ✅ Performance otimizada 