<script>
  import {push} from 'svelte-spa-router';
	import {kakaoLoggedIn, userId} from '../store';

  const emailLoginHandler = (e) => {
    const email = e.target['email'].value;
    const password = e.target['password'].value;

    auth.signInWithEmailAndPassword(email, password).then(() => {
      push('/');
    })
  }

  const socialLoginHandler = async (e) => {
    let clickedSocial = null;
    let provider = null;
    if (e.target.type === 'button') {
      clickedSocial = e.target.classList[0];
    } else {
      clickedSocial = e.target.parentNode.classList[0];
    }

    switch(clickedSocial) {
      case 'kakao':
        await Kakao.Auth.login({
          scope: 'profile, age_range',
          success: function(authObj) {
            kakaoLoggedIn.set(true);
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: res => {
                userId.set(res.id);
                push('/')
              }
            })
          }
        })
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider()
        break;
      case 'apple':
        provider = new firebase.auth.OAuthProvider('apple.com');
        break;
      default:
        return;
    }

    if (provider) {
      await firebase.auth().signInWithPopup(provider);
      push('/');
    }
  }
</script>

<div class="container">
  <h2 class="title">로그인</h2>
  <form on:submit|preventDefault={emailLoginHandler}>
    <label for="email">이메일</label>
    <input type="email" placeholder="example@naver.com" id="email">
    <label for="password">비밀번호</label>
    <input type="password" placeholder="*******" id="password">
    <button type="submit" class="email">로그인</button>
  </form>
  <div class="or">
    <span class="line"></span>
    <span class="text">또는</span>
    <span class="line"></span>
  </div>
  <div class="social-login" on:click={socialLoginHandler}>
    <button type="button" class="kakao">
      <i class="fas fa-comment"></i>
      <span>카카오로 시작하기</span>
    </button>
    
    <button type="button" class="facebook">
      <i class="fab fa-facebook-square"></i>
      <span>페이스북으로 시작하기</span>
    </button>
    <button type="button" class="google">
      <img class="google-icon" src="/img/google-icon.svg" alt="">
      <span>구글로 시작하기</span>
    </button>
  </div>
</div>

<style>
  .container {
    width: 500px;
    margin: 0 auto;
    padding-top: 3rem;
  }

  .title {
    font-size: 1.6rem;
    text-align: left;
    margin-bottom: 2rem;
  }

  form {
    margin-bottom: 3rem;
    text-align: left;
  }

  label {
    margin-bottom: 10px;
  }

  input {
    padding-left: 1rem;
  }

  input[type="email"] {
    margin-bottom: 1rem;
  }

  input::placeholder {
    color: #adb5bd;
  }

  input, button {
    width: 100%;
    height: 50px;
  }

  input:last-of-type {
    margin-bottom: 2rem;
  }

  button {
    font-size: 18px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  button.email {
    color: #fff;
    background-color: #fa5252;
  }

  button.email:hover {
    background-color: #f03e3e;
  }

  /*
  ******** or *********
  */
  .or {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }

  .or .line {
    flex: 3;
    height: 1px;
    background-color: var(--border-color);
  }

  .or .text {
    flex: 1;
    color: #868e96;
  }

  /*
  ******** social-login *********
  */

  .social-login button {
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .social-login button i {
    font-size: 1.6rem;
    margin-right: 10px;
  }

  .social-login .kakao {
    background-color: #ffeb12;
  }

  .social-login .kakao:hover {
    background-color: #f5e20f;
  }

  .social-login .facebook {
    background-color: #1877f2;
    color: #fff;
  }

  .social-login .facebook:hover {
    background-color: #106ae0;
    color: #fff;
  }

  .social-login .google {
    background-color: #4b525a;
    color: #fff;
  }

  .social-login .google:hover {
    background-color: #30383f;
  }

  .google-icon {
    width: 24px;
    margin-right: 10px;
  }
</style>