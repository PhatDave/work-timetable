<script>
import * as dateUtils from "@/Utils/dateUtils";
import DayComponent from "@/components/DayComponent.vue";
import {API} from "@/Utils/DBApi/API";

export default {
	data() {
		return {
			days: {},
			API: new API(),
			showModal: false,
			modalDay: {},
		}
	},
	components: {
		DayComponent,
	},
	beforeMount() {
		let now = new Date();
		this.days = dateUtils.buildMonth(now.getMonth() + 1, now.getFullYear());
	},
	methods: {
		showModal(day) {
			console.log("AAAAAAAAAAAAAAA");
			this.day = day;
			this.showModal = true;
		}
	}
}
</script>

<template>
	<div class="calendar">
		<div v-for="day in days">
			<DayComponent :day="day" @showModal="showModal"/>
		</div>
	</div>
	<Teleport to="body">
		<DayModalComponent :day="modalDay" :show="showModal" @close="showModal = false"/>
	</Teleport>
</template>

<style scoped>
.calendar {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: repeat(6, 1fr);
	justify-items: center;
	text-align: center;
	background-color: rgba(0, 143, 154, 0.3);
	border: 2px solid rgba(0, 143, 154, 0.3);
	gap: 2px;
	margin: 0 30vw;
}

.calendar > div {
	min-width: 100%;
	min-height: 10vh;
	aspect-ratio: 1;
}
</style>

<style>
</style>
