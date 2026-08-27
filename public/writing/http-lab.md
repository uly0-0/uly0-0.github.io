# Wireshark Lab: HTTP Protocol Analysis

**Course:** CSCI 156 — Computer Networks
**Tools:** Wireshark, Firefox/Chrome browser
**Protocols Covered:** HTTP/1.1, TCP, IPv4
**Target Server:** `gaia.cs.umass.edu` (128.119.245.12)

---

## Overview

This lab investigates the Hypertext Transfer Protocol (HTTP) using live Wireshark captures across five scenarios: a basic GET/response cycle, conditional GET caching behavior, retrieval of a large multi-segment document, a page with embedded objects requiring parallel connections, and HTTP Basic Authentication. The goal was to understand how HTTP operates at the packet level — how requests are structured, how caching headers work, how TCP segments large responses, and how credentials are transmitted.

---

## Section 1: Basic HTTP GET / Response

**Q1. What HTTP version is the browser running? What version is the server running?**

Both the client and server communicate using **HTTP/1.1**, as indicated by the request line `GET /wireshark-labs/HTTP-wireshark-file1.html HTTP/1.1` and the server's response line `HTTP/1.1 200 OK`.

---

**Q2. What languages does the browser indicate it can accept?**

The browser sends the following `Accept-Language` header in the GET request:

```
Accept-Language: en-US, en; q=0.5
```

This indicates a preference for US English, with generic English as a fallback (quality factor 0.5).

---

**Q3. What are the IP addresses of the client and server?**

| Host | IP Address |
|---|---|
| Client (my machine) | `129.8.231.207` |
| Server (`gaia.cs.umass.edu`) | `128.119.245.12` |

These values are visible in the IP source/destination fields of the captured GET request at packet 2422.

---

**Q4. What status code did the server return?**

```
HTTP/1.1 200 OK
```

Status code **200** indicates the request was successful and the server returned the requested resource.

---

**Q5. When was the HTML file last modified on the server?**

```
Last-Modified: Tue, 01 Oct 2024 05:59:01 GMT
```

The server dynamically sets this timestamp to approximately the current time once per minute, which is why it appears recently modified on each download.

---

**Q6. How many bytes of content were returned?**

```
Content-Length: 128
```

The server returned **128 bytes** of HTML content in the response body.

---

**Q7. Are there any headers in the raw packet data not shown in the parsed packet view?**

After inspecting the raw hex dump in the packet content window, no additional headers were found that were absent from the parsed display. The structured view and the raw bytes correspond to the same set of fields.

---

## Section 2: HTTP Conditional GET

This section examines how browsers use the `If-Modified-Since` header to avoid re-downloading unchanged resources.

**Q8. Does the first GET request contain an `If-Modified-Since` header?**

No. The first request to `HTTP-wireshark-file2.html` contains no `If-Modified-Since` header. This is expected — the browser has no cached copy yet and therefore cannot supply a conditional timestamp.

---

**Q9. Did the server explicitly return the file contents in the first response?**

Yes. The server responded with **HTTP/1.1 200 OK** and included the full HTML in the response body, visible in the "Line-based text data" section of the packet. The content confirms the file was delivered in full.

---

**Q10. Does the second GET request contain an `If-Modified-Since` header? What does it say?**

Yes. Having cached the resource from the first request, the browser includes:

```
If-Modified-Since: Sun, 06 Oct 2024 05:59:01 GMT
```

This tells the server to return the file only if it has been modified after that timestamp.

---

**Q11. What status code did the server return for the second GET? Was the file returned?**

```
HTTP/1.1 304 Not Modified
```

The server returned **304**, indicating the cached version is still current. No response body was sent — the browser uses its local cached copy, saving bandwidth and reducing latency.

---

## Section 3: Retrieving a Long Document

This section examines how HTTP handles responses too large to fit within a single TCP segment.

**Q12. How many HTTP GET requests did the browser send? Which packet contains the GET for the Bill of Rights?**

The browser sent **one HTTP GET request** for `HTTP-wireshark-file3.html`. The GET message is the first packet in the captured HTTP exchange group.

---

**Q13. Which packet contains the status code and response phrase?**

The **6th packet** in the sequence contains the `HTTP/1.1 200 OK` status line, following the initial TCP handshake and GET request.

---

**Q14. What is the status code and phrase?**

```
HTTP/1.1 200 OK
```

The server successfully located and returned the Bill of Rights document.

---

**Q15. How many TCP segments were needed to carry the HTTP response?**

**9 TCP segments** were required to carry the full response. Because the HTML document (~4,500 bytes) exceeds the Maximum Segment Size (MSS) of a single TCP segment, TCP fragmented the HTTP response body across multiple segments, each labeled "TCP segment of a reassembled PDU" in Wireshark. This is a TCP-layer function — HTTP itself has no awareness of the segmentation.

---

## Section 4: HTML Documents with Embedded Objects

**Q16. How many HTTP GET requests were sent, and to which addresses?**

The browser sent **3 HTTP GET requests**:

| Request | Destination |
|---|---|
| Base HTML page | `gaia.cs.umass.edu` (128.119.245.12) |
| Pearson logo image | `gaia.cs.umass.edu` (128.119.245.12) |
| Book cover image | `kurose.cslash.net` (178.79.137.164) |

The embedded `<img>` tags in the HTML caused the browser to issue additional GETs to retrieve the referenced images.

---

**Q17. Were the two images downloaded serially or in parallel?**

The behavior was mixed:

- The **Pearson logo** (`pearson.png`) was downloaded **in parallel** with the base page because it resides on the same server (`gaia.cs.umass.edu`). The browser pipelined or reused the existing TCP connection.
- The **book cover image** (`BE_cover_small.jpg`) was downloaded **serially** — it required opening a new TCP connection to an external server (`kurose.cslash.net`), which introduced additional latency. The GET for it appears after the first two requests complete.

This illustrates why modern browsers open multiple parallel TCP connections and why CDNs co-locate assets to reduce sequential round-trips.

---

## Section 5: HTTP Authentication

**Q18. What was the server's response to the initial GET request?**

```
HTTP/1.1 401 Unauthorized
```

The server rejected the unauthenticated request and prompted the client to supply credentials via the `WWW-Authenticate: Basic` challenge header.

---

**Q19. What new field was included in the second GET request?**

The browser included an `Authorization` header carrying Base64-encoded credentials:

```
Authorization: Basic d2lyZXNoYXJrLXN0dWRlbnRzOm5ldHdvcms=
```

Decoding this Base64 string reveals the plaintext credentials (`wireshark-students:network`). This demonstrates a critical weakness of HTTP Basic Authentication: **credentials are only encoded, not encrypted**. Without TLS (HTTPS), they are fully visible to any party capturing the traffic on the network path.

---

## Key Takeaways

- HTTP/1.1 uses persistent connections and supports conditional caching via `If-Modified-Since` / `304 Not Modified` to reduce unnecessary data transfer.
- Large HTTP responses are transparently segmented by TCP; the HTTP layer sees a single response regardless of how many segments it spans.
- Pages with embedded resources trigger multiple GET requests, potentially to multiple servers. Parallel connections and CDN placement significantly impact page load performance.
- HTTP Basic Authentication transmits credentials in Base64 encoding — not encryption. TLS is required to protect credentials in transit.
