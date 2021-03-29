<script>
  import { push } from "svelte-spa-router";


  const submitHandler = (e) => {
    const email = e.target['email'].value;
    const password = e.target['password'].value;

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      push('/');
    });
  }
</script>

<div class="container">
  <h2 class="title">회원가입</h2>
  <form on:submit|preventDefault={submitHandler}>
    <label for="name">이름</label>
    <input id="name" type="text" placeholder="홍길동">
    <label for="email">이메일</label>
    <input type="email" placeholder="example@example.com" id="email">
    <label for="password">비밀번호</label>
    <input type="password" placeholder="*******" id="password">
    <label for="password-confirm">비밀번호 확인</label>
    <input type="password" placeholder="*******" id="password-confirm">
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
    font-size: 1.6rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  form {
    text-align: left;
  }

  label {
    margin-bottom: 10px;
  }

  input {
    padding-left: 1rem;
    margin-bottom: 1.2rem;
  }

  input, button {
    width: 100%;
    height: 55px;
    border-radius: 3px;
  }

  input::placeholder {
    color: #adb5bd;
  }

  button {
    background-color: #446FDE;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
</style>