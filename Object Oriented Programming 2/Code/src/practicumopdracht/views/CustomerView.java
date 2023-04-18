package practicumopdracht.views;

import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Parent;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import practicumopdracht.models.Customer;

import java.util.ArrayList;

public class CustomerView extends View {
    private GridPane mainPane;

    // Top
    private BorderPane topPane;
    private MenuBar topMenu;

    // Top DAO Controls
    private Menu mainMenu;
    private MenuItem save;
    private MenuItem load;
    private MenuItem shutdown;

    // Top Sorting Controls
    private Menu sortMenu;
    private ToggleGroup radioParent;
    private RadioMenuItem sortAscendingName;
    private RadioMenuItem sortDescendingName;
    private RadioMenuItem sortDescendingDate;
    private RadioMenuItem sortAscendingDate;

    // Left
    private Text leftTitle;
    private ListView<Customer> customerListView;
    private HBox leftButtonContainer;
    private Button removeButton;
    private Button switchButton;

    // Center
    private Text centerTitle;
    private VBox centerBox;
    private TextField customerName;
    private TextField customerProfileName;
    private CheckBox emailVerified;
    private TextField language;
    private DatePicker creation;
    private TextArea description;

    // Right
    private Text rightTitle;
    private VBox rightBox;
    private TextField customerNameInput;
    private TextField customerProfileNameInput;
    private ComboBox<String> languageInput;
    private TextArea descriptionInput;
    private Button createButton;
    private Button saveButton;
    private Button cancelButton;

    @Override
    protected Parent initializeView() {
        // Top
        topPane = new BorderPane();
        topPane.setMinHeight(20);
        topMenu = new MenuBar();

        // Top DAO Controls
        mainMenu = new Menu("Bestand");
        save = new MenuItem("Opslaan");
        load = new MenuItem("Laden");
        shutdown = new MenuItem("Afsluiten");
        mainMenu.getItems().addAll(save, load, shutdown);

        // Top Sorting Controls
        sortMenu = new Menu("Sorteren");
        radioParent = new ToggleGroup();
        sortAscendingName = new RadioMenuItem("Naam (A-Z)");
        sortDescendingName = new RadioMenuItem("Naam (Z-A)");
        sortDescendingDate = new RadioMenuItem("Datum (Nieuw - Oud)");
        sortAscendingDate = new RadioMenuItem("Datum (Oud - Nieuw)");
        radioParent.getToggles().addAll(sortAscendingName, sortDescendingName, sortDescendingDate, sortAscendingDate);
        sortMenu.getItems().addAll(sortAscendingName, sortDescendingName, sortDescendingDate, sortAscendingDate);

        // Append Top
        topMenu.getMenus().addAll(mainMenu, sortMenu);
        topPane.setTop(topMenu);

        // Left
        leftTitle = new Text("Profielen");
        leftTitle.setFont(Font.font(18));
        customerListView = new ListView<>();
        customerListView.setMinWidth(200);
        customerListView.setMaxHeight(350);
        leftButtonContainer = new HBox();
        leftButtonContainer.setSpacing(20);
        removeButton = new Button("Verwijderen");
        removeButton.setStyle("-fx-background-color: #ad5050");
        switchButton = new Button("Naar Bots");
        switchButton.setStyle("-fx-background-color: #6ac6ee");
        leftButtonContainer.getChildren().addAll(removeButton, switchButton);

        // Center
        centerTitle = new Text("Bekijken");
        centerTitle.setFont(Font.font(18));

        Label customerNameLabel = new Label("Naam");
        customerName = new TextField();
        customerName.setDisable(true);
        customerName.setStyle("-fx-opacity: 1");
        customerName.setPromptText("Selecteer een profiel");

        Label customerProfileNameLabel = new Label("Profiel Naam");
        customerProfileName = new TextField();
        customerProfileName.setDisable(true);
        customerProfileName.setStyle("-fx-opacity: 1");

        Label emailVerifiedLabel = new Label("Verificatie Status");
        emailVerified = new CheckBox();
        emailVerified.setDisable(true);
        emailVerified.setStyle("-fx-opacity: 1");

        Label languageLabel = new Label("Voertaal");
        language = new TextField();
        language.setDisable(true);
        language.setStyle("-fx-opacity: 1");

        Label creationLabel = new Label("Creatie datum");
        creation = new DatePicker();
        creation.setDisable(true);
        creation.setStyle("-fx-opacity: 1");
        creation.getEditor().setStyle("-fx-opacity: 1");

        Label descriptionLabel = new Label("Beschrijving");
        description = new TextArea();
        description.setDisable(true);
        description.setStyle("-fx-opacity: 1");
        description.setMaxWidth(200);
        description.setMaxHeight(100);

        centerBox = new VBox();
        centerBox.setSpacing(10);
        centerBox.setMinWidth(200);
        centerBox.getChildren().addAll(customerNameLabel, customerName, customerProfileNameLabel,
                customerProfileName, emailVerifiedLabel, emailVerified, languageLabel, language, creationLabel,
                creation, descriptionLabel, description);

        // Right
        rightTitle = new Text("Nieuw/Wijzig Profiel");
        rightTitle.setFont(Font.font(18));

        Label customerNameInputLabel = new Label("Naam");
        customerNameInput = new TextField();
        customerNameInput.setPromptText("Uw naam");

        Label customerProfileNameInputLabel = new Label("Profiel Naam");
        customerProfileNameInput = new TextField();
        customerProfileNameInput.setPromptText("Profiel naam");

        Label languageInputLabel = new Label("Voertaal");
        ArrayList<String> languageList = new ArrayList<>();
        languageList.add("Nederlands");
        languageList.add("English");
        languageList.add("Deutsch");
        languageList.add("Francais");
        languageList.add("Español");
        languageList.add("Português");
        languageList.add("中国人");
        languageList.add("עִברִית");
        languageInput = new ComboBox<>(FXCollections.observableArrayList(languageList));
        languageInput.setPromptText("Uw taal");

        Label descriptionInputLabel = new Label("Beschrijving");
        descriptionInput = new TextArea();
        descriptionInput.setMaxWidth(200);
        descriptionInput.setMaxHeight(200);
        descriptionInput.setWrapText(true);
        descriptionInput.setPromptText("Schrijf een korte beschrijving voor dit profiel");

        rightBox = new VBox();
        rightBox.setSpacing(10);
        rightBox.setMinWidth(200);
        rightBox.getChildren().addAll(customerNameInputLabel, customerNameInput, customerProfileNameInputLabel,
                customerProfileNameInput, languageInputLabel, languageInput, descriptionInputLabel, descriptionInput);

        HBox rightButtonContainer = new HBox();
        rightButtonContainer.setSpacing(10);
        createButton = new Button("Creeër");
        createButton.setStyle("-fx-background-color: #80b75c");
        saveButton = new Button("Wijzigen");
        saveButton.setStyle("-fx-background-color: #6ac6ee");
        cancelButton = new Button("Annuleer");
        cancelButton.setStyle("-fx-background-color: #ad5050");
        rightButtonContainer.getChildren().addAll(createButton, saveButton, cancelButton);

        // Styling Layout
        mainPane = new GridPane();
        mainPane.setVgap(10);
        mainPane.setHgap(40);
        mainPane.setAlignment(Pos.TOP_LEFT);
        mainPane.setPadding(new Insets(10));

        // Adding Children
        mainPane.add(leftTitle, 0, 0);
        mainPane.add(customerListView, 0, 1);
        mainPane.add(leftButtonContainer, 0, 2);
        mainPane.add(centerTitle, 1, 0);
        mainPane.add(centerBox, 1, 1);
        mainPane.add(rightTitle, 2, 0);
        mainPane.add(rightBox, 2, 1);
        mainPane.add(rightButtonContainer, 2, 2);

        VBox vBox = new VBox(topPane, mainPane);
        setRoot(vBox);
        return getRoot();
    }

    public MenuItem getSave() {
        return save;
    }

    public MenuItem getLoad() {
        return load;
    }

    public MenuItem getShutdown() {
        return shutdown;
    }

    public RadioMenuItem getSortAscendingName() {
        return sortAscendingName;
    }

    public RadioMenuItem getSortDescendingName() {
        return sortDescendingName;
    }

    public RadioMenuItem getSortDescendingDate() {
        return sortDescendingDate;
    }

    public RadioMenuItem getSortAscendingDate() {
        return sortAscendingDate;
    }

    public ListView<Customer> getCustomerListView() {
        return customerListView;
    }

    public Button getRemoveButton() {
        return removeButton;
    }

    public Button getSwitchButton() {
        return switchButton;
    }

    public TextField getCustomerName() {
        return customerName;
    }

    public TextField getCustomerProfileName() {
        return customerProfileName;
    }

    public CheckBox getEmailVerified() {
        return emailVerified;
    }

    public TextField getLanguage() {
        return language;
    }

    public DatePicker getCreation() {
        return creation;
    }

    public TextArea getDescription() {
        return description;
    }

    public TextField getCustomerNameInput() {
        return customerNameInput;
    }

    public TextField getCustomerProfileNameInput() {
        return customerProfileNameInput;
    }

    public ComboBox<String> getLanguageInput() {
        return languageInput;
    }

    public TextArea getDescriptionInput() {
        return descriptionInput;
    }

    public Button getCreateButton() {
        return createButton;
    }

    public Button getSaveButton() {
        return saveButton;
    }

    public Button getCancelButton() {
        return cancelButton;
    }
}
