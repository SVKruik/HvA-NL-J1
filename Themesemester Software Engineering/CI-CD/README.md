# TSE - CI/CD

[![Quality Gate Status](https://api.stefankruik.com/sonarqube/api/project_badges/measure?project=se-specialization-2024-2_tse2_stefan-kruik_ci-cd_e5d8dafd-2acb-4929-8777-86c3ee4877b0&metric=alert_status&token=sqb_d4a80e1824f5365397f1258ddaa2ee0d82eef694)](https://api.stefankruik.com/sonarqube/dashboard?id=se-specialization-2024-2_tse2_stefan-kruik_ci-cd_e5d8dafd-2acb-4929-8777-86c3ee4877b0)

### Stefan Kruik, 500895667, TSE 2

Workshop CI/CD project for the TSE semester.

### Techstack & Features

- [Vue TS Frontend](https://tse.stefankruik.com)
- [Springboot Backend](https://tse.stefankruik.com/api)
- Docker
- Nginx
- [RabbitMQ](https://github.com/SVKruik-Organization/Uplink)
- [GitLab Container Registry](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/container_registry) & [Environments](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/-/environments)
- Self-hosted on several Raspberry Pi's
- Automated building, testing, analyzing & deployment

### Deployment Flow

- GitLab push event
- Building frontend & backend
- Testing backend
- Analyzing backend with Sonarqube
- Building & pushing Docker images
- Sending deployment request to RabbitMQ server
- RabbitMQ server sends deployment task downstream
- Complementary support server runs deployment script
- Docker compose pulls the new images
- Frontend & backend get updated

### CI Details

- Branch `dev` is reserved for cutting edge and untested features.
- Testing and analyzing only happens on `test` and `main`.
- Every branch has dedicated corresponding [Docker images](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/container_registry) and [environments](https://gitlab.fdmci.hva.nl/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/-/environments).
