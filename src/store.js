import { writable } from 'svelte/store';

const time = new Date();
export const colors = writable({
  'past-background-color': 'rgba(0,0,0,0.1)',
  'current-hover-item-color': 'rgba(0,0,0,0.4)',
  'hover-item-color': 'rgba(0,0,0,0.2)',
  'background-color': '#fdf9f1',
  'item-background-color': '#FFFEFC',
});
export const loggedIn = writable(false);
export const firebaseLoggedIn = writable(false);
export const kakaoLoggedIn = writable(false);
export const calendarTabs = writable(['연간', '월간', '주간']);
export const activeTab = writable('연간');
export const submitBirth = writable(false);
export const userId = writable(null);
// export const userInfo = writable({
//   birthday: { year: 1994 },
// });
export const userInfo = writable(null);
export const userDocId = writable(null);
export const clickedDay = writable({
  year: null,
  month: null,
  week: null,
  age: null,
});
export const showModal = writable(false);
export const squareList = writable(null);
export const date = writable(time);
export const thisYear = writable(time.getFullYear());
export const thisMonth = writable(time.getMonth());
export const weekNum = writable(null);
export const week = writable({
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
});

export const monthlyFoldObj = writable({
  1: false,
  10: false,
  20: false,
  30: false,
  40: false,
  50: false,
  60: false,
  70: false,
  80: false,
  90: false,
});

export const weeklyFoldObj = writable({
  1: false,
  10: false,
  20: false,
  30: false,
  40: false,
  50: false,
  60: false,
  70: false,
  80: false,
  90: false,
});
