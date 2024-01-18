<!-- @author Stefan Kruik -->

<script lang='js'>
import AdminDeveloperItem from "@/components/admin/AdminDeveloperItem.vue";
import AdminEnvironmentItem from "@/components/admin/AdminEnvironmentItem.vue";
import AdminPipelineStatsticItem from "@/components/admin/AdminPipelineStatsticItem.vue";
import AdminReturn from "@/components/admin/AdminReturn.vue";
import CumulativeChart from "@/components/admin/charts/CumulativeChart.vue";
import EntrepreneurChart from "@/components/admin/charts/EntrepreneurChart.vue";
import EventChart from "@/components/admin/charts/EventChart.vue";
import PartnerChart from "@/components/admin/charts/PartnerChart.vue";
import PostChart from "@/components/admin/charts/PostChart.vue";
import MainStatisticItem from "@/components/admin/MainStatisticItem.vue";
import { documentTitle, formatDateTime } from "@/utilities/formatController";
import { fetchApi, fetchGitApi } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AdminStatistics",
    components: {
        CumulativeChart,
        EntrepreneurChart,
        PartnerChart,
        EventChart,
        PostChart,
        AdminDeveloperItem,
        AdminEnvironmentItem,
        AdminPipelineStatsticItem,
        MainStatisticItem,
        AdminReturn
    },
    async created() {
        documentTitle("Administratie - Statistieken");
        if (!getItem("admin")) return this.$router.push("/");
        if (getItem("rank") !== "Administrator") return this.$router.push("/admin");

        // Load Main Statistics
        const mainStatisticsData = await fetchApi("/superUsers/mainStatistics", "GET");
        for (let i = 0; i < mainStatisticsData.length; i++) {
            this.mainStatisticConstructor(mainStatisticsData[i]);
        }

        // Load Pipeline Statistics
        const pipelineData = (await fetchGitApi("/pipelines?order_by=updated_at&per_page=100")).reverse();
        for (let i = 0; i < pipelineData.length; i++) {
            this.pipelineStatisticConstructor(pipelineData[i]);
        }

        // Load Progress Bar
        const progressData = await fetchGitApi("/issues?state=opened&per_page=100");
        const progressBar = this.$refs["progress-bar"];
        progressBar.max = progressData.length;
        this.issueTotal = progressData.length;
        progressData.forEach((item) => {
            if (item.labels.includes("Done")) progressBar.value++;
        });
        this.issueClosed = progressBar.value;

        // Load Environments - GitLab
        const environmentData = await fetchGitApi("/environments");
        for (let i = 0; i < environmentData.length; i++) {
            this.environmentStatisticConstructor(environmentData[i]);
        }

        // Load Environments - Backend Server
        let fetchError;
        try {
            await fetch(process.env.VUE_APP_API_HOST, { mode: "no-cors" });
        } catch (error) {
            fetchError = error;
        }
        this.environmentStatisticConstructor({
            "id": 575,
            "name": "Server",
            "slug": "hel1-dc2.2 nginx",
            "url": "",
            "state": fetchError ? "stopped" : "available"
        });

        // Load Environments – Database
        const databasesData = await fetchApi("/database", "GET");
        this.environmentStatisticConstructor({
            "id": 576,
            "name": "Database",
            "slug": "hel1-dc2.1 mariadb",
            "url": "",
            "state": databasesData === 200 ? "available" : "stopped"
        });

        // Load Developers
        const developerData = await fetchGitApi("/members");
        for (let i = 0; i < 6; i++) {
            this.developerConstructor(developerData[i]);
        }
    },
    data() {
        return {
            mainStatistics: [],
            pipelineData: [],
            environmentData: [],
            issueTotal: 0,
            issueClosed: 0,
            developerData: []
        };
    },
    methods: {
        mainStatisticConstructor(data) {
            this.mainStatistics.push({
                "name": data[0],
                "value": data[1],
                "id": data[2]
            });
        },
        pipelineStatisticConstructor(data) {
            this.pipelineData.push({
                "creation": formatDateTime(data.created_at, "nl-NL"),
                "id": data.id,
                "status": data.status,
                "url": data.web_url
            });
        },
        environmentStatisticConstructor(data) {
            this.environmentData.push({
                "id": data.id,
                "name": data.name,
                "slug": data.slug,
                "url": data.external_url,
                "state": data.state
            });
        },
        developerConstructor(data) {
            const titles = ["Team Lead & UIX", "DevOps & Infrastructure", "Information Architect", "Engineer"];
            let index = 0;
            switch (data.username) {
                case "bayet":
                    index = 2;
                    break;
                case "schapem3":
                    index = 0;
                    break;
                case "kruiksv":
                    index = 1;
                    break;
                default:
                    index = 3;
            }

            this.developerData.push({
                "id": data.id,
                "name": data.name,
                "image": data.avatar_url,
                "url": data.web_url,
                "title": titles[index]
            });
        }
    }
};
</script>

<template>
    <AdminReturn></AdminReturn>
    <h3>Platform Statistieken</h3>
    <section class='main-statistics-container'>
        <MainStatisticItem
            v-for='mainStatistic in this.mainStatistics'
            :id='mainStatistic.id'
            :key='mainStatistic.id'
            :name='mainStatistic.name'
            :value='mainStatistic.value'
        ></MainStatisticItem>
    </section>
    <hr/>
    <section class='statistics-container'>
        <h4>Nieuwe content per week</h4>
        <div class='chart-container'>
            <PostChart></PostChart>
            <EventChart></EventChart>
            <PartnerChart></PartnerChart>
            <EntrepreneurChart></EntrepreneurChart>
        </div>
        <hr/>
        <h4>Totale content</h4>
        <CumulativeChart></CumulativeChart>
    </section>
    <hr/>
    <h3>Development Statistieken</h3>
    <section class='statistics-container'>
        <h4>CI/CD Status</h4>
        <small>Overzicht van de afgelopen 100 pipeline taken.</small>
        <div class='pipeline-container'>
            <AdminPipelineStatsticItem
                v-for='pipelineStatistic in this.pipelineData'
                :id='pipelineStatistic.id'
                :key='pipelineStatistic.id'
                :creation='pipelineStatistic.creation'
                :status='pipelineStatistic.status'
                :url='pipelineStatistic.url'
            ></AdminPipelineStatsticItem>
        </div>
        <hr/>
        <h4>Omgevingen</h4>
        <div class='environment-container'>
            <AdminEnvironmentItem
                v-for='environment in this.environmentData'
                :id='environment.id'
                :key='environment.id'
                :name='environment.name'
                :slug='environment.slug'
                :state='environment.state'
                :url='environment.url'
            ></AdminEnvironmentItem>
        </div>
        <hr/>
        <h4>Taken Progressie</h4>
        <small
        >{{ this.issueClosed }} van de {{ this.issueTotal }} in behandeling
            taken compleet ({{
                Math.round((this.issueClosed / this.issueTotal) * 100)
            }}%).</small
        >
        <progress ref='progress-bar'></progress>
        <hr/>
        <h4>Actieve Ontwikkelaars</h4>
        <div class='developer-container'>
            <AdminDeveloperItem
                v-for='developer in this.developerData'
                :id='developer.id'
                :key='developer.id'
                :image='developer.image'
                :name='developer.name'
                :title='developer.title'
                :url='developer.url'
            ></AdminDeveloperItem>
        </div>
    </section>
</template>

<style scoped>
h3 {
    font-weight: bold;
}

.main-statistics-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
}

.statistics-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/** Platform **/
.chart-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
}

.chart-container > * {
    height: 300px;
}

/** Development **/
.pipeline-container {
    display: flex;
    justify-content: space-between;
}

progress {
    width: 100%;
}

progress[value]::-webkit-progress-value {
    background-color: var(--green);
    border-radius: 5px;
}

progress[value]::-webkit-progress-bar {
    background-color: var(--fill);
    border-radius: 5px;
}

.environment-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
}

.developer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 10px;
}

@media (width <= 900px) {
    .chart-container {
        grid-template-columns: minmax(0, 1fr);
    }

    .environment-container {
        flex-direction: column;
        gap: 20px;
    }
}

@media (width <= 860px) {
    .main-statistics-container {
        grid-template-columns: 1fr 1fr;
        row-gap: 20px;
    }

    .developer-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
}

@media (width <= 690px) {
    .pipeline-container {
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-start;
    }
}
</style>
