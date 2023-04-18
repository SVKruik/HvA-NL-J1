package practicumopdracht;

import javafx.application.Application;
import javafx.beans.property.StringProperty;
import javafx.scene.Scene;
import javafx.stage.Stage;
import practicumopdracht.controllers.Controller;
import practicumopdracht.controllers.CustomerController;
import practicumopdracht.data.BinaryCustomerDAO;
import practicumopdracht.data.DAO;
import practicumopdracht.data.ObjectDiscordBotDAO;
import practicumopdracht.models.Customer;
import practicumopdracht.models.DiscordBot;

public class MainApplication extends Application {

    private static final DAO<Customer> customerDAO = new BinaryCustomerDAO();
    private static final DAO<DiscordBot> discordBotDAO = new ObjectDiscordBotDAO();
    private static final Stage stage = new Stage();
    private final int WIDTH = 760;
    private final int HEIGHT = 600;

    public static void switchView(Controller controller) {
        stage.setScene(new Scene(controller.getView().getRoot()));
    }

    public static DAO<Customer> getCustomerDAO() {
        return customerDAO;
    }

    public static DAO<DiscordBot> getDiscordBotDAO() {
        return discordBotDAO;
    }

    @Override
    public void start(Stage stage) {
        if (!Main.launchedFromMain) {
            System.err.println("Je moet deze applicatie opstarten vanuit de Main-class, niet de MainApplication-class!");
            System.exit(1337);
            return;
        }

        // Load Text Data
        customerDAO.load();
        discordBotDAO.load();

        // Setup View
        stage = MainApplication.stage;
        Controller masterController = new CustomerController(null);
        switchView(masterController);

        // Style View
        stage.setTitle(String.format("Practicumopdracht OOP2 - %s", Main.studentNaam));
        stage.setWidth(this.WIDTH);
        stage.setHeight(this.HEIGHT);
        stage.sizeToScene();
        stage.show();
    }
}
