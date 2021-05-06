<script>
  import { kakaoLoggedIn, userId } from '../store';

  let valid = false;

  let fields = { email: '', password: '' };
  let errors = { email: '', password: '' };

  function validateEmail(email) {
    let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  const emailLoginHandler = (e) => {
    valid = true;

    // valid email
    if (validateEmail(fields.email)) {
      errors.email = '';
    } else if (fields.email === '') {
      valid = false;
      errors.email = '이메일을 입력해주세요.';
    } else {
      valid = false;
      errors.email = '올바른 이메일이 아닙니다.';
    }

    // valid password
    if (fields.password === '') {
      valid = false;
      errors.password = '비밀번호를 입력해주세요.';
    } else {
      errors.password = '';
    }

    if (valid) {
      auth
        .signInWithEmailAndPassword(fields.email, fields.password)
        .then(() => {})
        .catch((error) => {
          let errorCode = error.code;
          let errorMessage = error.message;

          switch (errorCode) {
            case 'auth/invalid-email':
              Swal.fire({
                text: '이메일 또는 비밀번호를 확인해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
              })
              break;
            case 'auth/user-disabled':
              Swal.fire({
                text: '이메일 또는 비밀번호를 확인해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
              })
              break;
            case 'auth/user-not-found':
              Swal.fire({
                text: '입력하신 이메일이 존재하지 않습니다.',
                icon: 'error',
                confirmButtonText: '확인'
              })
              break;
            case 'auth/wrong-password':
              Swal.fire({
                text: '비밀번호가 올바르지 않습니다.',
                icon: 'error',
                confirmButtonText: '확인'
              })
              break;
            default:
              return;
          }
          console.log(errorMessage);
        });
    }
  };

  const socialLoginHandler = async (e) => {
    // loading.set(true);
    let clickedSocial = null;
    let provider = null;
    if (e.target.type === 'button') {
      clickedSocial = e.target.classList[0];
    } else {
      clickedSocial = e.target.parentNode.classList[0];
    }

    switch (clickedSocial) {
      case 'kakao':
        await Kakao.Auth.login({
          scope: 'profile',
          success: function (authObj) {
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: (res) => {
                userId.set(res.id);
                kakaoLoggedIn.set(true);
              },
              fail: (err) => {
                console.log(err);
              },
            });
          },
        });
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      default:
        return;
    }

    if (provider) {
      await firebase.auth().signInWithPopup(provider);
    }
  };
</script>

<div class="container">
  <h2 class="title">로그인</h2>
  <form on:submit|preventDefault={emailLoginHandler}>
    <label for="email">이메일</label>
    <input
      type="text"
      placeholder="example@naver.com"
      id="email"
      bind:value={fields.email}
    />
    <p class="error">
      {#if errors.email}
        <i class="fas fa-exclamation-triangle" />
        {errors.email}
      {/if}
    </p>
    <label for="password">비밀번호</label>
    <input
      type="password"
      placeholder="*******"
      id="password"
      bind:value={fields.password}
    />
    <p class="error">
      {#if errors.password}
        <i class="fas fa-exclamation-triangle" />
        {errors.password}
      {/if}
    </p>
    <button type="submit" class="email">로그인</button>
  </form>
  <div class="or">
    <span class="line" />
    <span class="text">또는</span>
    <span class="line" />
  </div>
  <div class="social-login" on:click={socialLoginHandler}>
    <button type="button" class="kakao">
      <i class="fas fa-comment" />
      <span>카카오로 시작하기</span>
    </button>
    <button type="button" class="facebook">
      <i class="fab fa-facebook-square" />
      <span>페이스북으로 시작하기</span>
    </button>
    <button type="button" class="google">
      <img class="google-icon" src="/img/google-icon.svg" alt="" />
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
    font-size: 2rem;
    text-align: left;
    margin-bottom: 2rem;
  }

  form {
    margin-bottom: 3rem;
    text-align: left;
  }

  input {
    padding-left: 1rem;
  }

  input,
  button {
    width: 100%;
    height: 50px;
  }

  .error {
    color: var(--active-color);
    margin-bottom: 1.2rem;
    font-size: 14px;
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
    margin-bottom: 0.5em;
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
    background-color: #343a40;
    color: #fff;
  }

  .social-login .google:hover {
    background-color: #212529;
  }

  .google-icon {
    width: 24px;
    margin-right: 10px;
  }
</style>
