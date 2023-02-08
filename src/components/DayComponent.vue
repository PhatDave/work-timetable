<script>
import {API} from "@/Utils/API";

export default {
	emits: ["showModal"],
	props: {
		day: {
			type: Object,
			required: true,
			default: {}
		}
	},
	data() {
		return {
			isCurrentMonth: this.day.isCurrentMonth,
			isCurrentDay: this.day.isCurrentDay,
			API: new API(),
		}
	},
	methods: {
		showModal() {
			this.$emit("showModal", this.day);
		},
		addWorkHours(event) {
			this.API.addWorkhours(this.day.date, 8).then(hours => {
				this.day.workHours = this.day.workHours + hours.hours;
			});
		}
	},
	computed: {
		formattedDate() {
			return `${this.day.date.getDate()}.${this.day.date.getMonth() + 1}.`
		}
	}
}
</script>

<template>
	<div :class="{isNotCurrentMonth: !isCurrentMonth, isCurrentDay: isCurrentDay, cell: true}" @click="showModal" @auxclick="addWorkHours" v-if="!loading">
		<div class="date">
			{{ formattedDate }}
		</div>
		<div>
			<span :class="{regularHours: this.day.workHours >= 8}">{{ this.day.workHours }}</span><span v-if="this.day.overtimeHours > 0"
			                                                                                            class="overtime">+{{ this.day.overtimeHours }}</span>
		</div>
	</div>
</template>

<style scoped>
.cell {
	display: grid;
	grid-template-rows: 1fr 1fr;
}

.date {
	font-size: 1.2rem;
}

div {
	margin: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}

div > span {
	font-size: 1.8rem;
	font-weight: 400;
}

.isNotCurrentMonth * {
	opacity: 0.3;
}

.isCurrentDay {
	border: 1px solid #ff906e;
}

.overtime {
	color: #ff906e;
}

.regularHours {
	color: #a0e8ff;
}
</style>
