<template>
    <Column field="email" :sortable="true" headerStyle="min-width:15rem;">
        <template #header>
            <span class="flex-1 uppercase py-2 font-bold"> email </span>
        </template>
        <template #body="slotProps">
            <span :class="{ 'text-red-500': slotProps.data.trashed }">
                {{ slotProps.data.email }}
            </span>
        </template>
    </Column>
</template>
