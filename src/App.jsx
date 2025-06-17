import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './App.module.css';
import { useEffect, useRef } from 'react';

const formSchema = yup.object({
  email: yup
    .string()
    .required('Email обязателен для заполнения')
    .matches(/^[\w]+@[\w]+\.[\w]{2,}$/, 'Неверный формат Email. Пример: example@mail.ru'),
  password: yup
    .string()
    .required('Пароль обязателен для заполнения')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  checkPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
});

const sendFormData = (formData) => {
  console.log('Отправляем данные формы:', formData);
};

export const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      checkPassword: '',
    },
  });

  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (isValid && submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  }, [isValid]);

  const onSubmit = (data) => {
    const { checkPassword, ...dataToSend } = data;
    sendFormData(dataToSend);
    reset();
  };

  return (
    <div className={styles.registrationContainer}>
      <h2 className={styles.title}>Регистрация нового пользователя</h2>
      <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="Email" className={styles.label}>
            Email:
          </label>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input
            type="email"
            id="Email"
            placeholder="Введите ваш email..."
            className={styles.input}
            {...register('email')}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Пароль:
          </label>
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          <input
            type="password"
            id="password"
            placeholder="Введите ваш пароль..."
            className={styles.input}
            {...register('password')}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="checkPassword" className={styles.label}>
            Повтор пароля:
          </label>
          {errors.checkPassword && <p className={styles.error}>{errors.checkPassword.message}</p>}
          <input
            type="password"
            id="checkPassword"
            placeholder="Повторите ваш пароль..."
            className={styles.input}
            {...register('checkPassword')}
          />
        </div>
        <button type="submit" ref={submitButtonRef} className={styles.registerButton} disabled={!isValid}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};
