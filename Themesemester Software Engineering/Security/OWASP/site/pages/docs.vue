<template>
    <section class="content-wrapper">
        <article class="flex-col">
            <h2>Keystore API Documentation</h2>
            <p>
                The API you are about to exploit has several endpoints. Below they are described.
            </p>
        </article>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <h3>GET /r/:target</h3>
            <p>
                Read a specific resource from the target server.
            </p>
            <ul>
                <li>
                    <strong>target</strong> - The key of the resource to retrieve.
                </li>
            </ul>
        </article>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <h3>GET /r</h3>
            <p>
                Read all resources from the target server.
            </p>
        </article>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <h3>POST /w</h3>
            <p>
                Write a new resource to the target server.
            </p>
            <ul>
                <li>
                    (body) <strong>name</strong> - The key of the resource.
                </li>
                <li>
                    (body) <strong>value</strong> - The value of the resource.
                </li>
            </ul>
        </article>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <h3>DELETE /d/:target</h3>
            <p>
                Delete a specific resource from the target server.
            </p>
            <ul>
                <li>
                    <strong>target</strong> - The key of the resource to delete.
                </li>
            </ul>
        </article>
    </section>
</template>

<style scoped>
article {
    gap: 10px;
}
</style>
