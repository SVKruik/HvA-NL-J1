import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

function mailVerificatie(number, naam, adres) {
    FYSCloud.API.sendEmail({
        from: {
            name: "Corendon Connect",
            address: "corendon.connect@fys.cloud"
        },
        to: [
            {
                name: naam,
                address: adres
            }
        ],
        subject: "Account Verifiëren",
        html: `
        <style>
            .mail-main-text {
                font-size: 17px;
            }

            .mail-small-text {
                font-size: 13px;
            }
        </style>
        <div class="mail-content-container">
            <div class="mail-header">
                <img class="logo-image" src="https://is110-3.fys.cloud/uploads/public/logo.png" width="300">
            </div>
            <div class="mail-body">
                <p class="mail-main-text">Beste ${naam},</p>
                <br><br>

                <p class="mail-main-text">Bedankt voor uw registratie bij ons platform. Om uw account te verifiëren, gebruikt u de volgende verificatiecode:</p>
                <ul class="mail-main-text">
                    <li>${number}</li>
                </ul>

                <p class="mail-main-text">Gelieve deze code in te voeren op onze website om uw account te activeren. Als u hulp nodig heeft bij het verifiëren van uw account, aarzel dan niet om contact met ons op te nemen via onze klantenservice. Wij helpen u graag verder!</p>

                <br><br>
                <p class="mail-main-text">Met vriendelijke groet,</p>

                <p class="mail-main-text" style="margin-bottom: 60px;">Het team van Corendon Connect</p>
            </div>
            <div class="mail-footer">
                <p class="mail-small-text">Deze mail is bedoeld voor ${naam}. Bent u dit niet? Dan kunt u deze mail veilig negeren.</p>
                <p class="mail-small-text">Dit is een automatisch gegenereerde e-mail. Reacties op dit bericht worden niet gelezen.</p>
                <p class="mail-small-text"><a href="https://is110-3.fys.cloud/">Home</a> - <a href="https://is110-3.fys.cloud/support.html">Contact</a> - <a href="https://www.corendon.nl/privacy-verklaring">Privacybeleid</a> - <a href="https://www.corendon.nl/copyright">Copyright</a></p>
                <p class="mail-small-text">Corendon Connect</p>
            </div>
        </div>
    `
    }).catch(function (reason) {
        console.log(reason);
    });
};

export { mailVerificatie };
