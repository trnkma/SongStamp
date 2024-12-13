import { ref } from 'vue';

// Singleton instance
interface SnackbarService {
    message: string;
    buttonText: string;
    show: boolean;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    showBar: (msg: string, btnText: string, callback?: Function) => void;
    onActionClick: () => void;
}

const message = ref<string>('');
const buttonText = ref<string>('');
const show = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
let func: Function | null = null;

// Methods
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const showSnackbar = (msg: string, btnText: string, callback?: Function) => {
    message.value = msg;
    buttonText.value = btnText;
    func = callback || null;
    show.value = true;
};

const onActionClick = () => {
    if (func) func();
    show.value = false;
    func = null;
};

export function SnackbarService(): SnackbarService {
    return {
        message: message.value,
        buttonText: buttonText.value,
        show: show.value,
        showBar: showSnackbar,
        onActionClick,
    };
}
