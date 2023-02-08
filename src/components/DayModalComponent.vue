<script>
import {API} from "@/Utils/API";

export default {
	props: {
		show: {
			type: Boolean,
			required: true,
			default: false
		},
		day: {
			type: Object,
			required: true,
			default: {}
		}
	},
	data() {
		return {
			workHours: [],
			overtime: [],
			API: new API(),
		}
	},
	computed: {},
	watch: {
		day: function (newVal, oldVal) {
			console.log(this.day);
			this.API.getAllWorkDayHours(this.day.date).then((hours) => {
				this.workHours = hours;
				console.log(hours);
			});
			this.API.getAllOvertimeHours(this.day.date).then((hours) => {
				this.overtime = hours;
				console.log(hours);
			});
		}
	},
}
</script>

<template>
	<div v-if="show" class="modal-mask" @click="$emit('close')">
		<div class="modal-container">
			<div class="modal-header">
				<slot name="header">{{ this.day.date }}</slot>
			</div>

			<div class="modal-body">
				<slot name="body">default body</slot>
			</div>

			<div class="modal-footer">
				<slot name="footer">
					default footer
				</slot>
			</div>
		</div>
	</div>
</template>

<style scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
}

.modal-container {
	width: 60vw;
	margin: auto;
	padding: 20px 30px;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-body {
	margin: 20px 0;
}
</style>
