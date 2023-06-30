<script setup>
defineProps(["type"]);
</script>

<template>
    <button
        class="flex items-center gap-1 text-white px-4 py-2 rounded-md"
        :class="{
            'bg-blue-600 hover:bg-blue-700': type == 'primary',
            'bg-neutral-600 hover:bg-neutral-700': type == 'secondary',
        }"
    >
        <slot></slot>
    </button>
</template>
