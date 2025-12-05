import {useFetcher} from "react-router";
import {useEffect, useRef} from "react";
import {WishlistAction} from "~/dto/purchase/WishlistAction";


export default function PurchaseForm() {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);

    const isSubmitting = fetcher.state === "submitting";

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            formRef.current?.reset();
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <div>
            <fetcher.Form method="post" ref={formRef}>
                <input
                    id="newPurchaseDescription"
                    type="text"
                    name="newPurchaseDescription"
                    required
                    disabled={isSubmitting}
                />
                <input
                    id="newPurchasePrice"
                    type="number"
                    name="newPurchasePrice"
                    required
                    disabled={isSubmitting}
                />

                <button
                    type="submit"
                    name="intent"
                    value = {WishlistAction.ADD}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending..." : "Submit"}
                </button>

            </fetcher.Form>
        </div>
    );
}