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
	beforeMount() {
		this.API.getWorkDayHours(this.day.date).then((hours) => {
			this.day.hours = hours;
		});

		this.API.getOvertimeHours(this.day.date).then((hours) => {
			this.day.overtime = hours;
		});
	},
	methods: {
		showModal() {
			this.$emit("showModal", this.day);
		}
	},
}
</script>

<template>
	<div :class="{isNotCurrentMonth: !isCurrentMonth, isCurrentDay: isCurrentDay}" @click="showModal">
		<span :class="{regularHours: this.day.hours >= 8}">{{ this.day.hours }}</span><span v-if="this.day.overtime > 0"
		                                                                                    class="overtime">+{{ this.day.overtime }}</span>
	</div>
</template>

<style scoped>
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
