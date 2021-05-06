<script>
  import { push } from 'svelte-spa-router';

  import {
    loading,
    userInfo,
    userDocId,
    userId,
    thisYear,
    userAge,
  } from '../store';

  let birthdayValid = false;
  let year;

  const submitHandler = () => {
    birthdayValid = true;

    if (year <= $thisYear - 100 || year > $thisYear) {
      birthdayValid = false;
    }

    if (birthdayValid) {
      loading.set(true);

      const initialData = {
        userId: $userId,
        birthday: { year },
        annual: {},
        monthly: {},
        weekly: {},
      };

      db.collection('users')
        .add(initialData)
        .then((docRef) => {
          userInfo.set(initialData);
          userDocId.set(docRef.id);
          push('/annual');
          userAge.set($thisYear - $userInfo.birthday.year + 1);
        });
    } else {
      alert('잘못 입력하신 것 같아요. 다시 입력해주세요.');
      year = '';
    }
  };
</script>

<section>
  {#if $loading}
    <h2>Loading...</h2>
  {:else}
    <div class="birth-form-container">
      <h2>태어난 연도를 입력해주세요.😊👀</h2>
      <form on:submit|preventDefault={submitHandler}>
        <input type="number" bind:value={year} placeholder="ex) 2000" />
        <button type="submit">시작하기</button>
      </form>
      <div class="birth-img-wrap">
        <img class="party-img" src="/img/party.svg" alt="" />
        <img class="birthday-img" src="/img/birthday.svg" alt="" />
      </div>
    </div>
  {/if}
</section>

<style>
  section {
    padding-top: 6rem;
  }

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

  button {
    background-color: #fff;
    padding: 0 10px;
    cursor: pointer;
  }
</style>
