<!-- @author Stefan Kruik -->

<script lang='js'>
import { errorGeneral } from "@/utilities/errorController";
import { formatDateDMY, getStringLimit } from "@/utilities/formatController.js";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "AdminPostItem",
    props: {
        id: Number,
        author: String,
        content: String,
        date: String,
        title: String,
        verified: Boolean,
        ticket: String
    },
    data() {
        return {
            screenWidthThreshold: 680
        };
    },
    methods: {
        getStringLimit,
        formatDateDMY,
        async deletePost(event) {
            if (confirm("Weet u zeker dat u dit artikel wilt verwijderen?")) {
                const data = await fetchApi(`/posts/delete/${this.id}`, "DELETE");
                if (!data.response) {
                    event.srcElement.parentNode.parentNode.parentNode.removeChild(event.srcElement.parentNode.parentNode);
                } else errorGeneral();
            }
        },
        verifyPost(event) {
            let message = "dit artikel wilt verifiëren?";
            if (event.target.innerHTML === "Geverifieerd") message = "de verificatie van dit artikel ongedaan wilt maken?";
            if (!confirm(`Weet u zeker dat u ${message}`)) return;
            fetchApi(`/posts/toggleVerify/${this.id}`, "PUT");
            if (event.target.innerHTML === "Verifieer") {
                event.target.innerHTML = "Geverifieerd";
                this.$refs["post-item"].classList.remove("unverified");
            } else {
                event.target.innerHTML = "Verifieer";
                this.$refs["post-item"].classList.add("unverified");
            }
        },
        postLink() {
            this.$router.push(`/posts/${this.id}`);
        }
    },
    mounted() {
        if (!this.verified) this.$refs["post-item"].classList.add("unverified");
    }
};
</script>
<template>
    <div ref='post-item' class='post-item'>
        <section class='information-container' @click='postLink()'>
            <img
                :src='`https://files.stefankruik.com/uploads/posts/${this.ticket}.png`'
                alt='Post Image'
                class='post-image'
            />
            <hr class='hidden'/>
            <div class='text-container'>
                <h3>
                    {{
                        getStringLimit(
                            this.screenWidthThreshold,
                            30,
                            15,
                            this.title
                        )
                    }}
                </h3>
                <p>
                    {{
                        getStringLimit(
                            this.screenWidthThreshold,
                            40,
                            20,
                            this.content
                        )
                    }}
                </p>
                <small
                >Geplaatst op:
                    {{ formatDateDMY(this.date, "nl-NL") }}</small
                >
            </div>
        </section>
        <hr class='hidden'/>
        <section class='control-container'>
            <button
                class='verify-button'
                type='submit'
                @click='this.verifyPost($event)'
            >
                {{ this.verified ? "Geverifieerd" : "Verifieer" }}
            </button>
            <button
                class='delete-button'
                type='submit'
                @click='this.deletePost()'
            >
                Verwijder
            </button>
        </section>
    </div>
</template>

<style scoped>
h3 {
    font-weight: bold;
}

.post-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    height: 150px;
    border: 2px solid var(--accent-b);
}

.unverified {
    border: 2px dashed var(--accent-b);
}

.information-container {
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
}

.post-image {
    width: 130px;
    height: 130px;
    object-fit: cover;
}

.text-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.control-container {
    display: flex;
    align-items: center;
}

.verify-button {
    background-color: transparent;
    color: forestgreen;
}

.verify-button:hover {
    color: darkgreen;
    border: none;
}

.delete-button {
    background-color: transparent;
    color: red;
}

.delete-button:hover {
    color: darkred;
    border: none;
}

button {
    width: 100px;
}

hr {
    display: none;
}

@media (width <= 680px) {
    .post-item {
        height: fit-content;
    }

    .post-item,
    .information-container {
        flex-direction: column;
    }

    .information-container,
    .text-container {
        width: 100%;
    }

    .post-image {
        width: 200px;
        height: 200px;
    }

    .information-container {
        gap: 0;
    }

    .hidden {
        display: block;
    }
}
</style>
