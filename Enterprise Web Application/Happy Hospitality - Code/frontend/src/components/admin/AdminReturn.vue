<!-- @author Stefan Kruik -->

<script lang='js'>
export default {
    name: "AdminReturn"
};
</script>

<template>
    <div class='button-wrapper'>
        <router-link to='/admin'>
            <div class='back-button'>
                <img alt='Terug' src='../../assets/icons/arrow-left.svg'/>
                <p>Terug</p>
            </div>
        </router-link>
    </div>
    <hr/>
</template>

<style scoped>
.back-button {
    display: flex;
    align-items: center;
    gap: 10px;
}

p {
    font-weight: 600;
}
</style>
