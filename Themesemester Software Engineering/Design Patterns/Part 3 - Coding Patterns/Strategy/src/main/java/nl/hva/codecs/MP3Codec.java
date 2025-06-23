package nl.hva.codecs;

import nl.hva.Recordings.Recording;

public class MP3Codec implements Codec {
    private final String codecName = "mp3";

    @Override
    public String decode() {
        return "Decoding " + codecName;
    }

    @Override
    public Recording encode(String title) {
        return new Recording(title, getFileType());
    }

    @Override
    public FileType getFileType() {
        return FileType.MP3;
    }

    @Override
    public String getCodecInformation() {
        return CodecDescriptions.MP3_DESCRIPTION;
    }
}
