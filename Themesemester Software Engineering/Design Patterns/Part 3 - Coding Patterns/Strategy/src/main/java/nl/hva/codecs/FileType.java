package nl.hva.codecs;

public enum FileType {
    MP3("mp3"),
    WAV("wav"),
    AIFF("aiff"),
    AAC("aac");

    final String ext;

    FileType(String ext) {
        this.ext = ext;
    }
}
