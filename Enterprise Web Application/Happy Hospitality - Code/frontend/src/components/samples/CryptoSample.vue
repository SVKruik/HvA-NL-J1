<!-- @author Stefan Kruik -->
<!-- Used for test purposes only. -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { AES, enc } from "crypto-js";

const sessionKey = process.env.VUE_APP_SESSION_KEY;

export default {
    name: "CryptoSample",
    data() {
        return {
            key: sessionKey,
            encryptor: AES,
            encoder: enc
        };
    },
    created() {
        documentTitle("Crypto Sample");
    },
    methods: {
        submit(event) {
            event.preventDefault();

            // Params
            const input = document.querySelector("#text-input").value;
            const bytes = this.encryptor.decrypt(this.encryptor.encrypt(input, this.key).toString(), this.key);
            const originalText = bytes.toString(this.encoder.Utf8);

            // History
            const container = document.querySelector(".history-container");
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = input;
            td1.style.padding = "8px";
            const td2 = document.createElement("td");
            td2.innerText = bytes;
            td2.style.padding = "8px";
            const td3 = document.createElement("td");
            td3.innerText = originalText;
            td3.style.padding = "8px";
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.style.border = "1px solid #333";
            tr.style.height = "30px";
            container.appendChild(tr);
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <strong>Crypto Sample</strong>
        <p>This is a demo for testing the CryptoJS library.</p>
        <p>
            This sample will encrypt your message, show the output and then
            decrypt your message.
        </p>
        <p>
            Use responsibly! This is just a test, and no further data checking
            or rate limiting is applied.
        </p>
        <hr/>
        <form>
            <label for='text-input'>Input:</label>
            <input id='text-input' type='text'/>
            <button type='submit' @click='this.submit($event)'>Submit</button>
        </form>
        <hr/>
        <p>Crypto History:</p>
        <table class='history-container'>
            <tr class='table-row'>
                <th>Input</th>
                <th>Encrypted</th>
                <th>Output</th>
            </tr>
        </table>
        <router-link class='link' to='/'>Go back home</router-link>
        <router-link class='link' to='/requestSample'
        >Go to request sample
        </router-link>
        <router-link class='link' to='/uploadSample'
        >Go to upload sample
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

table {
    border-collapse: collapse;
}

td,
th {
    border: 1px solid #333;
    text-align: left;
    padding: 8px;
    height: 30px;
}
</style>
