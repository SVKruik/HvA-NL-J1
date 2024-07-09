FROM hashicorp/terraform as terraform
FROM mcr.microsoft.com/azure-cli

COPY --from=terraform /bin/terraform /usr/local/bin/terraform


RUN terraform --version \
    && az --version