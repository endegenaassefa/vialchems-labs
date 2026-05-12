---
vendor: ALL ANCHOR VENDORS
vendor_slug: _dns-evidence-all
url: dns:peptidesciences.com / dns:swisschems.is / dns:purerawz.co / dns:behemothlabz.com / dns:biotechpeptides.com / dns:corepeptides.com / dns:limitlesslifenootropics.com / dns:domestic-supply.com / dns:aminoasylum.shop / dns:peptideguys.com
fetch_date: 2026-05-06
fetch_method: dig +short TXT for SPF, _dmarc, and DKIM selector probes (mail / mailgun / smtp / k1 / k2 / k3 / mxvault / default / mta / krs / s1 / s2 / google / s2048 / sendgrid_default / sib1 / sib2 / brevo / brevo1 / brevo2 / om1 / om2 / omnisend / mailo / mailout / dkim / _domainkey / selector1 / selector2 / mailinblue1 / mailinblue2)
relevance: deliverability infrastructure across all anchor vendors — confirms ESP detection from on-site fingerprints with independent DNS evidence; reveals dominant Mailgun delivery transport, Brevo on Peptide Sciences, SendGrid on Limitless Life
---

# DNS evidence — SPF / DMARC / DKIM across anchor vendors

## SPF records

- peptidesciences.com: "v=spf1 mx include:spf.brevo.com include:_spf.google.com -all"
- swisschems.is: "v=spf1 include:spf.titan.email include:_spf.smtp.com include:mail.zendesk.com include:mailgun.org ~all"
- purerawz.co: "v=spf1 include:mailgun.org include:_spf.google.com mx a ip4:198.46.87.213 ~all"
- behemothlabz.com: "v=spf1 +a include:_spf.google.com include:mailgun.org ~all"
- biotechpeptides.com: "v=spf1 include:mailgun.org include:_spf.safewebservices.com include:_spf.google.com ~all\010"
- corepeptides.com: "v=spf1 include:zoho.eu include:_spf.safewebservices.com include:mailgun.org ~all"
- limitlesslifenootropics.com: "v=spf1 include:_spf.google.com include:mail.zendesk.com include:_spf.bigcommerce.com ~all"
- domestic-supply.com: "v=spf1 include:spf.titan.email ~all"
- aminoasylum.shop: "v=spf1 a mx include:_spf.elasticemail.com include:_spf.google.com include:mailgun.org ~all"
- peptideguys.com: 

## DMARC records

- peptidesciences.com: "v=DMARC1; p=reject; adkim=s; aspf=s; sp=reject; rua=mailto:1ca47dc72a6d4f8babbd0c3a55091d31@dmarc-reports.cloudflare.net,mailto:dmarc@mailinblue.com!10m; ruf=mailto:dmarc@mailinblue.com!10m; rf=afrf; pct=100; ri=86400"
- swisschems.is: "v=DMARC1; p=quarantine; rua=mailto:dmarc@swisschems.is; ruf=mailto:dmarc@swisschems.is; pct=100; adkim=r; aspf=r;"
- purerawz.co: "v=DMARC1;p=none;rua=mailto:admin@purerawz.co"
- behemothlabz.com: "v=DMARC1; p=quarantine; rua=mailto:support@behemothlabz.com"
- biotechpeptides.com: "v=DMARC1; p=quarantine; rua=mailto:oganiansprt@gmail.com"
- corepeptides.com: "v=DMARC1; p=none; rua=mailto:jeremy@corepeptides.com; ruf=mailto:jeremy@corepeptides.com; sp=none; adkim=r; aspf=r"
- limitlesslifenootropics.com: "v=DMARC1; p=none; rua=mailto:security@limitlesslifenootropics.com; ruf=mailto:security@limitlesslifenootropics.com; fo=1"
- domestic-supply.com: 
- aminoasylum.shop: "v=DMARC1; p=none;"
- peptideguys.com: 

## DKIM selector responses (only nonzero shown)

### peptidesciences.com
- mail (TXT): "k=rsa;p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDeMVIzrCa3T14JsNY0" "IRv5/2V1/v2itlviLQBwXsa7shBD6TrBkswsFUToPyMRWC9tbR/5ey0nRBH0ZVxp" "+lsmTxid2Y2z+FApQ6ra2VsXfbJP3HE6wAO0YTVEJt1TmeczhEd2Jiz/fcabIISg" "XEdSpTYJhb0ct0VJRxcg4c8c7wIDAQAB"

- default (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxi" "2UtixHLWU7uD7ZehPSYkk5L46612mfOCMWmv0ocvwBl9xJx36wBZb7cQcCY/eEls" "F57rLGMNH4vDFU89FfTkaVUfIBiG7U8EfmrRlJyDzTAzHR2Q1lDM1xWcUYz2e/Ru" "s2+W+zA4Sga3ECXMDMMaF/kauMv354B
- mailo (TXT): "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/PRZDDes18S1LbhO4MgdXSJrUFG7YC3fFVL6q90ZM8jVuK9PehcuTiqMxJWDGzYgA0O4Xq2RuGLXnIdlOnvAPu4R/CvotVg2e8ruN6lul5+ktzPPCFSZVWz7XJH7HStFk6DU/u8hS8QeI99XIHkR9JsGTbof7sP1LW0U0hHDLBwIDAQAB"


### swisschems.is
- krs (TXT): "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDxTyFF583xQHDNQrS4ct1Mm6Fyg/3n8mEXH3ONjNZm37mKj0pMzJHLbrYpr3E3Osi6JomNCTmqvbjIJ3DPFEWu1PESWyB0GGtrpJDByzhEsd0kzxAWWeC2bDTWKUmbVxXHfys+89RgZXVtXgKmZO80yy94/AjF+4sLmuNAb18fpwIDAQAB"


### purerawz.co
- default (TXT): "v=DKIM1;k=rsa;p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYwcoQeYOfe39+rk1mGCa0jFsc27ZF1L/9LQ9PU3wb5ekDOB73BH418jmvpsZOm3+xevygGG/wMwrIvkscD2voY2+iB2i3XVjT+yayZSz77p3DZmPLD/v1GxPDpVuPdcINIl/fz8Pe5KhgDmYDI+v3ZEXgmia7cbNyiQ5y2ZsX9wIDAQAB
- google (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAquhzHyhdNpF+mKGH8wqufnR/7qK1Amu7k1iAX8gwf4js4xSm2bcsZ69yQZVj5XeZffjGYcpcA0SAsj+yxbg9Su9G/KSocbYTJh3YgDdxdNAK7FgGm0JLjrPzspn7Csb65CHoWn4/rngHStiXRZ738U1s7hBmqOWPdDL6Y71ZTR/
- mailo (TXT): "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwziNRaPqGl9hxunS5uS2PIR+8J96Ybmi86lesg8cIIEHLNmhGbaFerJxAeBBAhfpfX4AQ5ju+RTmYZSsP+CFhe+QzDAwFdp/5dbu7U9NmO5uL51BlV9tSRbZEriLUKAEQKFEN4bmngLSVo9Lu5Bv6CNV+VHWl6sxJy0yg4ruL4wIDAQAB"

- dkim (TXT): "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDGAEIW7L3DxRVM8nuYa2LjoWAAZF6cq0yZsy0brT8FJudiRQCU1NAH0CZ8yJYNl4z/V1ffEHwmqaOGZyRRMYTRC7IehessE+5FRwi5s3tQgk51m2YGJz6BdwX98gGo2DAxEmseNazfyPeb/9Jr0Pe2bXSOjXoU9H4H/MjLKtuuQIDAQAB;

### behemothlabz.com
- default (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA08d9haBkTcvYVvzdtYU1d9XQLuKWwHPdrVh2yFvWXHYZZnqobAGok6Sg0InDQ+nkMJkO9YHF7/OSvNPInqMhUJQHqMLS24bFEeeHmOgvmKLCDTyB3zyjfVNzUiHlkuP3Obf94cmrcDYshdpE+3Kgb+XXIiFSWNNIRrxis1if1o
- google (TXT): "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+FfceGZnNIx4YgyzXvg/Lyu9OxbY8yw/PVLQY56k67x8oq5htqX6Lg7bDkxUftnVZbUX4T7Hvkk23LJq051VztHybHb0kY/TIKg/dYWjPyq8VpfjvYtC61XuOekxb3H1jpFm6/SqcblFWKTSMpJdvu5ubz8jHnmjAvHvOJ27WswIDAQA
- mailo (TXT): "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCKM8nUOVv1f03lqmUE2GUFzOZe88USEDGmaarFcdLm6ua5e8vDlAfGVSifoeBH9dy4vu1N7Nw5vMvomeJUvfwp/SxbtyH6ump/WS0jXZakOWn4lV1tb8jiZEbA+7q5BZGra+W9ptZ22DrkwkaotPKaCQ0JdhIfawhmSxx8DHGhwIDAQAB"


### biotechpeptides.com
- default (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4pbNJUxEG8ekufcBvcNdJWSYuR3af1GKjkY9zXkyeG2+vp+gocdijmUj3T2tsBXHwljh/kcBzX2bNWtfs346LkGWZjuSDUldI0MTqQqhaQuabwH8pnhTsp4fY7AfgwWB60ATK4dW6bZNlMcrrZc+nH2oD0i7tHsqJFHUU9CW5P
- google (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgxalR8B/7d8so/RhkF65D75AQTPzQhdottXKRRLMbfmjmeSkbW5dVRZIG4M0qM2e4bcoL1kwYrpo2Agsbsn/nx+AqmhzxOxn8zrTvxW07O2Qaf1OgQUbY8Z6vG4PFMswt89GfkvG9VkFvYIKlxGxBcyO0/NqS2DdqEla6vG4O4t

### corepeptides.com

### limitlesslifenootropics.com
- s1 (TXT): s1.domainkey.u33643171.wl172.sendgrid.net.

- s1 (CNAME): s1.domainkey.u33643171.wl172.sendgrid.net.
- s2 (TXT): s2.domainkey.u33643171.wl172.sendgrid.net.

- s2 (CNAME): s2.domainkey.u33643171.wl172.sendgrid.net.
- google (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx+ZjIJIZ9XwI8EhpFMVfwrKd5ki4TVmzR+G+qamDrnZrKGv/WLxEnMZRUPj5r9xBZ5INLZngMrGbIpmEwqcrxzX9dm1aemSDKlnrdV+GFVrugvzetNnKw77GeozWuJODsKOsrBxjo2MbgBQpJHCJqRHt4YLke+KGcpHyDeX1Eqy

### aminoasylum.shop
- k1 (TXT): "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDSMJPNnuG72fKUvsQetyy1U9h1S9ys28W7QpP2MGF4PgrXNWYZe4ZdjgpjdbOvpBvARL3ISI1TK7vws552qfZZlnIaOa0WJDyxDcqnq/elzMmQrn1/Ll47iFUAzkk1QTWcTwNso4gcYiWd9hLm6bggz8dT4PvozI/3mYhhnzv7MQIDAQAB"

- google (TXT): "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl64q71IbNhACDGdlOF3sVImzG75iRyCFgCYNB0K3SHxXLtY3lzLBwzATcbDbZ2UvIpHva36xbPUzUMvYf+Og3aTWDpXkvi3Gckhzi1z2n9hVkkeq634EnHqvp/zJ/qpaTJ4lWYNkBLVaA1aBjFKkBU508ojOD7p94G5f7bzpdSI


## MX records

### peptidesciences.com
- 10 alt3.aspmx.l.google.com.
- 10 alt4.aspmx.l.google.com.
- 5 alt1.aspmx.l.google.com.
- 5 alt2.aspmx.l.google.com.
- 1 aspmx.l.google.com.
### swisschems.is
- 20 mx2.titan.email.
- 10 mx1.titan.email.
### purerawz.co
- 5 alt1.aspmx.l.google.com.
- 5 alt2.aspmx.l.google.com.
- 1 aspmx.l.google.com.
- 10 alt4.aspmx.l.google.com.
- 10 alt3.aspmx.l.google.com.
### behemothlabz.com
- 10 aspmx3.googlemail.com.
- 1 aspmx.l.google.com.
- 5 alt1.aspmx.l.google.com.
- 10 aspmx2.googlemail.com.
- 5 alt2.aspmx.l.google.com.
### biotechpeptides.com
- 10 aspmx3.googlemail.com.
- 1 aspmx.l.google.com.
- 5 alt2.aspmx.l.google.com.
- 10 aspmx2.googlemail.com.
- 5 alt1.aspmx.l.google.com.
### corepeptides.com
- 10 mx.zoho.eu.
- 20 mx2.zoho.eu.
- 50 mx3.zoho.eu.
### limitlesslifenootropics.com
- 10 aspmx2.googlemail.com.
- 10 aspmx3.googlemail.com.
- 5 alt1.aspmx.l.google.com.
- 5 alt2.aspmx.l.google.com.
- 1 aspmx.l.google.com.
### domestic-supply.com
- 20 mx2.titan.email.
- 10 mx1.titan.email.
### aminoasylum.shop
- 5 alt2.aspmx.l.google.com.
- 10 alt4.aspmx.l.google.com.
- 10 alt3.aspmx.l.google.com.
- 1 aspmx.l.google.com.
- 5 alt1.aspmx.l.google.com.
### peptideguys.com
