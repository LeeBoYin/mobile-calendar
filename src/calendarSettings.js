// import moment locale so that calendar can set locale to moment
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/th';
import 'moment/locale/vi';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-hk';
import 'moment/locale/zh-tw';
// set format and lang by language code
export default {
	'en': {
		displayDateFormat: 'ddd, D MMM',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'ddd',
		firstDayOfWeek: 0,
	},
	'ja': {
		displayDateFormat: 'M月D日(ddd)',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 0,
	},
	'ko': {
		displayDateFormat: 'MMMM D일 dddd',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 0,
	},
	'th': {
		displayDateFormat: 'วันddddที่ D MMM',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 0,
	},
	'vi': {
		displayDateFormat: 'ddd, D MMM',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 0,
	},
	'zh-cn': {
		displayDateFormat: 'M月D日(ddd)',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 0,
	},
	'zh-hk': {
		displayDateFormat: 'M月D日(ddd)',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 0,
	},
	'zh-tw': {
		displayDateFormat: 'M月D日(ddd)',
		displayMonthFormat: 'MMM',
		displayDayFormat: 'dd',
		firstDayOfWeek: 1,
	},
};
