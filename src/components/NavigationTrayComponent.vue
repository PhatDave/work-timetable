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
		},
		goForth() {
			this.currentTime.month++;
		}
	},
	computed: {
		getFormattedTime() {
			let date = new Date(this.currentTime.year, this.currentTime.month, 1, 12);
			return `${date.getMonth()}.${date.getFullYear()}.`
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
}

.currentTime {
	font-size: 2rem;
}

button {
	height: 100%;
	width: 10vw;
	border: 3px solid transparent;
	cursor: pointer;
	font-size: 1.5rem;
}

button:hover {
	border: 3px solid deepskyblue;
}
</style>
