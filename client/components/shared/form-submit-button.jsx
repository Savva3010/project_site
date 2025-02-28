import { useFormStatus } from 'react-dom';

export default function FormSubmitButton({ text, loadingText}) {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>
        <b>{pending ? loadingText : text}</b>
    </button>
}