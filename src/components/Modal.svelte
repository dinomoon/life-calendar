<script>
  import { onDestroy, onMount } from 'svelte';
  import { clickedDay, userDocId, userInfo } from '../store.js';
  import DragDrop from 'editorjs-drag-drop';

  export let annual;
  export let monthly;
  export let weekly;

  let value = "";
  let editor = null;

  onMount(() => {
    if (annual) {
      value = $userInfo.annual[$clickedDay.year] || "";
    } else if (monthly) {
      value = $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || "";
    } else if (weekly) {
      value = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] || "";
    }

    editor = new EditorJS({
      onReady: () => {
        new DragDrop(editor);
      },
      holder: 'textarea',
      placeholder: '여기에 기록을 할 수 있어요.',
      data: {
        blocks: [...value],
      },
      tools: {
        heading: {
          class: Header,
        },
        list: {
          class: List,
        },
        checklist: {
          class: Checklist,
        },
        // image: {
        //   class: ImageTool,
        //   config: {
        //     endpoints: {
        //       byFile: 'http://localhost:5000/#/', // Your backend file uploader endpoint
        //       byUrl: 'http://localhost:5000/#/', // Your endpoint that provides uploading by Url
        //     }
        //   }
        // },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
            }
          }
        },
        quote: Quote,
        // inlineCode: {
        //   class: InlineCode,
        //   shortcut: 'CMD+SHIFT+M',
        // },
      },
    });
  })

  onDestroy(() => {
    editor.save().then((outputData) => {
      if (annual) {
        db.collection('users').doc($userDocId).set({
          annual: {
            [$clickedDay.year]: outputData.blocks
          },
        }, {merge: true});
      } else if (monthly) {
        db.collection('users').doc($userDocId).set({
          monthly: {
            [`${$clickedDay.age} ${$clickedDay.month}`]: outputData.blocks
          },
        }, {merge: true})
      } else if (weekly) {
        db.collection('users').doc($userDocId).set({
          weekly: {
            [`${$clickedDay.age} ${$clickedDay.week}`]: outputData.blocks
          },
        }, {merge: true})
      }
    }).catch((error) => {
      console.log('Saving failed: ', error)
    });
  })

  const clickHandler = async (dir) => {
    await editor.save().then((outputData) => {
      db.collection('users').doc($userDocId).set({
        annual: {
          [$clickedDay.year]: outputData.blocks
        },
      }, {merge: true});
    })
    editor.destroy();
    if (dir === 'prev') {
      clickedDay.set({year: $clickedDay.year - 1});
    } else if (dir === 'next') {
      clickedDay.set({year: $clickedDay.year + 1});
    }
    value = $userInfo.annual[$clickedDay.year] || "";
    editor = new EditorJS({
      holder: 'textarea',
      placeholder: '여기에 기록을 할 수 있어요.',
      data: {
        blocks: [...value],
      },
      tools: {
        heading: {
          class: Header,
        },
        list: {
          class: List,
        },
        checklist: {
          class: Checklist,
        },
        image: SimpleImage,
      },
    });
  }
</script>

{#if annual}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <span
          class="prev"
          class:hidden={$clickedDay.year === $userInfo.birthday.year}
          on:click={() => clickHandler('prev')}
        >
          {$clickedDay.year - 1}년
        </span>
        <h2>{$clickedDay.year}년</h2>
        <span
          class="next"
          class:hidden={$clickedDay.year === $userInfo.birthday.year + 99}
          on:click={() => clickHandler('next')}
        >
          {$clickedDay.year + 1}년
        </span>
      </header>
      <div id="textarea" spellcheck="false"></div>
    </div>
  </div>
{:else if monthly}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <h2>{$clickedDay.month}월</h2>
      </header>
      <div id="textarea"></div>
    </div>
  </div>
{:else if weekly}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <h2>{$clickedDay.age} - {$clickedDay.week}주</h2>
      </header>
      <div id="textarea"></div>
    </div>
  </div>
{/if}

<style>
  .modal .hidden {
    visibility: hidden;
  }

  .backdrop {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    width: 60vw;
    height: 80vh;
    padding: 40px 100px 60px;
    background-color: #fff;
    border-radius: 4px;
  }

  .modal header {
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-evenly;
    padding-bottom: 20px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    user-select: none;
  }

  .modal header span {
    display: inline-block;
    padding: 10px;
    color: #666;
    cursor: pointer;
  }

  #textarea {
    text-align: left;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 0 10px;
  }

  #textarea::-webkit-scrollbar {
    width: 10px;
  }

  #textarea::-webkit-scrollbar-track {
    background-color: #f8f9fa;
  }
  
  #textarea::-webkit-scrollbar-thumb {
    background-color: #e9ecef;
  }

  #textarea::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }

  :global(.ce-block__content, .ce-toolbar__content) { 
    max-width: calc(100% - 60px);
  }
  
  :global(.cdx-block) { 
    max-width: 100%;
  }

  :global(.ce-toolbar__actions--opened) {
    right: 0;
  }

  :global(.ce-toolbar__settings-btn) {
    width: 22px;
    height: 22px;
  }

  :global(.ce-toolbar__content) {
    display: flex;
    align-items: center;
  }

  :global(.ce-toolbar__actions) {
    top: 10px;
  }
</style>