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
	emits: ["hoursChanged"],
	data() {
		return {
			workHours: [],
			overtime: [],
			API: new API(),
		}
	},
	computed: {},
	watch: {
		day: function(newVal, oldVal) {
			this.API.getAllWorkDayHours(newVal.date).then((hours) => {
				this.workHours = hours;
			});
			this.API.getAllOvertimeHours(newVal.date).then((hours) => {
				this.overtime = hours;
			});
		}
	},
	methods: {
		block(event) {
			event.stopPropagation();
			event.preventDefault();
		},
		removeWorkHour(hour) {
			this.API.removeWorkHour(hour.id);
			this.workHours = this.workHours.filter((h) => h.id !== hour.id);
			this.day.workHours = this.day.workHours - hour.hours;
		},
		removeOvertimeHour(hour) {
			this.API.removeOvertimeHour(hour.id);
			this.overtime = this.overtime.filter((h) => h.id !== hour.id);
			this.day.overtimeHours = this.day.overtimeHours - hour.hours;
		},
		inputWorkHour(keyEvent) {
			if (keyEvent.keyCode === 13) {
				this.API.addWorkhours(this.day.date, keyEvent.target.value).then(hours => {
					this.workHours.push(hours);
					this.day.workHours = this.day.workHours + hours.hours;
				});
				this.$refs.workHourInput.value = "";
			}
		},
		inputWorkHourButton(event) {
			this.API.addWorkhours(this.day.date, event.target.previousElementSibling.value).then(hours => {
				this.workHours.push(hours);
				this.day.workHours = this.day.workHours + hours.hours;
			});
			this.$refs.workHourInput.value = "";
		},
		inputOvertimeHour(keyEvent) {
			if (keyEvent.keyCode === 13) {
				this.API.addOvertime(this.day.date, keyEvent.target.value).then(hours => {
					this.overtime.push(hours);
					this.day.overtimeHours = this.day.overtimeHours + hours.hours;
				});
				this.$refs.overtimeHourInput.value = "";
			}
		},
		inputOvertimeButton(event) {
			this.API.addOvertime(this.day.date, event.target.previousElementSibling.value).then(hours => {
				this.overtime.push(hours);
				this.day.overtimeHours = this.day.overtimeHours + hours.hours;
			});
			this.$refs.overtimeHourInput.value = "";
		}
	}
}
</script>

<template>
	<div v-if="show" class="modal-mask" @click="$emit('close')">
		<div class="modal-container" @click="block">
			<div class="modal-header">
				<slot name="header">{{ this.day.date }}</slot>
			</div>

			<div class="modal-body">
				Regular hours:
				<div class="hours" v-for="hour in workHours" @click="removeWorkHour(hour)">
					<slot>
						{{ hour.hours }}
					</slot>
				</div>
				<div>
					<input type="text" ref="workHourInput" placeholder="Add hours" @keyup="inputWorkHour" autofocus>
					<button @click="inputWorkHourButton">Add hours</button>
				</div>
				Overtime:
				<div class="hours" v-for="hour in overtime" @click="removeOvertimeHour(hour)">
					<slot>
						{{ hour.hours }} ({{ hour.description }})
					</slot>
				</div>
				<div>
					<input type="text" ref="overtimeHourInput" placeholder="Add overtime hours" @keyup="inputOvertimeHour">
					<button @click="inputOvertimeButton">Add overtime hours</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
button {
	width: 100%;
	border: 1px solid deepskyblue;
}

input {
	margin: auto;
	width: 100%;
	border: 0;
	padding: 0;
}

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
	width: 20vw;
	margin: auto;
	padding: 20px 30px;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-body {
	margin: 20px 0;
}

.hours {
	margin: 0 2vw;
	padding: 0 0.5vw;
	font-size: 2rem;
}

.hours:hover {
	background-color: darkred;
}
</style>
