### Aan de Slag

Dit document legt stap-voor-stap uit hoe je de gebouwde applicatie lokaal en op Azure aan de praat krijgt. Het vereist enkele programma's op de computer, basiskennis programmeren en werken met het opdrachtprompt (Command Line, Terminal). Voor het starten van het project zijn er een aantal programma's en stappen nodig. Hieronder staat stap voor stap uitgelegd hoe je het volledige project zelf kan opstarten.

### Benodigdheden

Om de verschillende onderdelen te kunnen starten moeten er enkele zaken aanwezig zijn op de computer waarop u alles probeert te installeren.

- [Node.JS LTS](https://nodejs.org/en/download/package-manager)
- De repository

  ```sh
  git clone https://gitlab.fdmci.hva.nl/major-cloud-solutions/2324_sem_2/mixit-2.git
  ```

- Python & Venv

  ```sh
  pip install virtualenv
  ```

- [Terraform CLI](https://developer.hashicorp.com/terraform/install)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

### Installatie

> Volg de volgende stappen om de frontend te kunnen starten

1. Navigeer naar de Frontend:

   ```sh
   cd frontend
   ```

2. Installeer de dependencies:

   ```sh
   npm install
   ```

3. Start de development server:

   ```sh
   npm run dev
   ```

> Volg de volgende stappen om de backend te kunnen starten

1. Creëer de virtuele omgeving:

   ```sh
   python -m venv .venv
   ```

2. Activeer de virtual environment voor Windows:

   ```sh
   .venv\Scripts\activate
   ```

3. Activeer de virtual environment voor MacOS:

   ```sh
   source .venv/bin/activate
   ```

4. Exporteer de benodigde paramaters voor Windows:

    ```sh
    $env:FLASK_APP="app.py"
    $env:FLASK_ENV="development"
    $env:FLASK_DEBUG="1"
    ```
  
5. Exporteer de benodigde paramaters voor MacOS:

    ```sh
    export FLASK_APP=app.py
    export FLASK_ENV=development
    export FLASK_DEBUG=1
    ```

6. Installeer de dependencies:

    ```sh
    pip install -r requirements.txt
    ```

7. Start de development server:

    ```sh
    flask run --host=localhost
    ```

> Volg de volgende stappen om te deployen op Azure

1. Login op een Azure-account met genoeg rechten:

    ```sh
    az login
    ```

2. Start de Terraform omgeving:

    ```sh
    terraform init
    ```

3. Plan de deployment:

    ```sh
    terraform plan
    ```

4. Realiseer de infrastructuur:

    ```sh
    terraform apply -auto-approve
    ```

    Als de applicatie niet gebruikt wordt raden wij aan deze met de volgende stap weer te verwijderen omdat kosten soms snel op kunnen lopen.

5. Mocht u de infrastructuur weer willen verwijderen:

    ```sh
    terraform destroy
    ```

> Volg de volgende stappen op inloggen met Microsoft mogelijk te maken:

1. Open de Azure portal en log in met het account die de juiste permissies heeft.
2. Zoek en open “Microsoft Entra ID”
3. Onder het kopje “manage” open “App registrations”
4. Klik “new registration"
5. Vul de verplichte velden naar wens in.
6. Open je aangemaakte App registration
7. Ga onder het kopje “manage” naar “Roles and Administrators” en zet de “Cloud Application Administrator” rol aan.
8. Ga naar “Certificates & secrets” en maak daar een client secret aan. Sla deze waarde goed en veilig op! (push dit nooit naar git)
9. Ga vervolgens naar “API permissions” en kies daar de permissies die je nodig hebt. Let wel op dat je de juiste type aanklikt.
10. Ga als laatste naar “Authentication” Hier kan je de Redirect URls aanpassen. Als je ergens met Office in moet loggen met jouw tenant. Dan moet de redirect link hierin gedefineerd staan. Het kan enkel een localhost zijn of een public HTTPS.
