<!-- @author Stefan Kruik -->

<script lang='js'>
import UpcomingEvents from "@/components/events/UpcomingEvents.vue";
import CompanyInformation from "@/components/home/CompanyInformation.vue";
import FaqInfo from "@/components/home/FaqInfo.vue";
import NewsOverview from "@/components/home/NewsOverview.vue";
import ThemeOverview from "@/components/home/ThemeOverview.vue";
import { documentTitle } from "@/utilities/formatController";

export default {
    name: "HomePage",
    components: { ThemeOverview, FaqInfo, CompanyInformation, UpcomingEvents, NewsOverview },
    mounted() {
        // Set the document title when the component is mounted
        documentTitle("Home");
    }
};
</script>

<template>
    <section class='content-container'>
        <CompanyInformation class='indent'></CompanyInformation>
        <ThemeOverview class='indent'></ThemeOverview>
        <NewsOverview class='indent'></NewsOverview>
        <UpcomingEvents></UpcomingEvents>
        <FaqInfo class='indent'></FaqInfo>
    </section>
</template>

<style scoped>
.content-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 130px;
}
</style>
