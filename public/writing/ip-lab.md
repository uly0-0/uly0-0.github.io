# Wireshark Lab: IP Protocol & Fragmentation Analysis

**Course:** CSCI 156 — Computer Networks
**Tools:** Wireshark, PingPlotter (Windows traceroute), provided trace file `ip-ethereal-trace-1`
**Protocols Covered:** IPv4, ICMP
**Target:** `gaia.cs.umass.edu` (128.59.23.100)

---

## Overview

This lab investigates the IPv4 protocol by analyzing packet captures generated through `traceroute` (PingPlotter on Windows). By sending ICMP Echo Requests with progressively increasing TTL values toward a remote destination, I examined the structure of the IP datagram header, identified which fields remain constant versus which change across a series of packets, and studied IP fragmentation — the process by which a router or sending host breaks an oversized datagram into smaller pieces to fit within a link's Maximum Transmission Unit (MTU).

> **Note:** The provided `ip-ethereal-trace-1` trace file was used for this lab.

---

## Section 1: IP Datagram Header Analysis

**Q1. What is the IP address of the source computer?**

```
Source: 192.168.1.102
```

This address is visible in the Internet Protocol section of the first captured ICMP Echo Request.

---

**Q2. What is the value in the upper-layer protocol field of the IP header?**

```
Protocol: ICMP (1)
```

The Protocol field value of `1` identifies the payload as an ICMP message. This field tells the receiving host which transport/network-layer protocol should process the datagram's payload.

---

**Q3. How many bytes are in the IP header? How many bytes are in the payload?**

```
Header Length:  20 bytes
Total Length:   84 bytes
Payload:        84 - 20 = 64 bytes
```

The IP header length is indicated by the IHL (Internet Header Length) field, which shows 5 × 4 = 20 bytes. The payload size is derived by subtracting the header length from the Total Length field.

---

**Q4. Has this IP datagram been fragmented?**

No. The datagram has **not been fragmented**. This is determined by examining the Flags field:

- **More Fragments (MF) bit:** Not set
- **Fragment Offset:** 0

When both of these conditions hold, the datagram is either unfragmented or the final (only) fragment. Since this is a small ICMP ping with no preceding fragments, it is confirmed unfragmented.

---

## Section 2: Changing Fields Across ICMP Messages

**Q5. Which IP header fields change from one datagram to the next in the ICMP series?**

Three fields vary across successive ICMP Echo Requests sent by the source:

| Field | Reason It Changes |
|---|---|
| **Identification** | Each new datagram is assigned a unique ID by the OS |
| **Time to Live (TTL)** | traceroute increments TTL by 1 for each new probe |
| **Header Checksum** | Recomputed whenever any header field changes |

---

**Q6. Which fields stay constant? Which must stay constant, and which must change?**

**Constant fields:**

| Field | Why It Must Stay Constant |
|---|---|
| **Source Address** | Identifies the originating host throughout the exchange |
| **Destination Address** | The target does not change between probes |
| **Header Length** | No IP options are used; header size is fixed at 20 bytes |
| **Protocol** | Always ICMP for this traceroute series |

**Must change:**
- **TTL** — deliberately incremented by traceroute to elicit ICMP TTL-exceeded messages from successive hops.
- **Header Checksum** — must be recomputed any time the TTL or Identification field changes, as it covers the full header.
- **Identification** — each independently originated datagram is assigned a new ID.

---

**Q7. Describe the pattern in the Identification field values.**

The Identification field **increments by 1** with each successive datagram sent by the source host. For example, consecutive packets show values like `0x32d1` (13009) followed by `0x32d2` (13010). This monotonically increasing counter is typical behavior for Windows IP stacks and allows reassembly of fragmented datagrams to associate fragments with the correct original datagram.

---

## Section 3: ICMP TTL-Exceeded Replies (First-Hop Router)

**Q8. What are the Identification and TTL values in the TTL-exceeded reply from the first-hop router?**

From the captured ICMP TTL-exceeded response:

```
Identification:  0xa60b
TTL:             244
```

---

**Q9. Do these values remain unchanged across all TTL-exceeded replies from the first-hop router?**

- **TTL (244):** Remains **constant** across all replies from the same router. The router consistently starts its outbound packets with a TTL of 244, reflecting the fixed number of hops from that router back to the source host.
- **Identification:** **Changes** with each reply, as each TTL-exceeded message is an independently generated datagram from the router with its own unique ID.

---

## Section 4: IP Fragmentation (2000-byte Packet)

When the packet size in PingPlotter was set to 2000 bytes, the IP datagram exceeded the Ethernet MTU of 1500 bytes and was fragmented.

**Q10. Was the 2000-byte ICMP Echo Request fragmented?**

Yes. The datagram was **split into 2 fragments** to comply with the 1500-byte Ethernet MTU.

---

**Q11. First fragment — what indicates fragmentation? How long is it?**

The first fragment is identified by the following IP header fields:

```
Flags:           0x1 (More Fragments = SET)
Fragment Offset: 0
Total Length:    1500 bytes (1480 bytes payload + 20 bytes IP header)
```

- **More Fragments = 1** signals that additional fragments follow.
- **Fragment Offset = 0** confirms this is the **first** fragment.
- The datagram is **1500 bytes** long — the maximum permitted by the Ethernet MTU.

---

**Q12. Second fragment — what indicates it is not the first? Are there more fragments?**

```
Flags:           0x0 (More Fragments = NOT SET)
Fragment Offset: 1480
Total Length:    548 bytes
```

- **Fragment Offset = 1480** indicates this fragment carries data beginning at byte 1480 of the original payload, confirming it is not the first fragment.
- **More Fragments = 0** signals this is the **final fragment** — no additional pieces follow.

---

**Q13. What fields change between the first and second fragment?**

| Field | First Fragment | Second Fragment |
|---|---|---|
| Total Length | 1500 bytes | 548 bytes |
| Flags (MF bit) | Set (1) | Not set (0) |
| Fragment Offset | 0 | 1480 |

The Identification field remains the **same** in both fragments, which is how the receiving host associates them for reassembly.

---

## Section 5: IP Fragmentation (3500-byte Packet)

**Q14. How many fragments were created from the 3500-byte datagram?**

The 3500-byte datagram was split into **3 fragments**:

| Fragment | Data Range | Total Length |
|---|---|---|
| 1 | 0 – 1479 | 1500 bytes |
| 2 | 1480 – 2959 | 1500 bytes |
| 3 | 2960 – 3499 | 560 bytes |

---

**Q15. What fields change across the three fragments?**

The same fields change as with the 2000-byte case:

| Field | Behavior |
|---|---|
| **Total Length** | Varies — 1500 / 1500 / 560 bytes |
| **More Fragments flag** | Set on fragments 1 and 2; cleared on fragment 3 |
| **Fragment Offset** | 0 / 1480 / 2960 — increments by 1480 per fragment |
| **Header Checksum** | Recomputed for each fragment since header fields differ |

The **Identification**, **Source**, **Destination**, and **Protocol** fields remain identical across all fragments to enable correct reassembly at the destination.

---

## Key Takeaways

- The IPv4 header is typically **20 bytes**. The TTL, Identification, and Header Checksum fields change between datagrams; Source, Destination, and Protocol remain constant for a given flow.
- **traceroute** works by exploiting TTL expiration: each hop decrements TTL by 1 and returns an ICMP TTL-exceeded message when it reaches zero, revealing the hop's identity to the sender.
- **IP fragmentation** occurs when a datagram exceeds the MTU of the outgoing link. The More Fragments flag and Fragment Offset field allow the destination to correctly reassemble fragments. The shared Identification field ties fragments together.
- Ethernet's MTU of **1500 bytes** is the most common fragmentation boundary. Fragmentation adds overhead and is generally avoided in modern networks through **Path MTU Discovery (PMTUD)**.
