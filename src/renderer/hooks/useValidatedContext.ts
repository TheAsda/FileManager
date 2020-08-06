import { useContext, Context } from 'react';

const useValidatedContext = <T>(someContext: Context<T>) => {
  const context = useContext(someContext);

  if (!context) {
    throw new Error(`Hook must be used within a Provider`);
  }

  return context;
};

export { useValidatedContext };
