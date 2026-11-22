# Content audit — Mareas Asesores: qué hemos hecho

Source: the seven Markdown documents at the root of `C:\Users\Hugo\UD1-gestoria` (`README.md`, `diagnostico.md`,
`propuesta.md`, `decisiones.md`, `verificacion.md`, `responsables.md`, `aprendizaje.md`). They are copied verbatim
into `reference/` for provenance. There were no source slides, no script and no design reference.
Design reference: **neutral theme** (near-black, off-white type, hairlines, one accent), with the accent changed
to ink blue/teal to sit alongside the project landing page. The source decides *what* is said; the neutral theme
decides *how* it looks and moves.

Rule applied: the presentation is support for what is said out loud to the boss, who does not use technical
language. Technical names (VLAN, LUKS, Samba, GRUB, FTP, SeaBIOS…) stay in `note`/`source` of the beats, never on
stage unless the briefing explicitly required them (Secure Boot, 9.6 → 6.0). No figure, URL, quote or logo has
been invented.

## Facts (never guess)

| Fact | Value | Source |
| --- | --- | --- |
| Project title | Proyecto UD1: La maldición de la gestoría | `README.md` |
| Client / organisation | Mareas Asesores (gestoría) | `README.md`, `propuesta.md`, `verificacion.md` |
| Deck title used on stage | «Mareas Asesores: qué hemos hecho» | proposed by the briefing; accepted as is |
| Speaker / author | `Grupo 1` | confirmed by the user |
| Audience | the person in charge of the gestoría | briefing (not in the source docs) |
| Team | Alejandro, Raúl, Luis y Hugo | `README.md`, `responsables.md` |
| Stolen laptop | September; unknown whether data were read | `propuesta.md` §Medida «Cifrado de disco (LUKS)…» |
| Original exposure | anyone reaching port 445 could enter the `[clientes]` share without a password | `diagnostico.md` Bloque 2 |
| Original client phone | received an IP on the office network and could reach the server | `diagnostico.md` Bloque 4, `propuesta.md` §1.1 |
| Restrictions | keep working the same way, buy no hardware, do not change the tax advisor's program | `propuesta.md` §1.2, `aprendizaje.md` «Riesgos aceptados por el cliente», briefing |
| Three networks | servers (VLAN 10), staff (VLAN 20), clients/wifi (VLAN 30) | `propuesta.md` §§1.2, 1.3, 1.4 |
| Staff access | only web (80) and shared folder (445) to the server | `propuesta.md` §1.4, `decisiones.md` §6.3, `verificacion.md` §6.4 |
| External advisor | FTP kept, restricted to source `192.168.122.50` | `decisiones.md` D-H1, §6.4, `verificacion.md` §4.1, §6.5 |
| Encryption | LUKS on laptop disk and on server data partition | `decisiones.md` §§1.1–1.2, `verificacion.md` §§1.1–1.2 |
| Boot password | required only to edit boot / use console / unusual entries; normal boot stays free | `decisiones.md` D-L7, `verificacion.md` §§3.1.3–3.1.4 |
| Exposure score | **9.6 UNSAFE → 6.0 MEDIUM** for `smbd` | `decisiones.md` D-L3, `verificacion.md` §2.1.3 |
| Pending measure | «Inventariar, reducir y acotar los servicios del servidor» is *Pendiente* | `responsables.md`, `verificacion.md` §7 |
| Residual risks | plain-text FTP, USB allowed, no BIOS password or Secure Boot in the lab (SeaBIOS), stolen-but-on laptop with an open session | `aprendizaje.md` «Riesgos que quedan abiertos», `decisiones.md` D-L5, D-L6, D-L8 |
| Server encrypted volume | final mount is documented as **temporary**; after a reboot it must be unlocked and mounted again | `verificacion.md` §1.1 «Nota final» |
| Event · city · date | not supplied (not needed on stage) | — |

## Source → beat mapping

| Source (document / section) | What the source says (verbatim where it matters) | Beat(s) | Status | Notes |
| --- | --- | --- | --- | --- |
| `README.md` — whole file | Team and objective: «documentar el diagnóstico, las medidas de seguridad, su implantación y verificación» | 1.2 (author only) | merged | The project name and the GitHub placeholder are not shown; no QR is used. |
| `diagnostico.md` Bloque 2 | «Samba comparte `[clientes]` … con `guest ok = Yes` y `read only = No`» | 1.4 | kept (plain language) | «Cualquiera en la red podía ver los documentos de los clientes». Ports, users and disk names cut from stage; kept in beat notes. |
| `diagnostico.md` Bloque 3 | Laura uses the laptop; laptop disk not encrypted | 6.1, 7.1 | kept | Name Laura kept because the briefing requires it. |
| `diagnostico.md` Bloque 4 | «**Servidor:** Si» from the client phone; advisor at `192.168.122.50`, outside the LAN | 2.2, 5.1 | kept | Shown as «el móvil del cliente llegaba al servidor». |
| `propuesta.md` §1.2 | Three VLANs; FTP stays so the advisor's workflow does not change; only its known IP is allowed | 4.1, 5.1 | kept | VLAN numbers moved to notes. |
| `propuesta.md` §1.3–1.4 | Three address ranges; clients only to Internet; staff only 445 and 80 | 4.1, 4.2, 5.2, 5.3 | kept | IP ranges omitted on stage: the audience does not need them. |
| `propuesta.md` §2 «Medida: Cifrado de disco (LUKS)…» | «En septiembre se robó un portátil y se desconoce si leyeron los datos» | 1.3, 6.1, 6.2 | kept | The theft is the opening; the reason for encryption is the closing line of 7.4. |
| `propuesta.md` §3 «LAS 4 MOLESTIAS» | «Autenticación personal en Samba», «Protección del arranque en BIOS/UEFI», «Cifrado de disco (LUKS)», «Despliegue de VLANs» | 5.1–5.3, 6.3, 7.1–7.4 | merged | Grouped as «three rules» + «three small inconveniences». |
| `propuesta.md` §4 «DOS DESCARTES» | SFTP rejected (would change the advisor's programs); USB blocking rejected (clients may bring documents) | 9.2, 9.3 | kept | «Cambiarlo rompería el trabajo de la asesoría» is a plain-language restatement, not a new claim. |
| `decisiones.md` §§1.1–1.2 | LUKS on the server's second disk and on Laura's laptop; recovery key; two independent passwords | 6.1, 6.2, 7.1 | kept | Recovery key and password custody moved to notes (too detailed for the room). |
| `decisiones.md` D-L1–D-L4, §2 | Kernel parameters, Apport, Samba confinement, `ReadWritePaths` | 8.5 | cut (condensed) | Only the before/after score (9.6 → 6.0) reaches the stage; the rest is in notes. |
| `decisiones.md` D-L5–D-L8, §3 | Admin password on real machines; no power-on password; GRUB only for editing; lab limits | 6.3, 7.3, 8.4, 9.4, 9.5 | kept (plain language) | SeaBIOS and recovery-mode details are in notes; Secure Boot stays on stage because the briefing asked for it. |
| `decisiones.md` §§4–6, D-H1, D-H2 | FTP restricted by source IP; becario account removed; interface renumbering, VLSM, ICMP blocked, static IP via NetworkManager | 5.1, 9.1 | kept / cut | Becario removal, VLSM, interface names and NetworkManager are implementation detail: cut from stage, kept in `note`. |
| `verificacion.md` §§1.1–1.2 | Encrypted volumes built and checked; **mount is temporary** | 6.1, 6.2, 9.1 | kept + question | The temporary mount is an open question in §Open questions; the deck does not claim automatic unlocking. |
| `verificacion.md` §2 | 8 parameters fixed, Apport disabled, Samba confined, score 9.6 UNSAFE → 6.0 MEDIUM, folder still works | 8.3, 8.5 | kept | «La carpeta sigue funcionando» and the two numbers. |
| `verificacion.md` §3 | GRUB asks on edit, normal boot asks for nothing, lab boots only from disk | 6.3, 8.4, 9.4 | kept | ISO test not possible (no ISO in the lab) → note only. |
| `verificacion.md` §4, §6.5 | Advisor connects from the known IP; another IP (`192.168.122.99`) is refused; passive FTP works | 8.2 | kept | «La asesoría entra; otra dirección, no». |
| `verificacion.md` §5 | `becario` account gone; `visudo -c` still pending | 9.1 | cut | Implementation detail; recorded in notes and open questions. |
| `verificacion.md` §6.1–6.4 | VLAN separation verified; client phone cannot reach server or staff; staff web and folder work | 8.1, 8.3 | kept | Ping/timeout evidence is in notes. |
| `verificacion.md` §7 | «Estado: Pendiente de ejecutar y verificar en GNS3» for reducing services | 9.1 | kept | Shown as pending, not as done. |
| `responsables.md` | Table of who implements and who verifies; only «Inventariar, reducir y acotar…» is *Pendiente* | 9.1 | kept | Names not shown on stage; the team is credited in the audit only. |
| `aprendizaje.md` «Riesgos que quedan abiertos», «Riesgos aceptados por el cliente» | Plain-text FTP, USB, BIOS/Secure Boot lab limit, open session, no new hardware, existing programs | 9.2–9.5, 3.1–3.3 | kept | «A falta de confirmación por escrito del cliente» is captured as an open question. |

Status: **kept** (carried as-is, simplified in wording) · **restored** (brought back from detail) · **merged**
(grouped with another source item) · **cut** (deliberately not on stage, reason given) · **new** (nothing is new).

## Real artefacts

| Artefact | File | Used in | Rights / credit |
| --- | --- | --- | --- |
| Project hero image | `C:\Users\Hugo\UD1-gestoria\public\images\marea-hero.jpg` (exists) | **not used** | Decision: this author cannot inspect the image visually, so its content, crop and legibility cannot be guaranteed. The deck uses locally drawn diagrams instead; no remote asset is fetched. |
| Network diagrams from the docs (`Images/cambio red.jpg`, screenshots) | root `Images/` folder | **not used** | Screenshots are console captures full of technical text; they would work against «poco texto» and are not legible from the back of the room. The relationships are redrawn as three simple NodeBox/Arrow diagrams. |

## Open questions

- [ ] The encrypted server volume is currently mounted temporarily (`verificacion.md` §1.1). Who unlocks and mounts it after a full restart in the real office? The deck does **not** claim this is automatic.
- [ ] «Hasta recibir una decisión expresa del cliente» (`aprendizaje.md`): confirm in writing which residual risks (FTP without encryption, USB, no new hardware) are accepted.
- [ ] `sudo visudo -c` remains to be run (`verificacion.md` §5); not shown to the boss.
- [ ] The real machine still needs the BIOS/UEFI admin password, USB/PXE boot disabled, Secure Boot and the ISO test — impossible in the SeaBIOS lab (`decisiones.md` D-L5/D-L6, `verificacion.md` §3.1.5).
- [ ] Speaker has not confirmed the title wording (the author credit «Grupo 1» is confirmed).

## Decisions taken on the speaker's behalf

- **Author** set to «Grupo 1», confirmed by the user.
- **Title** kept as proposed: «Mareas Asesores: qué hemos hecho». It is the most natural plain-language form of the briefing's proposal.
- **Art direction:** neutral theme kept; only `--accent` / `--accent-strong` changed to ink blue/teal (`themes/mareas.css`) so it dialogues with the landing page. No new visual language, no gradients, no stickers.
- **Hero image omitted:** it exists but could not be inspected by this author; an unverified image is worse than a clean diagram for this audience. Recorded above under Real artefacts.
- **Language:** technical names moved from the stage into presenter notes. Exceptions requested by the briefing: «Secure Boot» and the score «9.6 → 6.0».
- **Structure:** ten requested content points compressed into nine scenes; one idea per beat; 32 beats. No QR and no link placeholder: the last beat is the open question to the boss.
- **No exact terminal text on stage**, therefore no `data-exact` elements and no `Terminal` lines; `verify --source` is still run against a verbatim concatenation of the seven documents (`reference/fuentes-unidas.md`).
