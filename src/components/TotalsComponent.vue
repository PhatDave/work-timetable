<script>
export default {
	props: {
		days: {
			type: Object,
			required: true,
			default: {}
		}
	},
	data() {
		return {
			totalHours: 0,
			totalOvertimeHours: 0,
		}
	},
	watch: {
		days: {
			handler: function(newVal, oldVal) {
				this.calculateHours();
			},
			deep: true
		}
	},
	methods: {
		calculateHours() {
			this.totalHours = 0;
			this.totalOvertimeHours = 0;
			this.days.filter(day => day.isCurrentMonth).reduce((acc, day) => {
				this.totalHours += day.workHours;
				this.totalOvertimeHours += day.overtimeHours;
			}, 0);
		}
	},
}
</script>

<template>
	<div class="container">
		<span class="regularHours">{{ this.totalHours }}</span><span v-if="this.totalOvertimeHours > 0" class="overtime">+{{ this.totalOvertimeHours }}</span>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.container * {
	font-size: 2.5rem;
}
</style>
