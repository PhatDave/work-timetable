<script>
import * as dateUtils from "@/Utils/dateUtils";
import DayComponent from "@/components/DayComponent.vue";
import {API} from "@/Utils/API";
import DayModalComponent from "@/components/DayModalComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {ref} from "vue";

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
			]
		}
	},
	components: {
		HeaderComponent,
		DayComponent,
		DayModalComponent,
	},
	beforeMount() {
		let now = new Date();
		let days = dateUtils.buildMonth(now.getMonth() + 1, now.getFullYear());
		days = days.map(day => {
			return {
				...day,
				workHours: this.API.getWorkDayHours(day.date),
				overtimeHours: this.API.getOvertimeHours(day.date)
			};
		});
		this.days = days;
	},
	methods: {
		showModal(day) {
			this.modalDay = day;
			this.modalShown = true;
		}
	}
}
</script>

<template>
	<div class="calendar">
		<HeaderComponent :title="header" v-for="header in headers"/>
		<slot v-for="day in days">
			<DayComponent :day="day" @showModal="showModal" class="day"/>
		</slot>
	</div>
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
	margin: 0 30vw;
}

.calendar > div {
	width: 100%;
}

.day {
	aspect-ratio: 1;
}
</style>

<style>
</style>
