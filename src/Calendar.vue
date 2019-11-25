<template>
	<div class="calendar">
		<ul ref="navYear" class="nav nav-year">
			<li v-for="(monthsIdx, year) in yearMonthsIdx"
				class="item item-year">
				<span class="year">{{ year }}</span>
				<ul class="nav nav-month">
					<li v-for="idx in monthsIdx"
						ref="monthTab"
						:key="months[idx].year + '-' + months[idx].month"
						:class="{ active: currentMonthIdx === idx }"
						class="item item-month"
						@click="changeMonth(idx)">
						<a class="month">{{ months[idx].text }}</a>
					</li>
				</ul>
			</li>
			<div ref="underline" class="underline" :style="underlineStyle"></div>
		</ul>
		<div class="table-wrapper">
			<div ref='dateCarousel' class="owl-carousel">
				<table v-for="(dateRows, idx) in monthDateRows" class="date-table">
					<thead>
						<tr class="row-day">
							<th v-for="dayName in daysName" :key="dayName" class="cell-day">{{ dayName }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(row, y) in dateRows" :key="y" class="row-date">
							<td
								v-for="(dateObj, x) in row"
								:key="x"
								:class="dateObj && getCellClass(dateObj)"
								@click="onDateClick(dateObj)">
								<template v-if="dateObj">
									<div class="date-num">
										{{ dateObj.date() }}
									</div>
								</template>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="hint"></div>
		</div>
		<div v-if="isRangeMode" class="bottom">
			<i class="fa fa-info-circle"></i> 此方案最少預定 {{ minSpan }} 天，最多 {{ maxSpan }} 天
		</div>
		<div :class="{ active: isShowError }" class="error-msg">
			{{ errorMsg }}
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import 'owl.carousel';
import './owl.verticalswiping';
import './calendar.scss';
import calendarSettings from './calendarSettings';


const ERROR_CODES = {
	BELOW_MIN: 'BELOW_MIN',
	ABOVE_MAX: 'ABOVE_MAX',
	HAS_INVALID: 'HAS_INVALID',
};

// temp lang
const TEMP_LANG =  {
	calendar_error_above_max: '最多 %s 天',
	calendar_error_below_min: '最少 %s 天',
	calendar_error_has_invalid: '包含無法選擇的日期',
	calendar_error_missing_end_date: '請選擇結束日期',
	date_span_days: '天',
};

const calendarSettingDefault = {
	'displayDateFormat': 'ddd, D MMMM',
	'displayMonthFormat': 'MMMM YYYY',
	'firstDayOfWeek': 0,
};

export default {
	props: {
		value: {
			type: [String, Object],
			default: null,
		},
		dateFormat: {
			type: String,
			default: 'YYYY/MM/DD',
		},
		initialDate: {
			type: String,
			default: null,
		},
		isRangeMode: {
			type: Boolean,
			default: false,
		},
		minDate: {
			type: String,
			default: null,
			required: true,
		},
		maxDate: {
			type: String,
			default: null,
			required: true,
		},
		minSpan: {
			type: Number,
			default: null,
		},
		maxSpan: {
			type: Number,
			default: null,
		},
		checkIsValid: {
			type: Function,
			default: null,
		},
		getInfo: {
			type: Function,
			default: null,
		},
		langCode: {
			type: String,
			default: 'en',
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			displayMoment: (this.initialDate ? moment(this.initialDate, this.dateFormat) : moment()).startOf('month'),
			startDateObj: null,
			endDateObj: null,
			currentMonthIdx: null,
			dateCarousel: null,
			underlineStyle: null,
			transitionDuration: 150,
			monthTabsWidth: [],
			monthTabsOffset: [],
			errorMsg: null,
			errorTimeout: null,
			isShowError: false,
		};
	},
	computed: {
		calendarSetting() {
			return calendarSettings[this.langCode] || calendarSettingDefault;
		},
		daysName() {
			return _.times(7).map((d) => {
				return moment().locale(this.langCode).day(this.calendarSetting.firstDayOfWeek + d).format(this.calendarSetting.displayDayFormat);
			});
		},
		months() {
			const monthCursor = moment(this.minDate, this.dateFormat);
			const maxDateObj = moment(this.maxDate, this.dateFormat);
			const months = [];
			while(monthCursor.isSameOrBefore(maxDateObj, 'month')) {
				months.push({
					year: monthCursor.year(),
					month: monthCursor.month(),
					text: monthCursor.locale(this.langCode).format(this.calendarSetting.displayMonthFormat),
				});
				monthCursor.add(1, 'M');
			}
			return months;
		},
		yearMonthsIdx() {
			const yearMonthsIdx = {};
			_.forEach(this.months, (month, idx) => {
				_.setWith(yearMonthsIdx, [month.year, month.month], idx, Object);
			});
			console.log(yearMonthsIdx);
			return yearMonthsIdx;
		},
		monthDateRows() {
			return _.map(this.months, (month) => {
				const dateRows =  _.times(6, _.stubArray);
				const dateObjCursor =  moment().year(month.year).month(month.month).startOf('month');
				const lastDateObj =  moment().year(month.year).month(month.month).endOf('month');
				let dayCursor = this.calendarSetting.firstDayOfWeek;
				let rowIdx = 0;

				while(dateObjCursor.isSameOrBefore(lastDateObj)) {
					if(dateObjCursor.day() === dayCursor) {
						dateRows[rowIdx].push(dateObjCursor.clone());
						dateObjCursor.add(1, 'd');

					} else {
						dateRows[rowIdx].push(null);
					}

					dayCursor = (dayCursor + 1) % 7;
					if(dateRows[rowIdx].length === 7) {
						rowIdx++;
					}
				}

				return dateRows;
			});
		},
	// 	datesInfo() {
	// 		if(!_.isFunction(this.getInfo)) {
	// 			return null;
	// 		}
	// 		return _.reduce(_.times(this.displayMoment.daysInMonth()), (result, value) => {
	// 			const dateObj = this.displayMoment.clone().date(value + 1);
	// 			result[value + 1] = this.getInfo(dateObj);
	// 			return result;
	// 		}, {});
	// 	},
	// 	currentMonthText() {
	// 		return moment(this.displayMoment).locale(this.langCode).format(this.calendarSetting.displayMonthFormat);
	// 	},
		isSelecting() {
			return !!(this.isRangeMode && this.startDateObj && !this.endDateObj);
		},
		isSelected() {
			return !!(this.startDateObj && this.endDateObj);
		},
		emitValue() {
			if(!this.isSelected) {
				return null;
			}
			if(this.isRangeMode) {
				return {
					startDate: this.startDateObj.format(this.dateFormat),
					endDate: this.endDateObj.format(this.dateFormat),
				};
			} else {
				return this.startDateObj.format(this.dateFormat);
			}
		},
		displaySelectedDate() {
			if(!this.isSelected) {
				return null;
			}
			const displayDateFormat = this.calendarSetting.displayDateFormat;
			if(this.dateSpan > 1) {
				return `${ moment(this.startDateObj).locale(this.langCode).format(displayDateFormat) } ~ ${ moment(this.endDateObj).locale(this.langCode).format(displayDateFormat) }`;
			} else {
				return moment(this.startDateObj).locale(this.langCode).format(displayDateFormat);
			}
		},
		dateSpan() {
			return this.isSelected ? this.endDateObj.diff(this.startDateObj, 'days') + 1 : null;
		},
	},
	watch: {
		emitValue() {
			this.$emit('input', this.emitValue);
		},
		displayMoment() {
			this.$emit('month-changed', this.displayMoment);
		},
		value(value) {
			// set date from value props
			if(this.isRangeMode) {
				const startDate = _.get(value, 'startDate');
				const endDate = _.get(value, 'endDate');
				if(startDate === _.get(this.emitValue, 'startDate') && endDate === _.get(this.emitValue, 'endDate')) {
					return;
				}
				if(startDate && endDate) {
					const startDateObj = moment(startDate, this.dateFormat);
					const endDateObj = moment(endDate, this.dateFormat);
					this.setSelectedDates(startDateObj, endDateObj);
				} else {
					this.setSelectedDates(null, null);
				}
			} else {
				if(value === this.emitValue) {
					return;
				}
				if(value) {
					const dateObj = moment(value, this.dateFormat);
					this.setSelectedDates(dateObj, dateObj);
				} else {
					this.setSelectedDates(null, null);
				}
			}
			this.$emit('input', this.emitValue);
		},
		currentMonthIdx(idx) {
			// show month
			this.dateCarousel.$element.trigger('to.owl.carousel', [idx, 0]);
			// move underline
			$(this.$refs.underline).css({
				left: this.monthTabsOffset[idx],
				width: this.monthTabsWidth[idx],
			});
			// scroll month tabs
			this.checkMonthTabVisible();
		},
	},
	mounted() {
		this.monthTabsWidth = _.map(this.$refs.monthTab, (monthTab) => {
			return $(monthTab).outerWidth();
		});
		this.monthTabsOffset = _.map(this.$refs.monthTab, (monthTab, idx) => {
			return _.sum(_.slice(this.monthTabsWidth, 0, idx));
		});
		this.currentMonthIdx = this.displayMoment.diff(moment(this.minDate, this.dateFormat), 'M');
		this.initCarousel();
		this.initUnderline();
	},
	methods: {
		initCarousel() {
			$(this.$refs.dateCarousel).on('initialized.owl.carousel', (e) => {
				this.dateCarousel = e.relatedTarget;
			});
			$(this.$refs.dateCarousel).owlCarousel({
				items: 1,
				itemElement: 'table',
				smartSpeed: this.transitionDuration,
				// startPosition,
			}).on('changed.owl.carousel', (e) => {
				this.currentMonthIdx = e.item.index;
			});
		},
		initUnderline() {
			this.dateCarousel.$element.on('touchstart mousedown', (e) => {
				this.onDragging();
				$('body').on('touchmove mousemove', this.onDragging);
				$('body').one('touchend mouseup', () => {
					$('body').off('touchmove mousemove', this.onDragging);
					this.setUnderlineAnimate();
				});
			});
		},
		onDragging() {
			const translateMatrix = this.dateCarousel.$stage.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
			const translateX = _.toNumber(translateMatrix[12]) || _.toNumber(translateMatrix[4]);
			const idxFloat = -(translateX / this.dateCarousel.width());
			let underlineLeft;
			let underlineWidth;

			if(idxFloat >= 0) {
				const idx = _.floor(idxFloat);
				underlineLeft = this.monthTabsOffset[idx] + (idxFloat % 1) * this.monthTabsWidth[idx];
				if(idxFloat > this.monthTabsWidth.length) {
					underlineWidth = _.last(this.monthTabsWidth);
				} else {
					underlineWidth = this.monthTabsWidth[idx] + (this.monthTabsWidth[idx + 1] - this.monthTabsWidth[idx]) * (idxFloat % 1);
				}
			} else {
				underlineWidth = _.head(this.monthTabsWidth);
				underlineLeft = underlineWidth * idxFloat;
			}

			this.removeUnderlineAnimate();
			$(this.$refs.underline).css({
				left: underlineLeft,
				width: underlineWidth,
			});
		},
		setUnderlineAnimate() {
			const idx = this.dateCarousel.current();
			$(this.$refs.underline).css({
				left: this.monthTabsOffset[idx],
				width: this.monthTabsWidth[idx],
				transition: (this.transitionDuration / 1000) + 's ease',
			});
		},
		removeUnderlineAnimate() {
			$(this.$refs.underline).css({
				transition: '',
			});
		},
		checkMonthTabVisible() {
			const navYear = this.$refs.navYear;
			const navWidth = navYear.clientWidth;
			const navScrollLeft = navYear.scrollLeft;
			const tabWidth = this.monthTabsWidth[this.currentMonthIdx];
			const tabOffsetLeft = this.monthTabsOffset[this.currentMonthIdx];

			if(tabOffsetLeft < navScrollLeft) {
				// scroll to left
				$(navYear).animate({
					scrollLeft: tabOffsetLeft,
				}, this.transitionDuration);
			} else if(tabOffsetLeft + tabWidth > navScrollLeft + navWidth) {
				// scroll to right
				$(navYear).animate({
					scrollLeft: tabOffsetLeft + tabWidth - navWidth,
				}, this.transitionDuration);
			}
		},
		onDateClick(dateObj) {
			if(this.isRangeMode) {
				if(this.isSelected || !this.startDateObj || dateObj.isBefore(this.startDateObj, 'day')) {
					// set startDate
					this.setSelectedDates(dateObj, null);
				} else {
					// complete range
					const result = this.checkRangeValid(this.startDateObj, dateObj);
					if(result.isValid) {
						this.setSelectedDates(this.startDateObj, dateObj);
					} else {
						// clear
						this.setSelectedDates(null, null);
						if(result.errorMsg) {
							this.showErrorMsg(result.errorMsg);
						}
					}
				}
			} else { // single date
				if(this.isSelected && dateObj.isSame(this.startDateObj, 'day')) {
					// clear
					this.setSelectedDates(null, null);
				} else {
					// set date
					this.setSelectedDates(dateObj, dateObj);
				}
			}
		},
		setSelectedDates(startDateObj, endDateObj) {
			// reset
			this.startDateObj = this.endDateObj = null;
			if(!startDateObj) {
				return;
			}

			if(!endDateObj && this.checkSelectable(startDateObj)) {
				// set start date only
				this.startDateObj = startDateObj;
			} else if(endDateObj && this.checkRangeValid(startDateObj, endDateObj).isValid) {
				// set both start date and end date
				this.startDateObj = startDateObj;
				this.endDateObj = endDateObj;
			}
		},
		checkSelectable(dateObj) {
			if(!dateObj) {
				return false;
			}
			if(this.minDate && dateObj.isBefore(moment(this.minDate, this.dateFormat), 'day')) {
				return false;
			}
			if(this.maxDate && dateObj.isAfter(moment(this.maxDate, this.dateFormat), 'day')) {
				return false;
			}
			if(_.isFunction(this.checkIsValid)) {
				return !!this.checkIsValid(dateObj);
			}
			return true;
		},
		checkRangeValid(startDateObj, endDateObj) {
			if(!startDateObj || !endDateObj) {
				return {
					isValid: false,
					errorMsg: null,
				};
			}
			if(startDateObj.isAfter(endDateObj, 'day')) {
				return {
					isValid: false,
					errorMsg: null,
				};
			}

			const dateObjCursor = startDateObj.clone();
			while(dateObjCursor.isSameOrBefore(endDateObj, 'day')) {
				if(!this.checkSelectable(dateObjCursor)) {
					return {
						isValid: false,
						errorMsg: TEMP_LANG.calendar_error_has_invalid,
					};
				}
				dateObjCursor.add(1, 'd');
			}

			const span = endDateObj.diff(startDateObj, 'days') + 1;
			if(this.minSpan > 0 && this.minSpan > span) {
				return {
					isValid: false,
					errorMsg: TEMP_LANG.calendar_error_below_min.replace('%s', this.minSpan),
				};
			}
			if(this.maxSpan > 0 && this.maxSpan < span) {
				return {
					isValid: false,
					errorMsg: TEMP_LANG.calendar_error_above_max.replace('%s', this.maxSpan),
				};
			}

			return {
				isValid: true,
				errorMsg: null,
			};
		},
		changeMonth(idx) {
			this.removeUnderlineAnimate();
			this.currentMonthIdx = idx;
		},
		getCellClass(dateObj) {
			if(!moment.isMoment(dateObj)) {
				return [];
			}

			const classList = ['cell-date'];

			// today
			if(dateObj.isSame(moment(), 'day')) {
				classList.push('today');
			}

			// selectable, disabled
			if(this.checkSelectable(dateObj)) {
				classList.push('selectable');
			} else {
				classList.push('disabled');
			}

			// selecting
			if(this.isSelecting && dateObj.isSame(this.startDateObj, 'day')) {
				classList.push('selecting');
			}

			if(this.isSelected) {
				// selected
				if(dateObj.isSame(this.startDateObj, 'day') || dateObj.isSameOrAfter(this.startDateObj, 'day') && dateObj.isSameOrBefore(this.endDateObj, 'day')) {
					classList.push('selected');
				}

				// selected-start
				if(dateObj.isSame(this.startDateObj, 'day')) {
					classList.push('selected-start');
				}

				// selected-end
				if(dateObj.isSame(this.endDateObj, 'day')) {
					classList.push('selected-end');
				}
			}

			return classList;
		},
		showErrorMsg(msg) {
			if(!msg) {
				return;
			}

			if(this.errorTimeout) {
				// clear unfinished timeout
				clearTimeout(this.errorTimeout);
			}
			this.errorMsg = msg;
			this.isShowError = true;
			this.errorTimeout = setTimeout(() => {
				this.isShowError = false;
				this.errorTimeout = null;
			}, 3000);
		},
	},
};
</script>
