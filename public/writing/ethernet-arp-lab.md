# Wireshark Lab: Ethernet & ARP Protocol Analysis

**Course:** CSCI 156 — Computer Networks
**Tools:** Wireshark, Windows Command Prompt (`arp -a`)
**Protocols Covered:** Ethernet II, ARP (Address Resolution Protocol), IPv4

---

## Overview

This lab explores how Ethernet frames are structured and how the Address Resolution Protocol (ARP) resolves IP addresses to MAC addresses at the data link layer. Using Wireshark packet captures, I analyzed the source and destination addressing of Ethernet frames during an HTTP exchange with `gaia.cs.umass.edu`, then examined the ARP request/reply cycle to understand how devices on a local network discover each other's hardware addresses.

---

## Part 1: Ethernet Frame Analysis

### HTTP GET Request Frame

**Q1. What is the 48-bit Ethernet address of your computer?**

The source MAC address of my machine, identified from the captured Ethernet frame, is:

```
00:d0:59:a9:3d:68
```

This address appears in the Source field of the Ethernet II header for all outbound frames originating from my host.

---

**Q2. What is the 48-bit destination address in the Ethernet frame? Is this the Ethernet address of `gaia.cs.umass.edu`?**

The destination MAC address in the outbound frame is:

```
00:06:25:da:af:73
```

This is **not** the MAC address of `gaia.cs.umass.edu`. It belongs to a Linksys router (`LinksysGroup_da:af:73`) — the default gateway on the local network. This is expected behavior: Ethernet frames are only delivered within a single Layer 2 network segment. Traffic destined for a remote host is addressed to the local gateway's MAC, which then forwards the IP datagram toward its destination.

---

**Q3. What is the hexadecimal value of the two-byte Frame Type field? What upper-layer protocol does this correspond to?**

```
Type: 0x0800 → IPv4
```

The EtherType field `0x0800` indicates the payload of this Ethernet frame is an IPv4 datagram, per the IEEE 802.3 standard.

---

**Q4. How many bytes from the start of the Ethernet frame does the ASCII "G" in "GET" appear?**

The "G" in the HTTP GET method begins at **byte offset 54** from the start of the Ethernet frame. This accounts for the 14-byte Ethernet header, the 20-byte IP header, and the 20-byte TCP header before the HTTP application data begins.

---

### HTTP Response Frame

**Q5. What is the Ethernet source address in the HTTP response? What device does it belong to?**

The source MAC address in the response frame is:

```
00:06:25:da:af:73  →  LinksysGroup_da:af:73 (local gateway/router)
```

Again, this is the MAC of the local router — not `gaia.cs.umass.edu` directly. The router forwards the incoming IP datagram from the remote server and re-frames it at Layer 2 for delivery to the local host.

---

**Q6. What is the destination address in the response frame? Is it your computer's address?**

```
00:d0:59:a9:3d:68
```

Yes — this matches the source MAC from Q1, confirming it is my machine's Ethernet address. The router correctly addresses the response to my host.

---

**Q7. What is the EtherType value in the response frame?**

```
Type: 0x0800 → IPv4
```

Consistent with the request direction — the payload is an IPv4 datagram carrying the TCP/HTTP response.

---

**Q8. How many bytes from the start of the Ethernet frame does the ASCII "O" in "OK" appear?**

The "O" in the HTTP status phrase "OK" begins at **byte offset 67**. This reflects the Ethernet, IP, and TCP headers preceding the HTTP response line.

---

## Part 2: ARP Cache & Protocol Analysis

### ARP Cache

**Q9. Contents of the ARP cache (`arp -a`) and meaning of each column:**

```
Interface: 192.168.0.39 --- 0x14

  Internet Address      Physical Address      Type
  192.168.0.1           94-a6-7e-7e-a3-c6    dynamic
  192.168.0.27          10-59-32-6a-de-0d    dynamic
  192.168.0.255         ff-ff-ff-ff-ff-ff    static
  224.0.0.2             01-00-5e-00-00-02    static
  224.0.0.22            01-00-5e-00-00-16    static
  224.0.0.251           01-00-5e-00-00-fb    static
  224.0.0.252           01-00-5e-00-00-fc    static
  239.255.255.250       01-00-5e-7f-ff-fa    static
  255.255.255.255       ff-ff-ff-ff-ff-ff    static
```

| Column | Meaning |
|---|---|
| **Internet Address** | The IPv4 address of the known host |
| **Physical Address** | The corresponding MAC address learned for that IP |
| **Type: dynamic** | Entry was learned automatically via ARP and will expire |
| **Type: static** | Entry was added by the OS (e.g., multicast/broadcast mappings) and persists |

Dynamic entries such as `192.168.0.1` (the default gateway) are populated when the host sends an ARP request and receives a reply. Static entries for addresses like `224.0.0.x` are reserved multicast mappings defined by IANA.

---

### ARP Request

**Q10. Source and destination addresses in the ARP request frame:**

| Field | Value |
|---|---|
| Source MAC | `00:d0:59:a9:3d:68` (my machine) |
| Destination MAC | `ff:ff:ff:ff:ff:ff` (Ethernet broadcast) |

ARP requests are always broadcast to all devices on the local segment because the sender does not yet know which device holds the target IP address.

---

**Q11. EtherType value for the ARP frame:**

```
Type: 0x0806 → ARP
```

EtherType `0x0806` signals that the Ethernet payload carries an ARP message rather than an IP datagram.

---

**Q12. ARP Opcode and Payload Fields:**

**a) Byte offset to the ARP opcode field:**
The ARP opcode begins at **byte 20** from the start of the Ethernet frame (after the 14-byte Ethernet header and 6 bytes into the ARP payload).

**b) Opcode value in the ARP request:**
```
Opcode: 0x0001  →  ARP Request
```

**c) Does the ARP request contain the sender's IP address?**
Yes. The ARP payload includes the sender's MAC (`00:d0:59:a9:3d:68`) and IP address (`192.168.1.105`), which allows the target host to reply directly without issuing its own ARP lookup.

**d) Where does the "question" appear in the ARP request?**
The query is represented by the **Target MAC Address** field, which is set to all zeros (`00:00:00:00:00:00`). This indicates the sender does not yet know the target's hardware address — it is what is being asked for.

---

### ARP Reply

**Q13. ARP Reply Analysis:**

**a) Byte offset to the ARP opcode field:**
Same as the request: **byte 20** from the start of the Ethernet frame. The ARP packet structure is identical in both directions.

**b) Opcode value in the ARP reply:**
```
Opcode: 0x0002  →  ARP Reply
```

**c) Where does the "answer" appear in the ARP reply?**
The reply's **Sender MAC Address** field contains the hardware address that was being requested. The responding device places its own MAC there, and the originating host can then cache this IP-to-MAC mapping.

---

**Q14. Source and destination addresses in the ARP reply frame:**

| Field | Value |
|---|---|
| Source MAC | `00:06:25:da:af:73` (the router/gateway) |
| Destination MAC | `00:d0:59:a9:3d:68` (my machine) |

Unlike the broadcast request, the ARP reply is **unicast** — sent directly back to the requester since the gateway now knows the originator's MAC from the request payload.

---

**Q15. Why is there no ARP reply visible for the ARP request in packet 6?**

Packet 6 is a broadcast ARP request originating from a **different host** (`CnetTechnolo_73:8d`) asking "Who has 192.168.1.117?" The reply to that request would have been a unicast frame sent directly to that host. Because Wireshark was capturing from my machine's interface, that unicast reply was addressed to another device and not forwarded to my host — so it does not appear in this capture.

---

## Key Takeaways

- Ethernet frames use MAC addresses for local delivery. Traffic destined for remote hosts is always sent to the **default gateway's MAC**, not the remote server's MAC.
- The **EtherType field** (`0x0800` for IPv4, `0x0806` for ARP) tells the receiving NIC which upper-layer protocol to hand the payload to.
- ARP requests are **broadcast**; ARP replies are **unicast**. A device only sees ARP replies addressed to itself.
- The ARP cache stores dynamic and static IP-to-MAC mappings. Dynamic entries are learned at runtime and time out; static entries are OS-managed.
