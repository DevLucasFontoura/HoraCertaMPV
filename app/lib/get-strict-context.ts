import * as React from 'react';

export function getStrictContext<T>(name: string) {
  const Context = React.createContext<T | null>(null);

  const useStrictContext = () => {
    const value = React.useContext(Context);
    if (value === null) {
      throw new Error(`${name} deve ser usado dentro do provider correspondente.`);
    }
    return value;
  };

  return [Context.Provider, useStrictContext] as const;
}

