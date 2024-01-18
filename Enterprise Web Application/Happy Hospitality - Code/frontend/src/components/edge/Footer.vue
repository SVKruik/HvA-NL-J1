<!-- @author Jenelle Davelaar -->

<template>
    <footer>
        <h1>MELD JE AAN VOOR ONZE NIEUWSBRIEF</h1>

        <form>
            <div id='input-and-conformation'>
                <div id='input-container'>
                    <input
                        id='news-email'
                        v-model.trim.lazy='email'
                        placeholder='Voer e-mail adres in'
                        type='text'
                    />
                    <button
                        id='news-email-submit'
                        type='button'
                        v-on:click='onSubmit(email)'
                    >
                        Meld aan
                    </button>
                </div>
                <div v-if="conformation === 'succes'">
                    Succesvol aangemeld! Je ontvangt vanaf nu onze nieuwsbrief.
                </div>
                <div v-else-if="conformation === 'wrong'">
                    Er ging iets mis, voor een geldig e-mail adres in.
                </div>
                <div v-else-if="conformation === 'used'">
                    Ingevoerde e-mail adres is al aangemeld!
                </div>
            </div>
        </form>

        <div id='bottom'>
            <p id='copyright'>
                VAT: NL000000000B01 - KVK: 000000000 - Copyright © 2023 Happy
                Hospitality Collective
            </p>

            <p id='links'>
                <a
                    href='https://instagram.com/happyhospitalitycollective?igshid=MzRlODBiNWFlZA=='
                    target='_blank'
                >
                    Instagram</a
                >
                -
                <a
                    href='https://www.linkedin.com/company/happy-hospitality-collective'
                    target='_blank'
                >
                    LinkedIn</a
                >
            </p>
        </div>
    </footer>
</template>

<script lang='js'>
import { fetchApi } from "@/utilities/networkController";

export default {
    name: "FooterComponent",
    data() {
        return {
            email: null,
            //Regex for valid email
            regexEmail: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            conformation: ""
        };
    },
    methods: {

        //For clearing input field
        resetInput() {
            this.email = "";
        },

        //Checks with regex if a valid email is submitted
        async onSubmit(email) {
            let regexEmail = this.regexEmail;

            if (regexEmail.test(email)) {
                const response = await fetchApi(`/newsletter/save/${email}`, "POST");
                setTimeout(() => {
                }, 1000);
                //If the email has not been used already, it will be inserted
                if (!response) {
                    this.resetInput();
                    this.conformation = "succes";

                    //If the email is already used, it will not be inserted
                } else {
                    this.conformation = "used";
                    this.resetInput();
                }
            } else {
                this.conformation = "wrong";
            }
        }
    }
};
</script>

<style scoped>
footer {
    color: var(--main);
    background-color: var(--footer);
    height: auto;
    margin-top: 50px;
}

h1 {
    padding-top: 100px;
    padding-bottom: 50px;
    font-size: 24px;
    font-weight: normal;
    text-align: center;
}

form {
    margin-bottom: 100px;
    margin-left: 10%;
    margin-right: 10%;
    display: flex;
    box-sizing: border-box;
    border-bottom: 2px solid var(--main);
}

#input-and-conformation {
    box-sizing: border-box;
    width: 100%;
}

#input-container {
    display: flex;
    flex-direction: row;
    width: 100%;
}

#news-email {
    display: flex;
    border: none;
    box-sizing: border-box;
    width: 80%;
}

#news-email-submit {
    display: flex;
    box-sizing: border-box;
    width: 20%;
    border-left: 2px solid var(--main);
}

#news-email,
#news-email-submit {
    color: var(--main);
    background-color: var(--footer);
    padding: 20px;
}

/*No highlight when clicked*/
#news-email:focus {
    outline-width: 0;
}

#news-email-submit:hover {
    border: 0;
    border-left: 2px solid var(--main);
}

#news-email-submit:hover {
    color: var(--main-hover);
    cursor: pointer;
}

a {
    color: var(--main);
}

a:hover {
    color: var(--main-hover);
}

#copyright,
#links {
    font-size: 10px;
}

#copyright {
    padding-right: 55%;
}

#bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    padding: 20px;
}
</style>
