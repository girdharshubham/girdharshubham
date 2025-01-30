package girdharshubham;

public class MergeStringsAlternatively {
    static class ListNode {
        int val;
        ListNode next;

        ListNode() {
        }

        ListNode(int val) {
            this.val = val;
        }

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    public static void recurse(ListNode result, ListNode one, ListNode two) {
        if (one != null) {
            result.next = new ListNode(one.val);
            result = result.next;

            recurse(result, two, one.next);
        } else if (two != null) {
            result.next = new ListNode(two.val);
            result = result.next;

            recurse(result, two.next, one);
        }
    }

    public static ListNode mergeTwoLists(ListNode one, ListNode two) {
        var result = new ListNode();
        recurse(result, one, two);
        return result.next;
    }

    public static void main(String[] args) {
        var one = new ListNode(1, new ListNode(2, null));
        var two = new ListNode(4, new ListNode(5, new ListNode(6)));

        var result = mergeTwoLists(one, two);
        while (result != null) {
            System.out.print(result.val);
            result = result.next;
        }
    }
}
