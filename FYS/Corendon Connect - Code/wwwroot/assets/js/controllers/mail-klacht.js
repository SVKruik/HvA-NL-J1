import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

function mailKlacht(verzendID, verzendNaam, ontvangID, ontvangNaam, klacht, tijd) {
    FYSCloud.API.sendEmail({
        from: {
            name: "Corendon Connect",
            address: "corendon.connect@fys.cloud"
        },
        to: [
            {
                name: "Corendon Connect",
                address: "corendon.connect.service@gmail.com"
            }
        ],
        subject: "Nieuwe Klacht",
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
                <img class="logo-image" src="https://is110-3.fys.cloud/uploads/public/logo-admin.png" width="300">
            </div>
            <div class="mail-body">
                <p class="mail-main-text">Beste Administrator,</p>
                <br><br>

                <p class="mail-main-text">Er is een nieuwe klacht verzonden. Dit zijn de gegevens:</p>
                <ul class="mail-main-text">
                    <li>Verzender ID: ${verzendID}</li>
                    <li>Verzender Naam: ${verzendNaam}</li>
                    <br>
                    <li>Ontvanger ID: ${ontvangID}</li>
                    <li>Ontvanger Naam: ${ontvangNaam}</li>
                    <br>
                    <li>Klacht: ${klacht}</li>
                    <li>Tijd: ${tijd}</li>
                </ul>

                <br><br>
            </div>
            <div class="mail-footer">
                <p class="mail-small-text">Deze mail is bedoeld voor de administratoren van Corendon Connect. Bent u dit niet? Dan kunt u deze mail veilig negeren.</p>
                <p class="mail-small-text">Dit is een automatisch gegenereerde e-mail. Reacties op dit bericht worden niet gelezen.</p>
                <p class="mail-small-text"><a href="https://is110-3.fys.cloud/">Home</a> - <a href="https://is110-3.fys.cloud/support.html">Contact</a> - <a href="https://www.corendon.nl/privacy-verklaring">Privacybeleid</a> - <a href="https://www.corendon.nl/copyright">Copyright</a></p>
                <p class="mail-small-text">Corendon Connect Administrator</p>
            </div>
        </div>
    `
    }).catch(function (reason) {
        console.log(reason);
    });
};

export { mailKlacht };
