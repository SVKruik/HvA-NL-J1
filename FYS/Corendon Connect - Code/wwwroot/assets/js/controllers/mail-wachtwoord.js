import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

function mailWachtwoord(wachtwoord, naam, adres) {
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
        subject: "Wachtwoord Opvragen",
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

                <p class="mail-main-text">U heeft uw wachtwoord opgevraagt. Dit is uw huidige wachtwoord:</p>
                <ul class="mail-main-text">
                    <li>${wachtwoord}</li>
                </ul>

                <p class="mail-main-text">Mocht u er niet uitkomen of vragen hebben, aarzel dan niet om contact met ons op te nemen via onze klantenservice. Wij helpen u graag verder!</p>

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

export { mailWachtwoord };
