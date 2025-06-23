<template>
    <section class="content-wrapper">
        <article class="flex-col">
            <h2>Welcome to HvA SSRF!</h2>
            <p>
                This is a simple web application containing a Server-Side Request Forgery (SSRF) vulnerability.
                The goal is to exploit this vulnerability to access an internal service running on the LAN of the
                server.
            </p>
            <p>
                This is a Nuxt application with an integrated backend. The backend will serve as a proxy to the internal
                service. By prior research you have already found out that the internal service is running on following
                port: <strong>9106</strong>. Consult the API documentation for the correct routes.
            </p>
            <p>
                By adding a new Integration in the settings page, you can access the internal service.
            </p>
            <span class="splitter splitter-light"></span>
            <p>
                This is a demonstration app made by Team Fristi for the AUAS TSE - Security workshop.
            </p>
        </article>
    </section>
</template>

<style scoped>
article {
    gap: 10px;
}
</style>
