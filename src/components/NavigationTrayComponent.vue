<script>
export default {
	props: {
		currentTime: {
			type: Object,
			required: true,
			default: {}
		},
	},
	data() {
	},
	methods: {
		goBack() {
			this.currentTime.month--;
			if (this.currentTime.month < 0) {
				this.currentTime.month = 11;
				this.currentTime.year--;
			}
		},
		goForth() {
			this.currentTime.month++;
			if (this.currentTime.month > 11) {
				this.currentTime.month = 0;
				this.currentTime.year++;
			}
		}
	},
	computed: {
		getFormattedTime() {
			return `${this.currentTime.month + 1}.${this.currentTime.year}.`
		}
	}
}
</script>

<template>
	<div class="container">
		<button @click="goBack">B A C K</button>
		<span class="currentTime">{{ getFormattedTime }}</span>
		<button @click="goForth">F O R T H</button>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 10vh;
}

.currentTime {
	font-size: 2rem;
}

button {
	height: 100%;
	width: 25vw;
	border: 3px solid transparent;
	cursor: pointer;
	font-size: 1.5rem;
}

button:hover {
	border: 3px solid deepskyblue;
}
</style>
