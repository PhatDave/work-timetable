<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
			default: ""
		}
	}
}
</script>

<template>
	<div>
		{{ this.title }}
	</div>
</template>

<style scoped>
div {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

div > span {
	font-size: 2.2rem;
	font-weight: 400;
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
