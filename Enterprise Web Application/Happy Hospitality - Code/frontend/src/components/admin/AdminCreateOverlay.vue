<!-- @author Stefan Kruik -->

<script lang='js'>
import { errorCustom } from "@/utilities/errorController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AdminCreateOverlay",
    props: {
        type: String
    },
    data() {
        return {
            creationType: this.type
        };
    },
    methods: {
        reset(id) {
            const element = document.getElementById(id);
            element.value = "";
            element.focus();
        },
        submit() {
            // Name Validation
            const name = document.getElementById("name").value;
            if (!name.length) return errorCustom("Voer een geldige naam in.");

            // Email Validation
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const email = document.getElementById("email").value;
            if (!email.match(emailRegex)) return errorCustom("Voer een geldig e-mailadres in.");

            // Password Validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            const password = document.getElementById("password").value;
            if (!password.match(passwordRegex)) return errorCustom("Het opgegeven wachtwoord voldoet niet aan de eisen");

            this.$emit("submit", {
                "name": name,
                "id": -1,
                "email": email,
                "password": password,
                "createdById": getItem("adminId") || -1,
                "blocked": false,
                "creation": new Date(),
                "admin": document.getElementById("rank").value === "Administrator"
            });
        }
    }
};
</script>

<template>
    <div class='overlay' @click.self="$emit('close')">
        <div class='overlay-item'>
            <section class='overlay-item-content'>
                <h4>Maak een nieuwe {{ this.creationType }} aan.</h4>
                <hr/>
                <form>
                    <div>
                        <label for='name'>Naam:</label>
                        <div class='input-container'>
                            <input id='name' type='text'/>
                            <button type='button' @click="this.reset('name')">
                                <img
                                    alt='x'
                                    class='close-icon'
                                    src='../../assets/icons/circle-cross.svg'
                                />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label for='email'>Email:</label>
                        <div class='input-container'>
                            <input id='email' type='email'/>
                            <button type='button' @click="this.reset('name')">
                                <img
                                    alt='x'
                                    class='close-icon'
                                    src='../../assets/icons/circle-cross.svg'
                                />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label for='password'>Wachtwoord:</label>
                        <div class='input-container'>
                            <input id='password' type='password'/>
                            <button type='button' @click="this.reset('name')">
                                <img
                                    alt='x'
                                    class='close-icon'
                                    src='../../assets/icons/circle-cross.svg'
                                />
                            </button>
                        </div>
                        <details class='password-requirements'>
                            <summary>Wachtwoord eisen</summary>
                            <ul class='password-requirements-list'>
                                <li>Minimaal één lage letter.</li>
                                <li>Minimaal één hoofdletter.</li>
                                <li>Minimaal één nummer.</li>
                                <li>Minimaal één speciaal karakter.</li>
                                <li>Minimale lengte van 8 karakters.</li>
                            </ul>
                        </details>
                    </div>
                    <div>
                        <label for='rank'>Rang:</label>
                        <select id='rank' :value='this.creationType'>
                            <option value='Administrator'>Administrator</option>
                            <option value='Super User'>Super User</option>
                        </select>
                    </div>
                </form>
            </section>
            <section class='footer-wrapper'>
                <hr/>
                <div class='button-container'>
                    <button
                        class='reset-button'
                        type='reset'
                        @click="this.$emit('close')"
                    >
                        Annuleren
                    </button>
                    <button
                        class='submit-button'
                        type='submit'
                        @click='submit()'
                    >
                        Creëer
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    cursor: pointer;
}

.overlay-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    width: 90%;
    height: 500px;
    max-width: 340px;
    background-color: var(--main);
    cursor: initial;
}

.overlay-item-content {
    display: flex;
    flex-direction: column;
}

form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
}

form > * {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.input-container {
    display: flex;
    border: 1px solid var(--accent-b);
    height: 30px;
    gap: 5px;
    background-color: white;
}

input {
    width: 90%;
    height: 100%;
    outline: none;
    border: none;
    box-sizing: border-box;
    padding-left: 5px;
}

button {
    width: fit-content;
    height: 30px;
    background-color: transparent;
    box-sizing: border-box;
    padding: 5px;
}

button:hover {
    border: none;
}

.close-icon {
    width: 15px;
    height: 15px;
}

.button-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.reset-button {
    color: red;
}

.reset-button:hover {
    color: darkred;
}

.submit-button {
    color: forestgreen;
}

.submit-button:hover {
    color: darkgreen;
}

select {
    height: 30px;
    width: 100%;
    border: 1px solid var(--accent-b);
}

.password-requirements {
    font-size: 13px;
    box-sizing: border-box;
    padding-left: 10px;
}

summary {
    cursor: pointer;
    list-style: revert;
}

.password-requirements-list > li {
    list-style: disc;
}
</style>
