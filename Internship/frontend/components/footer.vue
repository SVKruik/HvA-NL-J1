<template>
    <footer class="flex-col">
        <a href="https://github.com/SVKruik" target="_blank">
            <small>Stefan Kruik - Hogeschool van Amsterdam - HBO ICT SE - Stage Leerjaar 3 -
                {{ new Date().getFullYear() }}
            </small>
        </a>
    </footer>
</template>

<style scoped>
footer {
    align-items: center;
    width: 100%;
    justify-content: flex-end;
    min-height: 20px;
    margin-bottom: 20px;
}

a {
    color: var(--font);
    text-decoration: none;
    text-align: center;
    width: 95%;
}
</style>