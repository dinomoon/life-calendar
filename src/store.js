import { writable } from 'svelte/store';

const time = new Date();
export const colors = writable({
  'past-background-color': 'rgba(0,0,0,0.1)',
  'current-hover-item-color': 'rgba(0,0,0,0.4)',
  'current-hover-text-color': '#ff922b',
  'hover-item-color': 'rgba(0,0,0,0.2)',
  'background-color': '#fdf9f1',
  'item-background-color': '#FFFEFC',
});
export const modalTransition = writable({ y: -20, duration: 400 });
export const loading = writable(false);
export const loggedIn = writable(false);
export const firebaseLoggedIn = writable(false);
export const kakaoLoggedIn = writable(false);
export const calendarTabs = writable(['연간', '월간', '주간']);
export const activeTab = writable('annual');
export const rowArray = writable(new Array(100));
export const colArray = writable(null);
export const userId = writable(null);
export const userInfo = writable(null);
export const userDocId = writable(null);
export const userAge = writable(null);
export const clickedDay = writable(null);
export const showItemModal = writable(false);
export const showHelpModal = writable(false);
export const date = writable(time);
export const thisYear = writable(time.getFullYear());
export const thisMonth = writable(time.getMonth());
export const dayNum = writable(time.getDay());
export const dateNum = writable(time.getDate());
export const weekNum = writable(null);
export const weekObj = writable({
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
});
export const dayArray = writable(['월', '화', '수', '목', '금', '토', '일']);
export const clickedYearWeekPeriod = writable(null);
export const foldStore = writable({
  monthly: {
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
  },
  weekly: {
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
  },
});

// modal Color
export const lastColorIdx = writable(null);
// selected Tag
export const selectedTag = writable('all');
export const selectedCategories = writable([
  { category: '운동', item: '푸쉬업', detail: { type: 'count', value: 0 } },
]);
export const startWeek = writable(null);
export const endWeek = writable(null);
export const categories = writable([
  { category: '운동', items: ['푸쉬업', '턱걸이'] },
]);

export const backgroundColors = writable([
  '#ffc9c9',
  '#ffd8a8',
  '#ffec99',
  '#b2f2bb',
  '#a5d8ff',
  '#bac8ff',
  '#d0bfff',
]);

export const borderColors = writable([
  '#fa5252',
  '#fd7e14',
  '#fab005',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
]);
export const tagCounts = writable([]);
