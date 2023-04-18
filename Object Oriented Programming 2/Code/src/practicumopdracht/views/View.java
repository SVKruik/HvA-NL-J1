package practicumopdracht.views;

import javafx.scene.Parent;

public abstract class View {

    private Parent root;

    public View() {
        root = initializeView();
    }

    protected abstract Parent initializeView();

    public Parent getRoot() {
        return root;
    }

    public void setRoot(Parent parent) {
        this.root = parent;
    }
}
