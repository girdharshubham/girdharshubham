name := "akka-quickstart-scala"

version := "1.0"

scalaVersion := "2.13.15"

resolvers += "Akka library repository".at("https://repo.akka.io/maven")

val AkkaManagementVersion = "1.5.0"
lazy val AkkaVersion = "2.9.5"

fork := true
enablePlugins(JavaAppPackaging)

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-actor-typed" % AkkaVersion,
  "com.typesafe.akka" %% "akka-actor-testkit-typed" % AkkaVersion % Test,
  "com.typesafe.akka" %% "akka-cluster-typed" % AkkaVersion,
  "com.typesafe.akka" %% "akka-cluster" % AkkaVersion,
  "com.typesafe.akka" %% "akka-discovery" % AkkaVersion,
  "ch.qos.logback" % "logback-classic" % "1.5.8",
  "com.lightbend.akka.discovery" %% "akka-discovery-kubernetes-api" % AkkaManagementVersion,
  "com.lightbend.akka.management" %% "akka-management" % AkkaManagementVersion

)
dockerBaseImage := "openjdk:21-jdk"