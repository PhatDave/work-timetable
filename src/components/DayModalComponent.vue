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
			hoursInput: "",
			overtimeInput: "",
			overtimeDescriptionInput: ""
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
				this.API.addWorkhours(this.day.date, this.hoursInput).then(hours => {
					this.workHours.push(hours);
					this.day.workHours = this.day.workHours + hours.hours;
				});
				this.hoursInput = "";
			}
		},
		inputWorkHourButton(event) {
			this.API.addWorkhours(this.day.date, this.hoursInput).then(hours => {
				this.workHours.push(hours);
				this.day.workHours = this.day.workHours + hours.hours;
			});
			this.hoursInput = "";
		},
		inputOvertimeHour(keyEvent) {
			if (keyEvent.keyCode === 13) {
				this.API.addOvertime(this.day.date, this.overtimeInput, this.overtimeDescriptionInput).then(hours => {
					this.overtime.push(hours);
					this.day.overtimeHours = this.day.overtimeHours + hours.hours;
				});
				this.overtimeInput = "";
				this.overtimeDescriptionInput = "";
			}
		},
		inputOvertimeButton(event) {
			this.API.addOvertime(this.day.date, this.overtimeInput, this.overtimeDescriptionInput).then(hours => {
				this.overtime.push(hours);
				this.day.overtimeHours = this.day.overtimeHours + hours.hours;
			});
			this.overtimeInput = "";
			this.overtimeDescriptionInput = "";
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
				<div>
					Regular hours:
				</div>
				<div v-for="hour in workHours" @click="removeWorkHour(hour)" class="hoursContainer">
					<span class="hours">{{ hour.hours }}</span>
				</div>
				<div>
					<input type="text" placeholder="Add hours" @keyup="inputWorkHour" v-model="hoursInput" autofocus>
					<button @click="inputWorkHourButton">Add hours</button>
				</div>
				<div>
					Overtime:
				</div>
				<div v-for="hour in overtime" @click="removeOvertimeHour(hour)" class="hoursContainer">
					<span class="hours">{{ hour.hours }}</span> <span class="overtimeDescription">({{ hour.description }})</span>
				</div>
				<div>
					<input type="text" placeholder="Add overtime hours" @keyup="inputOvertimeHour" v-model="overtimeInput">
					<input type="text" placeholder="Overtime description" @keyup="inputOvertimeHour" v-model="overtimeDescriptionInput">
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

.overtimeDescription {
	font-size: 1rem;
}

.hoursContainer:hover {
	background-color: darkred;
}

.hoursContainer:hover * {
	background-color: darkred;
}
</style>
