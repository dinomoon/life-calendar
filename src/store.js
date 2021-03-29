import { writable } from 'svelte/store';

export const loggedIn = writable(false);
export const firebaseLoggedIn = writable(false);
export const kakaoLoggedIn = writable(false);
export const naverLoggedIn = writable(false);
export const calendarTabs = writable(['연간', '월간', '주간']);
export const activeTab = writable('연간');
export const submitBirth = writable(false);
export const userId = writable(null);
export const userInfo = writable(null);
export const week = writable({
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
});
export const colors = writable({
  'past-background-color': '#ebecf0',
  'current-item-color': '#adb5bd',
  'hover-item-color': '#dee2e6',
});
