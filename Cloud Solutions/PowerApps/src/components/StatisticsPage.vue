<script lang='js'>
import { invoke } from "@tauri-apps/api/tauri";

export default {
    name: "StatisticsPage",
    data() {
        return {
            "confirmationMessage": "Payload sent.",
            "confirmationMessageBoolean": false
        }
    },
    props: {
        user: Object,
        guilds: Array
    },
    created() {
        if (!this.user) {
            return this.$router.push("/unauthorized");
        } else if (new Date(this.user.exp * 1000) < new Date()) return this.$router.push("/session-expired");
    },
    methods: {
        submitCloud() {
            const messageInput = document.getElementById("message");
            const sourceInput = document.getElementById("source");
            const projectInput = document.getElementById("project");

            invoke("cloud_submit", { message: messageInput.value, source: sourceInput.value, project: projectInput.value })
                .catch((error) => {
                    console.error(error);
                    this.confirmationMessage = "Something went wrong while sending your data."
                });
            this.confirmationMessageBoolean = true;
        }
    }
};
</script>

<template>
    <div class="content">
        <div class="content-wrapper">
            <p>Statistics</p>

            <section class="cloud-background">
                <form>
                    <input type="text" id="message" class="shadow input" placeholder="Message">
                    <input type="text" id="source" class="shadow input" placeholder="Source">
                    <input type="text" id="project" class="shadow input" placeholder="Project">
                    <button @click="this.submitCloud()" class="cloud-submit-button" type="button">Submit</button>
                    <p v-if="this.confirmationMessageBoolean">{{ this.confirmationMessage }}</p>
                </form>
            </section>
        </div>
    </div>
</template>

<style scoped>
.cloud-background {
    background-color: var(--fill);
    border-radius: var(--border-radius-high);
    height: 440px;
    box-sizing: border-box;
    padding: 35px
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

input,
.cloud-submit-button {
    width: 160px;
    height: 30px;
}

.cloud-submit-button {
    background-color: var(--success);
    border-radius: var(--border-radius-mid);
}
</style>
