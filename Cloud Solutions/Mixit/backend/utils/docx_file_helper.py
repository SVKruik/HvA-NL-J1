from spire.doc import *
def docx_to_pdf(docx_file: str):
    document = Document()
    document.LoadFromFile(docx_file)
    document.SaveToFile("DocToPDF.pdf", FileFormat.PDF)
    document.Dispose()
    return "DocToPDF.pdf"