import type { DirectiveBinding } from "vue";

interface ClickOutsideElement extends HTMLElement {
    clickOutsideHandler?: (event: Event) => void;
}

export default {
    mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
        el.clickOutsideHandler = (event: Event) => {
            if (!(el === event.target || el.contains(event.target as Node))) {
                binding.value(event);
            }
        };
        document.addEventListener("click", el.clickOutsideHandler);
    },
    unmounted(el: ClickOutsideElement) {
        if (el.clickOutsideHandler) {
            document.removeEventListener("click", el.clickOutsideHandler);
        }
    },
};