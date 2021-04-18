<script>
  import { userId } from '../store';

  let birthdayValid = false;

  const submitHandler = async (e) => {
    birthdayValid.set(true);
    const birthday = e.target['birthday'].value;
    const birthArray = birthday.split('-');
    const year = +birthArray[0];
    const month = +birthArray[1];
    const day = +birthArray[2];

    birthdayValid.set(birthday ? true : false);

    if (birthdayValid) {
      await db.collection('users').add({
        userId: $userId,
        birthday: { year, month, day },
        annual: {},
        monthly: {},
        weekly: {},
      });
    }
  };
</script>

<div class="birth-form-container">
  <h2>생일을 입력해주세요.😊👀</h2>
  <form on:submit|preventDefault={submitHandler}>
    <input type="date" id="birthday" name="birthday" />
    <button type="submit">시작하기</button>
  </form>
  <div class="birth-img-wrap">
    <img class="party-img" src="/img/party.svg" alt="" />
    <img class="birthday-img" src="/img/birthday.svg" alt="" />
  </div>
</div>

<style>
  .birth-form-container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  .birth-form-container h2 {
    font-size: 30px;
    margin-bottom: 2rem;
  }

  .birth-form-container form {
    display: flex;
    justify-content: center;
  }

  .birth-form-container input {
    padding: 10px;
  }

  .birth-img-wrap {
    display: flex;
    justify-content: space-between;
  }

  .birth-img-wrap img {
    width: 300px;
  }

  .birth-img-wrap .birthday-img {
    margin-top: 10rem;
  }
</style>
