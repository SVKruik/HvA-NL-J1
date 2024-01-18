<!-- @author Stefan Kruik -->
<!-- Used for test purposes only. -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { uploadFile } from "@/utilities/networkController";
import { createTicket } from "@/utilities/ticketController";

export default {
    name: "UploadSample",
    created() {
        documentTitle("Upload Sample");
    },
    methods: {
        async submit(event) {
            event.preventDefault();
            const input = document.querySelector("#file-input");

            // File
            const file = input.files[0];
            if (!file) return alert("No file chosen.");
            if (file.size / (1024 * 1024).toFixed(2) > 1) return alert("File to big. Max allowed size is 1 MB.");
            const formdata = new FormData();
            formdata.append("file", file);

            // Params
            const name = createTicket();
            const type = document.querySelector(".type-selection").value;

            // Process
            await uploadFile(formdata, type, name);
            setTimeout(() => {
                this.createImage(name, type);
            }, 5000);
        },
        createImage(name, type) {
            // Image
            const location = "https://files.stefankruik.com";
            const element = document.createElement("img");
            element.style.width = "150px";
            element.style.height = "150px";
            element.style.margin = "10px";
            element.style.objectFit = "cover";
            element.src = `${location}/uploads/${type}/${name}.png`;

            // Success
            const parent = document.querySelector(".image-container");
            parent.append(element);
            alert("File upload complete.");
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <strong>Upload Sample</strong>
        <p>
            This is a demo for uploading images to the SFTP server. Select your
            type and image and click submit.
        </p>
        <p>
            After submitting, an image element will be created with your
            uploaded image. This way you can check if everything went right.
        </p>
        <p>
            Use responsibly! This is just a test, and no further data checking
            or rate limiting is applied.
        </p>
        <hr/>
        <form>
            <label for='file-input'>Select your file:</label>
            <input id='file-input' type='file'/>
            <label for='type-selection'>Select your upload type:</label>
            <select id='type-selection' class='type-selection'>
                <option value='events'>Event</option>
                <option value='posts'>Post</option>
                <option value='users'>User</option>
            </select>
            <button type='submit' @click='this.submit($event)'>Submit</button>
        </form>
        <hr/>
        <div class='image-container'></div>
        <router-link class='link' to='/'>Go back home</router-link>
        <router-link class='link' to='/requestSample'
        >Go to request sample
        </router-link>
        <router-link class='link' to='/cryptoSample'
        >Go to crypto sample
        </router-link>
    </div>
</template>

<style scoped>
.content-wrapper {
    height: 800px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px;
    padding-top: 140px;
}

form {
    margin: 5px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

button {
    background-color: black;
    color: white;
    width: fit-content;
    height: fit-content;
    box-sizing: border-box;
    padding: 10px;
}

button:hover {
    outline: none;
    border: none;
    background-color: white;
    color: black;
}

.link {
    color: blue;
}

.type-selection {
    width: 200px;
}
</style>
