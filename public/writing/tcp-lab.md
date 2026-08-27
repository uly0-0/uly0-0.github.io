# Wireshark Lab: TCP Protocol Analysis

**Course:** CSCI 156 — Computer Networks
**Tools:** Wireshark, Firefox/Chrome browser
**Protocols Covered:** TCP, HTTP, IPv4
**Target Server:** `gaia.cs.umass.edu` (128.119.245.12)

---

## Overview

This lab examines the Transmission Control Protocol (TCP) through a Wireshark capture of a file upload (HTTP POST) from a client to `gaia.cs.umass.edu`. The analysis covers the three-way handshake that establishes the connection, sequence and acknowledgment numbering, segment sizing, receiver buffer (window) management, retransmission detection, and TCP's congestion control behavior. TCP is foundational to reliable data delivery on the internet, and this lab grounds those concepts in observed packet-level behavior.

---

## Section 1: Connection Identification

**Q1. What is the IP address and TCP port of the client transferring the file?**

```
Client IP:   129.8.231.131
Source Port: 49619
```

These values are visible in the TCP header of the HTTP POST segment. The source port (49619) is an ephemeral port assigned by the OS for this connection.

---

**Q2. What is the IP address and port of `gaia.cs.umass.edu`?**

```
Server IP:        128.119.245.12
Destination Port: 80 (HTTP)
```

Port 80 is the standard well-known port for HTTP. The server receives segments on this port and responds from it throughout the connection.

---

**Q3. Confirm the client IP and port used to transfer the file.**

The values are identical to Q1:

```
Client IP:   129.8.231.131
Port:        49619
```

Both the initial SYN and the HTTP POST originate from this same source address/port pair, confirming a single persistent TCP connection was used for the file transfer.

---

## Section 2: TCP Three-Way Handshake

**Q4. What is the sequence number of the TCP SYN segment? What identifies it as a SYN?**

```
Sequence Number (relative): 0
Flags:                       0x002 (SYN)
```

The segment is identified as a SYN by the **SYN flag being set to 1** in the TCP Flags field. The relative sequence number is 0 (raw value: 2723118601), which is the client's Initial Sequence Number (ISN) — randomly chosen by the OS to mitigate session hijacking.

---

**Q5. What is the sequence number of the SYNACK? What is the acknowledgment value? How was that value determined? What identifies it as a SYNACK?**

```
Sequence Number (relative):     0  (server's ISN)
Acknowledgment Number:          1
Flags:                          0x012 (SYN + ACK)
```

- The **Acknowledgment Number of 1** is calculated as the client's ISN + 1 (`2723118601 + 1`). TCP acknowledges the SYN itself as consuming one sequence number, so the server signals readiness to receive byte 1 from the client.
- The segment is identified as a **SYNACK** because both the **SYN** and **ACK** flags are set simultaneously in the Flags field.

---

## Section 3: Data Transfer

**Q6. What is the sequence number of the TCP segment containing the HTTP POST?**

```
Sequence Number (relative): 1
```

The HTTP POST is carried in the segment immediately after the three-way handshake completes, beginning at sequence number 1 — the first byte of application data on this connection.

---

**Q7. Sequence numbers of the first six segments (POST onward):**

| Segment | Seq. Number (relative) |
|---|---|
| 1 (HTTP POST) | 1 |
| 2 | 1383 |
| 3 | 2765 |
| 4 | 4147 |
| 5 | 5529 |
| 6 | 6911 |

Each sequence number advances by 1382, which equals the payload length of each segment. Sequence numbers in TCP track bytes, not segment count — the next segment's sequence number is the current one plus the number of data bytes sent.

---

**Q8. What is the length of each of the first six segments?**

Each of the first six segments carries **1382 bytes** of payload. This is consistent with a Maximum Segment Size (MSS) negotiated during the handshake, slightly below the 1460-byte MSS limit imposed by the 1500-byte Ethernet MTU (accounting for the 20-byte IP and 20-byte TCP headers).

---

## Section 4: Flow Control & Receiver Buffer

**Q9. What is the minimum receiver buffer space advertised? Does it ever throttle the sender?**

The **initial receive window** advertised by the server in the first ACK is:

```
Window Size: 29,200 bytes
```

As the transfer progressed, the receiver's window scaled up to **261,312 bytes**, indicating the TCP receive buffer grew dynamically. The sender was **never throttled** by the receiver window throughout the captured trace — the window remained large enough that the sender could always place new data in-flight without waiting.

---

**Q10. Are there any retransmitted segments in the trace? How did you check?**

The trace was inspected for retransmissions by looking for segments whose sequence numbers had already appeared in earlier packets (i.e., duplicate sequence numbers without corresponding out-of-order delivery context). No retransmitted segments were identified in this capture, suggesting the network path was reliable and no packet loss occurred during the file transfer.

---

**Q11. How much data does the receiver typically acknowledge per ACK? Is delayed ACK observable?**

The receiver typically acknowledges **1382 bytes per ACK** — one full segment's worth of data. Delayed ACK behavior (where the receiver waits to ACK every other segment) is observable in several places: the server sends a cumulative ACK covering two segments' worth of data, consistent with the RFC 1122 delayed ACK optimization. This reduces the number of ACK packets on the network at the cost of a brief acknowledgment delay.

---

**Q12. What is the throughput of the TCP connection?**

Throughput is calculated as total data transferred divided by total transfer time, derived from the packet timestamps and sequence numbers in the trace:

```
Total data transferred ≈ 152,138 bytes (from sequence numbers)
Transfer duration       ≈ observed from first POST to final ACK
```

The exact throughput varies by trace, but the consistent 1382-byte segments and absence of retransmissions indicate the connection operated efficiently near the available bandwidth for the duration of the transfer.

---

## Section 5: TCP Congestion Control

**Q13. Using the Time-Sequence Graph — where does slow start begin and end?**

From the Stevens time-sequence graph:

- **Slow Start** begins at the connection establishment (t ≈ 0) and is visible as an **exponential increase** in the number of segments in-flight — the congestion window (cwnd) doubles each RTT.
- Slow Start transitions to **Congestion Avoidance** when cwnd reaches the slow-start threshold (ssthresh), after which the window grows linearly (one MSS per RTT).

Compared to the idealized textbook model, the measured data shows more irregular growth due to real-world factors: ACK pacing by the receiver, OS-level send buffer constraints, and the fact that the file transfer completes before cwnd has grown significantly — meaning the connection may never leave slow start before all data is sent.

---

**Q14. Observations from the personal trace (file upload from local machine):**

The personal capture exhibits the same fundamental TCP behavior:

- A clean **SYN → SYNACK → ACK** three-way handshake before any data flows.
- Sequence numbers advancing by one MSS per segment, consistent with full-sized segments.
- ACKs returning from the server confirming receipt, with the window field remaining well above the amount of in-flight data.
- No evidence of congestion events (no cwnd reduction, no duplicate ACKs triggering fast retransmit).

The primary difference from the provided trace is the slightly different RTT profile reflecting the actual network path from my location to the server.

---

## Key Takeaways

- TCP's **three-way handshake** (SYN / SYNACK / ACK) synchronizes sequence numbers before any data flows, ensuring both sides agree on initial state.
- **Sequence numbers track bytes**, not packets. Each segment's sequence number equals the previous one plus the payload byte count.
- The **receive window** advertised in ACKs implements flow control, preventing a fast sender from overwhelming a slow receiver. In this trace, the window grew dynamically and never constrained throughput.
- **Delayed ACK** reduces ACK overhead by allowing a receiver to acknowledge multiple segments with a single cumulative ACK.
- **TCP slow start** exponentially increases the congestion window per RTT until the threshold is reached, then switches to linear growth during congestion avoidance — balancing rapid ramp-up with network stability.
