package nl.hva.codecs;

import nl.hva.Recordings.Recording;

public class WAVCodec implements Codec {
    private final String codecName = "wav";

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
        return FileType.WAV;
    }

    @Override
    public String getCodecInformation() {
        return CodecDescriptions.WAV_DESCRIPTION;
    }
}
