<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { loggedIn, showHelpModal } from '../store';

  onMount(() => {
    if ($loggedIn === false) {
      push('/');
    }
  });

  // keydownHandler
  function keydownHandler(event) {
    event.keyCode === 27 && showHelpModal.set(false);
  }
</script>

<svelte:window on:keydown={keydownHandler} />
{#if $showHelpModal}
  <div class="backdrop" on:click|self>
    <div class="modal help">
      <article class="markdown-article">
        <h2 class="title">마크다운 사용법</h2>
        <section>
          <h3 class="sub-title">제목</h3>
          <p class="desc">3단계로 제목을 표현할 수 있습니다.</p>
          <div class="code-wrap">
            <code>
              <div># 제목1</div>
              <div>## 제목2</div>
              <div>### 제목3</div>
            </code>
          </div>
        </section>
        <section>
          <h3 class="sub-title">목록</h3>
          <p class="desc">순서가 없는 목록과 순서가 있는 목록으로 표현할 수 있습니다.</p>
          <div class="code-wrap">
            <code>
              <div>1. 리스트 아이템1</div>
              <div>2. 리스트 아이템2</div>
              <div class="padding-left">1. 리스트 아이템2-1</div>
              <div class="padding-left">2. 리스트 아이템2-2</div>
            </code>
          </div>
          <div class="code-wrap">
            <code>
              <div>- 리스트 아이템1</div>
              <div>- 리스트 아이템2</div>
            </code>
          </div>
        </section>
        <section>
          <h3 class="sub-title">인용문</h3>
          <p class="desc">남의 말이나 글에서 직접 또는 간접으로 따온 문장(네이버 국어 사전)</p>
          <div class="code-wrap">
            <code>
              <div>> 인용문</div>
            </code>
          </div>
        </section>
      </article>
    </div>
  </div>
{/if}

<style>
  article {
    margin-bottom: 3rem;
    padding-bottom: 1rem;
  }

  section {
    margin-bottom: 3rem;
  }

  .markdown-article {
    margin: 0;
    padding: 0;
  }
  
  .modal.help {
    padding: 60px 80px;
  }

  .title {
    margin-bottom: 2rem;
  }

  .sub-title {
    margin-bottom: 1rem;
  }

  .desc {
    margin-bottom: 10px;
  }

  .code-wrap {
    padding: 26px 34px;
    font-weight: 800;
    background-color: #282b2e;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  code {
    color: #ffc66d;
  }

  .padding-left {
    padding-left: 1rem;
  }
</style>
