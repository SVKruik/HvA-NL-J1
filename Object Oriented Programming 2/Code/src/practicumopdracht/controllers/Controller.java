package practicumopdracht.controllers;

import javafx.beans.property.StringProperty;
import practicumopdracht.views.View;

public abstract class Controller {
    private final int MAX_INPUT_LENGTH = 35;

    /**
     * Limits the input length.
     *
     * @param stringProperty — String property of the input.
     * @param maxLength      — Max length of specific input.
     */
    public void inputMax(StringProperty stringProperty, int maxLength) {
        int length;
        if (maxLength == -1) {
            length = MAX_INPUT_LENGTH;
        } else {
            length = maxLength;
        }

        stringProperty.addListener((observable, oldValue, newValue) -> {
            if (newValue.length() > length) {
                stringProperty.set(oldValue);
            }
        });
    }

    /**
     * Returns the view.
     *
     * @return - The returned view.
     */
    public abstract View getView();
}
