<!-- @author Stefan Kruik -->
<!-- Used for test purposes only. -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "RequestSample",
    created() {
        documentTitle("Request Sample");
    },
    methods: {
        async submit(event) {
            event.preventDefault();

            // Params
            const route = document.querySelector(".route-input").value;
            const type = document.querySelector(".type-selection").value;
            const body = document.querySelector(".data-input").value;

            // History
            const container = document.querySelector(".history-container");
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = route;
            td1.style.padding = "8px";
            const td2 = document.createElement("td");
            td2.innerText = type;
            td2.style.padding = "8px";
            const td3 = document.createElement("td");
            td3.innerText = body;
            td3.style.padding = "8px";
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.style.border = "1px solid #333";
            tr.style.height = "30px";
            container.appendChild(tr);

            // Process
            const data = await fetchApi(route, type, body);
            console.log(data);
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <strong>Request Sample</strong>
        <p>This is a demo for doing requests with Axios.</p>
        <p>
            After submitting, a request will be sent to the specified route. Any
            output can be viewed in the console.
        </p>
        <p>
            Use responsibly! This is just a test, and no further data checking
            or rate limiting is applied.
        </p>
        <hr/>
        <form>
            <label for='route-input'
            >Type your target route starting from the root:</label
            >
            <input id='route-input' class='route-input' type='text' value='/'/>
            <label for='data-input'>Raw JSON input (optional):</label>
            <input id='data-input' class='data-input' type='text' value='{}'/>
            <label for='type-selection'>Select your request method:</label>
            <select id='type-selection' class='type-selection'>
                <option value='GET'>GET</option>
                <option value='POST'>POST</option>
                <option value='PUT'>PUT</option>
                <option value='DELETE'>DELETE</option>
            </select>
            <button type='submit' @click='this.submit($event)'>Submit</button>
        </form>
        <hr/>
        <p>Request History:</p>
        <table class='history-container'>
            <tr class='table-row'>
                <th>Route</th>
                <th>Method</th>
                <th>Body</th>
            </tr>
        </table>
        <router-link class='link' to='/'>Go back home</router-link>
        <router-link class='link' to='/uploadSample'
        >Go to upload sample
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

.type-selection,
.route-input,
.data-input {
    width: 200px;
    outline: none;
    border: 1px solid grey;
    height: 30px;
}

.data-input {
    width: 600px;
    height: 70px;
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
