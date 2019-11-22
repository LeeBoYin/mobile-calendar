<template>
	<div id="app">
		<Calendar
			v-model="singleDate"
			:date-format="dateFormat"
			:initial-date="initialDate"
			:min-date="minDate"
			:max-date="maxDate"
			:lang-code="langCode"
			:check-is-valid="checkIsDateValid">
		</Calendar>
		<hr>
		<Calendar
			v-model="dateRange"
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
			singleDate: null,
			dateRange: null,
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
	},
}
</script>

<style>

</style>
