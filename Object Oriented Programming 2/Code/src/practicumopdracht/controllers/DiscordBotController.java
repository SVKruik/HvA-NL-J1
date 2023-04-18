package practicumopdracht.controllers;

import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.*;
import javafx.scene.paint.Color;
import practicumopdracht.MainApplication;
import practicumopdracht.comparators.MemoryDiscordBotComparator;
import practicumopdracht.comparators.NameDiscordBotComparator;
import practicumopdracht.data.DAO;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;
import practicumopdracht.views.DiscordBotView;
import practicumopdracht.views.View;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Objects;
import java.util.Random;

public class DiscordBotController extends Controller {
    private final DAO<DiscordBot> discordBotDAO;
    private final DAO<Customer> customerDAO;
    private final DiscordBotView discordBotView = new DiscordBotView();
    private final DecimalFormat df = new DecimalFormat("#.00");

    /**
     * The constructor of the Customer view.
     * Everything gets loaded and controlled from here.
     *
     * @param customer — The Customer that got parsed from the Customer view.
     */
    public DiscordBotController(Customer customer) {
        // Initialize
        this.discordBotDAO = MainApplication.getDiscordBotDAO();
        this.customerDAO = MainApplication.getCustomerDAO();
        ObservableList<DiscordBot> discordBotList = FXCollections.observableArrayList(this.discordBotDAO.getAllFor(customer));
        this.discordBotView.getDiscordBotListView().getItems().setAll(discordBotList);
        this.loadProfiles(customer);
        this.loadBots("");
        try {
            selectViewInputs(this.discordBotView.getDiscordBotListView().getItems().get(0));
            selectEditInputs(this.discordBotView.getDiscordBotListView().getItems().get(0));
            this.discordBotView.getDiscordBotListView().getSelectionModel().select(0);
        } catch (Exception ignored) {
        }

        // Inputs
        TextField name = this.discordBotView.getNameInput();
        TextField color = this.discordBotView.getColorInput();
        ComboBox<String> host = this.discordBotView.getHostInput();
        TextField port = this.discordBotView.getPortInput();
        CheckBox autoRestart = this.discordBotView.getAutoRestartInput();
        TextField memory = this.discordBotView.getMemoryInput();

        // Select Profile
        this.discordBotView.getCustomerSelector().setOnAction(ActionEvent -> selectProfile());

        // Create New Bot
        this.discordBotView.getCreateBotButton().setOnAction(actionEvent -> createDiscordBot(name.getText(), color.getText(),
                host.getValue(), port.getText(), autoRestart.isSelected(), memory.getText()));

        // Cancel Bot Creation
        this.discordBotView.getCancelBotButton().setOnAction(actionEvent -> cancelBot());

        // Save Bot Button
        this.discordBotView.getSaveBotButton().setOnAction(actionEvent -> saveBot());

        // Remove Bot
        this.discordBotView.getRemoveButton().setOnAction(actionEvent -> removeDiscordBot());

        // Load Bot Data onClick
        this.discordBotView.getDiscordBotListView().getSelectionModel().selectedItemProperty().addListener(((observableValue, oudeSelectie, nieuweSelectie) -> {
            try {
                // View
                selectViewInputs(nieuweSelectie);

                // Edit
                selectEditInputs(nieuweSelectie);
            } catch (Exception ignored) {
            }
        }));

        // Customer View
        this.discordBotView.getSwitchButton().setOnAction(actionEvent -> {
            Controller controller = new CustomerController(this.discordBotView.getCustomerSelector().getSelectionModel().getSelectedItem());
            MainApplication.switchView(controller);
        });

        // Sorting
        this.discordBotView.getSortAscendingName().setOnAction(actionEvent -> loadBots("asc name"));
        this.discordBotView.getSortDescendingName().setOnAction(actionEvent -> loadBots("desc name"));
        this.discordBotView.getSortAscendingMemory().setOnAction(actionEvent -> loadBots("asc memory"));
        this.discordBotView.getSortDescendingMemory().setOnAction(actionEvent -> loadBots("desc memory"));

        // Default Border Color on Type/Select
        name.setOnKeyPressed(keyEvent -> name.setStyle("-fx-border-color: #bcbcbc"));
        color.setOnKeyPressed(keyEvent -> color.setStyle("-fx-border-color: #bcbcbc"));
        host.setOnKeyPressed(keyEvent -> host.setStyle("-fx-border-color: #bcbcbc"));
        port.setOnKeyPressed(keyEvent -> port.setStyle("-fx-border-color: #bcbcbc"));
        memory.setOnKeyPressed(keyEvent -> memory.setStyle("-fx-border-color: #bcbcbc"));

        // Menu Bar Controls
        this.discordBotView.getSave().setOnAction(actionEvent -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u wilt opslaan?", ButtonType.YES, ButtonType.CANCEL);
            alert.showAndWait();
            if (alert.getResult() == ButtonType.YES) {
                customerDAO.save();
                discordBotDAO.save();
            }
        });

        this.discordBotView.getLoad().setOnAction(actionEvent -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u wilt laden?", ButtonType.YES, ButtonType.CANCEL);
            alert.showAndWait();
            if (alert.getResult() == ButtonType.YES) {
                customerDAO.load();
                discordBotDAO.load();
                this.discordBotView.getCustomerSelector().getSelectionModel().select(0);
                Customer firstCustomer = this.discordBotView.getCustomerSelector().getItems().get(0);
                ObservableList<DiscordBot> reloadedDiscordBotList = FXCollections.observableArrayList(this.discordBotDAO.getAllFor(firstCustomer));
                this.discordBotView.getDiscordBotListView().getItems().setAll(reloadedDiscordBotList);
                this.loadBots("");
            }
        });

        this.discordBotView.getShutdown().setOnAction(actionEvent -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u wilt afsluiten?", ButtonType.YES, ButtonType.CANCEL);
            alert.showAndWait();
            if (alert.getResult() == ButtonType.YES) Platform.exit();
        });

        // Max Length
        inputMax(this.discordBotView.getNameInput().textProperty(), -1);
        inputMax(this.discordBotView.getColorInput().textProperty(), 7);
        inputMax(this.discordBotView.getNameInput().textProperty(), -1);
        inputMax(this.discordBotView.getMemoryInput().textProperty(), -1);
        inputMax(this.discordBotView.getPortInput().textProperty(), -1);
    }

    private void loadProfiles(Customer selectedCustomer) {
        List<Customer> customers = customerDAO.getAll();
        ObservableList<Customer> observableCustomers = FXCollections.observableList(customers);
        //FXCollections.sort(observableCustomers, new NameCustomerComparator().reversed());
        this.discordBotView.getCustomerSelector().getItems().clear();
        for (Customer customer : observableCustomers) {
            this.discordBotView.getCustomerSelector().getItems().add(customer);
        }
        if (selectedCustomer != null) {
            this.discordBotView.getCustomerSelector().setValue(selectedCustomer);
        }
    }

    private void createDiscordBot(String name, String color, String host, String portRaw, boolean autoRestart, String memoryRaw) {
        // Default colours
        this.discordBotView.getNameInput().setStyle("-fx-border-color: #bcbcbc");
        this.discordBotView.getColorInput().setStyle("-fx-border-color: #bcbcbc");
        this.discordBotView.getHostInput().setStyle("-fx-border-color: #bcbcbc");
        this.discordBotView.getPortInput().setStyle("-fx-border-color: #bcbcbc");
        this.discordBotView.getAutoRestartInput().setStyle("-fx-border-color: #bcbcbc");
        this.discordBotView.getMemoryInput().setStyle("-fx-border-color: #bcbcbc");

        // Check if all values are present
        Alert numberAlert = new Alert(Alert.AlertType.WARNING);
        StringBuilder numberStringBuilder = new StringBuilder();
        numberStringBuilder.append("De volgende fouten zijn gevonden:\n\n");
        int port = 0;
        int memory = 0;
        int error = 0;

        // Convert
        try {
            port = Integer.parseInt(portRaw);
        } catch (Exception exception) {
            error = 1;
            this.discordBotView.getPortInput().setStyle("-fx-border-color: #ad5050");
            numberStringBuilder.append("- Portnummer is geen nummer.\n");
        }
        try {
            memory = Integer.parseInt(memoryRaw);
        } catch (Exception exception) {
            error = 1;
            this.discordBotView.getMemoryInput().setStyle("-fx-border-color: #ad5050");
            numberStringBuilder.append("- Geheugen is geen nummer.\n");
        }

        // Check TextField Numbers
        if (memory < 100) {
            error = 1;
            this.discordBotView.getPortInput().setStyle("-fx-border-color: #ad5050");
            numberStringBuilder.append("- Er is te weinig RAM toegewezen. Wijs minimaal 100 MB toe.\n");
        }
        if (port < 1) {
            error = 1;
            this.discordBotView.getPortInput().setStyle("-fx-border-color: #ad5050");
            numberStringBuilder.append("- Er is een ongeldig port nummer ingevuld.\n");
        }

        // Check TextFields
        if (Objects.equals(name, "") || Objects.equals(color, "") || Objects.equals(host, "")) {
            // Check inputs
            if (Objects.equals(name, "") || name.trim().isEmpty()) {
                error = 1;
                this.discordBotView.getNameInput().setStyle("-fx-border-color: #ad5050");
                numberStringBuilder.append("- Er is nog geen naam ingevuld.\n");
            }
            if (Objects.equals(color, "") || color.trim().isEmpty()) {
                error = 1;
                this.discordBotView.getColorInput().setStyle("-fx-border-color: #ad5050");
                numberStringBuilder.append("- Er is nog geen accent kleur ingevuld.\n");
            } else if (!color.matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {
                error = 1;
                this.discordBotView.getColorInput().setStyle("-fx-border-color: #ad5050");
                numberStringBuilder.append("- Er is een ongeldige accent kleur ingevuld.\n");
            }
            if (Objects.equals(host, "") || host.trim().isEmpty()) {
                error = 1;
                this.discordBotView.getHostInput().setStyle("-fx-border-color: #ad5050");
                numberStringBuilder.append("- Er is nog geen applicatie host ingevuld.\n");
            }
        }
        if (error == 1) {
            numberAlert.setContentText(numberStringBuilder.toString());
            numberAlert.show();
            return;
        }

        // Check for duplicates
        List<DiscordBot> discordBots = discordBotDAO.getAll();
        boolean exists = false;
        for (DiscordBot discordBot : discordBots) {
            if (discordBot.getName().equals(name)) {
                exists = true;
                break;
            }
        }

        try {
            Random random = new Random();
            DecimalFormat df = new DecimalFormat("#.00");
            int clientId = random.nextInt(999999);
            double hostingPrice = Double.parseDouble(df.format(memory * 0.001283));

            Customer customer = this.discordBotView.getCustomerSelector().getSelectionModel().getSelectedItem();

            // Handle duplicates
            DiscordBot discordBot = new DiscordBot(customer, name, color, clientId, host, hostingPrice,
                    port, autoRestart, memory);
            if (exists) {
                Alert alert = new Alert(Alert.AlertType.WARNING);
                String stringBuilder = "De volgende fouten zijn gevonden:\n\n" +
                        "- Er bestaat al een Bot met deze naam.";
                alert.setContentText(stringBuilder);
                alert.show();
            } else {
                this.discordBotDAO.addOrUpdate(discordBot);
                this.discordBotView.getDiscordBotListView().getItems().add(discordBot);
                this.discordBotView.getNameInput().setText("");
                this.discordBotView.getColorInput().setText("#");
                this.discordBotView.getHostInput().setValue("");
                this.discordBotView.getPortInput().setText("");
                this.discordBotView.getMemoryInput().setText("");
                this.discordBotView.getAutoRestartInput().setSelected(false);
                Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
                alert.setContentText("Nieuwe Bot succesvol aangemaakt.");
                alert.show();
            }
        } catch (Exception ignored) {
        }
    }

    private void removeDiscordBot() {
        ObservableList<Integer> selectedIndices = this.discordBotView.getDiscordBotListView().getSelectionModel().getSelectedIndices();
        try {
            Alert confirmAlert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u deze Bot wilt verwijderen?", ButtonType.YES, ButtonType.CANCEL);
            confirmAlert.showAndWait();
            if (confirmAlert.getResult() == ButtonType.YES) {
                discordBotDAO.remove(this.discordBotView.getDiscordBotListView().getSelectionModel().getSelectedItem());
                int lastIndex = selectedIndices.get(selectedIndices.size() - 1);
                this.discordBotView.getDiscordBotListView().getItems().remove(lastIndex);
                clearView();
                cancelBot();
                Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
                alert.setContentText("Bot succesvol verwijderd.");
                alert.show();
            }
        } catch (Exception exception) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            String stringBuilder = "De volgende fouten zijn gevonden:\n\n" +
                    "- Er is nog geen item geselecteerd.";
            alert.setContentText(stringBuilder);
            alert.show();
        }
    }

    private void loadBots(String sort) {
        if (Objects.equals(sort, "") || Objects.equals(sort, "asc name")) {
            FXCollections.sort(this.discordBotView.getDiscordBotListView().getItems(), new NameDiscordBotComparator());
        } else if (Objects.equals(sort, "desc name")) {
            FXCollections.sort(this.discordBotView.getDiscordBotListView().getItems(), new NameDiscordBotComparator().reversed());
        } else if (Objects.equals(sort, "asc memory")) {
            FXCollections.sort(this.discordBotView.getDiscordBotListView().getItems(), new MemoryDiscordBotComparator().reversed());
        } else if (Objects.equals(sort, "desc memory")) {
            FXCollections.sort(this.discordBotView.getDiscordBotListView().getItems(), new MemoryDiscordBotComparator());
        }
    }

    private void selectProfile() {
        Customer selected = this.discordBotView.getCustomerSelector().getSelectionModel().getSelectedItem();
        this.discordBotView.getDiscordBotListView().getItems().setAll(this.discordBotDAO.getAllFor(selected));
        this.discordBotView.getDiscordBotListView().getSelectionModel().select(0);
    }

    private void saveBot() {
        DiscordBot selected = this.discordBotView.getDiscordBotListView().getSelectionModel().getSelectedItem();
        if (selected == null) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            alert.setContentText("Er is nog geen item geselecteerd.");
            alert.show();
        } else {
            if (!Objects.equals(this.discordBotView.getNameInput().getText(), "")) {
                selected.setName(this.discordBotView.getNameInput().getText());
            }
            if (!Objects.equals(this.discordBotView.getColorInput().getText(), "")) {
                selected.setAccentColor(this.discordBotView.getColorInput().getText());
            }
            if (this.discordBotView.getHostInput().getValue() != null) {
                selected.setHost(this.discordBotView.getHostInput().getValue());
            }
            selected.setAutoRestart(this.discordBotView.getAutoRestartInput().isSelected());

            // Convert
            StringBuilder stringBuilder = new StringBuilder();
            int error = 0;
            if (this.discordBotView.getPortInput().getText().length() != 0) {
                try {
                    int port = Integer.parseInt(this.discordBotView.getPortInput().getText());
                    selected.setPort(port);
                    if (port < 1) {
                        error = 1;
                        this.discordBotView.getPortInput().setStyle("-fx-border-color: #ad5050");
                        stringBuilder.append("- Er is een ongeldig port nummer ingevuld.\n");
                    }
                } catch (Exception exception) {
                    error = 1;
                    this.discordBotView.getPortInput().setStyle("-fx-border-color: #ad5050");
                    stringBuilder.append("- Portnummer is geen nummer.\n");
                }
            }
            if (this.discordBotView.getMemoryInput().getText().length() != 0) {
                try {
                    int memory = Integer.parseInt(this.discordBotView.getMemoryInput().getText());
                    selected.setMemory(memory);
                    if (memory < 100) {
                        error = 1;
                        this.discordBotView.getPortInput().setStyle("-fx-border-color: #ad5050");
                        stringBuilder.append("- Er is te weinig RAM toegewezen. Wijs minimaal 100 MB toe.\n");
                    }
                } catch (Exception exception) {
                    error = 1;
                    this.discordBotView.getMemoryInput().setStyle("-fx-border-color: #ad5050");
                    stringBuilder.append("- Geheugen is geen nummer.\n");
                }
            }

            if (error == 1) {
                Alert alert = new Alert(Alert.AlertType.WARNING);
                alert.setContentText(stringBuilder.toString());
                alert.show();
            } else {
                try {
                    String hostingData = this.discordBotView.getHostInput().getValue() + ":" +
                            this.discordBotView.getPortInput().getText() +
                            " @" + df.format(selected.getHostingPriceHour()) + "$/H";
                    this.discordBotView.getName().setText(this.discordBotView.getNameInput().getText());
                    this.discordBotView.getHost().setText(hostingData);
                    this.discordBotView.getMemory().setText(this.discordBotView.getMemoryInput().getText());
                    this.discordBotView.getAutoRestart().setSelected(this.discordBotView.getAutoRestartInput().isSelected());
                    this.discordBotView.getColor().setFill(Color.web(this.discordBotView.getColorInput().getText()));
                    loadBots("");
                    cancelBot();
                    Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
                    alert.setContentText("Bot succesvol gewijzigd.");
                    alert.show();
                } catch (Exception ignored) {
                }
            }
        }
    }

    private void cancelBot() {
        this.discordBotView.getNameInput().setText("");
        this.discordBotView.getColorInput().setText("#");
        this.discordBotView.getMemoryInput().setText("");
        this.discordBotView.getHostInput().setValue("");
        this.discordBotView.getPortInput().setText("");
        this.discordBotView.getAutoRestartInput().setSelected(false);
        this.discordBotView.getDiscordBotListView().getSelectionModel().clearSelection();
    }

    private void clearView() {
        this.discordBotView.getName().setText("");
        this.discordBotView.getClientId().setText("");
        this.discordBotView.getHost().setText("");
        this.discordBotView.getMemory().setText("");
        this.discordBotView.getAutoRestart().setSelected(false);
        this.discordBotView.getColor().setFill(Color.WHITE);
    }

    private void selectViewInputs(DiscordBot discordBot) {
        String hostingData = discordBot.getHost() + ":" + discordBot.getPort() + " @" +
                df.format(discordBot.getHostingPriceHour()) + "€/D";

        this.discordBotView.getName().setText(discordBot.getName());
        this.discordBotView.getClientId().setText(String.valueOf(discordBot.getClientId()));
        this.discordBotView.getHost().setText(hostingData);
        this.discordBotView.getMemory().setText(String.valueOf(discordBot.getMemory()));
        this.discordBotView.getAutoRestart().setSelected(discordBot.getAutoRestart());
        try {
            this.discordBotView.getColor().setFill(Color.web(discordBot.getAccentColor()));
        } catch (Exception ignored) {
        }
    }

    private void selectEditInputs(DiscordBot discordBot) {
        this.discordBotView.getNameInput().setText(discordBot.getName());
        this.discordBotView.getColorInput().setText(discordBot.getAccentColor());
        this.discordBotView.getMemoryInput().setText(String.valueOf(discordBot.getMemory()));
        this.discordBotView.getHostInput().setValue(discordBot.getHost());
        this.discordBotView.getPortInput().setText(String.valueOf(discordBot.getPort()));
        this.discordBotView.getAutoRestartInput().setSelected(discordBot.getAutoRestart());
    }

    /**
     * Returns the view object of the Discord Bot view.
     *
     * @return - The returned view.
     */
    @Override
    public View getView() {
        return discordBotView;
    }
}
