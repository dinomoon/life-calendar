<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    clickedDay,
    userDocId,
    userInfo,
    activeTab,
    showModal,
  } from '../store.js';
  import { fly } from 'svelte/transition';

  let value = '';
  let isEmpty;
  let editor;
  const modalTransition = { y: -50, duration: 400 };

  class UploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject, file);
            this._sendRequest(file);
          }),
      );
    }
    _initRequest() {
      const xhr = (this.xhr = new XMLHttpRequest());
      xhr.open(
        'POST',
        'https://firebasestorage.googleapis.com/v0/b/life-calendar-ce63c.appspot.com/o/images',
        true,
      );

      xhr.responseType = 'json';
    }

    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = '파일을 업로드 할 수 없습니다.';

      xhr.addEventListener('error', () => {
        reject(genericErrorText);
      });
      xhr.addEventListener('abort', () => reject());
      xhr.addEventListener('load', () => {
        const response = xhr.response;
        if (!response || response.error) {
          return reject(
            response && response.error
              ? response.error.message
              : genericErrorText,
          );
        }

        resolve({
          default: response.url, //업로드된 파일 주소
        });
      });
    }

    _sendRequest(file) {
      const data = new FormData();
      data.append('upload', file);
      this.xhr.send(data);
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }

  onMount(() => {
    switch ($activeTab) {
      case 'annual':
        value = $userInfo.annual[$clickedDay.year] || '';
        break;
      case 'monthly':
        value =
          $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || '';
        break;
      case 'weekly':
        value =
          $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] || '';
        break;
    }

    value === '' ? (isEmpty = true) : (isEmpty = false);

    ClassicEditor.create(document.querySelector('#editor'), {
      // cloudServices: {
      //   tokenUrl: 'https://www.googleapis.com/auth/firebase.database',
      //   uploadUrl: 'https://www.googleapis.com/auth/firebase.database',
      // },
      extraPlugins: [MyCustomUploadAdapterPlugin],
      toolbar: {
        items: [
          'heading',
          '|',
          'fontFamily',
          'fontSize',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'highlight',
          'bold',
          'italic',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          'alignment',
          '|',
          'imageUpload',
          'blockQuote',
          'insertTable',
          'mediaEmbed',
          'link',
          'undo',
          'redo',
        ],
      },
    })
      .then((newEditor) => {
        editor = newEditor;
        editor.setData(value);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  onDestroy(() => {
    saveData();
  });

  const clickHandler = async (e, dir) => {
    const date = e.target.id;
    const lastMonthOrWeek = date === 'month' ? 12 : 52;
    await saveData();

    // clickedDay 재설정
    if (dir === 'prev') {
      $clickedDay[date] === 1
        ? clickedDay.set({
            age: $clickedDay.age - 1,
            [date]: lastMonthOrWeek,
          })
        : clickedDay.set({ ...$clickedDay, [date]: $clickedDay[date] - 1 });
    } else if (dir === 'next') {
      $clickedDay[date] === lastMonthOrWeek
        ? clickedDay.set({
            age: $clickedDay.age + 1,
            [date]: 1,
          })
        : clickedDay.set({ ...$clickedDay, [date]: $clickedDay[date] + 1 });
    }

    // 값 가져오기
    if ($activeTab === 'annual') {
      value = $userInfo[$activeTab][$clickedDay[date]] || '';
    } else {
      value =
        $userInfo[$activeTab][`${$clickedDay.age} ${$clickedDay[date]}`] || '';
    }

    value === '' ? (isEmpty = true) : (isEmpty = false);
    editor.setData(value);
  };

  function saveData() {
    if (editor.getData() !== '' || !isEmpty) {
      switch ($activeTab) {
        case 'annual':
          db.collection('users')
            .doc($userDocId)
            .set(
              {
                annual: {
                  [$clickedDay.year]: editor.getData(),
                },
              },
              { merge: true },
            );
          break;
        case 'monthly':
          db.collection('users')
            .doc($userDocId)
            .set(
              {
                monthly: {
                  [`${$clickedDay.age} ${$clickedDay.month}`]: editor.getData(),
                },
              },
              { merge: true },
            );
          break;
        case 'weekly':
          db.collection('users')
            .doc($userDocId)
            .set(
              {
                weekly: {
                  [`${$clickedDay.age} ${$clickedDay.week}`]: editor.getData(),
                },
              },
              { merge: true },
            );
          break;
      }
    }
  }

  function handleKeydown(event) {
    event.keyCode === 27 && showModal.set(false);
  }
</script>

<svelte:window on:keydown={handleKeydown} />
{#if $activeTab === 'annual'}
  <div class="backdrop" on:click|self>
    <div class="modal" in:fly={modalTransition}>
      <header>
        <span
          id="year"
          class="prev"
          class:hidden={$clickedDay.year === $userInfo.birthday.year}
          on:click={(e) => clickHandler(e, 'prev')}
        >
          {$clickedDay.year - 1}년
        </span>
        <h2>{$clickedDay.year}년</h2>
        <span
          id="year"
          class="next"
          class:hidden={$clickedDay.year === $userInfo.birthday.year + 99}
          on:click={(e) => clickHandler(e, 'next')}
        >
          {$clickedDay.year + 1}년
        </span>
      </header>
      <textarea id="editor" placeholder="여기에 기록을 할 수 있어요." />
    </div>
  </div>
{:else if $activeTab === 'monthly'}
  <div class="backdrop" on:click|self>
    <div class="modal" in:fly={modalTransition}>
      <header>
        <h2 class="age left">
          {$userInfo.birthday.year +
            $clickedDay.age -
            1}년&nbsp;({$clickedDay.age})
        </h2>
        <div class="right">
          <i
            id="month"
            class="prev fas fa-chevron-left"
            on:click={(e) => clickHandler(e, 'prev')}
          />
          <h2>{$clickedDay.month}월</h2>
          <i
            id="month"
            class="next fas fa-chevron-right"
            on:click={(e) => clickHandler(e, 'next')}
          />
        </div>
      </header>
      <textarea id="editor" placeholder="여기에 기록을 할 수 있어요." />
    </div>
  </div>
{:else if $activeTab === 'weekly'}
  <div class="backdrop" on:click|self>
    <div class="modal" in:fly={modalTransition}>
      <header>
        <h2 class="age left">
          {$userInfo.birthday.year +
            $clickedDay.age -
            1}년&nbsp;({$clickedDay.age})
        </h2>
        <div class="right">
          <i
            id="week"
            class="prev fas fa-chevron-left"
            on:click={(e) => clickHandler(e, 'prev')}
          />
          <h2>{$clickedDay.week}주</h2>
          <i
            id="week"
            class="next fas fa-chevron-right"
            on:click={(e) => clickHandler(e, 'next')}
          />
        </div>
      </header>
      <textarea id="editor" placeholder="여기에 기록을 할 수 있어요." />
    </div>
  </div>
{/if}

<style>
  .backdrop {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50vw;
    height: 80vh;
    padding: 40px 80px 60px;
    background-color: #fff;
    border-radius: 4px;
    overflow-y: auto;
  }

  header {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: baseline;
    padding-bottom: 20px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    user-select: none;
  }

  header h2 {
    font-weight: normal;
  }

  header .left,
  header .right {
    flex: 1;
  }

  header .right {
    display: flex;
    align-items: center;
  }

  header .left {
    font-size: 20px;
  }

  header .right h2 {
    font-size: 24px;
    flex: 1;
  }

  .prev,
  .next {
    display: inline-block;
    font-size: 20px;
    padding: 10px;
    color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  .prev:hover,
  .next:hover {
    color: rgba(0, 0, 0, 0.6);
  }

  :global(.ck-editor__editable_inline) {
    width: calc(50vw - 160px);
  }

  :global(.ck-editor__editable_inline ol, .ck-editor__editable_inline ul) {
    padding-left: 2rem;
  }
</style>
