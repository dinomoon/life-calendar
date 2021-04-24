<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { loggedIn } from '../store';

  onMount(() => {
    if ($loggedIn === false) {
      push('/');
    }
  });
</script>

<section>
  <h2>도움말</h2>
  <p>
    혹시 달력이 화면에 꽉차서 보기 불편하다면 Ctrl + 마우스휠을 사용하여 화면을
    축소해보세요.
  </p>
  <p>
    추가했으면 좋을 것 같은 기능 또는 원하는 개선사항을 이메일로 알려주시면
    감사하겠습니다.
  </p>
</section>

<style>
  section {
    padding-top: 10rem;
  }

  section h2 {
    margin-bottom: 2rem;
  }
</style>
