<script>
  import { weekNum } from '../store';
  import { onMount } from 'svelte';

  onMount(() => {
    weekNum.set(moment().isoWeek());
  });

  const info = [
    {number: 1, title: '주간', pragraph: '매일 매일을 기록해보세요.', src: '/video/weekly.mp4'},
    {number: 2, title: '월간', pragraph: '주간 달력에서 기록한 것을 그래프로 확인할 수 있어요.', src: '/video/monthly.mp4'},
    {number: 3, title: '연간', pragraph: '연간 목표를 적어보세요.', src: '/video/annual.mp4'},
  ]
</script>

<section class="welcome">
  <div class="left-text">
    <h2>당신은 어떤 삶을 살고 계신가요?</h2>
    <p>당신의 삶을 기록해보세요.</p>
  </div>
  <div class="right-img">
    <img src="/img/main.svg" alt="" />
  </div>
</section>
{#each info as obj}
  <section class="calendar-introduce">
    <div class="header">
      <span class="number">{obj.number}</span>
      <div class="text">
        <h2>{obj.title}</h2>
        <p>{obj.pragraph}</p>
      </div>
    </div>
    <div class="rounded-media">
      <div class="video-sizer">
        <video autoplay playsinline loop muted>
          <source src={obj.src}>
        </video>
      </div>
    </div>
  </section>
{/each}

<style>
  .welcome {
    padding-top: 10rem;
    text-align: left;
  }
  
  .left-text {
    margin-bottom: 4rem;
  }

  .left-text h2 {
    font-size: 46px;
    margin-bottom: 10px;
  }
  
  .left-text p {
    font-size: 24px;
  }

  .right-img {
    text-align: right;
  }

  .right-img img {
    width: 900px;
  }

  section.calendar-introduce {
    margin-top: 8rem;
  }

  section .header {
    display: flex;
  }

  .number {
    font-family: 'Inter', sans-serif;
    font-size: 110px;
    margin-right: 10px;
    font-weight: 700;
  }

  .text {
    margin-top: 18px;
  }

  .text h2 {
    font-size: 30px;
    text-align: left;
  }

  .text p {
    font-size: 17px;
    color: rgba(0, 0, 0, 0.6);
  }

  video {
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
  }

  .rounded-media {
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 8px rgb(84 70 35 / 15%), 0 1px 3px rgb(84 70 35 / 15%);
  }

  .video-sizer {
    width: 100%;
    padding-top: 48.5%;
    height: 0;
    overflow: hidden;
    position: relative;
  }
</style>
