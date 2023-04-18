package practicumopdracht.views;

import javafx.beans.property.StringProperty;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Parent;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

public class DiscordBotView extends View {
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
    private RadioMenuItem sortAscendingMemory;
    private RadioMenuItem sortDescendingMemory;

    // Left
    private Text leftTitle;
    private VBox leftBox;
    private Label customerSelectorLabel;
    private ComboBox<Customer> customerSelector;
    private Label discordBotSelectorLabel;
    private ListView<DiscordBot> discordBotListView;
    private HBox leftButtonContainer;
    private Button removeButton;
    private Button switchButton;

    // Center
    private Text centerTitle;
    private VBox centerBox;
    private Label nameLabel;
    private TextField name;
    private Label clientIdLabel;
    private TextField clientId;
    private Label hostLabel;
    private TextField host;
    private Label memoryLabel;
    private TextField memory;
    private Label autoRestartLabel;
    private CheckBox autoRestart;
    private Label colorLabel;
    private Rectangle color;

    // Right
    private Text rightTitle;
    private VBox rightBox;
    private Label nameInputLabel;
    private TextField nameInput;
    private Label colorInputLabel;
    private TextField colorInput;
    private Label memoryInputLabel;
    private TextField memoryInput;
    private Label hostInputLabel;
    private ComboBox<String> hostInput;
    private Label portInputLabel;
    private TextField portInput;
    private Label autoRestartInputLabel;
    private CheckBox autoRestartInput;
    private HBox rightButtonContainer;
    private Button createBotButton;
    private Button saveBotButton;
    private Button cancelBotButton;

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

        // Top Sort Controls
        sortMenu = new Menu("Sorteren");
        radioParent = new ToggleGroup();
        sortAscendingName = new RadioMenuItem("Naam (A-Z)");
        sortAscendingName.setSelected(true);
        sortDescendingName = new RadioMenuItem("Naam (Z-A)");
        sortAscendingMemory = new RadioMenuItem("Geheugen Oplopend");
        sortDescendingMemory = new RadioMenuItem("Geheugen Aflopend");
        radioParent.getToggles().addAll(sortAscendingName, sortDescendingName, sortAscendingMemory, sortDescendingMemory);
        sortMenu.getItems().addAll(sortAscendingName, sortDescendingName, sortAscendingMemory, sortDescendingMemory);

        // Append Top
        topMenu.getMenus().addAll(mainMenu, sortMenu);
        topPane.setTop(topMenu);

        // Left
        leftTitle = new Text("Selecteren");
        leftTitle.setFont(Font.font(18));
        leftBox = new VBox();
        leftBox.setSpacing(10);
        leftBox.setMinWidth(200);
        customerSelectorLabel = new Label("Profiel");
        customerSelector = new ComboBox<>();
        customerSelector.setMinWidth(150);
        customerSelector.setMinHeight(25);
        discordBotSelectorLabel = new Label("Discord Bots");
        discordBotListView = new ListView<>();
        discordBotListView.setMaxHeight(350);
        leftBox.getChildren().addAll(customerSelectorLabel, customerSelector, discordBotSelectorLabel, discordBotListView);
        leftButtonContainer = new HBox();
        leftButtonContainer.setSpacing(20);
        removeButton = new Button("Verwijderen");
        removeButton.setStyle("-fx-background-color: #ad5050");
        switchButton = new Button("Naar Profiel");
        switchButton.setStyle("-fx-background-color: #6ac6ee");
        leftButtonContainer.getChildren().addAll(removeButton, switchButton);

        // Center
        centerTitle = new Text("Bekijken");
        centerTitle.setFont(Font.font(18));
        centerBox = new VBox();
        centerBox.setSpacing(10);
        centerBox.setMinWidth(200);

        nameLabel = new Label("Naam");
        name = new TextField();
        name.setDisable(true);
        name.setStyle("-fx-opacity: 1");
        name.setPromptText("Selecteer een Bot");

        clientIdLabel = new Label("Client ID");
        clientId = new TextField();
        clientId.setDisable(true);
        clientId.setStyle("-fx-opacity: 1");

        hostLabel = new Label("Host");
        host = new TextField();
        host.setDisable(true);
        host.setStyle("-fx-opacity: 1");

        memoryLabel = new Label("Geheugen (MB)");
        memory = new TextField();
        memory.setDisable(true);
        memory.setStyle("-fx-opacity: 1");

        autoRestartLabel = new Label("Automatisch Herstarten");
        autoRestart = new CheckBox();
        autoRestart.setDisable(true);
        autoRestart.setStyle("-fx-opacity: 1");

        colorLabel = new Label("Accent Kleur");
        color = new Rectangle();
        color.setWidth(200);
        color.setHeight(25);
        color.setStroke(Color.GRAY);
        color.setFill(Color.web("#FFFFFF"));
        centerBox.getChildren().addAll(nameLabel, name, clientIdLabel, clientId, hostLabel, host, memoryLabel, memory,
                autoRestartLabel, autoRestart, colorLabel, color);

        // Right
        rightTitle = new Text("Nieuw/Wijzig Bot");
        rightTitle.setFont(Font.font(18));
        rightBox = new VBox();
        rightBox.setSpacing(10);
        rightBox.setMinWidth(200);
        nameInputLabel = new Label("Naam");
        nameInput = new TextField();
        nameInput.setPromptText("Naam van de Bot");
        colorInputLabel = new Label("Accent Kleur (HEX)");
        colorInput = new TextField("#");
        memoryInputLabel = new Label("Geheugen (MB)");
        memoryInput = new TextField();
        memoryInput.setPromptText("Hoeveelheid geheugen");

        hostInputLabel = new Label("Host");
        hostInput = new ComboBox<>();
        hostInput.setMinWidth(150);
        hostInput.setMinHeight(25);
        hostInput.getItems().add("Local");
        hostInput.getItems().add("DisCloud");
        hostInput.getItems().add("AWS");
        hostInput.getItems().add("Microsoft Azure");
        hostInput.getItems().add("Linode");
        hostInput.getItems().add("A2 Hosting");
        hostInput.getItems().add("FastComet");
        hostInput.getItems().add("EvenNode");
        hostInput.getItems().add("Google Cloud");
        hostInput.getItems().add("Heroku");
        hostInput.setPromptText("Hosting platform");

        portInputLabel = new Label("Host Poort");
        portInput = new TextField();
        portInput.setPromptText("Server poort");
        autoRestartInputLabel = new Label("Automatisch Herstarten (Opt)");
        autoRestartInput = new CheckBox();
        rightBox.getChildren().addAll(nameInputLabel, nameInput, colorInputLabel, colorInput, memoryInputLabel,
                memoryInput, hostInputLabel, hostInput, portInputLabel, portInput, autoRestartInputLabel, autoRestartInput);

        rightButtonContainer = new HBox();
        createBotButton = new Button("Creeër");
        createBotButton.setStyle("-fx-background-color: #80b75c");
        saveBotButton = new Button("Wijzig");
        saveBotButton.setStyle("-fx-background-color: #6ac6ee");
        cancelBotButton = new Button("Annuleer");
        cancelBotButton.setStyle("-fx-background-color: #ad5050");
        rightButtonContainer.setSpacing(20);
        rightButtonContainer.getChildren().addAll(createBotButton, saveBotButton, cancelBotButton);

        // Styling Layout
        mainPane = new GridPane();
        mainPane.setVgap(10);
        mainPane.setHgap(40);
        mainPane.setAlignment(Pos.TOP_LEFT);
        mainPane.setPadding(new Insets(10));

        // Adding Children
        mainPane.add(leftTitle, 0, 0);
        mainPane.add(leftBox, 0, 1);
        mainPane.add(leftButtonContainer, 0, 2);
        mainPane.add(centerTitle, 1, 0);
        mainPane.add(centerBox, 1, 1);
        mainPane.add(rightTitle, 2, 0);
        mainPane.add(rightBox, 2, 1);
        mainPane.add(rightButtonContainer, 2, 2);

        // Parent
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

    public RadioMenuItem getSortAscendingMemory() {
        return sortAscendingMemory;
    }

    public RadioMenuItem getSortDescendingMemory() {
        return sortDescendingMemory;
    }

    public ComboBox<Customer> getCustomerSelector() {
        return customerSelector;
    }

    public ListView<DiscordBot> getDiscordBotListView() {
        return discordBotListView;
    }

    public Button getRemoveButton() {
        return removeButton;
    }

    public Button getSwitchButton() {
        return switchButton;
    }

    public TextField getName() {
        return name;
    }

    public TextField getClientId() {
        return clientId;
    }

    public TextField getHost() {
        return host;
    }

    public TextField getMemory() {
        return memory;
    }

    public CheckBox getAutoRestart() {
        return autoRestart;
    }

    public Rectangle getColor() {
        return color;
    }

    public TextField getNameInput() {
        return nameInput;
    }

    public TextField getColorInput() {
        return colorInput;
    }

    public TextField getMemoryInput() {
        return memoryInput;
    }

    public ComboBox<String> getHostInput() {
        return hostInput;
    }

    public TextField getPortInput() {
        return portInput;
    }

    public CheckBox getAutoRestartInput() {
        return autoRestartInput;
    }

    public Button getCreateBotButton() {
        return createBotButton;
    }

    public Button getSaveBotButton() {
        return saveBotButton;
    }

    public Button getCancelBotButton() {
        return cancelBotButton;
    }
}
