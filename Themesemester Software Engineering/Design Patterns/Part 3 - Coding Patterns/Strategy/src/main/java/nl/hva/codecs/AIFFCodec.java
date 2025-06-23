package nl.hva.codecs;

import nl.hva.Recordings.Recording;

public class AIFFCodec implements Codec {
    private final String codecName = "aiff";

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
        return FileType.AIFF;
    }

    @Override
    public String getCodecInformation() {
        return CodecDescriptions.AIFF_DESCRIPTION;
    }
}
