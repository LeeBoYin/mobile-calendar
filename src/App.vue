<template>
	<div id="app">
		<h1>單日</h1>
		<Calendar
			:date-format="dateFormat"
			:initial-date="initialDate"
			:min-date="minDate"
			:max-date="maxDate"
			:lang-code="langCode"
			:check-is-valid="checkIsDateValid">
		</Calendar>
		<h1>起訖日</h1>
		<Calendar
			:date-format="dateFormat"
			:initial-date="initialDate"
			:is-range-mode="true"
			:min-date="minDate"
			:max-date="maxDate"
			:min-span="2"
			:max-span="5"
			:lang-code="langCode"
			:check-is-valid="checkIsDateValid">
		</Calendar>
		<h1>聖誕節限定</h1>
		<Calendar
			:date-format="dateFormat"
			initial-date="2019-12-25"
			:is-range-mode="true"
			:min-date="minDate"
			max-date="2019-12-31"
			:min-span="2"
			:max-span="5"
			:lang-code="langCode"
			:check-is-valid="christmasLimit">
		</Calendar>
		<template v-for="lang in ['zh-tw', 'zh-cn', 'ja', 'ko', 'th', 'vi']">
			<h1>{{ lang }}</h1>
			<Calendar
				:date-format="dateFormat"
				:initial-date="initialDate"
				:is-range-mode="true"
				:min-date="minDate"
				:max-date="maxDate"
				:min-span="1"
				:max-span="3"
				:lang-code="lang"
				:check-is-valid="checkIsDateValid">
			</Calendar>
		</template>
	</div>
</template>

<script>
import moment from 'moment';
import './app.scss';
import Calendar from './Calendar.vue';
export default {
	components: {
		Calendar,
	},
	data() {
		return {
			dateFormat: 'YYYY-MM-DD',
			langCode: 'en',
		};
	},
	computed: {
		initialDate() {
			return moment().format(this.dateFormat);
		},
		minDate() {
			return moment().format(this.dateFormat);
		},
		maxDate() {
			return moment().add(1, 'year').format(this.dateFormat);
		},
	},
	methods: {
		checkIsDateValid(dateObj) {
			if(!moment.isMoment(dateObj)) {
				return false;
			}

			return dateObj.day() !== 3;
		},
		christmasLimit(dateObj) {
			if(!moment.isMoment(dateObj)) {
				return false;
			}

			return dateObj.month() === 11 && dateObj.date() >= 24;
		}
	},
}
</script>

<style>
	h1 {
		margin: 10px 15px;
	}
	.calendar {
		border-top: 1px solid #EEE;
		border-bottom: 80px solid #F8F8F8;
	}
</style>
