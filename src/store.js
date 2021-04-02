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
export const userInfo = writable({
  birthday: { year: 1994 },
});
// export const userInfo = writable(null);
export const squareList = writable(null);
export const birthdayValid = writable(false);
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
export const beforeBtnClasses = writable([
  'b10',
  'b20',
  'b30',
  'b40',
  'b50',
  'b60',
  'b70',
  'b80',
  'b90',
  'b100',
]);
export const beforeBtnObj = writable({
  b10: '.before10',
  b20: '.before20',
  b30: '.before30',
  b40: '.before40',
  b50: '.before50',
  b60: '.before60',
  b70: '.before70',
  b80: '.before80',
  b90: '.before90',
  b100: '.before100',
});

export const monthlyFoldObj = writable({
  b10: false,
  b20: false,
  b30: false,
  b40: false,
  b50: false,
  b60: false,
  b70: false,
  b80: false,
  b90: false,
  b100: false,
});

export const weeklyFoldObj = writable({
  b10: false,
  b20: false,
  b30: false,
  b40: false,
  b50: false,
  b60: false,
  b70: false,
  b80: false,
  b90: false,
  b100: false,
});
