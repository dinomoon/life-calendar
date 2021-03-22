<script>
  let submitBirth = true;
  let birthday = null;
  export let annual = false;
  export let monthly = false;
  export let weekly = false;

  let annualArray = [];

  if (annual) {
    annualArray = new Array(100);
  } else if (monthly) {
    annualArray = new Array(120);
  } else if (weekly) {
    annualArray = new Array(5200);
  }

  const submitHandler = (e) => {
    console.log(e.target['birthday'].value)
    birthday = e.target['birthday'].value;
    console.log(birthday.split('-'))
    console.log(birthday - '2020-01-03')
    submitBirth = true;
  }
</script>

<section>
  {#if submitBirth}
  <div class="container" class:annual class:monthly class:weekly>
    {#if annual}
      <img class="top-arrow" src="/img/year-arrow.png" alt="">
    {:else if monthly}
      <img class="top-arrow" src="/img/month-arrow.png" alt="">
    {:else if weekly}
      <img class="top-arrow" src="/img/week-arrow.png" alt="">
      {/if}
    <img class="left-arrow" src="/img/age-arrow.png" alt="">
    <div class="calendar--grid">
      {#each annualArray as item}
        <div class="item"></div>
      {/each}
    </div>
  </div>
{:else}
  <h2>태어난 날을 선택해주세요.</h2>
  <form on:submit|preventDefault={submitHandler}>
    <label for="birthday">태어난 날</label>
    <input type="date" id="birthday" name="birthday">
    <button type="submit">시작하기</button>
  </form>
{/if}
</section>

<style>
  section {
    padding-top: 6rem;
  }

  .container.annual {
    position: relative;
    max-width: 1090px;
    margin: 0 auto;
  }

  .container.monthly {
    position: relative;
    max-width: 1080px;
    margin: 0 auto;
  }

  .container.weekly {
    position: relative;
    max-width: 1300px;
    margin: 0 auto;
  }

  .left-arrow {
    position: absolute;
    left: -45px;
  }

  .top-arrow {
    position: absolute;
    left: 0;
    top: -42px;
  }

  /* Annual */
  .annual .calendar--grid {
    display: grid;
    grid-template-columns: repeat(10, 100px);
    gap: 10px;
  }

  .annual .calendar--grid .item {
    border: 1px solid;
    height: 100px;
    border-radius: 4px;
  }

  /* Monthly */
  .monthly .calendar--grid {
    display: grid;
    grid-template-columns: repeat(12, 80px);
    gap: 10px;
  }

  .monthly .calendar--grid .item {
    border: 1px solid;
    height: 80px;
    border-radius: 4px;
  }

  /* Weekly */
  .weekly .calendar--grid {
    display: grid;
    grid-template-columns: repeat(52, 20px);
    gap: 5px;
  }

  .weekly .calendar--grid .item {
    border: 1px solid;
    height: 20px;
    /* border-radius: 4px; */
  }
</style>