<template>
    <Column field="is_expired" :sortable="false" headerStyle="min-width:15rem;">
        <template #header>
            <span class="flex-1 uppercase py-2 font-bold"> is_expired </span>
        </template>
        <template #body="slotProps">
            <Tag
                :value="slotProps.data.is_expired ? 'Aktif' : 'Kadaluarasa'"
                :severity="slotProps.data.is_expired ? 'success' : 'danger'"
            >
            </Tag>
        </template>
    </Column>
</template>
