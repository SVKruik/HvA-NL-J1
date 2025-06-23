package nl.hva.codecs;

import nl.hva.Recordings.Recording;

/**
 * Represents a coding format for digital audio. Examples of existing formats
 * are given in the FileType enum.
 */
public interface Codec {
   /**
    * For demonstrating a strategy pattern this method simply returns a message
    * saying that it is decoding a file with a given file type. In reality this
    * method would be doing the actual decoding according to the algorithm for a
    * given Codec. Therefore, it cannot have a generic implementation
    *
    * @return a String in the format "Decoding xyz" where xyz is the file type.
    */
   String decode();

   /**
    * Uses this codec to create a Recording
    * For demonstrating a strategy pattern this method simply takes the title of a
    * recording that is to be encoded and returns a Recording which has a specific
    * file type. In reality this method would be doing the actual encoding
    * according to the algorithm for a given Codec and returning the encoded
    * recording. Therefore, it cannot have a generic implementation (i.e. be
    * implemented here and return getFileType)
    *
    * @param title the title of this recording
    * @return recording with title and file type of this decoder. The message
    *         should be in the form:
    *         "Decoding " + FileType.ext
    */
   Recording encode(String title);

   /**
    * @return FileType of this codec.
    */
   FileType getFileType();

   /**
    *
    * @return information about the algorithm of an actual codec
    */
   String getCodecInformation();
}
