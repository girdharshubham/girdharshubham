package edu.greet;

import kalix.javasdk.action.Action;
import kalix.javasdk.annotations.Acl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

// Exposing action to the Internet.
@RequestMapping("/greet")
@Acl(allow = @Acl.Matcher(principal = Acl.Principal.INTERNET))
public class GreetAction extends Action {

  @GetMapping("/{name}")
  public Action.Effect<Greeting> greet(@PathVariable String name) {
    if (name == null || name.isEmpty()) {
      return effects().reply(new Greeting("Hello, World!"));
    }
    return effects().reply(new Greeting("Hello, " + name));
  }

  @GetMapping
  public Action.Effect<Greeting> greet() {
    return effects().reply(new Greeting("Hello, World"));
  }

}