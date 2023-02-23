# FFC Payment Statement Constructor

Data construction of payment statement

## Prerequisites

- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the CSS files that were generated during the Docker build.  For the site to render correctly locally `npm run build` must be run on the host system.


By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start

Use Docker Compose to run service locally.

```
docker-compose up
```

## Test structure

The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

### Running tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

## Funding codes

In order to persist payment request data and construct a statement dataset, the service must be populated with a mapping of funding option codes to a name.
These values are stored in the `fundingOptions` PostgreSQL database table.

### SFI Pilot

| Name | Code |
| ---- | ---- |
| Arable and horticultural land | 80001 |
| Arable and horticultural soils| 80002 |
| Hedgerow | 80003 |
| Improved grassland soils | 80004 |
| Improved grassland | 80005 |
| On farm woodland | 80006 |
| Low and no input grassland | 80007 |
| Water body buffering | 80008 |
| Pilot participation payment | 80009 |

### SFI

| Name | Code |
| ---- | ---- |
| Arable and horticultural soils: Introductory | 80101 |
| Arable and horticultural soils: Intermediate | 80102 |
| Improved grassland soils: Introductory | 80111 |
| Improved grassland soils: Intermediate | 80112 |
| Moorland: Introductory | 80121 |
| Moorland: Additional | 80190 |
| Common land: Additional | 80195 |

### Lump sums

| Name | Code |
| ---- | ---- |
| Lump sum exit scheme | 10570 |

### Vet Visits

| Name | Code |
| ---- | ---- |
| Sheep | 18001 |
| Beef cattle | 18002 |
| Dairy cattle | 18003 |
| Pigs | 18004 |

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
