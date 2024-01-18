<!-- @author Stijn Kortekaas -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { fetchApi, uploadFile } from "@/utilities/networkController";
import { getItem } from "@/utilities/sessionController";
import { createTicket } from "@/utilities/ticketController";

export default {
    name: "PostCreate",
    data() {
        return {
            postName: "",
            date: "",
            description: "",
            second_description: "",
            ticket: "",
            sub_ticket: "",
            author: "",
            sub_ticket_title: "",
            errorMessages: {
                date: "",
                general: "",
                success: ""
            }
        };
    },
    mounted() {
        documentTitle("Artikelen Aanmaken");
    },
    beforeMount() {
        this.checkPermissions();
    },
    methods: {

        checkPermissions() {
            const userType = getItem("userType");
            if (userType === "Entrepreneur") {
                alert("Entreprenuers mogen geen events aanmaken. Terug naar home")
                this.$router.push("/home");
            } else if (userType === null) {
                alert("Je bent niet ingelogd. Log eerst in")
                this.$router.push("/login");
            }
        },

        async submitForms(event) {
            const button = document.querySelector(".submit-button");
            button.disabled = false;

            if (this.checkIfEmpty()) {

                this.date = new Date();
                this.ticket = createTicket();
                this.sub_ticket = createTicket();
                await this.authorCheck();

                const postInfo = {
                    author: this.author,
                    content: this.description,
                    second_content: this.second_description,
                    date: this.date,
                    title: this.postName,
                    verified: false,
                    main_ticket: this.ticket,
                    sub_ticket: this.sub_ticket,
                    sub_ticket_title: this.sub_ticket_title
                };

                try {
                    const post = await fetchApi("/posts/save", "POST", JSON.stringify(postInfo));
                    try {
                        await this.submitImages(event, this.ticket, "#file-input");

                        if (this.imageisEmpty()) {
                            this.redirect(post.id);
                        } else {
                            await this.submitImages(event, this.sub_ticket, "#sideimg");
                            this.redirect(post.id);
                        }
                    } catch (error) {
                        console.error("Fout bij het uploaden van een image:", error);
                    }
                } catch (error) {
                    console.error("Fout bij het aanmaken van een event:", error);
                }

                this.errorMessages.success = "Post is aangemaakt";

            } else {
                this.errorMessages.general = "* 1 of meerdere velden zijn niet ingevuld";
            }
        },

        async authorCheck() {
            const email = getItem("email");
            const userType = getItem("userType");
            if (email === null) {
                this.author = "Onbekend";
            } else {
                if (userType === "Entrepreneur") {
                    const entrepreneurData = await fetchApi(`/entrepreneurs/findByEmail/${email}`, "GET");
                    this.author = entrepreneurData.name;
                } else if (userType === "Partner") {
                    const partnerData = await fetchApi(`/partners/findByContactMail/${email}`, "GET");
                    this.author = partnerData.name;
                } else if (userType === "Admin/Superuser") {
                    const adminData = await fetchApi(`/superUsers/getByEmail/${email}`, "GET");
                    this.author = adminData.name;
                } else {
                    console.error("User type is niet correct");
                }
            }
        },

        async submitImages(event, name, querySelector) {
            event.preventDefault();
            const input = document.querySelector(querySelector);

            // File
            const file = input.files[0];
            const formdata = new FormData();
            formdata.append("file", file);

            // Params
            const type = "posts";

            // Process
            await uploadFile(formdata, type, name);
        },

        correctDate() {
            const today = new Date();
            const postDate = new Date(this.postDate);

            if (today > postDate) {
                this.errorMessages.date = "* Selecteer een datum in de toekomst";
                return false;
            } else {
                this.errorMessages.date = "";
                return true;
            }
        },

        checkIfEmpty() {
            const input = document.querySelector("#file-input");
            const file = input.files[0];
            return !(this.postName === "" || this.description === "" || !file);
        },

        imageisEmpty() {
            const input = document.querySelector("#sideimg");
            const file = input.files[0];
            return !(file === "");
        },

        triggerError() {
            this.errorMessages.general = "* 1 of meerdere velden zijn niet correct ingevuld";
        },

        removeError() {
            this.errorMessages.general = "";
        },

        redirect(id) {
            this.$router.push(`/posts/${id}`);
        },

        checkSize(event, querySelector) {
            event.preventDefault();
            const input = document.querySelector(querySelector);

            // File
            const file = input.files[0];
            if (file.size / (1024 * 1024).toFixed(2) > 1) {
                input.value = "";
                return alert("File to big. Max allowed size is 1 MB.");
            }

        }

    }
};
</script>

<template>
    <div class='post-create'>
        <section class='main-info'>
            <form id='form1'>
                <h1 class='header'>Post aanmaken</h1>

                <label for='eventname'>Titel*</label><br/>
                <input v-model='postName' type='text'/>

                <h1 id='blok1' class='header'>Content</h1>

                <label for='content'>Inhoud*</label><br/>
                <textarea
                    id='content'
                    v-model='description'
                    rows='3'
                ></textarea>

                <h1 id='blok' class='header'>Extra Content</h1>

                <label for='content'>Extra informatie</label><br/>
                <textarea
                    id='content'
                    v-model='second_description'
                    rows='3'
                ></textarea>
            </form>
        </section>

        <section class='img-info'>
            <form id='form2'>
                <label for='mainimg'>Hoofd foto*</label><br/>
                <input
                    id='file-input'
                    type='file'
                    @change="checkSize($event, '#file-input')"
                />

                <label for='sideimg'>Extra foto</label><br/>
                <input
                    id='sideimg'
                    type='file'
                    @change="checkSize($event, '#sideimg')"
                />

                <label for='sideimgopt'>Foto beschrijving</label><br/>
                <input v-model='sub_ticket_title' type='text'/>

            </form>

            <button class='submit-button' @click='submitForms($event)'>
                Maak aan
            </button>
            <p class='error'>{{ errorMessages.general }}</p>
            <p class='success'>{{ errorMessages.success }}</p>
        </section>
    </div>
</template>

<style scoped>
.post-create {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    padding-top: 100px;
}

.main-info {
    width: 75%;
    height: auto;
    margin: 0 5% 0 2%;
    display: flex;
    flex-direction: column;
}

.header {
    background-color: var(--accent-a);
    font-weight: bold;
    margin-bottom: 35px;
    padding: 10px;
    width: 225px;
    font-size: 24px;
}

.header {
    margin-top: 50px;
    width: 210px;
}

.header#blok1 {
    margin-top: 50px;
    width: 125px;
}

.img-info {
    width: 25%;
    height: auto;
    margin: 0 5% 0 0;
    display: flex;
    flex-direction: column;
}

select {
    margin-top: 10px;
    border: none;
    border-bottom: 2px solid black;
    background-color: var(--main);
    width: 100%;
}

input {
    margin-top: 10px;
    margin-bottom: 25px;
    padding-bottom: 5px;
    width: 100%;
    border: none;
    border-bottom: 2px solid black;
    background-color: var(--main);
}

.error {
    margin-top: 5px;
    color: red;
}

.success {
    margin-top: 5px;
    color: green;
    font-weight: bold;
}

input:focus {
    outline: none;
}

textarea:focus {
    outline: none;
}

textarea {
    margin-top: 10px;
    margin-bottom: 50px;
    text-align: left;
    width: 100%;
    border: none;
    border-bottom: 2px solid black;
    background-color: var(--main);
    resize: none;
}

button {
    width: 50%;
}

@media (width < 750px) {
    .post-create {
        flex-direction: column;
    }

    .main-info {
        width: 90%;
        margin-left: 5%;
        margin-bottom: 100px;
    }

    .img-info {
        width: 90%;
        margin: 0 0 0 5%;
    }

    button {
        margin-bottom: 50px;
    }
}
</style>