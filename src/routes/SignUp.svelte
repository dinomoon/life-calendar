<script>
  import { onMount } from "svelte";

  import { push } from "svelte-spa-router";

  let fields = {email: '', password: '', passwordConfirm: ''};
  let errors = {email: '', password: '', passwordConfirm: ''};
  let valid = false;

  function validateEmail(email) {
    let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  onMount(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focusout', () => {
        validateCheck(input.id);
      })
    })
  })

  function validateCheck(type) {
    // valid email
    if (type === 'email' || type === 'all') {
      if (validateEmail(fields.email)) {
        errors.email = '';
      } else if (fields.email === '') {
        valid = false;
        errors.email = '이메일을 입력해주세요.'
      } else {
        valid = false;
        errors.email = '올바른 이메일이 아닙니다.'
      }
    }
    
    // valid password
    if (type === 'password' || type === 'all') {
      if (fields.password === '') {
        valid = false;
        errors.password = '비밀번호를 입력해주세요.'
      } else if (fields.password.length < 6) {
        valid = false;
        errors.password = '6자 이상 입력해주세요.';
      } else {
        errors.password = '';
      }
    }

    if (type === 'password-confirm' || type === 'all') {
      if (fields.passwordConfirm === '') {
        valid = false;
        errors.passwordConfirm = '비밀번호를 확인을 입력해주세요.'
      } else {
        errors.passwordConfirm = '';
      }

      if (fields.password.length >= 6) {
        if (fields.password === fields.passwordConfirm) {
          errors.password = '';
          errors.passwordConfirm = '';
        } else {
          valid = false;
          errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }
      }
    }
  }

  $: if (fields.password.length < 6 && fields.password !== '') {
    errors.password = '6자 이상 입력해주세요.'
  } else {
    errors.password = ''
  }

  $: if (fields.password !== '' && fields.passwordConfirm !== '' && fields.password !== fields.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  } else {
    errors.passwordConfirm = '';
  }

  const submitHandler = (e) => {
    e.preventDefault();
    valid = true;

    validateCheck('all');

    if (valid) {
      auth.createUserWithEmailAndPassword(fields.email, fields.password).then(() => {
        push('/');
      }).catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;

        switch (errorCode) {
          case 'auth/email-already-in-use':
            Swal.fire({
                text: '이미 사용중인 이메일입니다. 😢',
                icon: 'error',
                confirmButtonText: '확인'
              })
            break;
          default:
            Swal.fire({
              text: '다른 이메일 또는 비밀번호를 사용해주세요.',
              icon: 'error',
              confirmButtonText: '확인'
            })
            return;
        }
        console.log(errorMessage);
      })
    }
  }
</script>

<div class="container">
  <h2 class="title">회원가입</h2>
  <form on:submit|preventDefault={submitHandler}>
    <label for="email">이메일</label>
    <input
      id="email"
      type="text"
      placeholder="example@example.com"
      class:invalidate={errors.email}
      bind:value={fields.email}
    >
    <p class="error">
      {#if errors.email}
        <i class="fas fa-exclamation-triangle"></i>
        {errors.email}
      {/if}
    </p>

    <label for="password">비밀번호</label>
    <input type="password" placeholder="*******" id="password" bind:value={fields.password} class:invalidate={errors.password}>
    <p class="error">
      {#if errors.password}
        <i class="fas fa-exclamation-triangle"></i>
        {errors.password}
      {/if}
    </p>

    <label for="password-confirm">비밀번호 확인</label>
    <input type="password" placeholder="*******" id="password-confirm" bind:value={fields.passwordConfirm} class:invalidate={errors.passwordConfirm} >
    <p class="error">
      {#if errors.passwordConfirm}
        <i class="fas fa-exclamation-triangle"></i>
        {errors.passwordConfirm}
      {/if}
    </p>

    <button type="submit">회원가입</button>
  </form>
</div>

<style>
  .container {
    width: 520px;
    margin: 0 auto;
    padding-top: 5rem;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  form {
    text-align: left;
  }
  
  label {
    display: block;
    margin-bottom: 6px;
  }

  input {
    padding-left: 1rem;
  }

  input.invalidate {
    border: 1px solid var(--active-color);
  }

  .error {
    color: var(--active-color);
    margin-bottom: 1.2rem;
    font-size: 14px;
  }

  input, button {
    width: 100%;
    height: 55px;
  }

  button {
    background-color: #446FDE;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
</style>