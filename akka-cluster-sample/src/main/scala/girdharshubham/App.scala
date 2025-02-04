package girdharshubham

import akka.actor.typed.scaladsl.Behaviors
import akka.actor.typed.{ActorSystem, Behavior}
import akka.cluster.typed.Cluster
import akka.management.scaladsl.AkkaManagement

import scala.concurrent.ExecutionContext.Implicits._
import scala.util._

object Main {
  def apply(): Behavior[String] = Behaviors.setup { ctx =>
    ctx.log.info("Starting up")
    Behaviors.same
  }
}

object App {
  def main(args: Array[String]): Unit = {
    val system: ActorSystem[String] = ActorSystem(Main(), "hello")

    AkkaManagement.get(system).start() onComplete {
      case Success(_) =>
        Cluster(system)
        system.log.info("Akka Management started")
      case Failure(_) =>
        system.terminate()
        system.log.error("Failed to start Akka Management")
    }
  }
}
