import { writable } from 'svelte/store';

export const loggedIn = writable(false);
export const firebaseLoggedIn = writable(false);
export const kakaoLoggedIn = writable(false);
export const naverLoggedIn = writable(false);
export const calendarTabs = writable(['연간', '월간', '주간']);
export const activeTab = writable('연간');
export const submitBirth = writable(false);
