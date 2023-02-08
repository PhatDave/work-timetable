<script>
import * as dateUtils from "@/Utils/dateUtils";
import DayComponent from "@/components/DayComponent.vue";
import {API} from "@/Utils/API";
import DayModalComponent from "@/components/DayModalComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {ref} from "vue";
import NavigationTrayComponent from "@/components/NavigationTrayComponent.vue";
import TotalsComponent from "@/components/TotalsComponent.vue";

export default {
	data() {
		return {
			days: {},
			API: new API(),
			modalShown: false,
			modalDay: Object,
			headers: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			currentTime: {
				month: new Date().getMonth() + 1,
				year: new Date().getFullYear()
			}
		}
	},
	components: {
		HeaderComponent,
		DayComponent,
		DayModalComponent,
		NavigationTrayComponent,
		TotalsComponent
	},
	beforeMount() {
		this.updateDays();
	},
	methods: {
		showModal(day) {
			this.modalDay = day;
			this.modalShown = true;
		},
		async updateDays() {
			let days = dateUtils.buildMonth(this.currentTime.month, this.currentTime.year);
			days = days.map(day => {
				let obj = {
					...day,
					workHours: this.API.getWorkDayHours(day.date),
					overtimeHours: this.API.getOvertimeHours(day.date)
				};
				return obj;
			});
			for (let day of days) {
				day.workHours = await day.workHours;
				day.overtimeHours = await day.overtimeHours;
			}
			this.days = days;
		}
	},
	watch: {
		currentTime: {
			handler(newValue) {
				this.updateDays();
			},
			deep: true
		},
	}
}
</script>

<template>
	<NavigationTrayComponent :current-time="currentTime"/>
	<div class="calendar">
		<HeaderComponent :title="header" v-for="header in headers"/>
		<slot v-for="day in days">
			<DayComponent :day="day" @showModal="showModal" class="day"/>
		</slot>
	</div>
	<TotalsComponent :days="days"/>
	<Teleport to="body">
		<DayModalComponent :day="modalDay" :show="modalShown" @close="modalShown = false"/>
	</Teleport>
</template>

<style scoped>
.calendar {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: 1fr repeat(6, 2fr);
	justify-items: center;
	text-align: center;
	background-color: rgba(0, 143, 154, 0.3);
	border: 2px solid rgba(0, 143, 154, 0.3);
	gap: 2px;
	margin: 2vh 30vw;
}

.calendar > div {
	width: 100%;
}

.day {
	aspect-ratio: 1;
}
</style>

<style>
/* These important-s are necessary because darkMode overwrites these colors for some reason */
.overtime {
	color: #ff906e !important;
}

.regularHours {
	color: #a0e8ff !important;
}
</style>
