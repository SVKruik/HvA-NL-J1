<template>
    <footer class="flex-col">
        <a href="https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/security" target="_blank">
            <small>Team Fristi - Amsterdam University of Applied Sciences - HBO ICT SE - Workshop Security -
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