import {useForm} from 'react-hook-form';
import {loginSchema} from '@acme/contracts';
import {zodResolver} from '@hookform/resolvers/zod';

export const useValidateLogin = () => {
  return useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
};
