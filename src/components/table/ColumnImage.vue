<template>
    <Column field="name" :sortable="true" headerStyle="min-width:15rem;">
        <template #header>
            <span class="flex-1 uppercase py-2 font-bold"> Name </span>
        </template>
        <template #body="slotProps">
            <Image
                :alt="slotProps.data.name"
                :src="`${slotProps.data.avatar}`"
                shape="circle"
                preview
                width="50"
            />
        </template>
    </Column>
</template>
