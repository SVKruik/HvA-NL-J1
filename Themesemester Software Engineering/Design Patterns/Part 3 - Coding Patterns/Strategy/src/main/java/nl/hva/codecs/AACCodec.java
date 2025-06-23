package nl.hva.codecs;

import nl.hva.Recordings.Recording;

public class AACCodec implements Codec {
    private final String codecName = "aac";

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
        return FileType.AAC;
    }

    @Override
    public String getCodecInformation() {
        return CodecDescriptions.AAC_DESCRIPTION;
    }
}
