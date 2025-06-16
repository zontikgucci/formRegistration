import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';

const dataFormInitial = {
  email: '',
  password: '',
};

const validationRules = {
  email: (value) => {
    if (!/^[\w]+@[\w]+\.[\w]{2,}$/.test(value)) {
      return 'Неверный Email. Допустимый Email - example@mail.ru';
    }
    return null;
  },
  password: (value) => {
    if (value.length < 6) {
      return 'Неверный пароль. Допустимый Пароль - 6 символов';
    }
    return null;
  },
  checkPassword: (value, fieldsForm) => {
    if (fieldsForm.password !== value) {
      return 'Пароли не совпадают';
    }
    return null;
  },
};

const sendFormData = (formData) => {
  console.log('Отправляем данные формы:', formData);
};

export const App = () => {
  const [fieldsForm, setFieldsForm] = useState({
    ...dataFormInitial,
    checkPassword: '',
  });

  const [fieldsFormErrors, setFieldsFormErrors] = useState({
    emailError: null,
    passwordError: null,
    checkPasswordError: null,
  });

  const submitButtonRef = useRef(null);

  const onBlurField = ({ target }) => {
    const { name, value } = target;
    const error = validationRules[name] ? validationRules[name](value, fieldsForm) : null;
    setFieldsFormErrors((errors) => ({ ...errors, [`${name}Error`]: error }));
  };

  const onChangeFieldForm = ({ target }) => {
    const { name, value } = target;
    setFieldsForm((fields) => ({ ...fields, [name]: value }));
    setFieldsFormErrors((prevErrors) => ({ ...prevErrors, [`${name}Error`]: null }));
  };

  const hasAnyErrors = Object.values(fieldsFormErrors).some((error) => error !== null);
  const areAllFieldsFilled = Object.values(fieldsForm).every((value) => value.trim() !== '');
  const isSubmitDisabled = hasAnyErrors || !areAllFieldsFilled;

  useEffect(() => {
    const allFieldsFilled = Object.values(fieldsForm).every((value) => value.trim() !== '');
    if (!allFieldsFilled) {
      return;
    }

    const isEmailValid = validationRules.email(fieldsForm.email) === null;
    const isPasswordValid = validationRules.password(fieldsForm.password) === null;
    const isCheckPasswordValid = validationRules.checkPassword(fieldsForm.checkPassword, fieldsForm) === null;

    if (isEmailValid && isPasswordValid && isCheckPasswordValid) {
      submitButtonRef.current?.focus();
    }
  }, [fieldsForm]);

  const submitForm = (event) => {
    event.preventDefault();
    const dataToSend = {
      email: fieldsForm.email,
      password: fieldsForm.password,
    };
    sendFormData(dataToSend);
  };

  return (
    <div className={styles.registrationContainer}>
      <h2 className={styles.title}>Регистрация нового пользователя</h2>
      <form className={styles.registrationForm} onSubmit={submitForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          {fieldsFormErrors.emailError && <p className={styles.error}>{fieldsFormErrors.emailError}</p>}
          <input
            type="email"
            name="email"
            placeholder="Введите ваш email..."
            className={styles.input}
            value={fieldsForm.email}
            onChange={onChangeFieldForm}
            onBlur={onBlurField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Пароль:
          </label>
          {fieldsFormErrors.passwordError && <p className={styles.error}>{fieldsFormErrors.passwordError}</p>}
          <input
            type="password"
            name="password"
            placeholder="Введите ваш пароль..."
            className={styles.input}
            value={fieldsForm.password}
            onChange={onChangeFieldForm}
            onBlur={onBlurField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirm-password" className={styles.label}>
            Повтор пароля:
          </label>
          {fieldsFormErrors.checkPasswordError && <p className={styles.error}>{fieldsFormErrors.checkPasswordError}</p>}
          <input
            type="password"
            name="checkPassword"
            placeholder="Повторите ваш пароль..."
            className={styles.input}
            value={fieldsForm.checkPassword}
            onChange={onChangeFieldForm}
            onBlur={onBlurField}
          />
        </div>
        <button type="submit" ref={submitButtonRef} className={styles.registerButton} disabled={isSubmitDisabled}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};
