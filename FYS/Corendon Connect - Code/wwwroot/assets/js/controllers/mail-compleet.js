import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

function mailCompleet(naam, adres) {
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
        subject: "Welkom bij Corendon Connect!",
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

                <p class="mail-main-text">Uw account is succesvol geactiveerd. U kunt nu aan de slag met het gebruiken van Corendon Connect. Hier zijn een paar dingen die u kunt doen om te beginnen:</p>
                <ul class="mail-main-text">
                    <li>Geef uw interesses op zodat anderen u kunnen vinden.</li>
                    <li>Upload afbeedingen op uw <a href="https://is110-3.fys.cloud/profiel.html">profiel</a> pagina om uw pagina te personaliseren.</li>
                    <li>Ga naar de <a href="https://is110-3.fys.cloud/zoek.html">zoek</a> pagina en begin met het matchen met anderen!</li>
                    <li>Bekijk op de <a href="https://is110-3.fys.cloud/zoek.html">match</a> pagina wie u al een match verzoek heeft verzonden!</li>
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

export { mailCompleet };
