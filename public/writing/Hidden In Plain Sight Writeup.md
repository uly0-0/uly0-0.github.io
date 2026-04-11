# Hidden In Plain Sight — Steganographic Analysis of a Concealed Payload

**Category:** Digital Forensics | Steganography **Tools Used:** `exiftool`, `steghide`, Base64 Decoder

---

## Objective

This analysis examines a JPEG file suspected of containing concealed data. The objective was to identify, extract, and document any hidden artifacts using standard forensic methodology, including metadata inspection, encoded string analysis, and steganographic extraction.

---

## Methodology

### 1. Evidence Acquisition

The target file `img.jpg` was retrieved and prepared for static analysis. Before any examination, the file was treated as read-only evidence to preserve its integrity.

```bash
curl -O <image_url>
```

---

### 2. Metadata Inspection

The first step in any file-based forensic analysis is examining the file's metadata for anomalies. Using `exiftool`, a full metadata dump was performed on the image:

```bash
exiftool img.jpg
```

**Output:**

```
ExifTool Version Number         : 12.40
File Name                       : img.jpg
File Size                       : 72 KiB
File Type                       : JPEG
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Image Width                     : 640
Image Height                    : 640
Comment                         : c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9
Megapixels                      : 0.410
```

**Finding:** The `Comment` field contained an anomalous string: `c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9`

Embedding encoded strings within EXIF comment fields is a known data concealment technique, as these fields are often overlooked during casual inspection — hence the challenge name _Hidden In Plain Sight._

---

### 3. Encoded String Analysis

The comment string was identified as Base64 encoding based on its character set and padding structure. Decoding it revealed:

```
steghide:cEF6endvcmQ=
```

This output contains two pieces of information:

- A reference to **steghide**, a steganography tool used to embed data within image files
- A second Base64-encoded string: `cEF6endvcmQ=`

Decoding the second string produced a passphrase:

```
pAzzword
```

The use of nested encoding — Base64 within Base64 — added an additional layer of obfuscation to the concealed credentials.

---

### 4. Steganographic Extraction

With the tool and passphrase identified, the image was inspected for embedded data using `steghide`:

```bash
steghide -info img.jpg
```

The output confirmed that embedded data was present and protected by a passphrase. Using the recovered credential, the hidden content was extracted:

```bash
steghide extract -sf img.jpg -p pAzzword
```

This successfully extracted a file named `flag.txt`.

---

### 5. Recovery of Concealed Data

The extracted file was opened and its contents revealed:

```bash
cat flag.txt
```

```
picoCTF{h1dd3n_1n_1m4g3_1c55ccd0}
```

---

## Summary of Findings

|Step|Finding|
|---|---|
|Metadata Inspection|Anomalous Base64 string found in EXIF Comment field|
|First Decode|Revealed steghide tool reference and second encoded string|
|Second Decode|Recovered passphrase: `pAzzword`|
|Steganographic Extraction|Confirmed embedded data; extracted `flag.txt`|
|Final Recovery|CTF flag successfully retrieved|

---

## Conclusion

This challenge demonstrated a multi-layered data concealment technique combining EXIF metadata manipulation, nested Base64 encoding, and image steganography. Each layer required a distinct analytical method to uncover, reinforcing the importance of thorough file examination during forensic investigations.

The methodology applied here — metadata analysis, encoded artifact identification, and structured extraction — reflects standard practices used in real digital forensic investigations when examining files suspected of containing hidden or exfiltrated data.