package nl.hva.mediacentre;

import nl.hva.Recordings.Recording;

import nl.hva.codecs.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PlayerTest {
    MediaCentre mediaCentre;
    Codec mp3;
    Codec wav;
    Codec aac;
    Codec aiff;
    Recording rec1, rec2, rec3, rec4;

    @BeforeEach
    void setup() {
        mediaCentre = new MediaCentre();
        mp3 = new MP3Codec();
        wav = new WAVCodec();
        aac = new AACCodec();
        aiff = new AIFFCodec();
        rec1 = new Recording("This is my strategy", FileType.MP3);
        rec2 = new Recording("The patterns of love", FileType.WAV);
        rec3 = new Recording("Like a bridge over troubled water", FileType.AAC);
        rec4 = new Recording("Smooth Decorator", FileType.AIFF);
    }

    @Test
    void media_centre_initially_has_no_codec() {
        assertEquals(MediaCentre.NO_DECODER, mediaCentre.getStatus());
    }

    @Test
    void mp3_codec_can_be_set() {
        mediaCentre.setCodec(mp3);
        assertEquals(MediaCentre.DECODER_SET + mp3.getFileType(), mediaCentre.getStatus());
    }

    @Test
    void codec_can_be_changed_to_no_codec() {
        mediaCentre.setCodec(mp3);
        mediaCentre.setCodec(null);

        assertEquals(MediaCentre.NO_DECODER, mediaCentre.getStatus());
    }

    @Test
    void codec_can_be_changed_another_codec() {
        mediaCentre.setCodec(mp3);
        mediaCentre.setCodec(aac);

        assertEquals(MediaCentre.DECODER_SET + aac.getFileType(), mediaCentre.getStatus());
    }

    @Test
    void player_with_aac_codec_can_play_aac_recordings() {
        mediaCentre.setCodec(aac);

        assertEquals("Decoding aac", mediaCentre.playFile(rec3));
    }

    @Test
    void player_with_mp3_codec_cannot_play_wav_file() {
        mediaCentre.setCodec(mp3);

        assertEquals(MediaCentre.INCORRECT_DECODER_FOR_PLAYING, mediaCentre.playFile(rec2));
    }

    @Test
    void player_with_mp3_makes_mp3_recording() {
        mediaCentre.setCodec(mp3);
        Recording recording1 = mediaCentre.recordFile("You've got me in a state");

        assert (recording1.getFileType().equals(FileType.MP3));
    }

    @Test
    void player_with_wav_makes_wav_recording() {
        mediaCentre.setCodec(wav);
        Recording recording2 = mediaCentre.recordFile("Let me be your singleton");

        assert (recording2.getFileType().equals(FileType.WAV));
    }

    @Test
    void player_with_no_codec_cannot_record() {
        assertNull(mediaCentre.recordFile("It ain't gonna work Baby"));
    }
}
