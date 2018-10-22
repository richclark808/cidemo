# cidemo
Repo for testing cloud based CI tools such as CircleCI, Bitbucket Pipeline, Heroku Pipelines, VSTS DevOps and Docker.

Contains the minimum elements to run a Provar ANT job assuming that JDK8 and ANT are already part of the environment (true for openjdk:8)

The Provar tests in the DemoProject do not contain any authenticated connections, so test cases cover generic websites such as Google only. This is purely to avoid exposing org credentials which will become stale.
