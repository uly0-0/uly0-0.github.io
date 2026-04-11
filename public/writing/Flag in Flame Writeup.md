# Flag In Flame — Log File Analysis and Encoded Image Recovery

**Category:** Digital Forensics | Log Analysis | Encoding **Tools Used:** `cat`, `base64`, Hex Decoder

---

## Objective

This analysis examines a large log file suspected of containing a concealed payload. The objective was to inspect the file's contents, identify the encoding scheme used, reconstruct any hidden artifacts, and extract the concealed data using standard forensic methodology.

---

## Methodology

### 1. Evidence Acquisition

The target file `log.txt` was retrieved and prepared for static analysis. Before any examination, the file was treated as read-only evidence to preserve its integrity.

---

### 2. Initial File Inspection

The first step was opening and reviewing the contents of `log.txt` to assess its structure and identify any anomalies.

```bash
cat log.txt
```

**Finding:** The file contained a large block of seemingly scrambled characters with no immediately readable content. This pattern is consistent with Base64-encoded data, where binary content is represented as a string of alphanumeric characters to facilitate storage or transmission.

The challenge hint confirmed this direction:

> _"Use Base64 to decode the data and generate the image file"_

Embedded encoding within log files is a known data concealment technique. Log files are frequently overlooked during routine inspections, making them an effective carrier for hidden payloads.

---

### 3. Base64 Decoding and File Reconstruction

Using the `base64` utility, the encoded contents of the log file were decoded and redirected into a new output file:

```bash
cat log.txt | base64 --decode > decoded.jpg
```

**Finding:** The decoding process successfully reconstructed a JPEG image file, `decoded.jpg`. This confirmed that the log file was being used as a container to conceal image data through Base64 encoding.

---

### 4. Image Analysis

The reconstructed image was opened for visual inspection.

**Finding:** The image depicted a person at a computer. Embedded visibly at the bottom of the image was the following string:

```
7069636F4354467B666F72656E736963735F616E616C797369735F69735F616D617A696E675F62393631303237397D
```

The character set — consisting exclusively of digits `0-9` and letters `A-F` — is characteristic of hexadecimal encoding. Hex encoding is commonly used to represent binary data or obscure readable strings in a format that bypasses casual detection.

---

### 5. Hexadecimal Decoding and Flag Recovery

The hex string was submitted to a hex decoder for analysis.

**Finding:** Decoding the hexadecimal string produced the following readable output:

```
picoCTF{forensics_analysis_is_amazing_b9ac4cb9}
```

The concealed flag was successfully recovered.

---

## Summary of Findings

|Step|Finding|
|---|---|
|Initial File Inspection|Log file contained Base64-encoded data disguised as scrambled characters|
|Base64 Decoding|Reconstructed a concealed JPEG image file from encoded log contents|
|Image Analysis|Discovered an embedded hex-encoded string at the bottom of the image|
|Hex Decoding|Recovered the hidden flag from the decoded string|

---

## Conclusion

This challenge demonstrated a two-stage data concealment technique: a JPEG image was Base64-encoded and stored within a log file, and a hex-encoded string was embedded visually within the image itself. Each layer required a distinct analytical method to uncover.

The use of log files as payload carriers is particularly relevant in real forensic investigations, as log data is often voluminous and deprioritized during initial triage. This challenge reinforces the importance of treating all file types as potential evidence containers and applying systematic encoding analysis regardless of the apparent file purpose.