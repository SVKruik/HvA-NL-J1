package practicumopdracht.controllers;

import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.*;
import practicumopdracht.MainApplication;
import practicumopdracht.comparators.DateCustomerComparator;
import practicumopdracht.comparators.NameCustomerComparator;
import practicumopdracht.data.DAO;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;
import practicumopdracht.views.CustomerView;
import practicumopdracht.views.View;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public class CustomerController extends Controller {
    private final DAO<Customer> customerDAO;
    private final DAO<DiscordBot> discordBotDAO;
    private final CustomerView customerView = new CustomerView();

    /**
     * The constructor of the Customer view.
     * Everything gets loaded and controlled from here.
     */
    public CustomerController(Customer selectedCustomer) {
        // Initialize
        this.customerDAO = MainApplication.getCustomerDAO();
        this.discordBotDAO = MainApplication.getDiscordBotDAO();
        ObservableList<Customer> customerList = FXCollections.observableArrayList(this.customerDAO.getAll());
        this.customerView.getCustomerListView().setItems(customerList);
        loadProfiles("", selectedCustomer);
        this.customerView.getSortAscendingName().setSelected(true);

        // Profile values
        TextField name = this.customerView.getCustomerNameInput();
        TextField profileName = this.customerView.getCustomerProfileNameInput();
        ComboBox<String> language = this.customerView.getLanguageInput();
        TextArea description = this.customerView.getDescriptionInput();

        // New Profile
        this.customerView.getCreateButton().setOnAction(actionEvent -> createCustomer(name.getText(), profileName.getText(), language.getValue(), description.getText()));

        // Remove Profile
        this.customerView.getRemoveButton().setOnAction(actionEvent -> removeCustomer());

        // Clear Profile Inputs
        this.customerView.getCancelButton().setOnAction(actionEvent -> cancelNewCustomer());

        // Save Profile
        this.customerView.getSaveButton().setOnAction(actionEvent -> saveCustomer());

        // Load Profile Data onClick
        this.customerView.getCustomerListView().getSelectionModel().selectedItemProperty().addListener(((observableValue, oudeSelectie, nieuweSelectie) -> {
            selectProfile(nieuweSelectie);
        }));

        // Sorting
        this.customerView.getSortAscendingName().setOnAction(actionEvent -> loadProfiles("asc name", selectedCustomer));
        this.customerView.getSortDescendingName().setOnAction(actionEvent -> loadProfiles("desc name", selectedCustomer));
        this.customerView.getSortDescendingDate().setOnAction(actionEvent -> loadProfiles("desc date", selectedCustomer));
        this.customerView.getSortAscendingDate().setOnAction(actionEvent -> loadProfiles("asc date", selectedCustomer));

        // Default Border Color on Type/Select
        name.setOnKeyPressed(keyEvent -> name.setStyle("-fx-border-color: #bcbcbc"));
        profileName.setOnKeyPressed(keyEvent -> profileName.setStyle("-fx-border-color: #bcbcbc"));
        language.setOnAction(actionEvent -> language.setStyle("-fx-border-color: #bcbcbc"));
        description.setOnKeyPressed(keyEvent -> description.setStyle("-fx-border-color: #bcbcbc"));

        // Discord Bots View
        this.customerView.getSwitchButton().setOnAction(actionEvent -> {
            Customer selected = this.customerView.getCustomerListView()
                    .getSelectionModel().getSelectedItem();
            if (selected == null) {
                Alert alert = new Alert(Alert.AlertType.WARNING);
                alert.setContentText("Er is nog geen profiel geselecteerd.");
                alert.show();
            } else {
                Controller controller = new DiscordBotController(selected);
                MainApplication.switchView(controller);
            }
        });

        // Menu Bar Controls
        this.customerView.getSave().setOnAction(actionEvent -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u wilt opslaan?", ButtonType.YES, ButtonType.CANCEL);
            alert.showAndWait();
            if (alert.getResult() == ButtonType.YES) {
                customerDAO.save();
                discordBotDAO.save();
            }
        });

        this.customerView.getLoad().setOnAction(actionEvent -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u wilt laden?", ButtonType.YES, ButtonType.CANCEL);
            alert.showAndWait();
            if (alert.getResult() == ButtonType.YES) {
                customerDAO.load();
                discordBotDAO.load();
                ObservableList<Customer> reloadedCustomerList = FXCollections.observableArrayList(this.customerDAO.getAll());
                this.customerView.getCustomerListView().setItems(reloadedCustomerList);
                loadProfiles("", selectedCustomer);
            }
        });

        this.customerView.getShutdown().setOnAction(actionEvent -> {
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u wilt afsluiten?", ButtonType.YES, ButtonType.CANCEL);
            alert.showAndWait();
            if (alert.getResult() == ButtonType.YES) Platform.exit();
        });

        // Max input length
        inputMax(this.customerView.getCustomerNameInput().textProperty(), -1);
        inputMax(this.customerView.getCustomerProfileNameInput().textProperty(), -1);
        inputMax(this.customerView.getDescriptionInput().textProperty(), 200);
    }

    private void selectProfile(Customer customer) {
        try {
            // View
            this.customerView.getCustomerName().setText(customer.getName());
            this.customerView.getCustomerProfileName().setText(customer.getProfileName());
            this.customerView.getEmailVerified().setSelected(customer.getVerified());
            this.customerView.getLanguage().setText(customer.getLanguage());
            this.customerView.getCreation().setValue(customer.getCreatedOn());
            this.customerView.getDescription().setText(customer.getDescription());

            // Edit
            this.customerView.getCustomerNameInput().setText(customer.getName());
            this.customerView.getCustomerProfileNameInput().setText(customer.getProfileName());
            this.customerView.getLanguageInput().setValue(customer.getLanguage());
            this.customerView.getDescriptionInput().setText(customer.getDescription());
        } catch (Exception ignored) {
        }
    }

    private void loadProfiles(String sort, Customer selectedCustomer) {
        if (selectedCustomer != null) {
            this.customerView.getCustomerListView().getSelectionModel().select(selectedCustomer);
            selectProfile(selectedCustomer);
        }
        if (Objects.equals(sort, "") || Objects.equals(sort, "asc name")) {
            FXCollections.sort(this.customerView.getCustomerListView().getItems(), new NameCustomerComparator());
        } else if (Objects.equals(sort, "desc name")) {
            FXCollections.sort(this.customerView.getCustomerListView().getItems(), new NameCustomerComparator().reversed());
        } else if (Objects.equals(sort, "desc date")) {
            FXCollections.sort(this.customerView.getCustomerListView().getItems(), new DateCustomerComparator().reversed());
        } else if (Objects.equals(sort, "asc date")) {
            FXCollections.sort(this.customerView.getCustomerListView().getItems(), new DateCustomerComparator());
        }
    }

    private void createCustomer(String name, String profileName, String language, String description) {
        // Default colours
        this.customerView.getCustomerNameInput().setStyle("-fx-border-color: #bcbcbc");
        this.customerView.getCustomerProfileNameInput().setStyle("-fx-border-color: #bcbcbc");
        this.customerView.getLanguageInput().setStyle("-fx-border-color: #bcbcbc");
        this.customerView.getDescriptionInput().setStyle("-fx-border-color: #bcbcbc");

        // Check if all values are present
        if (Objects.equals(name, "") || Objects.equals(profileName, "") || this.customerView.getLanguageInput().getSelectionModel().isEmpty() || Objects.equals(description, "")) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("De volgende fouten zijn gevonden:\n\n");
            if (Objects.equals(name, "") || name.trim().isEmpty()) {
                this.customerView.getCustomerNameInput().setStyle("-fx-border-color: #ad5050");
                stringBuilder.append("- Er is nog geen naam ingevuld.\n");
            }
            if (Objects.equals(profileName, "") || profileName.trim().isEmpty()) {
                this.customerView.getCustomerProfileNameInput().setStyle("-fx-border-color: #ad5050");
                stringBuilder.append("- Er is nog geen profiel naam ingevuld.\n");
            }
            if (this.customerView.getLanguageInput().getSelectionModel().isEmpty()) {
                this.customerView.getLanguageInput().setStyle("-fx-border-color: #ad5050");
                stringBuilder.append("- Er is nog geen taal geselecteerd.\n");
            }
            if (Objects.equals(description, "") || description.trim().isEmpty()) {
                this.customerView.getDescriptionInput().setStyle("-fx-border-color: #ad5050");
                stringBuilder.append("- Er is nog geen beschrijving ingevuld.");
            }
            alert.setContentText(stringBuilder.toString());
            alert.show();
            return;
        }

        // Check for duplicates
        List<Customer> customers = customerDAO.getAll();
        boolean exists = false;
        for (Customer customer : customers) {
            if (customer.getProfileName().equals(profileName)) {
                exists = true;
                break;
            }
        }

        // Handle duplicates
        Customer customer = new Customer(name, profileName, true, language, LocalDate.now(), description);
        if (exists) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            String stringBuilder = "De volgende fouten zijn gevonden:\n\n" +
                    "- Er bestaat al een profiel met deze profiel naam.";
            alert.setContentText(stringBuilder);
            alert.show();
            this.customerView.getCustomerNameInput().setStyle("-fx-border-color: #ad5050");
        } else {
            this.customerDAO.addOrUpdate(customer);
            this.customerView.getCustomerListView().getItems().add(customer);
            this.customerView.getCustomerNameInput().setText("");
            this.customerView.getCustomerProfileNameInput().setText("");
            this.customerView.getLanguageInput().setValue("");
            this.customerView.getDescriptionInput().setText("");
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setContentText("Nieuw profiel succesvol aangemaakt.");
            alert.show();
        }
    }

    private void removeCustomer() {
        ObservableList<Integer> selectedIndices = this.customerView.getCustomerListView().getSelectionModel().getSelectedIndices();
        try {
            Alert confirmAlert = new Alert(Alert.AlertType.CONFIRMATION, "Weet u zeker dat u dit profiel wilt verwijderen?", ButtonType.YES, ButtonType.CANCEL);
            confirmAlert.showAndWait();
            if (confirmAlert.getResult() == ButtonType.YES) {
                List<DiscordBot> discordBots = this.discordBotDAO.getAllFor(this.customerView.getCustomerListView().getSelectionModel().getSelectedItem());
                for (DiscordBot discordBot : discordBots) {
                    if (discordBot.getBelongsTo().equals(this.customerView.getCustomerListView().getSelectionModel().getSelectedItem())) {
                        this.discordBotDAO.remove(discordBot);
                    }
                }
                this.customerDAO.remove(this.customerView.getCustomerListView().getSelectionModel().getSelectedItem());
                int lastIndex = selectedIndices.get(selectedIndices.size() - 1);
                this.customerView.getCustomerListView().getItems().remove(lastIndex);
                this.customerView.getCustomerName().setText("");
                this.customerView.getCustomerProfileName().setText("");
                this.customerView.getEmailVerified().setSelected(false);
                this.customerView.getLanguage().setText("");
                this.customerView.getCreation().setValue(null);
                this.customerView.getDescription().setText("");
                cancelNewCustomer();
                Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
                alert.setContentText("Profiel succesvol verwijderd.");
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

    private void saveCustomer() {
        Customer selected = this.customerView.getCustomerListView().getSelectionModel().getSelectedItem();
        if (selected == null) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            alert.setContentText("Er is nog geen item geselecteerd.");
            alert.show();
        } else {
            selected.setName(this.customerView.getCustomerNameInput().getText());
            selected.setProfileName(this.customerView.getCustomerProfileNameInput().getText());
            selected.setLanguage(this.customerView.getLanguageInput().getValue());
            selected.setDescription(this.customerView.getDescriptionInput().getText());
            loadProfiles("", null);
            cancelNewCustomer();
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setContentText("Profiel succesvol gewijzigd.");
            alert.show();
        }
    }

    private void cancelNewCustomer() {
        this.customerView.getCustomerNameInput().setText("");
        this.customerView.getCustomerProfileNameInput().setText("");
        this.customerView.getLanguageInput().setValue("");
        this.customerView.getDescriptionInput().setText("");

        this.customerView.getCustomerNameInput().setOnKeyPressed(keyEvent -> this.customerView.getCustomerNameInput().
                setStyle("-fx-border-color: #bcbcbc"));
        this.customerView.getCustomerProfileNameInput().setOnKeyPressed(keyEvent -> this.customerView.
                getCustomerProfileNameInput().setStyle("-fx-border-color: #bcbcbc"));
        this.customerView.getLanguageInput().setOnAction(actionEvent -> this.customerView.getLanguageInput().
                setStyle("-fx-border-color: #bcbcbc"));
        this.customerView.getDescriptionInput().setOnKeyPressed(keyEvent -> this.customerView.getDescriptionInput().
                setStyle("-fx-border-color: #bcbcbc"));
        this.customerView.getCustomerListView().getSelectionModel().clearSelection();
    }

    /**
     * Returns the view object of the Customer view.
     *
     * @return - The returned view.
     */
    @Override
    public View getView() {
        return this.customerView;
    }
}
