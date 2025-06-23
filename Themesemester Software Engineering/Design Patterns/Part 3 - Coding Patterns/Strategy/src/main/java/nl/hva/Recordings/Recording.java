package nl.hva.Recordings;

import nl.hva.codecs.FileType;

/**
 * A Recording has a title and FileType. The FileType indicates what kind of
 * Codec is required to play the Recording.
 */
public class Recording {
    private final String title;
    private final FileType fileType;

    /**
     * Create a new Recording
     * 
     * @param title    the title of this Recording as a String
     * @param fileType the file type of this Recording
     */
    public Recording(String title, FileType fileType) {
        this.title = title;
        this.fileType = fileType;
    }

    public String getTitle() {
        return title;
    }

    public FileType getFileType() {
        return fileType;
    }

    @Override
    public String toString() {
        return "Recording{" +
                "title='" + title + '\'' +
                ", fileType=" + fileType +
                '}';
    }
}
