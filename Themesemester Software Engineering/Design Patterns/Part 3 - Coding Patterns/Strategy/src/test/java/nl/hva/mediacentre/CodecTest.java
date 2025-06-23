package nl.hva.mediacentre;

import nl.hva.codecs.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CodecTest {
    Codec mp3;
    Codec wav;
    Codec aac;
    Codec aiff;

    @BeforeEach
    void setup() {
        mp3 = new MP3Codec();
        wav = new WAVCodec();
        aac = new AACCodec();
        aiff = new AIFFCodec();
    }

    @Test
    void test_mp3_codec_has_correct_file_type() {
        assertEquals(FileType.MP3, mp3.getFileType());
    }

    @Test
    void test_wav_codec_has_correct_file_type() {
        assertEquals(FileType.WAV, wav.getFileType());
    }

    @Test
    void test_aac_codec_has_correct_file_type() {
        assertEquals(FileType.AAC, aac.getFileType());
    }

    @Test
    void test_aiff_codec_has_correct_file_type() {
        assertEquals(FileType.AIFF, aiff.getFileType());
    }

    @Test
    void mp3_returns_correct_algorithm_information() {
        assertEquals(CodecDescriptions.MP3_DESCRIPTION, mp3.getCodecInformation());
    }

    @Test
    void aac_returns_correct_algorithm_information() {
        assertEquals(CodecDescriptions.AAC_DESCRIPTION, aac.getCodecInformation());
    }

    @Test
    void aiff_returns_correct_algorithm_information() {
        assertEquals(CodecDescriptions.AIFF_DESCRIPTION, aiff.getCodecInformation());
    }

    @Test
    void wav_returns_correct_algorithm_information() {
        assertEquals(CodecDescriptions.WAV_DESCRIPTION, wav.getCodecInformation());
    }
}
