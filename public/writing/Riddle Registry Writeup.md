# Riddle Registry — Metadata Forensics and Encoded Artifact Recovery from a PDF

**Category:** Digital Forensics | Metadata Analysis | PDF Forensics **Tools Used:** `file`, `ls`, `sha256sum`, `strings`, `ripgrep`, `exiftool`, Base64 Decoder **Difficulty:** Beginner

---

## Objective

This analysis examines a PDF file labeled `confidential.pdf` suspected of containing a concealed flag. The objective was to conduct a structured forensic inspection of the file — beginning with integrity verification, followed by string analysis and metadata examination — to identify and extract any hidden artifacts.

---

## Methodology

### 1. Evidence Acquisition and Integrity Verification

Before any analysis was performed, the file was examined in an isolated environment to establish a baseline record. File type verification, size, and a cryptographic hash were documented:

```bash
file confidential.pdf
ls -lh confidential.pdf
sha256sum confidential.pdf
```

**Finding:** The file was confirmed as a valid PDF document. The SHA-256 hash was recorded to establish a integrity baseline, ensuring any future comparison could verify the file had not been modified during analysis. This step reflects standard evidence handling practice — documenting file state prior to examination.

---

### 2. Visible String Analysis

The next step was scanning the raw file contents for any readable strings, specifically searching for flag-formatted patterns. This technique is effective at identifying data embedded in plain text within a file's byte stream, regardless of whether it is visible when the file is rendered normally:

```bash
strings confidential.pdf | grep -i "picoCTF|picoCTF\{"
```

**Finding:** No flag-formatted strings were detected in the visible content. This result narrowed the investigation toward non-visible storage locations such as file metadata fields, which are not rendered during normal document viewing and are frequently overlooked.

---

### 3. Metadata Inspection

PDF documents support two metadata formats: the Info Dictionary and XMP metadata. Both can contain arbitrary text fields that are invisible to a standard reader but accessible through forensic tools. `exiftool` was used to perform a full metadata extraction:

```bash
exiftool confidential.pdf
```

**Output:**

```
ExifTool Version Number         : 12.40
File Name                       : confidential.pdf
File Size                       : 178 KiB
File Type                       : PDF
MIME Type                       : application/pdf
PDF Version                     : 1.7
Linearized                      : No
Page Count                      : 1
Producer                        : PyPDF2
Author                          : cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=
```

**Finding:** The `Author` metadata field contained an anomalous value ending in `=`, a structural characteristic of Base64-encoded strings. The padding character `=` is appended to Base64 output to maintain correct byte alignment, making it a reliable visual indicator of this encoding scheme.

Notably, the `Producer` field identified **PyPDF2** as the tool used to generate the document — a Python-based PDF library. This suggests the file was programmatically generated, which is consistent with intentional metadata manipulation rather than a standard document workflow.

---

### 4. Base64 Decoding and Flag Recovery

The anomalous `Author` field value was submitted to a Base64 decoder for analysis:

```
cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=
```

**Finding:** Decoding the string produced the following readable output:

```
picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```

The concealed flag was successfully recovered from the document's metadata.

---

## Summary of Findings

|Step|Finding|
|---|---|
|Integrity Verification|SHA-256 hash recorded; file confirmed as valid PDF|
|String Analysis|No flag-formatted strings found in visible file content|
|Metadata Inspection|Anomalous Base64-encoded string identified in `Author` field|
|Producer Analysis|PyPDF2 identified as document generator, indicating programmatic metadata manipulation|
|Base64 Decoding|Flag successfully recovered from decoded `Author` field value|

---

## Conclusion

This challenge demonstrated the use of PDF metadata fields as a concealment vector. By embedding an encoded payload within the `Author` field — a location invisible during normal document rendering — the flag was effectively hidden from casual inspection while remaining accessible through forensic metadata analysis.

The structured approach applied here — integrity verification, visible content analysis, and metadata examination — reflects the layered inspection methodology used in real forensic investigations when analyzing documents for concealed data, exfiltrated information, or indicators of tampering. PDF metadata manipulation is particularly relevant in real-world cases involving document fraud, insider threat investigations, and malware delivery through weaponized documents.