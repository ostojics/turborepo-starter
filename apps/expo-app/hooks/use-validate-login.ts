import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {LoginDTO, loginSchema} from '@acme/contracts';

export const useValidateLogin = () => {
  return useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
};
