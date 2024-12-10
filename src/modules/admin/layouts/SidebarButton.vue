<script setup lang="ts">
const props = defineProps({
	text: String,
	icon: String,
	'class': {
		type: String,
	},
	active: Boolean
});
</script>
<template>
	<Button :class="[
		'hover:transition hover:duoation-[0.3s] hover:ease w-full rounded-lg p-2 my-2  ',
		'flex select-none',
		!(props['class'] ?? '').includes('hover:bg') && !props.active && 'hover:bg-gray-700 text-white',
		!(props['class'] ?? '').includes('hover:text') && !props.active && 'hover:font-bold',
		props['class'],
		props.active && 'bg-gray-600 border-gray-600 dark:border-surface-500 '
	]">
	<i :class="[props.icon]" />
		{{ props.text }}
	</Button>
</template>
