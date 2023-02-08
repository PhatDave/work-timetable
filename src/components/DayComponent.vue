<script>
import {API} from "@/Utils/DBApi/API";

export default {
	props: ["day"],
	emits: ["showModal"],
	data() {
		return {
			isCurrentMonth: this.day.isCurrentMonth,
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
	}
}
</script>

<template>
	<div :class="{isNotCurrentMonth: !isCurrentMonth}" @click="showModal">
		<span :class="{regularHours: this.day.hours >= 8}">{{ this.day.hours }}</span><span v-if="this.day.overtime > 0"
		                                                                                    class="overtime"> + {{ this.day.overtime }}</span>
	</div>
</template>

<style scoped>
div {
	height: 100%;
}

.isNotCurrentMonth * {
	opacity: 0.3;
}

.overtime {
	color: #ff906e;
}
.regularHours {
	color: #a0e8ff;
}
</style>
