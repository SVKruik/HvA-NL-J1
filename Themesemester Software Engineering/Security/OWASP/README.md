# TSE - Security - OWASP SSRF Demo

This project contains two key directories. Below you can find a short description for both of them.

- `site`: Contains the Nuxt full-stack app. This app is made vulnerable to SSRF.
- `keystore`:` Contains a sample keystore API used by trusted local sources. The target of the SSRF attack.

---

The case that this project portraits is a classic case of SSRF. I have built a keystore that is only accessible locally. This API therefore expects that only trusted sources can access it. It is not connected to WAN whatsoever.

This is where the vulnerability in the API lies. It has weak protection. Now, the Nuxt app has an SSRF input vulnerability. It supports (in a bad way) sending requests via the backend to the LAN, acting as a proxy.

For the Keystore API, the backend that sends the request is trusted. Therefore the Keystore API permits retrieval of said keys. This means that an attacker that can query API's on localhost will have full access to the keys. This can cause a lot of damage.
