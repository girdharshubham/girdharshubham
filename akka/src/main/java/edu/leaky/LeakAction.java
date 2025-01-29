package edu.leaky;

import kalix.javasdk.action.Action;
import kalix.javasdk.annotations.Acl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/leak")
@Acl(allow = @Acl.Matcher(principal = Acl.Principal.INTERNET))
public class LeakAction extends Action {
    static List<byte[]> list = new ArrayList();

    @GetMapping("/boom")
    public Action.Effect<String> boom() {
        list.add(new byte[10240*10240]);
        return effects().reply("Boom");
    }
}
